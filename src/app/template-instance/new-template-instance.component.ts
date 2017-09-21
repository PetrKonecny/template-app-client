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
        <md-sidenav-container style="height: 100%; max-height: calc(100% - 64px); overflow: hidden;">
            <md-toolbar class="mat-elevation-z2">
                <button md-icon-button *ngIf="!sidenav.opened" (click)="sidenav.toggle()"><md-icon>add</md-icon></button>
                <button md-icon-button *ngIf="sidenav.opened" (click)="sidenav.toggle()"><md-icon>close</md-icon></button>
                <button md-icon-button (click)="saveTemplateInstance()"><md-icon>save</md-icon></button>
                <button md-icon-button (click)="undo()"><md-icon>undo</md-icon></button>
                <button md-icon-button><md-icon>redo</md-icon></button>
                <button md-button (click)="openAsTemplate()">Otevřít jako novou šablonu</button>
                <editor-toolbar *ngIf="element && element.type == 'text_element' && element.content.editor"></editor-toolbar>
            </md-toolbar>
            <md-sidenav #sidenav opened="true" class="sidenav mat-elevation-z6 bg-dark" mode ="side" style="width: 20%; display:flex; overflow: visible;">
                <album-index-sidenav (onCloseClicked)="sidenav.close()"></album-index-sidenav>
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
            overflow-y: auto;
            padding: 16px;
            box-sizing: border-box;
            height: calc(100% - 64px);
        }       
        .buttons{
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }
    `]
})

export class NewTemplateInstanceComponent {
             
     @Input()        
     //document being edited        
     templateInstance: TemplateInstance;        
     @Input()        
     //template of the document        
     template: Template;        
         
     //selected element        
     element: Element        
             
     /**        
     @param templateInstanceStore  injects store containing current document        
     @param elementStore  injects store containing selected element        
     @param router  injects router to navigate        
     @param templateStore  injects store containing current template        
     @param dialog  injects service to display the dialog        
     */        
     constructor(        
         private templateInstanceStore: TemplateInstanceStore,        
         private elementStore: ElementStore,        
         private router: Router,        
         private templateStore: TemplateStore,        
         public dialog: MdDialog,        
         private snackBar: MdSnackBar        
     ){         
                 
         this.elementStore.element.subscribe(element=> {        
             this.element = element        
         })        
     }        
               
     //opens dialog to save template instance and then saves is        
     saveTemplateInstance() {        
         let dialogRef = this.dialog.open(SaveTemplateInstanceModal, {        
           height: 'auto',        
           width: '30%',        
         });        
         dialogRef.afterClosed().subscribe(value =>         
             {        
                 if(value){        
                     this.templateInstance.name = value.name        
                     this.templateInstance.tagged = value.tagged
                     this.templateInstanceStore.saveTemplateInstance().subscribe(template=>{        
                         this.snackBar.open("Dokument úspěšně uložen",null,{duration: 1500})        
                     },error=>{        
                         this.snackBar.open("Chyba při ukládání dokumentu",null,{duration: 2500})        
                     })        
                 }        
             }        
         )        
         dialogRef.componentInstance.setTemplateInstance(this.templateInstance)        
     }

     openAsTemplate(){
        TemplateHelper.removeIdsFromTemplate(this.template)
        this.templateStore.ignoreNextClean();
        this.router.navigate(['/templates','new'])
    }       
 } 

   
