import { Component, OnInit, Input} from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user'

@Component({
    selector: 'admin-users',
    template: `
        <user-table [users] = "users" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></user-table>
    `,
    providers: []
})

export class AdminUsersComponent implements OnInit {
    
    errorMessage: string;
    users : User[];
    loading = true;

    constructor(
        private userService: UserService
    ){}

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
