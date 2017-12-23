import { Component, OnInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template } from './template';
import { ActivatedRoute } from '@angular/router';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { TemplateStore } from '../template/template.store'
import { PageStore } from '../page/page.store'
import { ElementStore } from '../element/element.store'
import { TemplateService } from '../template/template.service'
import { MdSnackBar } from '@angular/material';
import { PageFactory }from '../page/page.factory'
import { MdDialog } from '@angular/material'
import { MessageDialog } from '../message.dialog'

@Component({
    selector: 'template-demo',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="!template && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template *ngIf="template" [disableSave]="true" [template] = template></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ElementStore, PageStore]
})


//index page for opening already created templates containing the editor component
export class TemplateDemoComponent implements OnInit  {
    
    //error thrown when loading the template
    error: string;
    //template to be displayed
    template : Template;


    /**
    @param route - injects route to get route params
    @param templateStore - injects store containing current template
    @param pageStore - injects store containing currently selected page
    @param undoRedoService - injects undo redo ervice
    @param snackBar - injects service to dispaly snackbar with error
    @param factory - injects factory to build pages with right dimensions
    */
    constructor(
        public dialog: MdDialog,
        private templateStore: TemplateStore,
        private pageStore: PageStore,
        private undoRedoService: UndoRedoService,
        private snackBar: MdSnackBar,
        private factory: PageFactory
    ){ 
    }
    
    //saves buffer commands if the mouse up event happens
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }

    ngAfterViewInit(){
        
    }
    
    //loads template from the store with the right id
    ngOnInit(){
        this.templateStore.cleanStore()

        this.templateStore.template
        .first(template => template.id > 0)
        .subscribe(template => {
            this.template = template
            if(this.template.pages && this.template.pages[0]){
                 this.pageStore.selectPage(this.template.pages[0])
                 this.factory.setHeight(this.template.pages[0].height).setWidth(this.template.pages[0].width)
            }
        })

       this.templateStore.getDemoTemplate()
       .first()
       .subscribe(
            ()=>{this.displayDialog()},
            error => {
              this.error = error
              this.snackBar.open("Chyba při načítání dema",null,{duration: 1500})
            }
       )
   }

   displayDialog(){
       let dialogRef = this.dialog.open(MessageDialog, {
        });
        dialogRef.componentInstance.title = "Demo stránka"
        dialogRef.componentInstance.message = 
        `
        Vítejte v demu aplikace na tvorbu dokumentů :
        <ul>
          <li>Aplikace je stále ve vývoji.</li>
          <li>Aplikace je zatím optimalizována a testována pouze v Chrome</li>
          <li>Aplikace není 100% otestována a obsahuje drobné bugy</li>
          <li>Aplikace je určena pro desktop a není optimalizována pro mobily</li>
          <li>Tento dokument slouží pouze pro demo editoru<br>
          a nelze tedy uložit ani do něj přidat vlastní obrázky nebo fonty</li>
        </ul>  
        `
   }
}