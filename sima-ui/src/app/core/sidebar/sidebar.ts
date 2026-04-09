import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../menu-item/menu-item';
import { AuthService } from '../../auth/auth.service'; 

interface MenuNode {
  title: string;
  route?: string;
  children?: MenuNode[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
    constructor(private authService: AuthService) {}

  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<boolean>();

  isDark = localStorage.getItem('sima-theme') === 'dark';

  menu: MenuNode[] = [
    { title: 'Dashboard', route: '/dashboard' },
    {
      title: 'Feeder',
      children: [
        { title: 'Feeder Service Monthly', route: '/feeder/feeder-service-monthly' },
        { title: 'Weekly Voyage Summary', route: '/feeder/weekly-voyage-summary' },
        { title: 'Voyage Performance Tracker', route: '/feeder/voyage-performance-tracker' },
        { title: 'Port Traffic', route: '/feeder/port-traffic' },
        { title: 'Port Flow', route: '/feeder/port-flow' },
        { title: 'Vessel Monthly Report', route: '/feeder/vessel-monthly-report' },
        { title: 'Port Performance', route: '/feeder/port-performance' },
        { title: 'Customer 360', route: '/feeder/customer-360' },
        { title: 'Blended Rate', route: '/feeder/blended-rate' },
      ]
    },
    { title: 'Settings', route: '/settings' }
  ];

  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeChange.emit(this.isDark);
  }

  logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = '/login'; // refresh ensures clean state
  this.authService.logout();
}

}
