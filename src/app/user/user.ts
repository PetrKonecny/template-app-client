import { Action } from '@ngrx/store'


export class User {
    id: number
    token: string
    name: string
    templates
    template_instances
    albums
    admin: boolean
}

export class UserAction implements Action{
	constructor(public type: string , public user: User, public isFetching: Action, public error: any){}
}

export function userReducer(state = {user: 0, isFetching: null, error: null}, action: any) {
	switch (action.type) {
		case "REQUEST_CURRENT_USER": 
			return Object.assign({},state,{isFetching: action})
		case "RESPONSE_CURRENT_USER_SUCC":
			return Object.assign({},state,{isFetching: null, user: action.data.result})
		case "RESPONSE_CURRENT_USER_ERR":
			return Object.assign({},state,{isFetching: null, error: action.error })
		default: return state;
	}
}


export function usersReducer(state = {users: null}, action: any){
	switch (action.type) {
		case "RESPONSE_CURRENT_USER_SUCC":
		case "ADD_NORMALIZED_DATA":
			return state && 
				action.data.entities.users && 
				Object.assign({},state,{users: Object.assign({},state.users,...action.data.entities.users)})
		default: return state;
	} 
}