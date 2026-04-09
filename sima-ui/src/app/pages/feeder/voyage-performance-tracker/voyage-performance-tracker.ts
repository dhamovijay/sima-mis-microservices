import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { FeederService, VoyageTrackerResult, DropdownItem } from '../feeder.service';

@Component({
  selector: 'app-voyage-performance-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voyage-performance-tracker.html',
  styleUrl: './voyage-performance-tracker.css',
})
export class VoyagePerformanceTracker implements OnInit, OnDestroy {
  @ViewChild('durationChart') durationChartEl!: ElementRef;
  @ViewChild('loadingChart') loadingChartEl!: ElementRef;
  @ViewChild('revenueChart') revenueChartEl!: ElementRef;
  @ViewChild('marginChart') marginChartEl!: ElementRef;
  @ViewChild('concentrationChart') concentrationChartEl!: ElementRef;

  private charts: Map<string, echarts.ECharts> = new Map();
  private ro: ResizeObserver | null = null;

  services: DropdownItem[] = [];
  vessels: DropdownItem[] = [];
  selectedService = '';
  selectedVessel = '';
  loading = false;
  vesselLoading = false;
  dropdownLoading = true;
  hasData = false;
  data: VoyageTrackerResult | null = null;

  // Drill-down states
  showSpeedometer = false;
  showScatter = false;

  constructor(private feederService: FeederService) {}

  ngOnInit() { this.loadDropdowns(); }

