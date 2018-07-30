import {
  Component,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../auth/auth.service';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  isAuth$: Observable<boolean>;
  @Output() closeSidenav = new EventEmitter<void>();
  // isAuth = false;
  // authSubscription: Subscription;

  constructor(private authService: AuthService,
    private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    // this.authSubscription = this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }
}
