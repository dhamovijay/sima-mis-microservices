import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { FeederService, PortFlowBean } from '../feeder.service';

@Component({
  selector: 'app-port-flow',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './port-flow.html',
  styleUrl: './port-flow.css',
})
export class PortFlow implements OnInit, OnDestroy {
  @ViewChild('sankeyChart') sankeyChartEl!: ElementRef;
  private chart: echarts.ECharts | null = null;

  loading = false;
  dataList: PortFlowBean[] = [];

  year = new Date().getFullYear().toString();
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  type = '';

  months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  constructor(private feederService: FeederService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.chart?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => this.chart?.resize();

  loadData() {
    this.loading = true;
    this.feederService.getPortFlowHeader({ year: this.year, month: this.month, type: this.type }).subscribe({
      next: (res) => {
        this.loading = false;
        this.dataList = res.dataList || [];
        setTimeout(() => this.renderSankey());
      },
      error: () => (this.loading = false),
    });
  }

  renderSankey() {
    if (!this.sankeyChartEl || this.dataList.length === 0) return;

    if (!this.chart) {
      this.chart = echarts.init(this.sankeyChartEl.nativeElement);
      window.addEventListener('resize', this.onResize);
    }

    const nodeSet = new Set<string>();
    const links: { source: string; target: string; value: number }[] = [];

    this.dataList.forEach(row => {
      const pol = row.pol || '';
      const pod = row.pod || '';
      const teus = row.teus || 0;
      if (pol && pod && teus > 0) {
        nodeSet.add(pol);
        nodeSet.add(pod + ' ');
        links.push({ source: pol, target: pod + ' ', value: teus });
      }
    });

    const nodes = Array.from(nodeSet).map(name => ({ name }));

    const option: echarts.EChartsOption = {
      title: { text: 'Port Flow (POL to POD)', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target.trim()}<br/>TEUs: <b>${params.data.value.toLocaleString()}</b>`;
          }
          return params.name.trim();
        },
      },
      series: [{
        type: 'sankey',
        emphasis: { focus: 'adjacency' },
        data: nodes,
        links: links,
        lineStyle: { color: 'gradient', curveness: 0.5 },
        itemStyle: { borderWidth: 1 },
        label: { fontSize: 11, formatter: (p: any) => p.name.trim() },
        left: '4%',
        right: '4%',
        top: '14%',
        bottom: '4%',
      }],
    };

    this.chart.setOption(option, true);
  }

  get totalTeus(): number {
    return this.dataList.reduce((sum, row) => sum + (row.teus || 0), 0);
  }
}
