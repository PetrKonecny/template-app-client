import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'
import { Observable } from "rxjs/Observable";
import { TemplateIndexComponent } from './template-index.component';
import { UserStore } from '../user/user.store'
import { MdDialog } from '@angular/material'
import { Router } from '@angular/router'
import { TemplateService } from './template.service';
import {MaterialModule} from '@angular/material'
import {Template} from './template'
import {User} from '../user/user'

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

  let comp:    TemplateIndexComponent;
  let fixture: ComponentFixture<TemplateIndexComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let user = new User();
  user.id = 21;
  let templateServiceStub = {
      getPublicTemplates(){
        return Observable.create(observer=>{
          observer.next([{id: 23}, {id: 28}])
        }) 
      },
      getTemplatesForUser(id){
        return Observable.create(observer=>{
          observer.next([{id:45}])
        }) 
      }
  }
  let userStoreStub = {
        user : 
        Observable.create(observer=>{
          observer.next(user)
        }) 
  }
  let dialogStub = {}
  let routerStub = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateIndexComponent, MockComponent({ selector: 'template-list' ,  inputs: ['templates','user']})],
      providers: [ {provide: TemplateService, useValue: templateServiceStub}, {provide: UserStore, useValue: userStoreStub}, {provide : Router, useValue:routerStub}, {provide: MdDialog, useValue: dialogStub} ] // declare the test component
      ,imports: [MaterialModule]
    });

    fixture = TestBed.createComponent(TemplateIndexComponent);

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not display body if not done loading', () => {
    let element = fixture.debugElement.query(By.css('.template-list'))
    expect(element).toBeNull();
  });

  it('should load templates',  async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      //expect(fixture.componentInstance.templates.length).toBe(1);
    });    
  }))

});

