import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { TableElementFactory } from './element.factory';
import { NewTableElementComponent } from './new-table-element.component';
import { DisplayContentComponent } from '../content/display-content.component' 
import { NewPageReference } from '../page/new-page.ref'
import { ElementStore } from '../element/element.store'
import { Element } from './element';
import { Observable } from "rxjs/Observable";
import { NewTableElementReference } from './new-table-element.ref'
import {MaterialModule} from '@angular/material'
import { TableElement } from './table-element'
/*
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
      providers: [ {provide: NewPageReference, useValue: pageReferenceStub}, 
      {provide: ElementStore, useValue: elementStoreStub}, 
      {provide : TableElementCommands, useValue:elementCommandsStub},
      {provide: NewTableElementReference, useValue: tableElementReferenceStub}
    ], 
      imports: [MaterialModule] 
    });

    fixture = TestBed.createComponent(NewTableElementComponent);

    comp = fixture.componentInstance; 
    let element = new TableElementFactory().build();
    element.positionX = 50;
    element.positionY = 100;
    comp.element = element;
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
*/
