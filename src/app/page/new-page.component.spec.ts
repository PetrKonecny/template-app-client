import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { PageFactory } from './page.factory';
import { NewPageComponent } from './new-page.component';
import { Page, PageCommands} from './page';
import { Observable } from "rxjs/Observable";
import {NewPageRemote} from './new-page.remote'
import {PageStore} from '../page/page.store'

export function MockComponent(options: Component): Component {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class _ {});
}

describe('new page component', () => {

  let pageReferenceStub = {}
  let pageStoreStub = {
        page : 
        Observable.create(observer=>{
          observer.next(null)
        }) 
  }
  let pageCommandsStub = {}

  let comp:    NewPageComponent;
  let fixture: ComponentFixture<NewPageComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPageComponent, 
                      MockComponent({ selector: 'create-new-element' ,  inputs: ['element']}),
                      MockComponent({ selector: 'display-guide' ,  inputs: ['guide']}),
                      MockComponent({ selector: 'display-ruler' ,  inputs: ['guide']}) ],
      providers: [ {provide: NewPageRemote, useValue: pageReferenceStub}, 
                   {provide: PageStore, useValue: pageStoreStub}, 
                   {provide : PageCommands, useValue: pageCommandsStub} ] // declare the test component
    }).overrideComponent(NewPageComponent, {
      set: {
        providers: [
          { provide: NewPageRemote, useValue: pageReferenceStub }
        ]
      }
    })

    fixture = TestBed.createComponent(NewPageComponent);

    comp = fixture.componentInstance;
    let page = new PageFactory().build();
    comp.page = page
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should set width to Default A4', () => {
    expect(de.nativeElement.style.width).toEqual(Page.presetDimensions.A4.width+'mm');
  });

  it('should set height to Default A4', () => {
    expect(de.nativeElement.style.width).toEqual(Page.presetDimensions.A4.width+'mm');
  });
});


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/