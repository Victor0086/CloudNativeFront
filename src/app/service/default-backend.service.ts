import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultBackendService {

  private readonly baseUrl = 'https://gftgeiygv0.execute-api.us-east-1.amazonaws.com/DEV';

  constructor(private readonly http: HttpClient) {}

  // Método para llamar a /inventario (ya lo tenías)
  public consumirBackend() {
    const body = {
      key: 'Hola mundo'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/inventario`, body, { headers });
  }

  //NUEVO método para obtener las compras del usuario
  public getVentasPorCliente(email: string, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/ventas/cliente/${email}`, { headers });
  }
}
