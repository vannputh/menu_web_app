import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { Router, NavigationEnd } from '@angular/router';
import { NgIf, AsyncPipe } from "@angular/common";
import { CartDialogComponent } from './shared/components/cart-dialog/cart-dialog.component';
import { CartDialogService, CartDialogData } from './shared/services/cart-dialog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgIf, AsyncPipe, CartDialogComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'menu';
  showSidebar = true;
  isDarkMode = false;

  dialogVisible$: Observable<boolean>;
  dialogData$: Observable<CartDialogData | null>;

  constructor(
    private router: Router, 
    private renderer: Renderer2,
    private cartDialogService: CartDialogService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = event.url !== '/cart';
      }
    });

    this.dialogVisible$ = this.cartDialogService.dialogVisible$;
    this.dialogData$ = this.cartDialogService.dialogData$;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }

  onDialogClose() {
    this.cartDialogService.closeDialog();
  }

  onDialogConfirm(result: any) {
    this.cartDialogService.confirmAddToCart(result);
  }
}
