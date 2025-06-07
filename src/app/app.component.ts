import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  MsalGuardConfiguration
} from '@azure/msal-angular';

import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  EventMessage,
  EventType
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
    MatBadgeModule
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Tienda Angular 18';
  isIframe = false;
  loginDisplay = false;


  carritoCantidad$: typeof this.carritoService.cantidad$;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private carritoService: CarritoService
  ) {
    this.carritoCantidad$ = this.carritoService.cantidad$;
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.isIframe = window !== window.parent && !window.opener;

    this.setLoginDisplay();
    this.authService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
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
    const accounts = this.authService.instance.getAllAccounts();
    this.loginDisplay = accounts && accounts.length > 0;
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
        }
      });
    });
  }

  logout(popup?: boolean) {
    this.authService.logoutPopup({ mainWindowRedirectUri: '/' }).subscribe({
      next: () => {
        this.authService.instance.setActiveAccount(null);
        this.setLoginDisplay();
        localStorage.removeItem('jwt');
      },
      error: (err) => console.error('Error en logout', err)
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
