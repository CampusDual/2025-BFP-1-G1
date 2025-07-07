import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);
  const router = inject(Router);

  const isLoggedIn = userService.isLoggedIn();
  const isExpired = userService.isTokenExpired();

  if (!isLoggedIn || isExpired) {
    userService.logout();
    return router.createUrlTree(['/main/login']);
  }

  const storedRole = localStorage.getItem('role');
  
  if (storedRole) {
    const role = Number(storedRole);
    
    if (state.url.includes('userprofile') && role !== 2) {
      return router.createUrlTree(['/main/candidateprofile']);
    }
    
    if (state.url.includes('candidateprofile') && role !== 3) {
      return router.createUrlTree(['/main/userprofile']);
    }
  }
  return true;
};
