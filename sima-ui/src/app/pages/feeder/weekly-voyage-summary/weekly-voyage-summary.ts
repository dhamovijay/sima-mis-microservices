import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import * as echarts from 'echarts';
import { FeederService, WeeklyVoyageBean } from '../feeder.service';

type DrillLevel = 'year' | 'month' | 'week';

@Component({
  selector: 'app-weekly-voyage-summary',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './weekly-voyage-summary.html',
  styleUrl: './weekly-voyage-summary.css',
})
export class WeeklyVoyageSummary implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chart') chartEl!: ElementRef;
  private chart: echarts.ECharts | null = null;
  private ro: ResizeObserver | null = null;

  loading = false;
  drillLevel: DrillLevel = 'year';
  breadcrumb: { level: DrillLevel; label: string }[] = [];

  yearData: WeeklyVoyageBean[] = [];
  monthData: WeeklyVoyageBean[] = [];
  weekData: WeeklyVoyageBean[] = [];

  selectedYear = '';
  selectedMonth = '';

  ownVoyages: WeeklyVoyageBean[] = [];
  thirdPartyVoyages: WeeklyVoyageBean[] = [];
  showTable = false;
  tableLoading = false;
  selectedWeekLabel = '';
  private sparklinesPending = false;

  constructor(private feederService: FeederService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.chart?.dispose();
    this.ro?.disconnect();
    window.removeEventListener('resize', this.onResize);
  }

  ngAfterViewChecked() {
    if (this.sparklinesPending && this.showTable && !this.tableLoading) {
      this.sparklinesPending = false;
      setTimeout(() => this.renderAllSparklines(), 50);
    }
  }

  private onResize = () => requestAnimationFrame(() => this.chart?.resize());

  loadInitialData() {
    this.loading = true;
    this.feederService.getWeeklyInitialChart().subscribe({
      next: (res) => {
        this.loading = false;
        this.yearData = res.yearDataList || [];
        this.monthData = res.monthDataList || [];
        this.weekData = res.weekDataList || [];
        this.drillLevel = 'year';
        this.breadcrumb = [{ level: 'year', label: 'Yearly' }];
        this.showTable = false;
        setTimeout(() => this.renderChart());
      },
      error: () => (this.loading = false),
    });
  }

  renderChart() {
    if (!this.chartEl) return;
    if (!this.chart) {
      this.chart = echarts.init(this.chartEl.nativeElement);
      window.addEventListener('resize', this.onResize);
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(this.chartEl.nativeElement);
    }

    let categories: string[] = [];
    let values: number[] = [];
    let title = '';

    if (this.drillLevel === 'year') {
      categories = this.yearData.map((d) => d.year || '');
      values = this.yearData.map((d) => d.totalTeus || 0);
      title = 'TEUs by Year';
    } else if (this.drillLevel === 'month') {
      const filtered = this.monthData.filter((d) => d.year === this.selectedYear);
      categories = filtered.map((d) => d.month || '');
      values = filtered.map((d) => d.totalTeus || 0);
      title = `TEUs in ${this.selectedYear} by Month`;
    } else {
      const filtered = this.weekData.filter(
        (d) => d.year === this.selectedYear && d.month === this.selectedMonth
      );
      categories = filtered.map((d) => String(d.week || ''));
      values = filtered.map((d) => d.totalTeus || 0);
      title = `TEUs in ${this.selectedMonth}/${this.selectedYear} by Week`;
    }

    const option: echarts.EChartsOption = {
      title: { text: title, left: 'center', textStyle: { fontSize: 15, fontWeight: 600 } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const p = params[0];
          return `${p.name}<br/>TEUs: <b>${Number(p.value).toLocaleString()}</b>`;
        },
      },
      grid: { left: '8%', right: '4%', bottom: '12%', top: '16%', containLabel: true },
      xAxis: { type: 'category', data: categories, axisLabel: { fontSize: 12 } },
      yAxis: {
        type: 'value',
        name: 'TEUs',
        axisLabel: {
          formatter: (v: number) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toString()),
        },
      },
      series: [
        {
          name: 'TEUs',
          type: 'bar',
          data: values,
          barMaxWidth: 60,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0ea5e9' },
              { offset: 1, color: '#6366f1' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          label: { show: true, position: 'top', formatter: (p: any) => Number(p.value).toLocaleString(), fontSize: 11, fontWeight: 600 },
          emphasis: { itemStyle: { opacity: 0.85 } },
        },
      ],
    };

    this.chart.setOption(option, true);
    this.chart.off('click');
    this.chart.on('click', (params: any) => this.onBarClick(params.name));
  }

  onBarClick(name: string) {
    if (this.drillLevel === 'year') {
      this.selectedYear = name;
      this.drillLevel = 'month';
      this.breadcrumb = [{ level: 'year', label: 'Yearly' }, { level: 'month', label: name }];
      this.showTable = false;
      this.renderChart();
    } else if (this.drillLevel === 'month') {
      this.selectedMonth = name;
      this.drillLevel = 'week';
      this.breadcrumb = [{ level: 'year', label: 'Yearly' }, { level: 'month', label: this.selectedYear }, { level: 'week', label: name }];
      this.showTable = false;
      this.renderChart();
    } else if (this.drillLevel === 'week') {
      this.loadTableData(name);
    }
  }

  onBreadcrumbClick(level: DrillLevel) {
    if (level === 'year') {
      this.drillLevel = 'year';
      this.breadcrumb = [{ level: 'year', label: 'Yearly' }];
      this.showTable = false;
      this.renderChart();
    } else if (level === 'month') {
      this.drillLevel = 'month';
      this.breadcrumb = [{ level: 'year', label: 'Yearly' }, { level: 'month', label: this.selectedYear }];
      this.showTable = false;
      this.renderChart();
    }
  }

  loadTableData(week: string) {
    this.tableLoading = true;
    this.selectedWeekLabel = `Week ${week}`;
    const value = `${this.selectedYear}-${week}`;

    this.feederService.getWeeklyTableList(value).subscribe({
      next: (res) => {
        this.tableLoading = false;
        this.ownVoyages = res.tableList || [];
        this.thirdPartyVoyages = res.tableList2 || [];
        this.showTable = true;
        this.sparklinesPending = true;
      },
      error: () => (this.tableLoading = false),
    });
  }

  // --- Sparkline rendering ---
  parseSparkData(csv: string | undefined): number[] {
    if (!csv) return [];
    return csv.split(',').map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v));
  }

  private renderAllSparklines() {
    document.querySelectorAll('canvas.sparkline').forEach((canvas) => {
      const el = canvas as HTMLCanvasElement;
      if (el.dataset['rendered'] === '1') return;
      const data = this.parseSparkData(el.dataset['values']);
      const color = el.dataset['color'] || '#ABB2B9';
      const negColor = el.dataset['negcolor'] || color;
      const label = el.dataset['label'] || '';
      this.drawSparkBar(el, data, color, negColor, label);
      el.dataset['rendered'] = '1';
    });
  }

  private drawSparkBar(canvas: HTMLCanvasElement, data: number[], color: string, negColor: string, label: string) {
    const ctx = canvas.getContext('2d');
    if (!ctx || data.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const max = Math.max(...data.map(Math.abs), 1);
    const barW = Math.max(2, Math.floor((w - data.length) / data.length));
    const gap = 1;

    // Store bar rects for hit detection
    const bars: { x: number; w: number; val: number }[] = [];

    ctx.clearRect(0, 0, w, h);

    data.forEach((val, i) => {
      const rawH = (Math.abs(val) / max) * (h * 0.85);
      const barH = val !== 0 ? Math.max(rawH, 3) : 0; // minimum 3px so small bars are visible
      const x = i * (barW + gap);
      ctx.fillStyle = val >= 0 ? color : negColor;
      ctx.fillRect(x, h - barH, barW, barH);
      bars.push({ x, w: barW, val });
    });

    // Tooltip
    let tooltip: HTMLDivElement | null = null;

    const getTooltip = (): HTMLDivElement => {
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'spark-tooltip';
        tooltip.style.cssText = 'position:fixed;padding:4px 8px;background:rgba(15,23,42,0.9);color:#fff;font-size:12px;border-radius:6px;pointer-events:none;z-index:9999;white-space:nowrap;display:none;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
        document.body.appendChild(tooltip);
      }
      return tooltip;
    };

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const tip = getTooltip();

      let found = false;
      for (const bar of bars) {
        if (mx >= bar.x && mx <= bar.x + bar.w) {
          tip.innerHTML = `${label ? '<b>' + label + '</b>: ' : ''}${bar.val.toLocaleString()}`;
          tip.style.left = e.clientX + 10 + 'px';
          tip.style.top = e.clientY - 30 + 'px';
          tip.style.display = 'block';
          found = true;
          break;
        }
      }
      if (!found) tip.style.display = 'none';
    });

    canvas.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
    });
  }
}
