import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export interface Compra {
  fecha: string;
  productos: Producto[];
  total: number;
  usuario: string; // email
}

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  constructor() {}

  guardarCompra(compra: Compra): void {
    const compras = this.obtenerComprasDelUsuario(compra.usuario);
    compras.push(compra);
    localStorage.setItem(`compras_${compra.usuario}`, JSON.stringify(compras));
  }

  obtenerComprasDelUsuario(correo: string): Compra[] {
    const comprasGuardadas = localStorage.getItem(`compras_${correo}`);
    return comprasGuardadas ? JSON.parse(comprasGuardadas) : [];
  }


}
