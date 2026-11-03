import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorSchema } from '@foodsale/contracts';
import { catchError, map, of, startWith } from 'rxjs';
import type { Observable } from 'rxjs';
export type RequestState<T> =
  { status: 'loading' } | { status: 'loaded'; data: T } | { status: 'error'; message: string };
export function requestState<T>(request: Observable<T>): Observable<RequestState<T>> {
  return request.pipe(
    map((data): RequestState<T> => ({ status: 'loaded', data })),
    startWith<RequestState<T>>({ status: 'loading' }),
    catchError((error: unknown) => {
      const parsed =
        error instanceof HttpErrorResponse ? apiErrorSchema.safeParse(error.error) : null;
      return of<RequestState<T>>({
        status: 'error',
        message: parsed?.success
          ? parsed.data.error.message
          : 'Nie udało się pobrać danych. Sprawdź połączenie i spróbuj ponownie.',
      });
    }),
  );
}
