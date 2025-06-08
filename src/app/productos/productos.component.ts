import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, Producto } from '../service/carrito.service';
import { MsalService } from '@azure/msal-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  carrito: Producto[] = [];
  boletaVisible = false;

  boleta = {
    numero: 0,
    usuario: '',
    fecha: new Date(),
    productos: [] as Producto[],
    total: 0
  };

  constructor(
    private readonly carritoService: CarritoService,
    private readonly authService: MsalService
  ) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.carrito = [];
    alert('Carrito limpiado.');
  }

  confirmarCompra(): void {
    const cuenta = this.authService.instance.getActiveAccount();
    if (!cuenta) {
      alert('Debes iniciar sesión para confirmar la compra.');
      return;
    }

    const total = this.carritoService.calcularTotal();
    this.boleta = {
      numero: Math.floor(100000 + Math.random() * 900000),
      usuario: cuenta.username,
      fecha: new Date(),
      productos: [...this.carrito],
      total
    };

    this.carritoService.confirmarCompra(cuenta.username);
    this.carrito = [];
    this.boletaVisible = true;
  }

  cancelarCompra(): void {
    this.carritoService.cancelarCompra();
    this.carrito = [];
    alert('Compra cancelada.');
  }

  cerrarBoleta(): void {
    this.boletaVisible = false;
  }
}
