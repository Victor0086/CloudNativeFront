import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export interface Compra {
  productos: Producto[];
  total: number;
  fecha: Date;
  usuario: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carrito: Producto[] = [];
  private historial: Compra[] = [];

  private cantidadSubject = new BehaviorSubject<number>(0);
  cantidad$ = this.cantidadSubject.asObservable();

  agregarProducto(producto: Producto): void {
    this.carrito.push(producto);
    console.log('Producto agregado:', producto.nombre);
    console.log('Cantidad actual en el carrito:', this.carrito.length);
    this.cantidadSubject.next(this.carrito.length);
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio, 0);
  }

  limpiarCarrito(): void {
    this.carrito = [];
    console.log('Carrito limpiado.');
    this.cantidadSubject.next(0); // fuerza actualización
  }

  confirmarCompra(usuario: string): void {
    const nuevaCompra: Compra = {
      productos: [...this.carrito],
      total: this.calcularTotal(),
      fecha: new Date(),
      usuario: usuario
    };
    console.log('Compra confirmada:', nuevaCompra);

    this.historial.push(nuevaCompra);
    this.limpiarCarrito();
  }

  obtenerHistorial(): Compra[] {
    return this.historial;
  }

  cancelarCompra(): void {
    console.log('Compra cancelada.');
    this.limpiarCarrito();
  }
}
