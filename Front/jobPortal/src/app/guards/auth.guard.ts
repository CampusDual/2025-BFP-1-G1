import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  const isLoggedIn = userService.isLoggedIn();
  const isExpired = userService.isTokenExpired();

  if (isLoggedIn && !isExpired) {
    return true;
  }

  userService.logout();
  return router.createUrlTree(['/main/login']);
};
