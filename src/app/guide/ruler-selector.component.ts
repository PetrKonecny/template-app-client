import { Component, OnInit} from '@angular/core';
import { Guide } from './guide'
import { TemplateInstanceStore } from '../template-instance/template-instance.store'
import { TemplateHelper} from '../template/template.helper'
import { TemplateStore } from '../template/template.store'
import { Template } from '../template/template'

@Component({
    selector: 'ruler-select',
    template: `
                <span *ngIf="ruler">
                    <span *ngIf="ruler.positionX" >Position X: <input [(ngModel)]="ruler.positionX" (keyup)="0"></span><br>
                    <span *ngIf="ruler.positionY" >Position Y: <input [(ngModel)]="ruler.positionY" (keyup)="0"></span><br>
                    <button (click)="onDeleteClicked()">Delete ruler</button>
                </span>
             `,
    providers: []
})

export class RulerSelectorComponent {
        
    ruler: Guide
    template: Template
    
    constructor(private store: TemplateStore){
        this.store.template.subscribe(template => this.template = template)
    }
    
    onDeleteClicked(){
        TemplateHelper.deleteRulerFromTemplate(this.ruler,this.template)
        this.ruler = null
    }
 
    
}