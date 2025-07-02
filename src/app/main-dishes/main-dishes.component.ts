import { Component } from '@angular/core';
import { MenuCategoryComponent } from '../shared/components/menu-category/menu-category.component';

@Component({
  selector: 'app-main-dishes',
  standalone: true,
  imports: [MenuCategoryComponent],
  template: `<app-menu-category category="main-dishes"></app-menu-category>`
})
export class MainDishesComponent {}
