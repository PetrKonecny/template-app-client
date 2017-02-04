import { Component} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from './user.service'
import { UserStore } from './user.store'

 

@Component({
    selector: 'user-login',
    template: `
            <form [formGroup]="loginForm" (ngSubmit)="doLogin($event)">
                <md-input-container>
                    <input md-input formControlName="email" type="email" placeholder="Your email">
                </md-input-container>
                <md-input-container>
                    <input md-input formControlName="password" type="password" placeholder="Your password">
                </md-input-container>
                <button type="submit">Log in</button>
            </form>`
          
})

export class UserLoginComponent {
     

    public loginForm = this.fb.group({
        email: ["", Validators.required],
        password: ["", Validators.required]
    });
 
    constructor(public fb: FormBuilder, private userService: UserService, private userStore: UserStore) {}

    doLogin(event) {
        this.userStore.authUser(this.loginForm.value)
    }
    
}