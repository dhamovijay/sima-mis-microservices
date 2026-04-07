import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeederMonthlyBean {
  id?: string;
  text?: string;
  service?: string;
  serviceShortCode?: string;
  totalTeus?: number;
  totalRevenue?: number;
  totalBlended?: number;
  month?: string;
  year?: string;
  totalTeusList?: number[];
  totalRevenueList?: number[];
  totalBlendedList?: number[];
  monthList?: string[];
}

export interface FeederMonthlyResult {
  dataList: FeederMonthlyBean[];
  success: boolean;
  bean?: FeederMonthlyBean;
}

@Injectable({ providedIn: 'root' })
export class FeederService {
  private baseUrl = 'http://localhost:8000/api/feeder/monthly';

  constructor(private http: HttpClient) {}

  getBasicChart(year: string, month: string): Observable<FeederMonthlyResult> {
    return this.http.post<FeederMonthlyResult>(`${this.baseUrl}/getBasicChart`, { year, month });
  }

  getSynchronizedChart(service: string): Observable<FeederMonthlyResult> {
    return this.http.post<FeederMonthlyResult>(`${this.baseUrl}/synchronizeChartList`, { service });
  }
}
