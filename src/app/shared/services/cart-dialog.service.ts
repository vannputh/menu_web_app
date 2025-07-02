import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartDialogComponent } from '../components/cart-dialog/cart-dialog.component';
import { MenuItem } from '../interfaces/menu-item.interface';
import { CartItem } from '../interfaces/cart-item.interface';
import { CartService } from '../../cart/cart.service';

export interface CartDialogData {
  menuItem: MenuItem;
}

@Injectable({
  providedIn: 'root'
})
export class CartDialogService {
  
  constructor(
    private dialog: MatDialog,
    private cartService: CartService
  ) {}

  openAddToCartDialog(menuItem: MenuItem): void {
    const dialogRef = this.dialog.open(CartDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { menuItem }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToCart(menuItem, result);
      }
    });
  }

  private addToCart(menuItem: MenuItem, dialogResult: any): void {
    const cartItem: CartItem = {
      imageUrl: menuItem.imageSrc,
      title: menuItem.title,
      price: menuItem.price,
      quantity: dialogResult.quantity,
      specialInstructions: dialogResult.specialInstructions,
      sugarLevel: menuItem.type === 'drink' ? dialogResult.sugarLevel : undefined,
      iceLevel: menuItem.type === 'drink' ? dialogResult.iceLevel : undefined,
      spiceLevel: menuItem.type === 'main' ? dialogResult.spiceLevel : undefined,
      soupType: menuItem.type === 'soup' ? dialogResult.soupType : undefined,
      iced: menuItem.type === 'bottled' ? dialogResult.iced : undefined,
      topping: menuItem.type === 'drink' ? dialogResult.topping : undefined
    };

    this.cartService.addToCart(cartItem);
  }
} 