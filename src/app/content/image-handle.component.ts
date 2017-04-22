import { Component,ContentChild, AfterContentInit, HostListener} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'
import { ImageContent, ImageContentCommands } from './image-content'
import {AppComponentRef} from '../app.ref'

@Component({
    selector: 'image-handle',
    template: `
            <div [style.width.px]="handleContent?.content?.width"  
            [style.height.px]="handleContent?.content?.height"
            [style.margin-top.px]="handleContent?.content?.top"
            [style.margin-left.px]="handleContent?.content?.left">
            <a draggable2 (move)="leftTop($event)" style="left: 0; top: 0;"></a>
            <a draggable2 (move)="rightTop($event)" style="top: 0; left: 100%;"></a>
            <a draggable2 (move)="leftBottom($event)" style="left: 0; top:100%;"></a>
            <a draggable2 (move)="rightBottom($event)" style="left: 100%; top: 100%;"></a>
            <a draggable2 (move)="top($event)" style="top: 0; left: 50%;"></a>
            <a draggable2 (move)="left($event)" style="left: 0; top: 50%;" ></a>
            <a draggable2 (move)="bottom($event)" style="left:50%; top: 100%;"></a>
            <a draggable2 (move)="right($event)" style="left: 100%; top: 50%;"></a>
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
    content: any
    shift: boolean

    constructor(private commands: ImageContentCommands, private ref: AppComponentRef){
        this.ref.shiftPRess.subscribe(press => this.shift = press)
    }

    
    ngAfterContentInit(){
        this.content = this.handleContent.content
    }

    leftTop(dimensions){
        if(this.shift){
            let ratio = this.content.width / this.content.height
            this.commands.startResizingImage(this.content,{width:-1*dimensions.top * ratio, height: -1*dimensions.top, left: dimensions.top * ratio, top: dimensions.top})
        }else{
            this.commands.startResizingImage(this.content,{width:-1*dimensions.left, height: -1*dimensions.top, left: dimensions.left, top: dimensions.top})
        }
    }

    top(dimensions){
        this.commands.startResizingImage(this.content,{height: -1*dimensions.top,  top: dimensions.top})
    }

    rightTop(dimensions){
        if(this.shift){
            let ratio = this.content.width / this.content.height
            this.commands.startResizingImage(this.content,{width: -1*dimensions.top*ratio, height: -1*dimensions.top, top: dimensions.top })
        }else{
            this.commands.startResizingImage(this.content,{width: dimensions.left, height: -1*dimensions.top, top: dimensions.top})
        }
    }

    right(dimensions){
        this.commands.startResizingImage(this.content,{width: dimensions.left})
    }

   rightBottom(dimensions){
        if(this.shift){
            let ratio = this.content.width / this.content.height
            this.commands.startResizingImage(this.content,{width: dimensions.top * ratio, height: dimensions.top})
        }else{
            this.commands.startResizingImage(this.content,{width: dimensions.left, height: dimensions.top})
        }
   }

   bottom(dimensions){
        this.commands.startResizingImage(this.content,{height: dimensions.top})
   }

   leftBottom(dimensions){
       if(this.shift){
            let ratio = this.content.height / this.content.width
            this.commands.startResizingImage(this.content,{width:-1*dimensions.left, height: -1*dimensions.left * ratio, left: dimensions.left})

       }else{
            this.commands.startResizingImage(this.content,{width:-1*dimensions.left, height: dimensions.top, left: dimensions.left})
       }
   }

   left(dimensions){
       this.commands.startResizingImage(this.content,{width:-1*dimensions.left, left: dimensions.left})
   }
     
}