import { Component,ContentChild, ElementRef, AfterContentInit, HostListener, Input} from '@angular/core';
import {NewPageReference} from '../page/new-page.ref'
import { Element, ElementCommands} from './element';
import {AppComponentRef} from '../app.ref'

@Component({
    selector: 'element-handle',
    template: `
            <!-- displays 8 dots and frame around the element, rare case of use of ng-content that projects element display there -->
            <div [style.width.px]="element?.width"  
                [style.height.px]="element?.height"
                [style.margin-top.px]="element?.positionY"
                [style.margin-left.px]="element?.positionX">
                <span *ngIf="handleContent?.selected && !handleContent?.hideHandles">
                <a class="element-handle" draggable2 (move)="leftTop($event)" style="left: 0; top: 0;"></a>
                <a class="element-handle" draggable2 (move)="rightTop($event)" style="top: 0; left: 100%;"></a>
                <a class="element-handle" draggable2 (move)="leftBottom($event)" style="left: 0; top:100%;"></a>
                <a class="element-handle" draggable2 (move)="rightBottom($event)" style="left: 100%; top: 100%;"></a>
                <a class="element-handle" draggable2 (move)="top($event)" style="top: 0; left: 50%;"></a>
                <a class="element-handle" draggable2 (move)="left($event)" style="left: 0; top: 50%;" ></a>
                <a class="element-handle" draggable2 (move)="bottom($event)" style="left:50%; top: 100%;"></a>
                <a class="element-handle" draggable2 (move)="right($event)" style="left: 100%; top: 50%;"></a>
                </span>
                <ng-content></ng-content>
            </div>
        `,
    styles: [`
        div{position: absolute;}
    `]
})

//displays resize controlls over the element, when one of the handles is moved resizes the element acordingly
export class ElementHandleComponent implements AfterContentInit {

    @ContentChild('handleContent')
    handleContent: any
    @Input()
    //element to be resized
    element: any
    //stores if the shift key is pressed or not
    shift = false

    /*
    @param 'newPage' - injects reference to the page it is on
    @param 'commands' - injects commands used to resize element
    @parap 'ref' - injects reference to aplication root providing shift press event
    */
    constructor (private newPage: NewPageReference, private commands: ElementCommands, private ref: AppComponentRef){
        this.ref.shiftPRess.subscribe(press => this.shift = press)
    }
    
    ngAfterContentInit(){
    }

    //calls commands to resize element from the top left handle
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

    //calls commands to resize element from the top handle
    top(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseHeight: true,filterThesePositions:[
            {y:this.element.positionY+this.element.height}
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{height:d.height, top: d.top})
        }
    }

    //calls commands to resize element from the top right handle
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

    //calls commands to resize element from the right handle
    right(dimensions){
        let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{filterThesePositions:[
            {x:this.element.positionX},
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{width:d.width})
        }
    }

    //calls commands to resize element from bottom right handle
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

    //calls commands to resize element from bottom handle
   bottom(dimensions){
       let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{filterThesePositions:[
            {y:this.element.positionY}
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{height:d.height})
        }
   }

    //calls commands to resize element from left bottom handle
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

    //calls commands to resize element from left handle
   left(dimensions){
       let d = this.newPage.resize(this.element,{width: dimensions.left,height: dimensions.top},{reverseWidth: true,filterThesePositions:[
            {x:this.element.positionX + this.element.width},
        ]})
        if(d){
            this.commands.startResizingElement(this.handleContent.element,{width:d.width, left: d.left})
        } 
   } 
}