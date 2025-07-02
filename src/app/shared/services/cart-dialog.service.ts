import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  private _dialogVisible = new BehaviorSubject<boolean>(false);
  private _dialogData = new BehaviorSubject<CartDialogData | null>(null);
  
  public dialogVisible$ = this._dialogVisible.asObservable();
  public dialogData$ = this._dialogData.asObservable();
  
  constructor(private cartService: CartService) {}

  openAddToCartDialog(menuItem: MenuItem): void {
    this._dialogData.next({ menuItem });
    this._dialogVisible.next(true);
  }

  closeDialog(): void {
    this._dialogVisible.next(false);
    // Clear data after a short delay to allow dialog animation
    setTimeout(() => {
      this._dialogData.next(null);
    }, 300);
  }

  confirmAddToCart(dialogResult: any): void {
    const currentData = this._dialogData.value;
    if (currentData) {
      this.addToCart(currentData.menuItem, dialogResult);
      this.closeDialog();
    }
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