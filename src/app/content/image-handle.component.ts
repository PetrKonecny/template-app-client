import { Component,ContentChild, AfterContentInit} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'

@Component({
    selector: 'image-handle',
    template: `
            <div [style.width.px]="handleContent?.content?.width"  
            [style.height.px]="handleContent?.content?.height"
            [style.margin-top.px]="handleContent?.content?.top"
            [style.margin-left.px]="handleContent?.content?.left">
            <a draggable2 (move)="onMoveDiagonal($event)" [propagate]="false" style="left: 0; top: 0;">O</a>
            <a draggable2 (move)="onMoveDiagonal($event)" [propagate]="false" style="top: 0;" [style.left.px]="handleContent?.content?.width">O</a>
            <a draggable2 (move)="onMoveDiagonal($event)" [propagate]="false" style="left: 0;" [style.top.px]="handleContent?.content?.height">O</a>
            <a draggable2 (move)="onMoveDiagonal($event)" [propagate]="false" [style.left.px]="handleContent?.content?.width" [style.top.px]="handleContent?.content?.height">O</a>
            <a draggable2 (move)="onMoveHorizontal($event)" [propagate]="false" style="top: 0;" [style.left.px]="handleContent?.content?.width/2">O</a>
            <a draggable2 (move)="onMoveVertical($event)" [propagate]="false" style="left: 0;" [style.top.px]="handleContent?.content?.height/2">O</a>
            <a draggable2 (move)="onMoveHorizontal($event)" [propagate]="false" [style.left.px]="handleContent?.content?.width/2" [style.top.px]="handleContent?.content?.height">O</a>
            <a draggable2 (move)="onMoveVertical($event)" [propagate]="false" [style.left.px]="handleContent?.content?.width" [style.top.px]="handleContent?.content?.height/2">O</a>
            <ng-content></ng-content>
            </div>
        `,
    styles: [`
        div{border: 2px solid red; position: absolute;}
        a {z-index: 1000; position: absolute; margin: -5px;}
    `]
})

       
export class ImageHandleComponent implements AfterContentInit {

    @ContentChild('handleContent')
    handleContent: any

    resizeSimple(dimensions){
        let content = this.handleContent.content
        if (dimensions.width){
            content.width += dimensions.width
        }
        if (dimensions.height){
            content.height += dimensions.height
        }
    }

    
    ngAfterContentInit(){
        console.log(this.handleContent)
    }

    onMoveVertical(dimensions){
        dimensions.width = dimensions.left
        this.resizeSimple(dimensions)
    }

    onMoveHorizontal(dimensions){
        dimensions.height = dimensions.top
        this.resizeSimple(dimensions)        
    }

    onMoveDiagonal(dimensions){
        let ratio = this.handleContent.content.width / this.handleContent.content.height
        dimensions.width = dimensions.top * ratio
        dimensions.height = dimensions.top
        this.resizeSimple(dimensions)
    }

    onMove(dimensions){
        console.log(dimensions)
    }


     
}