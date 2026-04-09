import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeederService, FeederMonthlyBean } from '../feeder.service';

interface ServiceData {
  serviceShortCode: string;
  service: string;
  totalRevenue: number;
  totalTeus: number;
}

const COLOR_PALETTES: Record<string, string[]> = {
  blue: ['#0D0975', '#23238B', '#393DA2', '#5056B8', '#6670CF', '#7C8AE5'],
  quaa: ['#ff2727', '#e7ff22', '#ff3aed', '#4bff60', '#ce45ff'],
  lucky: ['#ec1e1e', '#f2983d', '#fbf33d', '#64f02c', '#2b5ee7'],
  highlight: ['#f0ff00', '#22ff00', '#ff00db', '#04dfff', '#b000ff'],
  lifesaver: ['#a9438b', '#f0a736', '#ecee12', '#e14850', '#5ee352'],
  boneless: ['#9e957d', '#4e4848', '#445e8d', '#da8871', '#edeb94'],
  yellow: ['#F8E810', '#F8E82F', '#F8E84E', '#F9E96C', '#F9E98B', '#F9E9AA'],
  green: ['#4BFB06', '#61FA28', '#77F84A', '#8CF76C', '#A2F58E', '#B8F4B0'],
  pink: ['#ED9191', '#EF9D9D', '#F1A9A9', '#F3B5B5', '#F5C1C1', '#F7CDCD'],
  lightblue: ['#56E8E8', '#C8E6F7', '#6FE8EB', '#AFE6F4', '#95E7F0', '#7CE7ED'],
};

const MONTH_SHORT: Record<string, string> = {
  '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
  '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
  '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC',
};

@Component({
  selector: 'app-monthly',
  imports: [FormsModule, CommonModule],
  templateUrl: './monthly.html',
  styleUrl: './monthly.css',
})
export class Monthly implements OnInit, OnDestroy {
  @ViewChild('leftChart') leftChartEl!: ElementRef;
  @ViewChild('volumeChart') volumeChartEl!: ElementRef;
  @ViewChild('blendedChart') blendedChartEl!: ElementRef;
  @ViewChild('marginChart') marginChartEl!: ElementRef;

  private leftChart: echarts.ECharts | null = null;
  private syncCharts: echarts.ECharts[] = [];
  private resizeObserver: ResizeObserver | null = null;

  year: string;
  month: string;
  selectedPalette = 'blue';
  paletteKeys = Object.keys(COLOR_PALETTES);

  selectedService = '';
  showSync = false;
  loading = false;

  serviceList: ServiceData[] = [];

  monthDropDownList = [
    { id: '01', text: 'January' }, { id: '02', text: 'February' },
    { id: '03', text: 'March' }, { id: '04', text: 'April' },
    { id: '05', text: 'May' }, { id: '06', text: 'June' },
    { id: '07', text: 'July' }, { id: '08', text: 'August' },
    { id: '09', text: 'September' }, { id: '10', text: 'October' },
    { id: '11', text: 'November' }, { id: '12', text: 'December' },
  ];

  yearList: string[] = [];

  constructor(private feederService: FeederService) {
    const now = new Date();
    this.year = now.getFullYear().toString();
    const m = now.getMonth() + 1;
    this.month = m < 10 ? '0' + m : '' + m;

    for (let i = 0; i < 5; i++) {
      this.yearList.push((now.getFullYear() - i).toString());
    }
  }

  ngOnInit() {
    setTimeout(() => this.loadData());
  }

  ngOnDestroy() {
    this.leftChart?.dispose();
    this.syncCharts.forEach((c) => c.dispose());
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    requestAnimationFrame(() => {
      this.leftChart?.resize();
      this.syncCharts.forEach((c) => c.resize());
    });
  };

  private observeResize(el: HTMLElement) {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(el);
  }

  get chartLabel(): string {
    return `Services in ${MONTH_SHORT[this.month] || ''}-${this.year}`;
  }

