import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Monthly } from './pages/feeder/feeder-service-monthly/monthly';
import { Yearly} from './pages/feeder/yearly/yearly';
import { Settings } from './pages/settings/settings';
import { Login } from './auth/login/login';
import { AuthGuard } from './guards/auth-guard';
import { Layout } from './core/layout/layout';


export const routes: Routes = [
   // Default route → show login first
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'feeder/feeder-service-monthly', component: Monthly, canActivate: [AuthGuard] },
      { path: 'feeder/yearly', component: Yearly, canActivate: [AuthGuard]},
      { path: 'settings', component: Settings, canActivate: [AuthGuard] },
     ],
  },
 
  // Wildcard → redirect to login if route not found
  { path: '**', redirectTo: 'login' }, 

];
