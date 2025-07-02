import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartItem } from '../../interfaces/cart-item.interface';

export interface ReceiptDialogData {
  items: CartItem[];
  total: number;
}

@Component({
  selector: 'app-receipt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.scss']
})
export class ReceiptDialogComponent {
  customerName = '';
  paymentMethod: 'cash' | 'khqr' = 'cash';
  errorMessage = '';

  private soupTypeNames: {[key: string]: string} = {
    'sichuan_spicy': 'Sichuan Spicy',
    'chongqing_spicy': 'Chongqing Spicy',
    'milky_broth': 'Milky Broth',
    'tomato': 'Tomato',
    'wild_mushroom': 'Wild Mushroom'
  };

  constructor(
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReceiptDialogData
  ) {}

  getSoupTypeName(soupType: string | undefined): string {
    return soupType ? this.soupTypeNames[soupType] || soupType : '';
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCheckout(): void {
    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter your name';
      return;
    }

    this.dialogRef.close({
      customerName: this.customerName,
      paymentMethod: this.paymentMethod
    });
  }

  setPaymentMethod(method: 'cash' | 'khqr'): void {
    this.paymentMethod = method;
    this.errorMessage = '';
  }

  hasOptions(item: CartItem): boolean {
    return !!(item.sugarLevel || item.iceLevel || item.spiceLevel || 
             item.soupType || item.iced || 
             (item.topping && item.topping !== 'None') ||
             item.specialInstructions);
  }
} 