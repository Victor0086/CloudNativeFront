import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

import { CarritoService } from './service/carrito.service';

import {
  MsalService,
  MsalModule,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';

import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  EventMessage,
  EventType,
} from '@azure/msal-browser';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MsalModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Tienda Angular 18';
  isIframe = false;
  loginDisplay = false;
  userEmail = '';

  carritoCantidad$: typeof this.carritoService.cantidad$;

  private readonly _destroying$ = new Subject<void>();

  private readonly msalGuardConfig = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);

  constructor(
    private readonly authService: MsalService,
    private readonly msalBroadcastService: MsalBroadcastService,
    private readonly carritoService: CarritoService,
    private readonly router: Router
  ) {
    this.carritoCantidad$ = this.carritoService.cantidad$;
  }

  ngOnInit(): void {
    this.authService.instance
      .initialize()
      .then(() => {
        console.log('MSAL inicializado correctamente');
        this.procesarEventos();
      })
      .catch((err) => console.error('Error inicializando MSAL', err));
  }

  private procesarEventos(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.authService.instance.setActiveAccount(result.account);
          this.setLoginDisplay();
        }
      },
      error: (error) => console.error('Error en redirección', error),
    });

    this.setLoginDisplay();
    this.authService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    const account = this.authService.instance.getActiveAccount();
    this.loginDisplay = !!account;
    this.userEmail = account?.username ?? '';
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]);
    }
  }

  loginPopup() {
    const login$ = this.msalGuardConfig.authRequest
      ? this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
      : this.authService.loginPopup();

    login$.subscribe((response: AuthenticationResult) => {
      this.authService.instance.setActiveAccount(response.account);
      this.setLoginDisplay();
      this.authService.acquireTokenSilent({ scopes: ['User.Read'] }).subscribe({
        next: (tokenResponse) => {
          localStorage.setItem('jwt', tokenResponse.idToken);
        },
        error: (error) => {
          console.error('Error obteniendo token:', error);
        },
      });
    });
  }

  logout() {
    this.authService.logoutPopup({ mainWindowRedirectUri: '/' }).subscribe({
      next: () => {
        this.authService.instance.setActiveAccount(null);
        this.setLoginDisplay();
        localStorage.removeItem('jwt');
      },
      error: (err) => console.error('Error en logout', err),
    });
  }

  identificarse(): void {
    this.router.navigate(['/auth']);
  }

  registrarse(): void {
    this.authService.loginRedirect({
      authority:
        'https://grupo10duoc.b2clogin.com/grupo10Duoc.onmicrosoft.com/B2C_1_grupo10Duoc',
      scopes: ['openid', 'profile', 'offline_access'],
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
