import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '@foodsale/contracts';
import { categoryDetails } from './categories';
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  template: ` <article class="product-card">
    <a
      [routerLink]="['/produkty', product().id]"
      queryParamsHandling="preserve"
      class="product-art"
      [style.background]="categories[product().category].color"
      [attr.aria-label]="'Szczegóły: ' + product().name"
    >
      <span class="art-label">{{ categories[product().category].label }}</span>
      <span class="food-icon" aria-hidden="true">{{ categories[product().category].icon }}</span>
      <span class="availability" [class.sold-out]="!product().available"
        ><span aria-hidden="true">●</span>
        {{ product().available ? 'Dostępne' : 'Wyprzedane' }}</span
      >
    </a>
    <div class="card-body">
      <p class="seller-name">
        {{ product().seller.name }} <span>· {{ product().seller.city }}</span>
      </p>
      <h3>
        <a [routerLink]="['/produkty', product().id]" queryParamsHandling="preserve">{{
          product().name
        }}</a>
      </h3>
      <div class="card-bottom">
        <p>
          <strong>{{
            product().priceGrosze / 100 | currency: 'PLN' : 'symbol' : '1.2-2' : 'pl'
          }}</strong
          ><span> / {{ product().unit }}</span>
        </p>
        <a
          [routerLink]="['/produkty', product().id]"
          queryParamsHandling="preserve"
          class="round-link"
          [attr.aria-label]="'Zobacz ' + product().name"
          >↗</a
        >
      </div>
    </div>
  </article>`,
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly categories = categoryDetails;
}
