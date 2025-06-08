import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AuthComponent {
  email: string = '';
  password: string = '';

  constructor(private readonly authService: MsalService, private readonly router: Router) {}

  identificarse(): void {
    this.authService.loginPopup().subscribe({
      next: (result) => {
        this.authService.instance.setActiveAccount(result.account);
        this.router.navigate(['/']);
      },
      error: (error) => console.error('Error al iniciar sesión', error)
    });
  }

  registrarse(): void {
  this.authService.loginRedirect({
    authority: 'https://grupo10duoc.b2clogin.com/grupo10duoc.onmicrosoft.com/B2C_1_grupo10Duoc',
    scopes: ['openid', 'profile', 'offline_access']
    });
  }
}