  loadData() {
    if (!this.year || !this.month) return;
    this.loading = true;
    this.showSync = false;
    this.selectedService = '';

    this.feederService.getBasicChart(this.year, this.month).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.dataList) {
          this.serviceList = res.dataList.map((d) => ({
            serviceShortCode: d.serviceShortCode || '',
            service: d.service || '',
            totalRevenue: d.totalRevenue || 0,
            totalTeus: d.totalTeus || 0,
          }));
          setTimeout(() => this.renderLeftChart());
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  renderLeftChart() {
    if (!this.leftChartEl) return;
    this.leftChart?.dispose();
    this.leftChart = echarts.init(this.leftChartEl.nativeElement);
    window.addEventListener('resize', this.onResize);
    this.observeResize(this.leftChartEl.nativeElement);

    const colors = COLOR_PALETTES[this.selectedPalette];
    const categories = this.serviceList.map((s) => s.serviceShortCode);
    const values = this.serviceList.map((s) => s.totalRevenue);

    const option: echarts.EChartsOption = {
      title: { text: this.chartLabel, left: 'center', textStyle: { fontSize: 16 } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const p = params[0];
          const idx = p.dataIndex;
          const svc = this.serviceList[idx];
          return `<b>${svc.serviceShortCode}</b><br/>
                  TEUs: <b>${(svc.totalTeus || 0).toLocaleString()}</b><br/>
                  Margin: <b>${(svc.totalRevenue || 0).toLocaleString()}</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 30, fontSize: 11 },
        name: 'Services',
        nameLocation: 'middle',
        nameGap: 35,
      },
      yAxis: {
        type: 'value',
        name: 'Contribution Margin (USD)',
        axisLabel: {
          formatter: (v: number) => {
            if (v === 0) return '0';
            return (v / 1000000).toFixed(0) + 'M';
          },
        },
      },
      series: [
        {
          name: 'Contribution Margin',
          type: 'bar',
          data: values.map((v, i) => ({
            value: v,
            itemStyle: { color: colors[i % colors.length] },
          })),
          barMaxWidth: 50,
          label: {
            show: true,
            position: 'top',
            formatter: (p: any) => {
              const v = Math.abs(p.value);
              if (v >= 1000000) return (p.value / 1000000).toFixed(1) + 'M';
              if (v >= 1000) return (p.value / 1000).toFixed(0) + 'K';
              return p.value;
            },
            fontSize: 11,
          },
        },
      ],
    };

    this.leftChart.setOption(option);

    this.leftChart.on('click', (params: any) => {
      const idx = params.dataIndex;
      const svc = this.serviceList[idx];
      this.onServiceClick(svc.service, svc.serviceShortCode);
    });
  }

  onServiceClick(service: string, shortCode: string) {
    this.selectedService = shortCode;
    this.showSync = false;

    this.feederService.getSynchronizedChart(service).subscribe({
      next: (res) => {
        if (res.bean) {
          this.showSync = true;
          setTimeout(() => this.renderSyncCharts(res.bean!, shortCode));
        }
      },
    });
  }

  renderSyncCharts(bean: FeederMonthlyBean, serviceName: string) {
    this.syncCharts.forEach((c) => c.dispose());
    this.syncCharts = [];

    const months = bean.monthList || [];
    const datasets = [
      { name: 'Volume (TEUs)', data: bean.totalTeusList || [], color: '#7cb5ec', type: 'bar' as const },
      { name: 'Blended Rate (USD/TEU)', data: bean.totalBlendedList || [], color: '#f7a35c', type: 'line' as const },
      { name: 'Contribution Margin (USD)', data: bean.totalRevenueList || [], color: '#90ed7d', type: 'bar' as const },
    ];

    const refs = [this.volumeChartEl, this.blendedChartEl, this.marginChartEl];

    datasets.forEach((ds, i) => {
      if (!refs[i]) return;
      const chart = echarts.init(refs[i].nativeElement);
      this.syncCharts.push(chart);

      const option: echarts.EChartsOption = {
        title: {
          text: ds.name,
          left: 'left',
          textStyle: { fontSize: 14 },
          subtext: serviceName,
          subtextStyle: { fontSize: 16, fontWeight: 'bold' as const },
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const p = params[0];
            return `${p.name}<br/>${ds.name}: <b>${Number(p.value).toLocaleString()}</b>`;
          },
        },
        grid: { left: '10%', right: '5%', bottom: '15%', top: '22%' },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: { rotate: 45, fontSize: 10 },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (v: number) => {
              if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1) + 'M';
              if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + 'K';
              return v.toString();
            },
          },
        },
        series: [
          {
            name: ds.name,
            type: ds.type,
            data: ds.data,
            itemStyle: { color: ds.color },
            areaStyle: ds.type === 'bar' ? undefined : { opacity: 0.3 },
            smooth: ds.type === 'line',
          },
        ],
      };

      chart.setOption(option);

      // Synchronized tooltip on hover
      chart.on('mouseover', (params: any) => {
        this.syncCharts.forEach((c, j) => {
          if (j !== i) {
            c.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: params.dataIndex });
          }
        });
      });

      chart.on('mouseout', () => {
        this.syncCharts.forEach((c, j) => {
          if (j !== i) {
            c.dispatchAction({ type: 'hideTip' });
          }
        });
      });
    });
  }

  changePalette(key: string) {
    this.selectedPalette = key;
    if (this.serviceList.length > 0) {
      this.renderLeftChart();
    }
  }
}
