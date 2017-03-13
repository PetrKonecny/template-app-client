import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from './template';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'

@Component({
    selector: 'template-create',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, PageSelector, RulerSelector, TextSelector, UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateCreateComponent implements OnInit, AfterViewInit  {
    
    errorMessage: string;
    template : Template;

    constructor(
        private templateService: TemplateInstanceStore, private pageSelector: PageSelector, private undoRedoService: UndoRedoService
    ){ }

    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    
    ngOnInit(){
        this.templateService.cleanStore();
        this.templateService.template.first().subscribe( template => {
            this.template = template
            this.templateService.createContentsForTemplate()
        });
    }

    ngAfterViewInit(){
        this.pageSelector.selectPage(this.template.pages[0])
    }
}