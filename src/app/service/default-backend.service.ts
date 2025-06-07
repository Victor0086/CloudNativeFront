import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultBackendService {

  private readonly apiUrl = 'https://gftgeiygv0.execute-api.us-east-1.amazonaws.com/DEV/';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private readonly http: HttpClient) {}

  public consumirBackend() {
    const body = {
      key: 'Hola mundo'
    };

    return this.http.post(this.apiUrl, body, this.httpOptions);
  }
}