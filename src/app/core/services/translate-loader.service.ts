import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class LocalTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<unknown> {
    return this.http.get(`./assets/locales/${(lang).toLowerCase()}.json`);
  }
}
