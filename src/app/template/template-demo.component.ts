import { Component, OnInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from './template';
import {ActivatedRoute} from '@angular/router';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'
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
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands, ElementStore, PageStore]
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
        let dialogRef = this.dialog.open(MessageDialog, {
        });
        dialogRef.componentInstance.title = "Demo stránka"
        dialogRef.componentInstance.message = "Toto je testovací demo stránka. Ukládání šablony a obrázků je vypnuto"
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
            null,
            error => {
              this.error = error
              this.snackBar.open("Chyba při načítání dema",null,{duration: 1500})
            }
       )
   }
}