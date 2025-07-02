import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MenuItem, MenuCategory, MenuItemType } from '../interfaces/menu-item.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMenuItems(category: MenuCategory): Observable<MenuItem[]> {
    const url = `${this.baseApiUrl}/${category}`;
    return this.http.get<any[]>(url).pipe(
      map(items => this.normalizeMenuItems(items, category)),
      catchError(this.handleError)
    );
  }

  private normalizeMenuItems(items: any[], category: MenuCategory): MenuItem[] {
    return items.map(item => ({
      id: item._id || item.id?.toString() || this.generateId(),
      title: item.title,
      price: item.price,
      imageSrc: item.imageSrc,
      category: category,
      type: this.getItemType(item, category)
    }));
  }

  private getItemType(item: any, category: MenuCategory): MenuItemType {
    if (category === 'drinks') {
      return item.category === 'Bottled' ? 'bottled' : 'drink';
    }
    if (category === 'main-dishes') {
      return item.category === 'Soup' ? 'soup' : 'main';
    }
    return 'side';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unable to load menu items at this time.';
    
    if (error.status === 0) {
      console.error('Network error:', error.error);
      errorMessage = 'Unable to connect to service.';
    } else {
      console.error(`Server error ${error.status}:`, error.error);
      errorMessage = `Service temporarily unavailable.`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 