import { HttpInterceptorFn } from '@angular/common/http';
import { normalizeFalsyObject } from '@shared/utils/normalize-falsy-object.util';

export const normalizeBodyInterceptor: HttpInterceptorFn = (req, next) => {
  const body = req.body;

  if (!body) return next(req);

  return next(req.clone({ body: normalizeFalsyObject(body) }));
};
