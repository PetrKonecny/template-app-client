import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FrameElementFactory } from './element.factory';
import { NewFrameElementComponent } from './new-frame-element.component';
import { DisplayContentComponent } from '../content/display-content.component' 
import { NewPageReference } from '../page/new-page.ref'
import { ElementStore } from '../element/element.store'
import { Element, ElementCommands} from './element';
import { Observable } from "rxjs/Observable";
import {MaterialModule} from '@angular/material'
import { ImageContent, ImageContentCommands } from '../content/image-content';


export function MockComponent(options: Component): Component {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class _ {});
}

describe('new frame component', () => {

  let comp:    NewFrameElementComponent;
  let fixture: ComponentFixture<NewFrameElementComponent>;
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
  let imageCommandsStup = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFrameElementComponent, 
                      MockComponent({ selector: 'display-content' ,  inputs: ['content']}), 
                      MockComponent({ selector: 'display-content-img-drag' ,  inputs: ['content']}), 
                      MockComponent({ selector: 'image-handle' ,  inputs: ['content']})],
      providers: [ {provide: NewPageReference, useValue: pageReferenceStub}, 
                   {provide: ElementStore, useValue: elementStoreStub}, 
                   {provide : ElementCommands, useValue:elementCommandsStub},
                   {provide : ImageContentCommands, useValue: imageCommandsStup}],
      imports: [MaterialModule]
    });

    fixture = TestBed.createComponent(NewFrameElementComponent);

    comp = fixture.componentInstance; // BannerComponent test instance
    let element = new FrameElementFactory().build();
    element.content = null;
    element.positionX = 50;
    element.positionY = 100;
    comp.element = element;
    // query for the title <h1> by CSS element selector
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.inner'));
    el = de.nativeElement;
  });

  it('should set width', () => {
    expect(de.nativeElement.style.width).toEqual('100px');
  });

  it('should set height', () => {
    expect(de.nativeElement.style.height).toEqual('100px');
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