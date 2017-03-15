import { Component,ContentChild, ElementRef, AfterContentInit, HostListener} from '@angular/core';
import {NewPageRemote} from '../page/new-page.remote'
import { Element, ElementCommands} from './element';
import {AppComponentRef} from '../app.ref'

@Component({
    selector: 'element-handle',
    template: `
            <div [style.width.px]="element?.width"  
            [style.height.px]="element?.height"
            [style.margin-top.px]="element?.positionY"
            [style.margin-left.px]="element?.positionX">
            <span *ngIf="handleContent?.selected && !handleContent?.hideHandles">
            <a draggable2 (move)="leftTop($event)" style="left: 0; top: 0;"></a>
            <a draggable2 (move)="rightTop($event)" style="top: 0; left: 100%;"></a>
            <a draggable2 (move)="leftBottom($event)" style="left: 0; top:100%;"></a>
            <a draggable2 (move)="rightBottom($event)" style="left: 100%; top: 100%;"></a>
            <a draggable2 (move)="top($event)" style="top: 0; left: 50%;"></a>
            <a draggable2 (move)="left($event)" style="left: 0; top: 50%;" ></a>
            <a draggable2 (move)="bottom($event)" style="left:50%; top: 100%;"></a>
            <a draggable2 (move)="right($event)" style="left: 100%; top: 50%;"></a>
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
    shift = false

    constructor (private newPage: NewPageRemote, private commands: ElementCommands, private ref: AppComponentRef){
        this.ref.shiftPRess.subscribe(press => this.shift = press)
    }
    
    ngAfterContentInit(){
        this.element = this.handleContent.element
    }


    leftTop(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseWidth: true,reverseHeight: true,filterThesePositions:[
            {x:this.element.positionX+this.element.width},
            {y:this.element.positionY+this.element.height}
        ]})
        if(d){
            if(this.shift){
                let ratio = this.element.width / this.element.height
                this.commands.startResizingElement(this.element,{left: d.top*ratio,top: d.top, width: d.height*ratio, height: d.height})
            }else{     
                this.commands.startResizingElement(this.element,d)
            }
        }
    }

    top(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseHeight: true,filterThesePositions:[
            {y:this.element.positionY+this.element.height}
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{height:d.height, top: d.top})
        }
    }

    rightTop(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseHeight: true,filterThesePositions:[
            {x:this.element.positionX},
            {y:this.element.positionY+this.element.height}
        ]})
        if(d){
            if(this.shift){
                let ratio = this.element.width / this.element.height
                this.commands.startResizingElement(this.element,{top: d.top, width: d.height*ratio, height: d.height})
            }else{     
                this.commands.startResizingElement(this.element,d)
            }        
        }        
    }

    right(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{filterThesePositions:[
            {x:this.element.positionX},
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{width:d.width})
        }
    }

   rightBottom(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{filterThesePositions:[
            {x:this.element.positionX},
            {y:this.element.positionY}
        ]})
        if(d){
            if(this.shift){
                let ratio = this.element.width / this.element.height
                this.commands.startResizingElement(this.element,{width: d.height*ratio, height: d.height})
            }else{     
                this.commands.startResizingElement(this.element,d)
            }
        }
   }

   bottom(dimensions){
       let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{filterThesePositions:[
            {y:this.element.positionY}
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{height:d.height})
        }
   }

   leftBottom(dimensions){
      let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseWidth: true,filterThesePositions:[
            {x:this.element.positionX + this.element.width},
            {y:this.element.positionY}
        ]})
        if(d){
            if(this.shift){
                let ratio = this.element.height / this.element.width
                this.commands.startResizingElement(this.element,{left: d.left, width: d.width, height: d.width * ratio})
            }else{     
                this.commands.startResizingElement(this.element,d)
            }
        } 
   }

   left(dimensions){
       let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseWidth: true,filterThesePositions:[
            {x:this.element.positionX + this.element.width},
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{width:d.width, left: d.left})
        } 
   }

    onMove(dimensions){
        console.log(dimensions)
    }


     
}