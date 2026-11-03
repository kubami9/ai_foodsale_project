import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductStore } from './product-store';
import { categoryDetails } from './categories';
import { Feedback } from '../shared/feedback';
@Component({
  imports: [CurrencyPipe, RouterLink, Feedback],
  providers: [ProductStore],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage {
  readonly store = inject(ProductStore);
  readonly categories = categoryDetails;
}
