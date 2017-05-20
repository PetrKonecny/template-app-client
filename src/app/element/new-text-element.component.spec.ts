import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { TextElementFactory } from './element.factory';
import { NewTextElementComponent } from './new-text-element.component';
import { DisplayContentComponent } from '../content/display-content.component' 
import { NewPageRemote } from '../page/new-page.remote'
import { ElementStore } from '../element/element.store'
import { Element, ElementCommands} from './element';
import { Observable } from "rxjs/Observable";


export function MockComponent(options: Component): Component {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  return Component(metadata)(class _ {});
}

describe('new text component', () => {

  let comp:    NewTextElementComponent;
  let fixture: ComponentFixture<NewTextElementComponent>;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTextElementComponent, MockComponent({ selector: 'display-content' ,  inputs: ['content']})],
      providers: [ {provide: NewPageRemote, useValue: pageReferenceStub}, {provide: ElementStore, useValue: elementStoreStub}, {provide : ElementCommands, useValue:elementCommandsStub} ] // declare the test component
    });

    fixture = TestBed.createComponent(NewTextElementComponent);

    comp = fixture.componentInstance; // BannerComponent test instance
    let element = new TextElementFactory().build();
    element.content = null;
    element.positionX = 50;
    element.positionY = 100;
    comp.element = element;
    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    fixture.detectChanges();
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

