import { Component,ContentChild, ElementRef, AfterContentInit} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'
import { Element, ElementCommands} from './element';

@Component({
    selector: 'element-handle',
    template: `
            <div [style.width.px]="element?.width"  
            [style.height.px]="element?.height"
            [style.margin-top.px]="element?.positionY"
            [style.margin-left.px]="element?.positionX">
            <span *ngIf="handleContent?.selected && !handleContent?.hideHandles">
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0; top: 0;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="top: 0; left: 100%;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0; top:100%;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 100%; top: 100%;"></a>
            <a draggable2 (move)="onMoveHorizontal($event)" style="top: 0; left: 50%;"></a>
            <a draggable2 (move)="onMoveVertical($event)" style="left: 0; top: 50%;" ></a>
            <a draggable2 (move)="onMoveHorizontal($event)" style="left:50%; top: 100%;"></a>
            <a draggable2 (move)="onMoveVertical($event)" style="left: 100%; top: 50%;"></a>
            </span>
            <ng-content></ng-content>
            </div>
        `,
    styles: [`
        div{position: absolute;}
        a {z-index: 1000; position: absolute; margin: -2px; border-radius: 50%; width: 10px; height: 10px; background: blue;}
    `]
})

       
export class ElementHandleComponent implements AfterContentInit {

    @ContentChild('handleContent')
    handleContent: any
    element: any

    constructor (private newPage: NewPageRemote, private commands: ElementCommands){}
    
    ngAfterContentInit(){
        this.element = this.handleContent.element
    }

    onMoveVertical(dimensions){
        let d = this.newPage.resize(this.handleContent.element,{width: dimensions.left,height: dimensions.top, top: null, left: null, border: null})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{width:d.width})
        }
    }

    onMoveHorizontal(dimensions){
        let d = this.newPage.resize(this.handleContent.element,{width: dimensions.left,height: dimensions.top, top: null, left: null, border: null})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{height: d.height})
        }
    }

    onMoveDiagonal(dimensions){
        let d = this.newPage.resize(this.handleContent.element,{width: dimensions.left,height: dimensions.top, top: null, left: null, border: null})
        if(d){
            let ratio = this.handleContent.element.width / this.handleContent.element.height
            this.commands.startResizingElement(this.handleContent.element,{width:d.height * ratio, height: d.height})
        }
    }

    onMove(dimensions){
        console.log(dimensions)
    }


     
}