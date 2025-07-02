import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CartDialogData } from '../../services/cart-dialog.service';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent {
  quantity = 1;
  specialInstructions = '';
  sugarLevel = '100%';
  iceLevel = '100%';
  spiceLevel = '100%';
  soupType = 'sichuan_spicy';
  iced = 'yes';
  topping = 'None';

  constructor(
    public dialogRef: MatDialogRef<CartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({
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
    return this.data.menuItem.type === 'drink';
  }

  isBottled(): boolean {
    return this.data.menuItem.type === 'bottled';
  }

  isMain(): boolean {
    return this.data.menuItem.type === 'main';
  }

  isSoup(): boolean {
    return this.data.menuItem.type === 'soup';
  }
} 