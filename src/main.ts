/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

defineElement(lottie.loadAnimation);
