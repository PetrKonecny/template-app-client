import { Component,Input, Output, EventEmitter} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { AppConfig }from '../app.config'

@Component({
    selector: 'template-instance-list',
    template: `
        <md-nav-list>
            <md-list-item [routerLink] = "['/template-instances', templateInstance.id]" *ngFor="let templateInstance of templateInstances">
                <span md-line>{{ templateInstance.name? templateInstance.name : "Nepojmenovaný dokument" }}</span>
                <md-chip-list md-line><md-chip *ngFor="let tag of templateInstance.tagged">{{tag.tag_name}}</md-chip></md-chip-list>
                <button md-icon-button (click)="onClick($event)" [mdMenuTriggerFor]="templateInstListItemMenu"><md-icon>more_vert</md-icon></button>
                <md-menu #templateInstListItemMenu="mdMenu">
                    <button md-menu-item [routerLink] = "['/template-instances', templateInstance.id]">Otevřít dokument</button>
                    <a md-menu-item href="{{config.getConfig('api-url')}}/templateInstance/{{templateInstance.id}}/pdf"  target="_blank">Vytvořit PDF</a>
                    <button md-menu-item href="javascript:void(0)"(click)="onDelete(templateInstance)">Smazat</button>  
                </md-menu>             
            </md-list-item>
        </md-nav-list>
    `
})


//displays list of documents
export class TemplateInstanceListComponent {
    
    
    
    @Input()
    //documents to be displayed
    templateInstances : TemplateInstance[] 
    
    @Output() 
    //triggered when delete on the item clicked
    onDeleteClicked = new EventEmitter<TemplateInstance>();

    /**
    @param config - config to get API url from
    */
    constructor(private config: AppConfig){

    }

    //stops redirection when clicking on item menu
    onClick(event) {
       event.stopPropagation();
    }

    //triggered when deleting document
    onDelete(templateInstance: TemplateInstance){
        this.onDeleteClicked.emit(templateInstance);
    }
        
}