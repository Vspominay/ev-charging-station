import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'bv-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
      <div id="layout-wrapper">
          <!-- Top Bar -->
<!--          <app-topbar (mobileMenuButtonClicked)="onToggleMobileMenu()"></app-topbar>-->
          <!-- Side Bar -->
<!--          <app-sidebar></app-sidebar>-->
          <div class="main-content">
              <div class="page-content">
                  <div class="container-fluid">
                      <!-- Main Content -->
                      <router-outlet></router-outlet>
                  </div>
              </div>
              <!-- Footer -->
<!--              <app-footer></app-footer>-->
          </div>
      </div>
      <!-- Right Side Bar -->
<!--      <app-rightsidebar  (settingsButtonClicked)="onSettingsButtonClicked()"></app-rightsidebar>-->
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    if (document.documentElement.getAttribute('data-layout') == 'semibox') {
      document.documentElement.setAttribute('data-layout', 'semibox');
      document.documentElement.setAttribute('data-layout-style', 'default');
    } else {
      document.documentElement.setAttribute('data-layout', 'vertical');
      document.documentElement.setAttribute('data-layout-style', 'detached');
    }
    document.documentElement.setAttribute('data-topbar', 'dark');
    document.documentElement.setAttribute('data-sidebar', 'light');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');
    window.addEventListener('resize', function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute('data-sidebar-size', '');
        document.querySelector('.hamburger-icon')?.classList.add('open')
      }
      else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
        document.querySelector('.hamburger-icon')?.classList.add('open')
      }
      else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
        document.querySelector('.hamburger-icon')?.classList.remove('open')
      }
    })
  }
}
