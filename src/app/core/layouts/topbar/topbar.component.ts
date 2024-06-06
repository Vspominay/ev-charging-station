import { DOCUMENT, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Inject, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { RolePipe } from '@features/auth/ui/pipes/role.pipe';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbNavContent, NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconDirective } from '@shared/directives/icon.directive';

import dayjs from 'dayjs';
import { Locale as DayJsLocale } from 'dayjs/locale/*';
import dayEn from 'dayjs/locale/en';
import dayUk from 'dayjs/locale/uk';

// Language
//Logout
import { cartData } from './data';

import { CartModel } from './topbar.model';


export enum Locales {
  UK = 'UK',
  EN = 'EN',
}

export const LOCALES_CONFIG: Record<Locales, { dayJs: DayJsLocale }> = {
  [Locales.UK]: {
    dayJs: dayUk,
  },
  [Locales.EN]: {
    dayJs: dayEn,
  },
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgForOf,
    NgClass,
    RouterLink,
    NgIf,
    NgbNavOutlet,
    NgbNavContent,
    IconDirective,
    RolePipe,
    TranslateModule,
    NgOptimizedImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);

  readonly $vm = this.authFacade.$vm;

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData = {
    first_name: 'Dmytro',
    last_name: 'Horkun',
    role: 0
  };

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    // this.userData = this.TokenStorageService.getUser();
    this.element = document.documentElement;

    // Cookies wise Language set
    // this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    //  Fetch Data
    this.cartData = cartData;
    this.cart_length = this.cartData.length;
    this.cartData.forEach((item) => {
      var item_price = item.quantity * item.price;
      this.total += item_price;
    });

  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  ngAfterViewInit() {
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    // this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.documentElement.setAttribute('data-sidebar', 'light');
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.documentElement.setAttribute('data-sidebar', 'light');
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', 'light');
        break;
    }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: Locales.EN },
    { text: 'Ukrainian', flag: 'assets/images/flags/uk.svg', lang: Locales.UK },
  ];

  private readonly translateService = inject(TranslateService);

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: Locales, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;

    this.translateService.setDefaultLang(lang);
    dayjs.locale({
      ...LOCALES_CONFIG[lang].dayJs,
    });
    // this.languageService.setLanguage(lang);
  }

  logout() {
    this.logout();
  }
}
