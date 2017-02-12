import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserStore } from './user.store';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private userStore: UserStore, private router: Router) {}

  canActivate() {
    // If user is not logged in we'll send them to the homepage 
    /*if (!this.userStore.loggedIn()) {
      //this.router.navigate(['/login']);
      return true;
    }*/
    return true;
  }

}