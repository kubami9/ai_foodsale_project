import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catalogPageSchema, productSchema, successSchema } from '@foodsale/contracts';
import { map } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);
  list(params: Record<string, string>) {
    return this.http
      .get<unknown>('/api/products', { params })
      .pipe(map((body) => successSchema(catalogPageSchema).parse(body).data));
  }
  findById(id: string) {
    return this.http
      .get<unknown>(`/api/products/${encodeURIComponent(id)}`)
      .pipe(map((body) => successSchema(productSchema).parse(body).data));
  }
}
