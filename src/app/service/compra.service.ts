import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Compra {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  productos: {
    id: number;
    nombreProducto: string;
    precioUnitario: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private readonly apiUrl = 'https://gftgeiygv0.execute-api.us-east-1.amazonaws.com/DEV/ventas';

  constructor(private readonly http: HttpClient) {}

  getComprasPorUsuario(email: string): Observable<Compra[]> {
    const token = localStorage.getItem('jwt') ?? '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Compra[]>(`${this.apiUrl}/cliente/${email}`, { headers });
  }
}
