import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../core/layouts/sidebar/sidebar.component';
import { TopbarComponent } from '../core/layouts/topbar/topbar.component';

@Component({
  selector: 'app-features-root',
  standalone: true,
  template: `
    <div id="layout-wrapper">
      <!-- Top Bar -->
      <app-topbar (mobileMenuButtonClicked)="onToggleMobileMenu()"></app-topbar>
      <!-- Side Bar -->
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <!-- Main Content -->
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [
    SidebarComponent,
    RouterOutlet,
    TopbarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesRootComponent {

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    const currentSIdebarSize = document.documentElement.getAttribute('data-sidebar-size');
    if (document.documentElement.clientWidth >= 767) {
      if (currentSIdebarSize == null) {
        (document.documentElement.getAttribute('data-sidebar-size') == null || document.documentElement.getAttribute('data-sidebar-size') == 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
      } else if (currentSIdebarSize == 'md') {
        (document.documentElement.getAttribute('data-sidebar-size') == 'md') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'md');
      } else {
        (document.documentElement.getAttribute('data-sidebar-size') == 'sm') ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
      }
    }

    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
    }
  }
}
