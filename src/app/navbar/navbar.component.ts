import {Component, OnInit, Renderer2, Output, EventEmitter} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { CartService } from '../cart/cart.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ToolbarModule,
    ButtonModule,
    BadgeModule,
    MenubarModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    cartCount: number = 0;
    isDarkMode: boolean = false;
    
    @Output() darkModeToggle = new EventEmitter<boolean>();

    constructor(private cartService: CartService, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
        });
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.darkModeToggle.emit(this.isDarkMode);
        if (this.isDarkMode) {
            this.renderer.addClass(document.documentElement, 'dark');
        } else {
            this.renderer.removeClass(document.documentElement, 'dark');
        }
    }
}
