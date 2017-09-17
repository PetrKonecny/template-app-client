import { Component, OnInit, Input } from '@angular/core'
import { TemplateInstance} from './template-instance'
import { Template} from '../template/template'
import { TemplateInstanceStore } from './template-instance.store'
import { Router} from '@angular/router'
import { TextContent} from '../content/text-content'
import { Element } from '../element/element'
import { TemplateHelper} from '../template/template.helper'
import { TemplateStore } from '../template/template.store'
import { ElementStore } from '../element/element.store'
import { PageStore } from '../page/page.store'
import { MdSnackBar } from '@angular/material';
import { MdDialog } from '@angular/material'
import { SaveTemplateInstanceModal} from '../template-instance/save-template-instance.modal'
import { NewTemplateComponent } from '../template/new-template.component'

@Component({
    selector: 'create-new-template-instance',
    template:
       `
        <md-sidenav-container style="height: 100%;">
            <md-toolbar>
                <button md-icon-button *ngIf="!sidenav.opened" (click)="sidenav.toggle()"><md-icon>add</md-icon></button>
                <button md-icon-button *ngIf="sidenav.opened" (click)="sidenav.toggle()"><md-icon>close</md-icon></button>
                <button md-icon-button (click)="saveInstance()"><md-icon>save</md-icon></button>
                <button md-icon-button (click)="undo()"><md-icon>undo</md-icon></button>
                <button md-icon-button><md-icon>redo</md-icon></button>
                <button md-button (click)="openAsTemplate()">Otevřít jako novou šablonu</button>
                <editor-toolbar *ngIf="element && element.type == 'text_element' && element.content.editor"></editor-toolbar>
            </md-toolbar>
            <md-sidenav mode ="side" class="sidenav" #sidenav style="width: 20%;">
                <album-index-sidenav></album-index-sidenav>
            </md-sidenav>       
            <div class="pages" *ngIf="template">
                <display-page *ngFor="let page of template.pages" [page]="page"></display-page>
            </div>
        </md-sidenav-container>
    `,
    providers: [ElementStore, PageStore],
     styles: [`.leftPanel {
            position: relative;
            float: left;
            margin-top: 10px;
            width: 300px;
        }
        .pages{
            position: relative;
            overflow-y: scroll;
            height: 90%;
        }       
        .buttons{
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }
    `]
})

//displays editor for document edditing
export class NewTemplateInstanceComponent extends NewTemplateComponent{
    //this opens current display of the editor as new template by
    //removing the ids from the template and setting store to not reset 
    //on the next reset request
    openAsTemplate(){
        TemplateHelper.removeIdsFromTemplate(this.template)
        this.templateStore.ignoreNextClean();
        this.router.navigate(['/templates','new'])
    }
}
   
