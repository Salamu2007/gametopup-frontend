import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { of } from 'rxjs';

export interface AdminOrder {
  _id?: string;
  gameName: string;
  gameImage?: string;
  image?: string; // legacy fallback
  currency?: string;
  paymentImage?: string;
  email: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface AdminCharge {
  _id?: string;
  gameName: string;
  gameImage?: string;
  image?: string; // legacy fallback
  currency?: string;
  paymentImage?: string;
  email: string;
  quantity: number;
  playerId: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})

export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token'); // تأكد من استخدام المفتاح الصحيح
  }
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/dashboard`, { headers });
  }

  getOrders(): Observable<AdminOrder[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]); // ترجع مصفوفة فارغة في حالة الخطأ
      })
    );
  }

  getCharges(): Observable<AdminCharge[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AdminCharge[]>(`${this.apiUrl}/charges`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching charges:', error);
        return of([]); // ترجع مصفوفة فارغة في حالة الخطأ
      })
    );
  }

  // Games Management
  getGames(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>('http://localhost:3000/api/products', { headers }).pipe(
      catchError(error => {
        console.error('Error fetching games:', error);
        return of([]);
      })
    );
  }

  createGame(gameData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post('http://localhost:3000/api/products/create', gameData, { headers });
  }

  updateGame(id: string, gameData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:3000/api/products/${id}`, gameData, { headers });
  }

  deleteGame(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`http://localhost:3000/api/products/${id}`, { headers });
  }

  uploadGameImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post('http://localhost:3000/api/products/upload-image', formData);
  }

  confirmOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const token = this.getToken();
    console.log('Confirming order:', orderId);
    console.log('Token exists:', !!token);
    console.log('Headers:', headers);
    
    return this.http.put(`http://localhost:3000/api/admin/confirm/${orderId}`, {}, { headers });
  }

  rejectOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:3000/api/admin/reject/${orderId}`, {}, { headers });
  }

  confirmCharge(chargeId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:3000/api/admin/confirm-charge/${chargeId}`, {}, { headers });
  }

  rejectCharge(chargeId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:3000/api/admin/reject-charge/${chargeId}`, {}, { headers });
  }
}
