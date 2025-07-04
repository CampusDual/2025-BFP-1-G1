import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const noAuthGuard: CanActivateFn = () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return true;
  } else {
    let userData = userService.getUserValue();
    let role = userData?.user.role_id;
    if (!userData) {
      const storedRole = localStorage.getItem('role');
      if (storedRole === '3') {
        return router.createUrlTree(['/main/candidateprofile']);
      } else if (storedRole === '2') {
        return router.createUrlTree(['/main/userprofile']);
      } else {
        return router.createUrlTree(['/main/catalogue']);
      }
    }

    if (role === 3) {
      return router.createUrlTree(['/main/candidateprofile']);
    } else if (role === 2) {
      return router.createUrlTree(['/main/userprofile']);
    } else {
      return router.createUrlTree(['/main/catalogue']);
    }
  }
};