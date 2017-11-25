import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {UserService} from "../user/user.service"
import { AppState } from '../app.state'
import { of } from 'rxjs/observable/of';
import { normalizeUser } from '../normalizers'
@Injectable()
export class UserEffects{

    constructor(public actions: Actions, public userService: UserService){}

    @Effect() fetchCurrentUser: Observable<Action> = this.actions.ofType("REQUEST_CURRENT_USER")
    .flatMap((action)=>this.userService.getCurrentUser()
        .map(data => ({ type: "RESPONSE_CURRENT_USER_SUCC", data: normalizeUser(data)}))
        .catch(error => of({type: "RESPONSE_CURRENT_USER_ERR", error: error}))
    )
}