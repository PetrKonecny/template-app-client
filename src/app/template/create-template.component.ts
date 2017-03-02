import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template} from './template';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { StepSelector } from '../step-selector'
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'
import { UndoRedoService } from '../undo-redo.service'
import { TableElementRedoer } from '../element/table-element'
import { TextContentRedoer } from '../content/text-content'
import { ImageContentRedoer } from '../content/image-content'
import { ElementRedoer } from '../element/element'


@Component({
    selector: 'template-create',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, StepSelector, PageSelector, RulerSelector, TextSelector, UndoRedoService, TableElementRedoer, TextContentRedoer, ImageContentRedoer, ElementRedoer]
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
            this.templateService.filloutNewTemplate()
        });
    }

    ngAfterViewInit(){
        this.pageSelector.selectPage(this.template.pages[0])
    }
}