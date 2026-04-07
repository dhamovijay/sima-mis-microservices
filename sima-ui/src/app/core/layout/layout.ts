import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd  } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, Footer, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  isLoginPage: boolean = false;
  constructor(public router: Router, public authService: AuthService ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        !this.isLoginPage; this.router.url === '/login';
      }
    });

  } 

  isDark = localStorage.getItem('sima-theme') === 'dark';
  sidebarOpen = false;

  onLoginSuccess() {
    this.isLoginPage = true; // 👈 called after successful login
  }

  toggleTheme() { 
    this.isDark = !this.isDark;
    localStorage.setItem('sima-theme', this.isDark ? 'dark' : 'light');
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
  }

}
