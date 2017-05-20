import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'
import { Observable } from "rxjs/Observable";
import { TemplateInstanceIndexComponent } from './template-instance-index.component';
import { UserStore } from '../user/user.store'
import { MdDialog } from '@angular/material'
import { Router } from '@angular/router'
import {MaterialModule} from '@angular/material'
import {User} from '../user/user'
import { TemplateInstanceService } from './template-instance.service';

export function MockComponent(options: Component): Component {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class _ {});
}

describe('template index', () => {

  let comp:    TemplateInstanceIndexComponent;
  let fixture: ComponentFixture<TemplateInstanceIndexComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let user = new User();
  user.id = 21;
  let templateInstanceServiceStub = {
      getTemplateInstancesForUser(){
        return Observable.create(observer=>{
          observer.next([{id: 23}, {id: 28}])
        }) 
      }
  }
  let userStoreStub = {
        user : 
        Observable.create(observer=>{
          observer.next(user)
        }) 
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateInstanceIndexComponent, MockComponent({ selector: 'template-instance-list' ,  inputs: ['templateInstances']})],
      providers: [ {provide: TemplateInstanceService, useValue: templateInstanceServiceStub}, {provide: UserStore, useValue: userStoreStub}] // declare the test component
      ,imports: [MaterialModule]
    });

    fixture = TestBed.createComponent(TemplateInstanceIndexComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

 
  it('should load templates',  async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(fixture.componentInstance.templateInstances.length).toBe(2);
    });    
  }))

});
