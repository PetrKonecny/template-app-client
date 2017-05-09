import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { TableElementFactory } from './element.factory';
import { NewTableElementComponent } from './new-table-element.component';
import { DisplayContentComponent } from '../content/display-content.component' 
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'
import { Element, ElementCommands} from './element';
import { Observable } from "rxjs/Observable";
import { NewTableElement } from './new-table-element'
import {MaterialModule} from '@angular/material'
import { TableElement, TableElementCommands } from './table-element'

export function MockComponent(options: Component): Component {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class _ {});
}

describe('new table component', () => {

  let comp:    NewTableElementComponent;
  let fixture: ComponentFixture<NewTableElementComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  let pageReferenceStub = {}
  let elementStoreStub = {
        element : 
        Observable.create(observer=>{
          observer.next(null)
        }) 
  }
  let elementCommandsStub = {}
  let tableElementReferenceStub = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTableElementComponent, MockComponent({ selector: 'tr' ,  inputs: ['myTr','y','content']})],
      providers: [ {provide: NewPageRemote, useValue: pageReferenceStub}, 
      {provide: ElementStore, useValue: elementStoreStub}, 
      {provide : ElementCommands, useValue:elementCommandsStub},
      {provide : TableElementCommands, useValue:elementCommandsStub},
      {provide: NewTableElement, useValue: tableElementReferenceStub}
    ], // declare the test component
      imports: [MaterialModule] // declare the test component
    });

    fixture = TestBed.createComponent(NewTableElementComponent);

    comp = fixture.componentInstance; // BannerComponent test instance
    let element = new TableElementFactory().build();
    element.positionX = 50;
    element.positionY = 100;
    comp.element = element;
    // query for the title <h1> by CSS element selector
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.table-element-move'));
    el = de.nativeElement;
  });

  it('should set positionX', () => {
    expect(de.nativeElement.style.left).toEqual('50px');
  });

  it('should set positionY', () => {
    expect(de.nativeElement.style.top).toEqual('100px');
  });
});


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/