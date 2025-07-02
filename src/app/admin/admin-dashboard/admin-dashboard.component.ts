import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { MenuManagementService, Drink, MainDish, SideDish } from '../../shared/services/menu-management.service';
import { Order } from '../../shared/interfaces/order.interface';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    // Orders properties
    orders: Order[] = [];
    loading = true;
    error = '';
    
    // Tab navigation
    activeTab: 'orders' | 'menu' = 'orders';
    
    // Menu management properties
    menuCategory: 'drinks' | 'main-dishes' | 'side-dishes' = 'drinks';
    drinks: Drink[] = [];
    mainDishes: MainDish[] = [];
    sideDishes: SideDish[] = [];
    
    // Form properties
    showForm = false;
    isEditing = false;
    editingId = '';
    formData: any = {};
    
    private destroy$ = new Subject<void>();

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
        private menuService: MenuManagementService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadOrders();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadOrders(): void {
        this.loading = true;
        this.error = '';

        this.orderService.getOrders()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (orders) => {
                    this.orders = orders.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error fetching orders:', error);
                    this.error = error.message || 'Failed to load orders';
                    this.loading = false;
                }
            });
    }

    markAsCompleted(order: Order): void {
        if (!order.id) return;

        this.orderService.updateOrderStatus(order.id, 'completed')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedOrder) => {
                    const index = this.orders.findIndex(o => o.id === order.id);
                    if (index !== -1) {
                        this.orders[index] = updatedOrder;
                    }
                },
                error: (error) => {
                    console.error('Error updating order status:', error);
                    this.error = 'Failed to update order status';
                }
            });
    }

    getStatusClass(status: string): string {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
        return status === 'completed'
            ? `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
            : `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    }

    getPendingOrdersCount(): number {
        return this.orders.filter(order => order.status === 'pending').length;
    }

    getTotalRevenue(): number {
        return this.orders
            .filter(order => order.status === 'completed')
            .reduce((total, order) => total + order.total, 0);
    }

    logout(): void {
        this.authService.logout();
    }

    retryLoadOrders(): void {
        this.loadOrders();
    }

    hasItemOptions(item: any): boolean {
        return !!(item.spiceLevel || item.iceLevel || item.sugarLevel || 
                 (item.topping && item.topping !== 'None') || 
                 item.soupType || item.specialInstructions);
    }

    // Tab navigation methods
    setActiveTab(tab: 'orders' | 'menu'): void {
        this.activeTab = tab;
        if (tab === 'menu') {
            this.loadMenuItems();
        }
    }

    setMenuCategory(category: 'drinks' | 'main-dishes' | 'side-dishes'): void {
        this.menuCategory = category;
    }

    // Menu management methods
    loadMenuItems(): void {
        forkJoin({
            drinks: this.menuService.getDrinks(),
            mainDishes: this.menuService.getMainDishes(),
            sideDishes: this.menuService.getSideDishes()
        }).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (data) => {
                this.drinks = data.drinks;
                this.mainDishes = data.mainDishes;
                this.sideDishes = data.sideDishes;
            },
            error: (error) => {
                console.error('Error loading menu items:', error);
                this.error = 'Failed to load menu items';
            }
        });
    }

    // Form methods
    openAddForm(): void {
        this.isEditing = false;
        this.editingId = '';
        this.resetFormData();
        this.showForm = true;
    }

    editItem(category: string, item: any): void {
        this.isEditing = true;
        this.editingId = item._id;
        this.menuCategory = category as 'drinks' | 'main-dishes' | 'side-dishes';
        
        if (category === 'drinks') {
            this.formData = { ...item };
        } else {
            this.formData = { ...item };
        }
        
        this.showForm = true;
    }

    resetFormData(): void {
        if (this.menuCategory === 'drinks') {
            this.formData = {
                name: '',
                description: '',
                category: '',
                price: 0,
                imageUrl: ''
            };
        } else {
            this.formData = {
                title: '',
                price: 0,
                imageSrc: ''
            };
        }
    }

    closeForm(): void {
        this.showForm = false;
        this.resetFormData();
    }

    getFormTitle(): string {
        if (this.menuCategory === 'drinks') return 'Drink';
        if (this.menuCategory === 'main-dishes') return 'Main Dish';
        return 'Side Dish';
    }

    saveItem(): void {
        if (this.isEditing) {
            this.updateItem();
        } else {
            this.createItem();
        }
    }

    createItem(): void {
        if (this.menuCategory === 'drinks') {
            this.menuService.createDrink(this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (newItem: Drink) => {
                        this.addItemToList(newItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error creating item:', error);
                        this.error = 'Failed to create item';
                    }
                });
        } else if (this.menuCategory === 'main-dishes') {
            this.menuService.createMainDish(this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (newItem: MainDish) => {
                        this.addItemToList(newItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error creating item:', error);
                        this.error = 'Failed to create item';
                    }
                });
        } else {
            this.menuService.createSideDish(this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (newItem: SideDish) => {
                        this.addItemToList(newItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error creating item:', error);
                        this.error = 'Failed to create item';
                    }
                });
        }
    }

    updateItem(): void {
        if (this.menuCategory === 'drinks') {
            this.menuService.updateDrink(this.editingId, this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedItem: Drink) => {
                        this.updateItemInList(updatedItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error updating item:', error);
                        this.error = 'Failed to update item';
                    }
                });
        } else if (this.menuCategory === 'main-dishes') {
            this.menuService.updateMainDish(this.editingId, this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedItem: MainDish) => {
                        this.updateItemInList(updatedItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error updating item:', error);
                        this.error = 'Failed to update item';
                    }
                });
        } else {
            this.menuService.updateSideDish(this.editingId, this.formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedItem: SideDish) => {
                        this.updateItemInList(updatedItem);
                        this.closeForm();
                    },
                    error: (error: any) => {
                        console.error('Error updating item:', error);
                        this.error = 'Failed to update item';
                    }
                });
        }
    }

    deleteItem(category: string, id: string): void {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        if (category === 'drinks') {
            this.menuService.deleteDrink(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.removeItemFromList(category, id);
                    },
                    error: (error: any) => {
                        console.error('Error deleting item:', error);
                        this.error = 'Failed to delete item';
                    }
                });
        } else if (category === 'main-dishes') {
            this.menuService.deleteMainDish(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.removeItemFromList(category, id);
                    },
                    error: (error: any) => {
                        console.error('Error deleting item:', error);
                        this.error = 'Failed to delete item';
                    }
                });
        } else {
            this.menuService.deleteSideDish(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.removeItemFromList(category, id);
                    },
                    error: (error: any) => {
                        console.error('Error deleting item:', error);
                        this.error = 'Failed to delete item';
                    }
                });
        }
    }

    // Helper methods
    addItemToList(item: any): void {
        if (this.menuCategory === 'drinks') {
            this.drinks.push(item);
        } else if (this.menuCategory === 'main-dishes') {
            this.mainDishes.push(item);
        } else {
            this.sideDishes.push(item);
        }
    }

    updateItemInList(updatedItem: any): void {
        if (this.menuCategory === 'drinks') {
            const index = this.drinks.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) this.drinks[index] = updatedItem;
        } else if (this.menuCategory === 'main-dishes') {
            const index = this.mainDishes.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) this.mainDishes[index] = updatedItem;
        } else {
            const index = this.sideDishes.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) this.sideDishes[index] = updatedItem;
        }
    }

    removeItemFromList(category: string, id: string): void {
        if (category === 'drinks') {
            this.drinks = this.drinks.filter(item => item._id !== id);
        } else if (category === 'main-dishes') {
            this.mainDishes = this.mainDishes.filter(item => item._id !== id);
        } else {
            this.sideDishes = this.sideDishes.filter(item => item._id !== id);
        }
    }
}
