import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogStore } from './catalog-store';
import { ProductCard } from './product-card';
import { Feedback } from '../shared/feedback';
import { categories } from './categories';
@Component({
  imports: [ProductCard, Feedback, RouterLink],
  providers: [CatalogStore],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {
  readonly store = inject(CatalogStore);
  readonly categories = categories;
  search(event: Event, query: string): void {
    event.preventDefault();
    this.store.update({ query: query.trim() || null });
  }
}
