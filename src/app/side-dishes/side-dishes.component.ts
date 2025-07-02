import { Component } from '@angular/core';
import { MenuCategoryComponent } from '../shared/components/menu-category/menu-category.component';

@Component({
  selector: 'app-side-dishes',
  standalone: true,
  imports: [MenuCategoryComponent],
  template: `<app-menu-category category="side-dishes"></app-menu-category>`
})
export class SideDishesComponent {}
