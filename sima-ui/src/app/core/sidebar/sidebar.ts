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
        { title: 'Yearly', route: '/feeder/yearly' }
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
