import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

export const $getSelectedLanguage = () => {
  const translateService = inject(TranslateService);

  return toSignal(translateService.onLangChange.pipe(map(({ lang }) => lang)), { initialValue: translateService.currentLang });
};
