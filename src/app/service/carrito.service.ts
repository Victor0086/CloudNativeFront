import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// ✅ Interfaz extendida para evitar errores en home y productos
export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  imagen: string;
  estrellas?: number;
  resenas?: number;
  descuento?: number;
  nuevo?: boolean;
  descripcion?: string;
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
  private readonly carrito: Producto[] = [];
  private readonly historial: Compra[] = [];

  private readonly cantidadSubject = new BehaviorSubject<number>(0);
  cantidad$ = this.cantidadSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

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
    this.carrito.length = 0;
    console.log('Carrito limpiado.');
    this.cantidadSubject.next(0);
  }

  confirmarCompra(usuario: string): void {
    const jwt = localStorage.getItem('jwt') ?? '';

    const nuevaCompra: Compra = {
      productos: [...this.carrito],
      total: this.calcularTotal(),
      fecha: new Date(),
      usuario
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    });

    const payload = {
      cliente: nuevaCompra.usuario,
      fecha: nuevaCompra.fecha.toISOString(),
      total: nuevaCompra.total,
      productos: nuevaCompra.productos.map(p => ({
        nombreProducto: p.nombre,
        precioUnitario: p.precio
      }))
    };

    this.http.post(
      'https://gftgeiygv0.execute-api.us-east-1.amazonaws.com/DEV/ventas',
      payload,
      { headers }
    ).subscribe({
      next: (res) => console.log('Venta guardada en backend:', res),
      error: (err) => console.error('Error al guardar venta en backend:', err)
    });

    this.limpiarCarrito();
  }

  cancelarCompra(): void {
    console.log('Compra cancelada.');
    this.limpiarCarrito();
  }
}
