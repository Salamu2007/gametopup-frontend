import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { of } from 'rxjs';

export interface GamesCharges {
  _id: string;
  name: string;
  currency: string;
  currencyType: string;
  category: string;
  platform: string;
  imageUrl: string;
  description?: string; // optional description, used on card previews
}
export interface GameDetailcharge {
  _id: string;
  name: string;
  category: string;
  platform: string;
  image: string; // مش imageUrl
  description: string;
  currency: string;
  currencyType: string;
  package: {
    amount: number;
    price: number;
  }[];

}

export interface GameCard {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  is_New?: boolean;
  platform?: string;
  category?: string;
  description?: string;
  reviews?: number;
}

export interface GameDetailbuy {
  
  _id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  platform?: string;
  category?: string;
  description?: string;
  reviews?: number;
}

export interface OrderPayment {
  orderId: string;
  name: string;
  image: string;
  quantity: number;
  paymentMethod: string;
  status: string;
  unitPrice: number;    // stored per-order price
  totalPrice: number;   // precomputed total
  price?: number;       // optional original product price
}

export interface chargePayment {
  chargeId: string;
  name: string;
  image: string;
  playerId: string;
  amount: number;
  quantity?: number;
  currencyType: string;
  paymentMethod: string;
  status: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class GameService {
  // If you want to force a specific API URL in any environment (e.g. local dev),
  // set `window.API_BASE_URL = 'https://gametopup-api.onrender.com/api'` in the browser console.
  private readonly remoteApiUrl = 'https://gametopup-api.onrender.com/api';
  private readonly localApiUrl = 'http://localhost:3000/api';

  private get apiUrl(): string {
    const override = (window as any).API_BASE_URL;
    if (override) return override;

    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';

    // Normally use remote API in production; use local API only when running locally.
    return isLocalHost ? this.localApiUrl : this.remoteApiUrl;
  }

  constructor(private http: HttpClient) {}

  loadgamecharges(): Observable<GamesCharges[]> {
    return this.http.get<GamesCharges[]>(
      `${this.apiUrl}/products/charges`
    ).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error fetching charge games:', error);
        return of([]); // ✅ نرجع array فارغ
      })
    );
  }

  


  loadGamebuy(id: string): Observable<GameDetailbuy> {
    return this.http.get<GameDetailbuy>(`${this.apiUrl}/products/${id}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error fetching game:', error);
        throw error;
      })
    );
  }

  loadGamecharge(id: string): Observable<GameDetailcharge> {
    return this.http.get<GameDetailcharge>(`${this.apiUrl}/products/${id}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error fetching game:', error);
        throw error;
      })
    );
  }

  createCharge(gameId: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/charges/newcharge/${gameId}`, payload);
  }

  /** Create order for a buy-type product */
  createOrder(productId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders/neworder/${productId}`, payload);
  }

  loadGamesCards(): Observable<GameCard[]> {
    return this.http.get<GameCard[]>(`${this.apiUrl}/products/orders`).pipe(
      map((res) => {
        return res;
      }),
      
      catchError((error) => {
        console.error('Error fetching game cards:', error);
        return of([]);
      })
    );
  }

  loadOrderPayment(orderId: string): Observable<OrderPayment> {
    return this.http.get<OrderPayment>(`${this.apiUrl}/orders/paymentorder/${orderId}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error fetching order payment:', error);
        throw error;
      })
    );
  }

  confirmOrder(id: string, data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/confirm/${id}`, data);
  }

  loadChargePayment(chargeId: string): Observable<chargePayment> {
    return this.http.get<chargePayment>(`${this.apiUrl}/charges/paymentcharge/${chargeId}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.error('Error fetching charge payment:', error);
        throw error;
      })
    );
  }

  confirmCharge(id: string, data: FormData) {
    return this.http.post(`${this.apiUrl}/charges/confirm/${id}`, data);
  }

  makeAdminLogin(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { username, password });
  }




  
}
