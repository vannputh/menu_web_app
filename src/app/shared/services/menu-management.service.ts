import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Drink {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface MainDish {
  _id?: string;
  title: string;
  price: number;
  imageSrc: string;
}

export interface SideDish {
  _id?: string;
  title: string;
  price: number;
  imageSrc: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Drinks CRUD
  createDrink(drink: Omit<Drink, '_id'>): Observable<Drink> {
    return this.http.post<Drink>(`${this.apiUrl}/drinks`, drink);
  }

  updateDrink(id: string, drink: Partial<Drink>): Observable<Drink> {
    return this.http.put<Drink>(`${this.apiUrl}/drinks/${id}`, drink);
  }

  deleteDrink(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/drinks/${id}`);
  }

  getDrinks(): Observable<Drink[]> {
    return this.http.get<Drink[]>(`${this.apiUrl}/drinks`);
  }

  // Main Dishes CRUD
  createMainDish(dish: Omit<MainDish, '_id'>): Observable<MainDish> {
    return this.http.post<MainDish>(`${this.apiUrl}/main-dishes`, dish);
  }

  updateMainDish(id: string, dish: Partial<MainDish>): Observable<MainDish> {
    return this.http.put<MainDish>(`${this.apiUrl}/main-dishes/${id}`, dish);
  }

  deleteMainDish(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/main-dishes/${id}`);
  }

  getMainDishes(): Observable<MainDish[]> {
    return this.http.get<MainDish[]>(`${this.apiUrl}/main-dishes`);
  }

  // Side Dishes CRUD
  createSideDish(dish: Omit<SideDish, '_id'>): Observable<SideDish> {
    return this.http.post<SideDish>(`${this.apiUrl}/side-dishes`, dish);
  }

  updateSideDish(id: string, dish: Partial<SideDish>): Observable<SideDish> {
    return this.http.put<SideDish>(`${this.apiUrl}/side-dishes/${id}`, dish);
  }

  deleteSideDish(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/side-dishes/${id}`);
  }

  getSideDishes(): Observable<SideDish[]> {
    return this.http.get<SideDish[]>(`${this.apiUrl}/side-dishes`);
  }
} 