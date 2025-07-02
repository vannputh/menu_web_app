import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { MenuItem } from '../../interfaces/menu-item.interface';

export interface CartDialogData {
  menuItem: MenuItem;
}

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    InputTextarea
  ],
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent {
  @Input() visible: boolean = false;
  @Input() data: CartDialogData | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<any>();

  quantity = 1;
  specialInstructions = '';
  sugarLevel = '100%';
  iceLevel = '100%';
  spiceLevel = 'medium';
  soupType = 'sichuan_spicy';
  iced = 'yes';
  topping = 'None';

  // Dropdown options
  sugarOptions = [
    { label: '0%', value: '0%' },
    { label: '25%', value: '25%' },
    { label: '50%', value: '50%' },
    { label: '75%', value: '75%' },
    { label: '100%', value: '100%' }
  ];

  iceOptions = [
    { label: 'No Ice', value: 'No Ice' },
    { label: '25%', value: '25%' },
    { label: '50%', value: '50%' },
    { label: '75%', value: '75%' },
    { label: '100%', value: '100%' }
  ];

  toppingOptions = [
    { label: 'None', value: 'None' },
    { label: 'Pearls', value: 'Pearls' },
    { label: 'Jelly', value: 'Jelly' },
    { label: 'Pudding', value: 'Pudding' }
  ];

  spiceOptions = [
    { label: 'Mild', value: 'mild' },
    { label: 'Medium', value: 'medium' },
    { label: 'Spicy', value: 'spicy' },
    { label: 'Extra Spicy', value: 'extra-spicy' }
  ];

  soupOptions = [
    { label: 'Sichuan Spicy', value: 'sichuan_spicy' },
    { label: 'Clear Broth', value: 'clear_broth' },
    { label: 'Tomato', value: 'tomato' }
  ];

  icedOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  onCancel(): void {
    this.onClose.emit();
  }

  onConfirmClick(): void {
    this.onConfirm.emit({
      quantity: this.quantity,
      specialInstructions: this.specialInstructions,
      sugarLevel: this.sugarLevel,
      iceLevel: this.iceLevel,
      spiceLevel: this.spiceLevel,
      soupType: this.soupType,
      iced: this.iced,
      topping: this.topping
    });
  }

  isDrink(): boolean {
    return this.data?.menuItem?.type === 'drink';
  }

  isBottled(): boolean {
    return this.data?.menuItem?.type === 'bottled';
  }

  isMain(): boolean {
    return this.data?.menuItem?.type === 'main';
  }

  isSoup(): boolean {
    return this.data?.menuItem?.type === 'soup';
  }

  getTotalPrice(): number {
    return this.data?.menuItem?.price ? this.data.menuItem.price * this.quantity : 0;
  }
} 