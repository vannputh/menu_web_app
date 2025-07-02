import { Component } from '@angular/core';
import { MenuCategoryComponent } from '../shared/components/menu-category/menu-category.component';

@Component({
    selector: 'app-drinks',
    standalone: true,
    imports: [MenuCategoryComponent],
    template: `<app-menu-category category="drinks"></app-menu-category>`
})
export class DrinksComponent {}
