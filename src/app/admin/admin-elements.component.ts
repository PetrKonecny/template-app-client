import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Element} from '../element/element';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {ElementHttpService} from '../element/element-http.service'

@Component({
    selector: 'admin-elements',
    template: `
        <element-table [rows] = "elements" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></element-table>
    `,
    providers: []
})

export class AdminElementsComponent implements OnInit {
    
    errorMessage: string;
    elements : Element[];
    loading = true;

    constructor(
        private elementService: ElementHttpService
    ){}

    ngOnInit(){
        this.elementService.getElements().subscribe(
        elements=>{
            this.elements = elements
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
