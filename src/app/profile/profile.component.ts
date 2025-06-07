import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultBackendService } from '../service/default-backend.service';
import { CarritoService, Compra } from '../service/carrito.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit {
  profile: { name?: string; preferred_username?: string } = {};
  compras: Compra[] = [];
  expanded: boolean[] = [];
  responseBackend!: object;

  constructor(
    private backendService: DefaultBackendService,
    private carritoService: CarritoService,
    private authService: MsalService
  ) {}

  ngOnInit() {
    this.getProfile();
    this.cargarHistorialCompras();
  }

  getProfile() {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded: any = this.decodeTokenBase64Url(token);
        this.profile = {
          name: decoded.name,
          preferred_username: decoded.preferred_username,
        };
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  decodeTokenBase64Url(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  cargarHistorialCompras(): void {
    this.compras = this.carritoService.obtenerHistorial();
    this.expanded = this.compras.map(() => false);
  }

  toggleDetalle(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  llamarBackend(): void {
    this.backendService.consumirBackend().subscribe((response) => {
      this.responseBackend = response;
    });
  }

  mostrarResponseBackend(): string {
    return JSON.stringify(this.responseBackend);
  }
}
