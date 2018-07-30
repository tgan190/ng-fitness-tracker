import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
 // Router,
  CanLoad,
  Route
} from '@angular/router';

import { AuthService } from './auth.service';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  // isAuthenticated$: Observable<boolean>
  
 // constructor(private router: Router,
  constructor(private store: Store<fromRoot.State>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authService.isAuth()) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    // if (this.isAuthenticated$) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
  }

  canLoad(route: Route) {
    // let isAuth: boolean
    // console.log('route: ', route);
    // return this.store.select(fromRoot.getIsAuth).pipe(take(1));

    const observable_auth: Observable<boolean> = this.store.select(fromRoot.getIsAuth);
    // observable_auth.subscribe(auth1 => {
    //   console.log('auth1 in AUTHGUARD: ',auth1);
    // })
    return observable_auth.pipe(take(1));

    // return this.store.select(fromRoot.getIsAuth).pipe(take(1));
   
    // .subscribe(isAuth => {
    //   console.log('In Auth Guard, canLoad, isAuth is ', isAuth);
    //   this.isAuth = isAuth;
    // })
    
       // return true;
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
  }
}
