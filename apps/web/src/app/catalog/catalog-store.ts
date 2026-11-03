import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { Params, ParamMap } from '@angular/router';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { CatalogApi } from './catalog-api';
import { requestState } from '../shared/request-state';
function queryParams(params: ParamMap): Record<string, string> {
  return Object.fromEntries(
    ['query', 'category', 'available', 'page'].flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value]] : [];
    }),
  );
}
@Injectable()
export class CatalogStore {
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly refresh = new BehaviorSubject(0);
  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });
  readonly query = computed(() => this.params().get('query') ?? '');
  readonly category = computed(() => this.params().get('category') ?? '');
  readonly availableOnly = computed(() => this.params().get('available') === 'true');
  readonly state = toSignal(
    combineLatest([this.route.queryParamMap, this.refresh]).pipe(
      switchMap(([params]) => requestState(this.api.list(queryParams(params)))),
    ),
    { initialValue: { status: 'loading' } as const },
  );
  update(filters: Params): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...filters, page: filters['page'] ?? 1 },
      queryParamsHandling: 'merge',
    });
  }
  retry(): void {
    this.refresh.next(this.refresh.value + 1);
  }
}
