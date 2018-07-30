import { Action } from "@ngrx/store";
import {AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED} from './auth.actions';

export interface State {
    isAuthenticated: boolean;
}

const initialState: State = {
    isAuthenticated: false
}

// export function authReducer(state=initialState, action: Action) {
export function authReducer(state=initialState, action: AuthActions) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            console.log('Auth reducer: set to true');
            return {isAuthenticated: true};
        case SET_UNAUTHENTICATED:
            console.log('Auth reducer: set to false');
            return {isAuthenticated: false};
        default:
            return state;
    }
   
}

export const getIsAuth = (state: State) => state.isAuthenticated;