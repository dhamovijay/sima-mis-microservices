import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { FeederService, PortPerformanceBean } from '../feeder.service';

@Component({
  selector: 'app-port-performance',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './port-performance.html',
  styleUrl: './port-performance.css',
})
export class PortPerformance implements OnDestroy {
  @ViewChild('utilizationChart') utilizationChartEl!: ElementRef;
  @ViewChild('loadingChart') loadingChartEl!: ElementRef;

  private charts: echarts.ECharts[] = [];
  loading = false;
  voyageId = '';
  searched = false;

  dataList: PortPerformanceBean[] = [];
  loadingList: PortPerformanceBean[] = [];
  categories: string[] = [];

  constructor(private feederService: FeederService) {}

  ngOnDestroy() {
    this.charts.forEach(c => c.dispose());
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => this.charts.forEach(c => c.resize());

  search() {
    if (!this.voyageId.trim()) return;
    this.loading = true;
    this.searched = true;
    this.feederService.getPortPerformance(this.voyageId.trim()).subscribe({
      next: (res) => {
        this.loading = false;
        this.dataList = res.dataList || [];
        this.loadingList = res.loadingList || [];
        this.categories = res.categories || [];
        setTimeout(() => this.renderCharts());
      },
      error: () => (this.loading = false),
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.search();
  }

  private initChart(el: ElementRef): echarts.ECharts {
    const chart = echarts.init(el.nativeElement);
    this.charts.push(chart);
    return chart;
  }

  renderCharts() {
    if (this.charts.length === 0) {
      window.addEventListener('resize', this.onResize);
    }
    this.charts.forEach(c => c.dispose());
    this.charts = [];

    this.renderUtilizationChart();
    this.renderLoadingChart();
  }

  private renderUtilizationChart() {
    if (!this.utilizationChartEl || this.dataList.length === 0) return;
    const chart = this.initChart(this.utilizationChartEl);

    const ports = this.categories.length > 0 ? this.categories : this.dataList.map(d => d.pol || '');
    const utilization = this.dataList.map(d => d.averageutilization || 0);

    chart.setOption({
      title: { text: 'Port Utilization', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>Utilization: <b>${p.value.toFixed(1)}%</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: ports, axisLabel: { fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', name: '%', max: 100 },
      series: [{
        name: 'Utilization', type: 'line', data: utilization,
        lineStyle: { color: '#0ea5e9', width: 2 }, itemStyle: { color: '#0ea5e9' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(14,165,233,0.15)' }, { offset: 1, color: 'rgba(14,165,233,0.01)' },
        ])},
        smooth: true,
        label: { show: true, position: 'top', formatter: (p: any) => p.value.toFixed(1) + '%', fontSize: 10 },
      }],
    });
  }

  private renderLoadingChart() {
    if (!this.loadingChartEl || this.loadingList.length === 0) return;
    const chart = this.initChart(this.loadingChartEl);

    const ports = this.categories.length > 0 ? this.categories : this.loadingList.map(d => d.pol || '');
    const loaded = this.loadingList.map(d => d.loadedteus || 0);
    const discharged = this.loadingList.map(d => d.dischargedteus || 0);
    const onboard = this.loadingList.map(d => d.onboardteus || 0);

    chart.setOption({
      title: { text: 'Loading / Discharge / Onboard TEUs', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, data: ['Loaded', 'Discharged', 'Onboard'] },
      grid: { left: '8%', right: '4%', bottom: '14%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: ports, axisLabel: { fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', name: 'TEUs' },
      series: [
        {
          name: 'Loaded', type: 'bar', stack: 'teus', data: loaded, barMaxWidth: 40,
          itemStyle: { color: '#10b981', borderRadius: [0, 0, 0, 0] },
        },
        {
          name: 'Discharged', type: 'bar', stack: 'teus', data: discharged, barMaxWidth: 40,
          itemStyle: { color: '#f59e0b' },
        },
        {
          name: 'Onboard', type: 'bar', stack: 'teus', data: onboard, barMaxWidth: 40,
          itemStyle: { color: '#6366f1', borderRadius: [3, 3, 0, 0] },
        },
      ],
    });
  }
}
