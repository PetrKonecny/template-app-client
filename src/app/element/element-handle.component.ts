import { Component,ContentChild, ElementRef, AfterContentInit} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'

@Component({
    selector: 'element-handle',
    template: `
            <div [style.width.px]="handleContent?.element?.width"  
            [style.height.px]="handleContent?.element?.height"
            [style.margin-top.px]="handleContent?.element?.positionY"
            [style.margin-left.px]="handleContent?.element?.positionX">
            <span *ngIf="handleContent?.selected">
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0; top: 0;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="top: 0;" [style.left.px]="handleContent?.element?.width"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0;" [style.top.px]="handleContent?.element?.height"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" [style.left.px]="handleContent?.element?.width" [style.top.px]="handleContent?.element?.height"></a>
            <a draggable2 (move)="onMoveHorizontal($event)" style="top: 0;" [style.left.px]="handleContent?.element?.width/2"></a>
            <a draggable2 (move)="onMoveVertical($event)" style="left: 0;" [style.top.px]="handleContent?.element?.height/2"></a>
            <a draggable2 (move)="onMoveHorizontal($event)" [style.left.px]="handleContent?.element?.width/2" [style.top.px]="handleContent?.element?.height"></a>
            <a draggable2 (move)="onMoveVertical($event)" [style.left.px]="handleContent?.element?.width" [style.top.px]="handleContent?.element?.height/2"></a>
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

    constructor (private newPage: NewPageRemote){}
    
    ngAfterContentInit(){
        console.log(this.handleContent)
    }

    onMoveVertical(dimensions){
        dimensions.width = dimensions.left        
        this.handleContent.element.changing = true 
        this.newPage.resize(this.handleContent.element,dimensions)
    }

    onMoveHorizontal(dimensions){
        dimensions.height = dimensions.top        
        this.handleContent.element.changing = true 
        this.newPage.resize(this.handleContent.element,dimensions)
    }

    onMoveDiagonal(dimensions){
        let ratio = this.handleContent.element.width / this.handleContent.element.height
        dimensions.width = dimensions.top  * ratio
        dimensions.height = dimensions.top 
        this.handleContent.element.changing = true 
        this.newPage.resize(this.handleContent.element,dimensions)
    }

    onMove(dimensions){
        console.log(dimensions)
    }


     
}