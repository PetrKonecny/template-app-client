import { Component, OnInit, Input} from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user'

@Component({
    selector: 'admin-users',
    template: `
        <user-table [users] = "users" [loadingIndicator]="loading"></user-table>
    `,
    providers: []
})
//displays users in the admin section
export class AdminUsersComponent implements OnInit {
    
    //error thrown when loading users
    errorMessage: string;
    //array of users to display
    users : User[];
    //loading indicator
    loading = true;

    /**
    @param userService - service to load users from
    */
    constructor(
        private userService: UserService
    ){}

    //loads users
    ngOnInit(){
        this.userService.getUsers().subscribe(
        users=>{
            this.users = users
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
