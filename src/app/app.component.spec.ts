/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module'
import {APP_BASE_HREF} from '@angular/common';
import {AppConfig} from './app.config'
import { APP_INITIALIZER } from '@angular/core';
import { Observable } from "rxjs/Observable";
import {FontStore} from './font/font.store'


describe('AppComponent', () => {
  beforeEach(() => {
    let appConfigStub = {
      getConfig(key: any){
        return 'http://localhost:8080'
      },
      load(){
        return new Promise(resolve=> {return})
      }
    }

    let fonteStoreStub = {
      getFonts(){
        return Observable.create(observer=>{
          observer.next([{name: 'font1'},{name: 'font2'}])
        }) 
      }
    }

    let userServiceStup = {
      logoutUser(){}
    }


    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{provide: APP_BASE_HREF, useValue: '/'},{provide: AppConfig, useValue: appConfigStub}, {provide: FontStore, useValue: fonteStoreStub}]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
