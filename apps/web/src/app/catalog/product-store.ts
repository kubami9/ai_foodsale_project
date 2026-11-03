import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { CatalogApi } from './catalog-api';
import { requestState } from '../shared/request-state';
@Injectable()
export class ProductStore {
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh = new BehaviorSubject(0);
  readonly state = toSignal(
    combineLatest([this.route.paramMap, this.refresh]).pipe(
      switchMap(([params]) => requestState(this.api.findById(params.get('id') ?? ''))),
    ),
    { initialValue: { status: 'loading' } as const },
  );
  retry(): void {
    this.refresh.next(this.refresh.value + 1);
  }
}
