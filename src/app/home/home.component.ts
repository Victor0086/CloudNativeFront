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
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  productos: Producto[] = [
  {
    id: 1,
    nombre: 'GIGABYTE M27Q ICE SA 27" 180HZ IPS 1MS QHD',
    marca: 'GIGABYTE',
    precio: 319000,
    imagen: 'assets/productos/gigabyte-m27q-ice.jpg',
    estrellas: 5,
    resenas: 12,
    descuento: 5,
    nuevo: true,
    descripcion: 'Monitor de 27” QHD 2560x1440 con tecnología IPS y frecuencia de 180Hz, ideal para gaming.'
  },
  {
    id: 2,
    nombre: 'GIGABYTE 27" 260HZ QHD GS27QXA SA',
    marca: 'GIGABYTE',
    precio: 329900,
    imagen: 'assets/productos/gigabyte-gs27qxa.jpg',
    estrellas: 4,
    resenas: 8,
    descuento: 5,
    nuevo: true,
    descripcion: 'Monitor para juegos de 27” QHD 2560x1440, 260Hz, Freesync Premium y 1ms de respuesta.'
  },
  {
    id: 3,
    nombre: 'Gabinete AIRFLOW 3X FAN AUTO RGB',
    marca: 'AIRFLOW',
    precio: 41900,
    imagen: 'assets/productos/gabinete-airflow.jpg',
    estrellas: 5,
    resenas: 23,
    descuento: 5,
    nuevo: true,
    descripcion: 'Gabinete M-ATX con paneles de vidrio y 3 ventiladores RGB incluidos. Excelente flujo de aire.'
  },
  {
    id: 4,
    nombre: 'ASUS PRIME RADEON RX 9060XT 8GB',
    marca: 'ASUS',
    precio: 479000,
    imagen: 'assets/productos/asus-rx9060xt.jpg',
    estrellas: 5,
    resenas: 17,
    descuento: 5,
    nuevo: true,
    descripcion: 'Tarjeta gráfica de alto rendimiento con 8GB GDDR6, ideal para gaming en 2K y 4K.'
  },
  {
  id: 5,
  nombre: 'AMD Athlon 3000G 3.5GHz Dual-Core',
  marca: 'AMD',
  precio: 59800,
  imagen: 'assets/productos/amd-athlon-3000g.jpg',
  estrellas: 0,
  resenas: 0,
  descuento: 5,
  nuevo: true,
  descripcion: 'Procesador básico con gráficos Radeon Vega 3 ideal para navegación y tareas livianas.'
},
{
  id: 6,
  nombre: 'Intel Celeron G4930 3.2GHz Coffee Lake',
  marca: 'INTEL',
  precio: 69000,
  imagen: 'assets/productos/intel-celeron-g4930.jpg',
  estrellas: 0,
  resenas: 0,
  descuento: 5,
  nuevo: true,
  descripcion: 'Procesador dual-core 3.2GHz con gráficos UHD 610 compatible con socket LGA 1151.'
},
{
  id: 7,
  nombre: 'AMD Ryzen 3 4100 Quad-Core 65W AM4',
  marca: 'AMD',
  precio: 82100,
  imagen: 'assets/productos/amd-ryzen-3-4100.jpg',
  estrellas: 0,
  resenas: 0,
  descuento: 5,
  nuevo: true,
  descripcion: 'Procesador AMD 7nm con 4 núcleos, 65W TDP, ideal para multitarea y gaming básico.'
},
{
  id: 8,
  nombre: 'Exelink Adaptador Tipo C a HDMI 4K + USB 3.0',
  marca: 'EXELINK',
  precio: 14900,
  imagen: 'assets/productos/exelink-adaptador.jpg',
  estrellas: 0,
  resenas: 0,
  descuento: 5,
  nuevo: true,
  descripcion: 'Conversor USB C a HDMI 4K y USB 3.0 para conexión de video y periféricos.'
}

];


  constructor(
    private readonly authService: MsalService,
    private readonly msalBroadcastService: MsalBroadcastService,
    private readonly carritoService: CarritoService
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

  setLoginDisplay(): void {
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
