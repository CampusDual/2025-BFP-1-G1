import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const noAuthGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return true;
  } else {
    // Si userData$ es un BehaviorSubject:
    const userData = userService.getUserValue();
    const role = userData?.user.role_id;

    if (role === 3) {
      return router.createUrlTree(['/main/candidateprofile']);
    } else if (role === 2) {
      return router.createUrlTree(['/main/userprofile']);
    } else {
      return router.createUrlTree(['/main/catalogue']);
    }
  }
};