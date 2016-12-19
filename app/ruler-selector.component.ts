import { Component, OnInit} from '@angular/core';
import { RulerSelector } from './ruler-selector'
import { Guide } from './guide'
import { TemplateInstanceStore } from './template-instance.store'

@Component({
    selector: 'ruler-select',
    template: `
                <span *ngIf="ruler">
                    <span *ngIf="ruler.positionX" >Position X: <input [(ngModel)]="ruler.positionX" (keyup)="0"></span><br>
                    <span *ngIf="ruler.positionY" >Position Y: <input [(ngModel)]="ruler.positionY" (keyup)="0"></span><br>
                    <button (click)="onDeleteClicked()">Delete ruler</button>
                </span>
             `,
    directives: [],
    providers: []
})

export class RulerSelectorComponent {
        
    ruler: Guide
    
    constructor(private rulerSelector: RulerSelector, private store: TemplateInstanceStore){
        this.rulerSelector.component = this
    }
    
    onDeleteClicked(){
        this.store.deleteRulerFromTemplate(this.ruler)
        this.ruler = null
    }
 
    
}