// no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const noAuthGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/main/userprofile']); 
  }
};
