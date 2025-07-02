import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="base-card" [class]="cardClass">
      <div class="card-header" *ngIf="showHeader">
        <ng-content select="[slot=header]"></ng-content>
      </div>
      
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./base-card.component.scss']
})
export class BaseCardComponent {
  @Input() cardClass: string = '';
  @Input() showHeader: boolean = false;
  @Input() showFooter: boolean = false;
} 