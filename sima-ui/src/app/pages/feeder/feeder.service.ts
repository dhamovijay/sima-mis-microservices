import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// === Monthly ===
export interface FeederMonthlyBean {
  id?: string; text?: string; service?: string; serviceShortCode?: string;
  totalTeus?: number; totalRevenue?: number; totalBlended?: number;
  month?: string; year?: string;
  totalTeusList?: number[]; totalRevenueList?: number[]; totalBlendedList?: number[]; monthList?: string[];
}
export interface FeederMonthlyResult { dataList: FeederMonthlyBean[]; success: boolean; bean?: FeederMonthlyBean; }

// === Weekly Voyage ===
export interface WeeklyVoyageBean {
  month?: string; year?: string; week?: number; totalTeus?: number; type?: string;
  vesselId?: string; sectorId?: string; voyageId?: string;
  sector?: string; vessel?: string; voyage?: string;
  teus?: number; revenue?: number; margin?: number;
  teusChart?: string; revenueChart?: string; marginChart?: string;
}
export interface WeeklyVoyageResult {
  success: boolean;
  yearDataList?: WeeklyVoyageBean[]; monthDataList?: WeeklyVoyageBean[]; weekDataList?: WeeklyVoyageBean[];
  tableList?: WeeklyVoyageBean[]; tableList2?: WeeklyVoyageBean[];
}

// === Voyage Performance Tracker ===
export interface VoyageTrackerBean {
  vesselId?: string; sectorId?: string; voyageId?: string;
  totalTeus?: number; totalRevenue?: number; totalBlended?: number;
  totalProformaVoyDays?: number; totalActualDays?: number;
  totalWeight?: number; totalCapacity?: number; closedate?: string;
  totalTeusList?: number[]; totalRevenueList?: number[]; totalBlendedList?: number[];
  voyageList?: string[]; proformaList?: number[]; actualList?: number[]; monthList?: string[];
}
export interface DropdownItem { id?: string; text?: string; }
export interface VoyageTrackerResult {
  success: boolean;
  bean?: VoyageTrackerBean; bean1?: VoyageTrackerBean; bean2?: VoyageTrackerBean;
  bean3?: VoyageTrackerBean; bean4?: VoyageTrackerBean;
  dataList?: VoyageTrackerBean[];
  serviceList?: DropdownItem[];
  vesselList?: DropdownItem[];
  customerList?: any[];
  customerVoyageList?: any[];
  customerVoyageValueList?: any[];
  voyageWeightList?: any[];
  mloScatterPlotList?: any[];
  agentScatterPlotList?: any[];
  nvoccScatterPlotList?: any[];
  jvScatterPlotList?: any[];
}

// === Port Flow ===
export interface PortFlowBean {
  year?: string; month?: string; type?: string; pol?: string; pod?: string;
  sector?: string; teus?: number; convertteus?: string;
}
export interface PortFlowResult { success: boolean; dataList: PortFlowBean[]; }

// === Port Performance ===
export interface PortPerformanceBean {
  voyageId?: string; pol?: string; pod?: string;
  loadedteus?: number; dischargedteus?: number; onboardteus?: number; averageutilization?: number;
}
export interface PortPerformanceResult {
  success: boolean; dataList: PortPerformanceBean[]; loadingList: PortPerformanceBean[]; categories: string[];
}

// === Customer 360 ===
export interface Customer360Bean {
  id?: string; text?: string; year?: string; customer?: string; customerName?: string;
  rev?: number; tues?: number; rate?: number; minRate?: string; maxRate?: string;
  pol?: string; pod?: string; sectorId?: string; type?: string;
  montext?: string; revenue?: number; label?: string; monyear?: string;
  d20Rev?: number; d20Tues?: number; d20BlRate?: number;
  d40Rev?: number; d40Tues?: number; d40BlRate?: number;
}
export interface Customer360Result {
  success: boolean; dataList: Customer360Bean[]; tuesList?: Customer360Bean[];
  rateList?: Customer360Bean[]; graphList?: Customer360Bean[]; tableList?: Customer360Bean[];
}

