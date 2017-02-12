import { Component, OnInit} from '@angular/core';
import {UserListComponent} from './user-list.component';
import { UserService } from './user.service';
import { User} from './user';
import { Observable }     from 'rxjs/Observable';

@Component({
    selector: 'template-index',
    template: `
        <user-list [users] = "users" ></user-list>\n\
    `,
    providers: []
})

export class UserIndexComponent {
    
    errorMessage: string;
    users : User[];

    constructor(
        private userService: UserService 
    ){ 
        this.userService.getUsers().subscribe(users => this.users = users)
    }
}