import { Action, createSelector } from '@ngrx/store'
import { AppState } from '../app.state'

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
			if(action.data.entities.users){ 
				return Object.assign({},state,{users: Object.assign({},state.users,...action.data.entities.users)})
			}else{
				return state
			}
		default: return state;
	} 
}

export const selectLoggedInUser = (state: AppState)=>state.user.user
export const selectUsers = (state: AppState)=>state.users.users

export const selectCurrentUser = createSelector(selectLoggedInUser, selectUsers, (user,users)=>{
	return users && users[user] 
})