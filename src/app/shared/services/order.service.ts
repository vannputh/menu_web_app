import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order, OrderSummary } from '../interfaces/order.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOrderSummaries(): Observable<OrderSummary[]> {
    return this.getOrders().pipe(
      map(orders => orders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
        createdAt: order.createdAt
      })))
    );
  }

  updateOrderStatus(orderId: string, status: 'pending' | 'completed'): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Observable<Order> {
    const newOrder = {
      ...order,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    return this.http.post<Order>(this.apiUrl, newOrder).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Service temporarily unavailable';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to service';
    }
    
    console.error('Order service error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 