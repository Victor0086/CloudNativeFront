import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';

describe('authInterceptorInterceptor', () => {
  let interceptorInstance: AuthInterceptorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptorInterceptor]
    });
    interceptorInstance = TestBed.inject(AuthInterceptorInterceptor);
  });

  it('should be created', () => {
    expect(interceptorInstance).toBeTruthy();
  });
});
