import { Component, input, output } from '@angular/core';
@Component({
  selector: 'app-feedback',
  template: ` <section
    class="feedback"
    [attr.role]="error() ? 'alert' : 'status'"
    aria-live="polite"
  >
    <span class="feedback-icon" aria-hidden="true">{{ error() ? '↻' : '❧' }}</span>
    <h2>{{ title() }}</h2>
    <p>{{ message() }}</p>
    @if (error()) {
      <button class="button" type="button" (click)="retry.emit()">Spróbuj ponownie</button>
    }
  </section>`,
  styles: `
    .feedback {
      text-align: center;
      padding: 4rem 1rem;
      border: 1px dashed var(--line);
      border-radius: 1rem;
      background: var(--paper);
    }
    .feedback-icon {
      font-size: 2rem;
      color: var(--forest);
    }
    h2 {
      font-size: 1.4rem;
      margin: 1rem 0 0.5rem;
    }
    p {
      color: var(--muted);
      margin-bottom: 1.5rem;
    }
  `,
})
export class Feedback {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly error = input(false);
  readonly retry = output<void>();
}
