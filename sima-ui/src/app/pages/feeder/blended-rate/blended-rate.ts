import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { FeederService, Customer360Bean } from '../feeder.service';

@Component({
  selector: 'app-blended-rate',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './blended-rate.html',
  styleUrl: './blended-rate.css',
})
export class BlendedRate implements OnDestroy {
  @ViewChild('rateChart') rateChartEl!: ElementRef;

  private chart: echarts.ECharts | null = null;
  loading = false;
  searched = false;

  year = new Date().getFullYear().toString();
  graphList: Customer360Bean[] = [];
  tableList: Customer360Bean[] = [];

  constructor(private feederService: FeederService) {}

  ngOnDestroy() {
    this.chart?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => this.chart?.resize();

  search() {
    if (!this.year) return;
    this.loading = true;
    this.searched = true;
    this.feederService.getBlendedRateList({ year: this.year }).subscribe({
      next: (res) => {
        this.loading = false;
        this.graphList = res.graphList || [];
        this.tableList = res.tableList || [];
        setTimeout(() => this.renderChart());
      },
      error: () => (this.loading = false),
    });
  }

  renderChart() {
    if (!this.rateChartEl || this.graphList.length === 0) return;

    if (!this.chart) {
      this.chart = echarts.init(this.rateChartEl.nativeElement);
      window.addEventListener('resize', this.onResize);
    }

    const labels = this.graphList.map(d => d.label || '');
    const values = this.graphList.map(d => d.rev || 0);

    const option: echarts.EChartsOption = {
      title: { text: `Monthly Blended Rate - ${this.year}`, left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>Blended Rate: <b>${Number(p.value).toLocaleString()}</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', name: 'Rate (USD)' },
      series: [{
        name: 'Blended Rate', type: 'line', data: values,
        lineStyle: { color: '#6366f1', width: 2 },
        itemStyle: { color: '#6366f1' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99,102,241,0.15)' },
            { offset: 1, color: 'rgba(99,102,241,0.01)' },
          ]),
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        label: { show: true, position: 'top', formatter: (p: any) => Number(p.value).toLocaleString(), fontSize: 10 },
      }],
    };

    this.chart.setOption(option, true);
  }

  get totalRevenue(): number {
    return this.tableList.reduce((sum, row) => sum + (row.revenue || 0), 0);
  }

  get totalTues(): number {
    return this.tableList.reduce((sum, row) => sum + (row.tues || 0), 0);
  }
}
