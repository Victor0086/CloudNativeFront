import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Compra, CompraService } from '../service/compra.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit {
  profile: { name?: string; preferred_username?: string } = {};
  compras: Compra[] = [];
  responseBackend!: object;

  constructor(
    private readonly authService: MsalService,
    private readonly compraService: CompraService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getProfile();
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
        this.cargarHistorialCompras();
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
      console.error('Error decoding token:', error);
      return null;
    }
  }

  cargarHistorialCompras(): void {
    this.isCargando = true;

    const email = this.profile.preferred_username;
    const token = localStorage.getItem('jwt');

    if (email && token) {
      this.compraService.getComprasPorUsuario(email).subscribe({
        next: (ventas: Compra[]) => {
        this.compras = ventas;
        this.isCargando = false;
        this.cd.detectChanges();
        console.log('Compras cargadas:', this.compras);
        },
        error: (err) => {
          this.isCargando = false;
          console.error('Error al obtener compras:', err);
        },
      });
    }
  }

  isCargando = true;

}
