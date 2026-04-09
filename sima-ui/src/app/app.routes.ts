import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Monthly } from './pages/feeder/feeder-service-monthly/monthly';
import { WeeklyVoyageSummary } from './pages/feeder/weekly-voyage-summary/weekly-voyage-summary';
import { VoyagePerformanceTracker } from './pages/feeder/voyage-performance-tracker/voyage-performance-tracker';
import { PortTraffic } from './pages/feeder/port-traffic/port-traffic';
import { PortFlow } from './pages/feeder/port-flow/port-flow';
import { VesselMonthlyReport } from './pages/feeder/vessel-monthly-report/vessel-monthly-report';
import { PortPerformance } from './pages/feeder/port-performance/port-performance';
import { Customer360 } from './pages/feeder/customer-360/customer-360';
import { BlendedRate } from './pages/feeder/blended-rate/blended-rate';
import { Yearly } from './pages/feeder/yearly/yearly';
import { Settings } from './pages/settings/settings';
import { Login } from './auth/login/login';
import { AuthGuard } from './guards/auth-guard';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'feeder/feeder-service-monthly', component: Monthly, canActivate: [AuthGuard] },
      { path: 'feeder/weekly-voyage-summary', component: WeeklyVoyageSummary, canActivate: [AuthGuard] },
      { path: 'feeder/voyage-performance-tracker', component: VoyagePerformanceTracker, canActivate: [AuthGuard] },
      { path: 'feeder/port-traffic', component: PortTraffic, canActivate: [AuthGuard] },
      { path: 'feeder/port-flow', component: PortFlow, canActivate: [AuthGuard] },
      { path: 'feeder/vessel-monthly-report', component: VesselMonthlyReport, canActivate: [AuthGuard] },
      { path: 'feeder/port-performance', component: PortPerformance, canActivate: [AuthGuard] },
      { path: 'feeder/customer-360', component: Customer360, canActivate: [AuthGuard] },
      { path: 'feeder/blended-rate', component: BlendedRate, canActivate: [AuthGuard] },
      { path: 'feeder/yearly', component: Yearly, canActivate: [AuthGuard] },
      { path: 'settings', component: Settings, canActivate: [AuthGuard] },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