  ngOnDestroy() {
    this.disposeAll();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => requestAnimationFrame(() => this.charts.forEach(c => c.resize()));

  private disposeAll() {
    this.charts.forEach(c => c.dispose());
    this.charts.clear();
    this.ro?.disconnect();
    this.ro = null;
  }

  private getChart(key: string, el: ElementRef): echarts.ECharts {
    this.charts.get(key)?.dispose();
    const chart = echarts.init(el.nativeElement);
    this.charts.set(key, chart);
    if (!this.ro) this.ro = new ResizeObserver(() => this.onResize());
    this.ro.observe(el.nativeElement);
    return chart;
  }

  loadDropdowns() {
    this.dropdownLoading = true;
    this.feederService.getVoyageTrackerDropdowns().subscribe({
      next: (res) => { this.dropdownLoading = false; this.services = res.serviceList || []; },
      error: () => (this.dropdownLoading = false),
    });
  }

  onServiceChange() {
    this.selectedVessel = '';
    this.vessels = [];
    this.hasData = false;
    if (!this.selectedService) return;
    this.vesselLoading = true;
    this.feederService.getVoyageTrackerVessels(this.selectedService).subscribe({
      next: (res) => { this.vesselLoading = false; this.vessels = res.vesselList || []; },
      error: () => (this.vesselLoading = false),
    });
  }

  loadData() {
    if (!this.selectedService || !this.selectedVessel) return;
    this.loading = true;
    this.hasData = false;
    this.showSpeedometer = false;
    this.showScatter = false;
    this.feederService.getVoyageTrackerData({ sectorId: this.selectedService, vesselId: this.selectedVessel }).subscribe({
      next: (res) => {
        this.loading = false;
        this.data = res;
        this.hasData = res.success;
        if (this.hasData) {
          window.addEventListener('resize', this.onResize);
          setTimeout(() => this.renderAllCharts());
        }
      },
      error: () => (this.loading = false),
    });
  }

  renderAllCharts() {
    if (!this.data) return;
    this.disposeAll();
    this.renderDurationChart();
    this.renderLoadingChart();
    this.renderMarginChart();
    this.renderRevenueChart();
    this.renderConcentrationChart();
  }

  // === Chart 1: Voyage Duration ===
  private renderDurationChart() {
    if (!this.durationChartEl || !this.data?.bean) return;
    const chart = this.getChart('duration', this.durationChartEl);
    const b = this.data.bean;
    chart.setOption({
      title: { text: 'Voyage Duration', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, data: ['Proforma', 'Actual'] },
      grid: { left: '8%', right: '4%', bottom: '14%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: b.voyageList || [], axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: { type: 'value', name: 'Days' },
      series: [
        { name: 'Proforma', type: 'bar', data: b.proformaList || [], barMaxWidth: 30, itemStyle: { color: '#f59e0b', borderRadius: [3, 3, 0, 0] } },
        { name: 'Actual', type: 'bar', data: b.actualList || [], barMaxWidth: 30, itemStyle: { color: '#8b5cf6', borderRadius: [3, 3, 0, 0] } },
      ],
    });
  }

  // === Chart 2: Loadings (click → Speedometer) ===
  private renderLoadingChart() {
    if (!this.loadingChartEl || !this.data?.bean1) return;
    const chart = this.getChart('loading', this.loadingChartEl);
    const b = this.data.bean1;
    this.showSpeedometer = false;

    chart.setOption({
      title: { text: 'Loadings', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, data: ['TEUs', 'Utilization %'] },
      grid: { left: '8%', right: '8%', bottom: '14%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: b.monthList || [], axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: [
        { type: 'value', name: 'TEUs' },
        { type: 'value', name: 'Utilization %', splitLine: { show: false } },
      ],
      series: [
        { name: 'TEUs', type: 'bar', data: b.totalTeusList || [], barMaxWidth: 30, itemStyle: { color: '#1e3a5f', borderRadius: [3, 3, 0, 0] } },
        { name: 'Utilization %', type: 'line', yAxisIndex: 1, data: b.totalBlendedList || [], lineStyle: { color: '#ef4444', width: 2 }, itemStyle: { color: '#ef4444' } },
      ],
    });

    // Click → Speedometer
    chart.off('click');
    chart.on('click', (params: any) => {
      const voyageId = params.name;
      this.feederService.getSpeedometerData({
        sectorId: this.selectedService, vesselId: this.selectedVessel, voyageId,
      }).subscribe({
        next: (res) => {
          if (res.voyageWeightList && res.voyageWeightList.length > 0) {
            this.showSpeedometer = true;
            setTimeout(() => this.renderSpeedometer(res.voyageWeightList![0], voyageId));
          }
        },
      });
    });
  }

  // === Speedometer (Gauge) ===
  private renderSpeedometer(weightData: any, voyageId: string) {
    if (!this.loadingChartEl) return;
    const chart = this.getChart('loading', this.loadingChartEl);
    const weight = weightData.totalWeight || 0;

    chart.setOption({
      title: { text: 'Weight Utilization in particular Voyage', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 }, subtext: voyageId, subtextStyle: { fontSize: 13 } },
      tooltip: { formatter: '{b}: {c}%' },
      series: [{
        type: 'gauge',
        min: 0, max: 200,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[0.25, '#DF5353'], [0.5, '#55BF3B'], [0.75, '#DDDF0D'], [1, '#DF5353']],
          },
        },
        pointer: { width: 5 },
        axisTick: { distance: -20, length: 8, lineStyle: { color: '#666', width: 1 } },
        splitLine: { distance: -25, length: 20, lineStyle: { color: '#666', width: 2 } },
        axisLabel: { color: 'auto', distance: 30, fontSize: 12 },
        detail: { valueAnimation: true, formatter: '{value}', fontSize: 20 },
        data: [{ value: Math.round(weight), name: voyageId }],
      }],
    }, true);

    // Click gauge → back to Loadings
    chart.off('click');
    chart.on('click', () => {
      this.showSpeedometer = false;
      this.renderLoadingChart();
    });
  }

  // === Chart 3: Contribution Margin ===
  private renderMarginChart() {
    if (!this.marginChartEl || !this.data?.bean3) return;
    const chart = this.getChart('margin', this.marginChartEl);
    const b = this.data.bean3;
    chart.setOption({
      title: { text: 'Contribution Margin', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'axis' },
      grid: { left: '8%', right: '4%', bottom: '14%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: b.voyageList || [], axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: { type: 'value', name: 'USD', axisLabel: { formatter: (v: number) => Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toString() } },
      series: [{
        name: 'Margin', type: 'bar', data: b.totalRevenueList || [],
        itemStyle: { color: '#a855f7', borderRadius: [3, 3, 0, 0] },
        label: { show: false },
      }],
    });
  }

  // === Chart 4: Revenues (click → Scatter) ===
  private renderRevenueChart() {
    if (!this.revenueChartEl || !this.data?.bean2) return;
    const chart = this.getChart('revenue', this.revenueChartEl);
    const b = this.data.bean2;
    this.showScatter = false;

    chart.setOption({
      title: { text: 'Revenues', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['Revenues', 'Blended Rates'] },
      grid: { left: '8%', right: '10%', bottom: '14%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: b.monthList || [], axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: [
        { type: 'value', name: 'Revenues (USD)', axisLabel: { formatter: (v: number) => Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toString() } },
        { type: 'value', name: 'Blended Rate\n(USD per TEU)', splitLine: { show: false } },
      ],
      series: [
        {
          name: 'Revenues', type: 'bar', data: b.totalRevenueList || [], barMaxWidth: 35,
          itemStyle: { color: '#6366f1', borderRadius: [3, 3, 0, 0] },
          label: { show: true, position: 'top', fontSize: 10, formatter: (p: any) => Number(p.value).toLocaleString() },
        },
        {
          name: 'Blended Rates', type: 'line', yAxisIndex: 1, data: b.totalBlendedList || [],
          lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' },
          label: { show: true, position: 'top', fontSize: 9, color: '#f59e0b' },
        },
      ],
    });

    // Click → Scatter
    chart.off('click');
    chart.on('click', (params: any) => {
      const voyageId = params.name;
      this.feederService.getScatterData({
        sectorId: this.selectedService, vesselId: this.selectedVessel, voyageId,
      }).subscribe({
        next: (res) => {
          this.showScatter = true;
          setTimeout(() => this.renderScatterChart(res, voyageId));
        },
      });
    });
  }

  // === Scatter Plot (TEUs vs Blended Rate by customer type) ===
  private renderScatterChart(res: VoyageTrackerResult, voyageId: string) {
    if (!this.revenueChartEl) return;
    const chart = this.getChart('revenue', this.revenueChartEl);

    const toPoints = (list: any[]) => (list || []).map((d: any) => [d.totalTeus || 0, d.totalBlended || 0, d.customerShotCode || '']);

    chart.setOption({
      title: { text: '', subtext: voyageId, subtextStyle: { fontSize: 16, fontWeight: 'bold' as const } },
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `Customer: <b>${p.value[2]}</b><br/>Blended Rate: <b>${Number(p.value[1]).toLocaleString()}</b><br/>TEUs: <b>${Number(p.value[0]).toLocaleString()}</b>`,
      },
      legend: { bottom: 0, data: ['MLO', 'AGENT', 'NVOCC', 'JV'] },
      grid: { left: '8%', right: '4%', bottom: '14%', top: '12%', containLabel: true },
      xAxis: { type: 'value', name: 'TEUs', scale: true },
      yAxis: { type: 'value', name: 'Blended Rate', scale: true },
      series: [
        { name: 'MLO', type: 'scatter', data: toPoints(res.mloScatterPlotList || []), symbolSize: 8, itemStyle: { color: 'rgba(51,153,153,1)' } },
        { name: 'AGENT', type: 'scatter', data: toPoints(res.agentScatterPlotList || []), symbolSize: 8, itemStyle: { color: 'rgba(153,255,51,1)' } },
        { name: 'NVOCC', type: 'scatter', data: toPoints(res.nvoccScatterPlotList || []), symbolSize: 8, itemStyle: { color: '#e25d5d' } },
        { name: 'JV', type: 'scatter', data: toPoints(res.jvScatterPlotList || []), symbolSize: 8, itemStyle: { color: 'rgba(255,153,51,1)' } },
      ],
    }, true);

    // Click scatter → back to Revenue
    chart.off('click');
    chart.on('click', () => {
      this.showScatter = false;
      this.renderRevenueChart();
    });
  }

  // === Chart 5: Loading Concentration ===
  private renderConcentrationChart() {
    if (!this.concentrationChartEl || !this.data) return;
    const customerList = this.data.customerList || [];
    const customerVoyageList = this.data.customerVoyageList || [];
    const customerVoyageValueList = this.data.customerVoyageValueList || [];
    if (customerList.length === 0) return;

    const chart = this.getChart('concentration', this.concentrationChartEl);
    const voyages = customerVoyageList.map((v: any) => v.voyageId || '');

    const seriesData = customerList.map((cust: any) => {
      const points: number[][] = [];
      customerVoyageValueList.forEach((v: any) => {
        if (v.customer === cust.customer && v.voyageId != null) {
          const xIdx = voyages.indexOf(v.voyageId);
          if (xIdx >= 0 && v.totalCustValue) points.push([xIdx, v.totalCustValue]);
        }
      });
      return { name: cust.customer || 'Unknown', type: 'scatter' as const, data: points, symbolSize: 10 };
    });

    chart.setOption({
      title: { text: 'Loading Concentration', left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.seriesName}: <b>${Number(p.value[1]).toLocaleString()}</b>` },
      legend: { bottom: 0, type: 'scroll' },
      grid: { left: '8%', right: '4%', bottom: '16%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: voyages, axisLabel: { fontSize: 10, rotate: 30 } },
      yAxis: { type: 'value', name: 'TEU' },
      series: seriesData,
    });
  }
}