// === Vessel Monthly Report ===
export interface VesselMonthlyBean {
  vesselCode?: string; vesselName?: string; build?: string; flag?: string; service?: string;
  normalCapacity?: string; effectiveCapacity?: string; purchasePrice?: string;
  bookValue?: string; marketValue?: string; loanOutstanding?: string; loanDate?: string;
  ltvPercentage?: number; nominalTeus?: string; vesselCapacity?: string;
  expenseType?: string; expenseName?: string; amount?: number;
  costCategory?: string; costName?: string; costPeriod?: string; totalAmount?: number;
}
export interface VesselMonthlyResult {
  success: boolean; vesselList?: VesselMonthlyBean[];
  costTable1?: VesselMonthlyBean[]; costTable2?: VesselMonthlyBean[];
  costTable3?: VesselMonthlyBean[]; costTable4?: VesselMonthlyBean[];
  costTable5?: VesselMonthlyBean[]; costTable6?: VesselMonthlyBean[];
}

@Injectable({ providedIn: 'root' })
export class FeederService {
  private baseUrl = 'http://localhost:8000/api/feeder';

  constructor(private http: HttpClient) {}

  // Monthly
  getBasicChart(year: string, month: string): Observable<FeederMonthlyResult> {
    return this.http.post<FeederMonthlyResult>(`${this.baseUrl}/monthly/getBasicChart`, { year, month });
  }
  getSynchronizedChart(service: string): Observable<FeederMonthlyResult> {
    return this.http.post<FeederMonthlyResult>(`${this.baseUrl}/monthly/synchronizeChartList`, { service });
  }

  // Weekly Voyage
  getWeeklyInitialChart(): Observable<WeeklyVoyageResult> {
    return this.http.get<WeeklyVoyageResult>(`${this.baseUrl}/weekly/getInitialChart`);
  }
  getWeeklyTableList(yearWeek: string): Observable<WeeklyVoyageResult> {
    return this.http.post<WeeklyVoyageResult>(`${this.baseUrl}/weekly/tableList?value=${yearWeek}`, {});
  }

  // Voyage Performance Tracker
  getVoyageTrackerDropdowns(): Observable<VoyageTrackerResult> {
    return this.http.get<VoyageTrackerResult>(`${this.baseUrl}/tracker/dropdowns`);
  }
  getVoyageTrackerVessels(sectorId: string): Observable<VoyageTrackerResult> {
    return this.http.get<VoyageTrackerResult>(`${this.baseUrl}/tracker/vessels?sectorId=${sectorId}`);
  }
  getVoyageTrackerData(bean: any): Observable<VoyageTrackerResult> {
    return this.http.post<VoyageTrackerResult>(`${this.baseUrl}/tracker/getChartData`, bean);
  }
  getSpeedometerData(bean: any): Observable<VoyageTrackerResult> {
    return this.http.post<VoyageTrackerResult>(`${this.baseUrl}/tracker/speedometerChartList`, bean);
  }
  getScatterData(bean: any): Observable<VoyageTrackerResult> {
    return this.http.post<VoyageTrackerResult>(`${this.baseUrl}/tracker/scatterChartList`, bean);
  }

  // Port Flow
  getPortFlowHeader(bean: any): Observable<PortFlowResult> {
    return this.http.post<PortFlowResult>(`${this.baseUrl}/portflow/header`, bean);
  }

  // Port Performance
  getPortPerformance(voyageId: string): Observable<PortPerformanceResult> {
    return this.http.get<PortPerformanceResult>(`${this.baseUrl}/portperformance/chart?voyageId=${voyageId}`);
  }

  // Customer 360
  getCustomerDropDown(): Observable<Customer360Result> {
    return this.http.get<Customer360Result>(`${this.baseUrl}/customer360/customerDropDown`);
  }
  getPortDropDown(): Observable<Customer360Result> {
    return this.http.get<Customer360Result>(`${this.baseUrl}/customer360/portDropDown`);
  }
  getCustomerRevenueRate(bean: any): Observable<Customer360Result> {
    return this.http.post<Customer360Result>(`${this.baseUrl}/customer360/revenueRate`, bean);
  }
  getCustomerByRate(bean: any): Observable<Customer360Result> {
    return this.http.post<Customer360Result>(`${this.baseUrl}/customer360/customerByRate`, bean);
  }
  getBlendedRateList(bean: any): Observable<Customer360Result> {
    return this.http.post<Customer360Result>(`${this.baseUrl}/customer360/blendedRate`, bean);
  }

  // Vessel Monthly Report
  getVesselDetails(): Observable<VesselMonthlyResult> {
    return this.http.get<VesselMonthlyResult>(`${this.baseUrl}/vesselmonthly/vessels`);
  }
  getVesselCosts(vesselId: string): Observable<VesselMonthlyResult> {
    return this.http.get<VesselMonthlyResult>(`${this.baseUrl}/vesselmonthly/costs?vesselId=${vesselId}`);
  }
}
