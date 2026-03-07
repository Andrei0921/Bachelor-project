import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

export const ResponseNormalizerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    mergeMap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.body instanceof Blob) {
        const contentType = event.headers.get('Content-Type') || event.body.type || '';
        return from(event.body.text()).pipe(
          map(text => {
            let body: any = text;
            if (/application\/json|application\/.*\+json/i.test(contentType)) {
              try {
                body = JSON.parse(text);
              } catch {
                // leave as plain text
              }
            }
            return event.clone({ body });
          })
        );
      }
      return of(event);
    })
  );
};
