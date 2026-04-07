import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface MenuNode {
  title: string;
  route?: string;
  children?: MenuNode[];
}

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLinkActive],
  templateUrl: './menu-item.html',
  styleUrls: ['./menu-item.css']
})
export class MenuItemComponent {
  @Input() item!: MenuNode;
  @Output() closeSidebar = new EventEmitter<void>();
  expanded = false;

  constructor(private router: Router) {}

  toggle() {
    if (this.item.children) {
      this.expanded = !this.expanded;
    } else if (this.item.route) {
      this.router.navigateByUrl(this.item.route);
      this.closeSidebar.emit();
    }
  }
}
