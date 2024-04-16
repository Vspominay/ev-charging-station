import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { LocalTranslateLoader } from '../services/translate-loader.service';

export const translateProvider = TranslateModule.forRoot({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useClass: LocalTranslateLoader
  }
});

