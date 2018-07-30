import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    // private store: Store<{ui: fromApp.State}>
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuthenticated());
        // console.log('login is successful');
        this.router.navigate(['/training']);
      } else {
        // this.trainingService.cancelSubscriptions();

        // this.isAuthenticated = false;
        // this.authChange.next(false);
        // console.log('login is unsuccessful!!!');
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
       
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
       // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        //this.store.dispatch(new Auth.SetAuthenticated());
        // Only doing this in initAuthListener
        // So not doing any dispatch for login or register


        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.trainingService.cancelSubscriptions();
    this.afAuth.auth.signOut();
    console.log('logout completed');
  }

  // isAuth() {
  //   return this.isAuthenticated;
  // }
}
