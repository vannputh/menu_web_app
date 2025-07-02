import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';
import { Order } from '../../shared/interfaces/order.interface';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    loading = true;
    error = '';
    private destroy$ = new Subject<void>();

    constructor(
        private orderService: OrderService,
        private authService: AuthService,
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
}
