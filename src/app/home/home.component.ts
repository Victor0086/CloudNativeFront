import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CarritoService, Producto } from '../service/carrito.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  productos: Producto[] = [
    { id: 1, nombre: 'Laptop Gamer ASUS ROG', precio: 950000, imagen: 'https://via.placeholder.com/300x200?text=Laptop+Gamer' },
    { id: 2, nombre: 'Mouse Logitech', precio: 12000, imagen: 'https://via.placeholder.com/300x200?text=Mouse+Logitech' },
    { id: 3, nombre: 'Teclado RGB', precio: 28000, imagen: 'https://via.placeholder.com/300x200?text=Teclado+RGB' }
  ];
  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  agregarAlCarrito(producto: Producto): void {
  this.carritoService.agregarProducto(producto);
}
  realizarCompra(): void {
    console.log('Compra realizada:', this.carritoService.obtenerCarrito());
    alert('¡Gracias por tu compra!');
    this.carritoService.limpiarCarrito();
  }

  obtenerCarrito(): Producto[] {
    return this.carritoService.obtenerCarrito();
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    alert('Carrito limpiado.');
  }
  
}
