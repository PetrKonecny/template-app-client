import { Component,ContentChild, AfterContentInit, HostListener} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'
import { ImageContent, ImageContentCommands } from './image-content'

@Component({
    selector: 'image-handle',
    template: `
            <div [style.width.px]="handleContent?.content?.width"  
            [style.height.px]="handleContent?.content?.height"
            [style.margin-top.px]="handleContent?.content?.top"
            [style.margin-left.px]="handleContent?.content?.left">
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0; top: 0;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="top: 0; left: 100%;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 0; top:100%;"></a>
            <a draggable2 (move)="onMoveDiagonal($event)" style="left: 100%; top: 100%;"></a>
            <a draggable2 (move)="onMoveHorizontal($event)" style="top: 0; left: 50%;"></a>
            <a draggable2 (move)="onMoveVertical($event)" style="left: 0; top: 50%;" ></a>
            <a draggable2 (move)="onMoveHorizontal($event)" style="left:50%; top: 100%;"></a>
            <a draggable2 (move)="onMoveVertical($event)" style="left: 100%; top: 50%;"></a>
            <ng-content></ng-content>
            </div>
        `,
    styles: [`
        div{border: 2px solid red; position: absolute;}
        a {z-index: 1000; position: absolute; margin: -2px; border-radius: 50%; width: 10px; height: 10px; background: green;}
    `]
})

       
export class ImageHandleComponent implements AfterContentInit {

    @ContentChild('handleContent')
    handleContent: any

    constructor(private commands: ImageContentCommands){}

    
    ngAfterContentInit(){
        console.log(this.handleContent)
    }

    onMoveVertical(dimensions){
        this.commands.startResizingImage(this.handleContent.content,{width:dimensions.left})
    }

    onMoveHorizontal(dimensions){

        this.commands.startResizingImage(this.handleContent.content,{height: dimensions.top})
    }

    onMoveDiagonal(dimensions){
        let ratio = this.handleContent.content.width / this.handleContent.content.height
        this.commands.startResizingImage(this.handleContent.content,{width:dimensions.top * ratio, height: dimensions.top})
    }

    onMove(dimensions){
    }


     
}