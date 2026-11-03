import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  template: `<section class="page-container py-20">
    <p class="eyebrow">404</p>
    <h1>Tu jeszcze nic nie rośnie.</h1>
    <p>Nie znaleźliśmy tej strony.</p>
    <a routerLink="/" class="button">Wróć do produktów</a>
  </section>`,
})
export class NotFoundPage {}
