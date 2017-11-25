import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {TemplateService} from "../template/template.service"
import {UserService} from "../user/user.service"
import { AppState } from '../app.state'
import { of } from 'rxjs/observable/of';
import { normalizeTemplates, normalizeTemplate } from '../normalizers'

@Injectable()
export class TemplateEffects{

    constructor(public actions: Actions,public templateService: TemplateService, public userService: UserService, public store: Store<AppState>){}

    @Effect() fetchTemplates: Observable<Action> = this.actions.ofType("REQUEST_TEMPLATES")
    .withLatestFrom(this.store)
    .flatMap(([action,storeState])=>Observable.forkJoin(this.userService.getUserTemplates(storeState.user.user),this.templateService.getPublicTemplates())
        .map(data => 
        	{
        		var userTemplates = data[0]
        		var publicTemplates = data[1]
                publicTemplates = publicTemplates.filter((template)=> {return !userTemplates.some(template2 => template.id === template2.id)})
        		return { type: "ADD_NORMALIZED_DATA", data: normalizeTemplates({templates: userTemplates.concat(publicTemplates)})}
        	}
        	)
        .catch(error => of({type: "TEMPLATES_ERR", error: error}))
    )

    @Effect() fetchTemplate: Observable<Action> = this.actions.ofType("REQUEST_TEMPLATE")
    .flatMap((action: any)=>this.templateService.getTemplate(action.id)
        .map(data => ({ type: "ADD_NORMALIZED_DATA", data: normalizeTemplate(data)}))
        .catch(error => of({type: "TEMPLATE_ERR", error: error}))
    )
}