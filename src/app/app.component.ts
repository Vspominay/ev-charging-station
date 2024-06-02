import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrService } from '@core/services/signalr.service';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'bv-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  private readonly selectConfig = inject(NgSelectConfig);

  ngOnInit(): void {
    if (document.documentElement.getAttribute('data-layout') == 'semibox') {
      document.documentElement.setAttribute('data-layout', 'semibox');
      document.documentElement.setAttribute('data-layout-style', 'default');
    } else {
      document.documentElement.setAttribute('data-layout', 'semibox');
      document.documentElement.setAttribute('data-layout-style', 'detached');
    }
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');
    window.addEventListener('resize', function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute('data-sidebar-size', '');
        document.querySelector('.hamburger-icon')?.classList.add('open');
      } else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
        document.querySelector('.hamburger-icon')?.classList.add('open');
      } else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
        document.querySelector('.hamburger-icon')?.classList.remove('open');
      }
    });
  }

  private signalR = inject(SignalrService);

  constructor() {
    this.selectConfig.bindValue = 'id';
  }
}
