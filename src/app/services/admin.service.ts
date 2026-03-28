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
  currencyType?: string;
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
  private readonly remoteApiUrl = 'https://gametopup-api.onrender.com/api';
  private readonly localApiUrl = 'http://localhost:3000/api';

  private get baseApiUrl(): string {
    const override = (window as any).API_BASE_URL;
    if (override) return override;

    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';

    return isLocalHost ? this.localApiUrl : this.remoteApiUrl;
  }

  private get apiUrl(): string {
    return `${this.baseApiUrl}/admin`;
  }

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token'); // تأكد من استخدام المفتاح الصحيح
  }
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
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
    return this.http.get<any[]>(`${this.baseApiUrl}/products`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching games:', error);
        return of([]);
      })
    );
  }

  createGame(gameData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseApiUrl}/products/create`, gameData, { headers });
  }

  updateGame(id: string, gameData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseApiUrl}/products/${id}`, gameData, { headers });
  }

  deleteGame(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseApiUrl}/products/${id}`, { headers });
  }

  uploadGameImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.baseApiUrl}/products/upload-image`, formData);
  }

  confirmOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const token = this.getToken();
    return this.http.put(`${this.apiUrl}/confirm/${orderId}`, {}, { headers });
  }

  rejectOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/reject/${orderId}`, {}, { headers });
  }

  confirmCharge(chargeId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/confirm-charge/${chargeId}`, {}, { headers });
  }

  rejectCharge(chargeId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/reject-charge/${chargeId}`, {}, { headers });
  }
}
