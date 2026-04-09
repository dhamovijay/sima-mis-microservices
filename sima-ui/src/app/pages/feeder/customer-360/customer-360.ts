import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { FeederService, Customer360Bean } from '../feeder.service';

@Component({
  selector: 'app-customer-360',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-360.html',
  styleUrl: './customer-360.css',
})
export class Customer360 implements OnInit, OnDestroy {
  @ViewChild('revenueChart') revenueChartEl!: ElementRef;
  @ViewChild('teusChart') teusChartEl!: ElementRef;

  private charts: echarts.ECharts[] = [];
  loading = false;
  dropdownLoading = false;

  customers: Customer360Bean[] = [];
  selectedCustomer = '';
  year = new Date().getFullYear().toString();

  revenueData: Customer360Bean[] = [];
  teusData: Customer360Bean[] = [];
  searched = false;

  constructor(private feederService: FeederService) {}

  ngOnInit() {
    this.loadDropdowns();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.dispose());
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => this.charts.forEach(c => c.resize());

  loadDropdowns() {
    this.dropdownLoading = true;
    this.feederService.getCustomerDropDown().subscribe({
      next: (res) => {
        this.dropdownLoading = false;
        this.customers = res.dataList || [];
      },
      error: () => (this.dropdownLoading = false),
    });
  }

  search() {
    if (!this.selectedCustomer || !this.year) return;
    this.loading = true;
    this.searched = true;
    this.feederService.getCustomerRevenueRate({ year: this.year, customer: this.selectedCustomer }).subscribe({
      next: (res) => {
        this.loading = false;
        this.revenueData = res.dataList || [];
        this.teusData = res.tuesList || [];
        setTimeout(() => this.renderCharts());
      },
      error: () => (this.loading = false),
    });
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

    this.renderRevenueChart();
    this.renderTeusChart();
  }

  private renderRevenueChart() {
    if (!this.revenueChartEl || this.revenueData.length === 0) return;
    const chart = this.initChart(this.revenueChartEl);

    const labels = this.revenueData.map(d => d.montext || d.label || '');
    const values = this.revenueData.map(d => d.rev || d.revenue || 0);

    chart.setOption({
      title: { text: 'Revenue', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>Revenue: <b>${Number(p.value).toLocaleString()}</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11, rotate: 30 } },
      yAxis: {
        type: 'value', name: 'USD',
        axisLabel: { formatter: (v: number) => Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toString() },
      },
      series: [{
        name: 'Revenue', type: 'bar', data: values, barMaxWidth: 40,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0ea5e9' }, { offset: 1, color: '#6366f1' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        label: { show: true, position: 'top', formatter: (p: any) => Number(p.value).toLocaleString(), fontSize: 10 },
      }],
    });
  }

  private renderTeusChart() {
    if (!this.teusChartEl || this.teusData.length === 0) return;
    const chart = this.initChart(this.teusChartEl);

    const labels = this.teusData.map(d => d.montext || d.label || '');
    const values = this.teusData.map(d => d.tues || 0);

    chart.setOption({
      title: { text: 'TEUs', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>TEUs: <b>${Number(p.value).toLocaleString()}</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', name: 'TEUs' },
      series: [{
        name: 'TEUs', type: 'bar', data: values, barMaxWidth: 40,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' }, { offset: 1, color: '#059669' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        label: { show: true, position: 'top', formatter: (p: any) => Number(p.value).toLocaleString(), fontSize: 10 },
      }],
    });
  }
}
