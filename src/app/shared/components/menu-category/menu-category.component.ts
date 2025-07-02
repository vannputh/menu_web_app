import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../../../menu-item/menu-item.component';
import { MenuService } from '../../services/menu.service';
import { MenuItem, MenuCategory } from '../../interfaces/menu-item.interface';

@Component({
  selector: 'app-menu-category',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent
  ],
  template: `
    <div class="p-6" *ngIf="!loading">
      <!-- Normal menu items -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto" *ngIf="!error">
        <app-menu-item
          *ngFor="let item of menuItems"
          [imageSrc]="item.imageSrc"
          [title]="item.title"
          [price]="item.price"
          [itemType]="item.type">
        </app-menu-item>
      </div>

      <!-- Empty placeholder menu items for any error -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto" *ngIf="error">
        <app-menu-item
          *ngFor="let placeholder of getPlaceholderItems()"
          [imageSrc]="placeholder.imageSrc"
          [title]="placeholder.title"
          [price]="placeholder.price"
          [itemType]="placeholder.type"
          [disabled]="true">
        </app-menu-item>
      </div>
    </div>
    
    <div class="flex flex-col items-center justify-center min-h-[300px] text-center p-6" *ngIf="loading">
      <div class="mb-4">
        <svg viewBox="0 0 24 24" class="w-8 h-8 text-red-600 animate-spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">Loading menu items...</p>
    </div>
  `
})
export class MenuCategoryComponent implements OnInit {
  @Input() category!: MenuCategory;
  
  menuItems: MenuItem[] = [];
  loading = false;
  error = false;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  private loadMenuItems() {
    this.loading = true;
    this.error = false;
    
    this.menuService.getMenuItems(this.category)
      .subscribe({
        next: (items) => {
          this.menuItems = items;
          this.loading = false;
        },
        error: (error) => {
          console.error(`Error fetching ${this.category}:`, error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  getPlaceholderItems(): MenuItem[] {
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDAgMTAwTDEyMCA4MEwxNjAgODBMMTQwIDEwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
    
    return [
      {
        id: 'placeholder-1',
        title: '',
        price: 0,
        imageSrc: placeholderImage,
        category: this.category,
        type: this.category === 'drinks' ? 'drink' : this.category === 'main-dishes' ? 'main' : 'side'
      },
      {
        id: 'placeholder-2', 
        title: '',
        price: 0,
        imageSrc: placeholderImage,
        category: this.category,
        type: this.category === 'drinks' ? 'drink' : this.category === 'main-dishes' ? 'main' : 'side'
      },
      {
        id: 'placeholder-3',
        title: '', 
        price: 0,
        imageSrc: placeholderImage,
        category: this.category,
        type: this.category === 'drinks' ? 'drink' : this.category === 'main-dishes' ? 'main' : 'side'
      }
    ];
  }

  retry() {
    this.loadMenuItems();
  }
} 