import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserStore } from './user.store';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private userStore: UserStore) {}

  canActivate() {
   	return this.userStore.isLoggedIn()
  }

}