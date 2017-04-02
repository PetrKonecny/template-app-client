import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Page} from '../page/page';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {PageHttpService} from '../page/page-http.service'

@Component({
    selector: 'admin-pages',
    template: `
        <page-table [pages] = "pages" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></page-table>
    `,
    providers: []
})

export class AdminPagesComponent implements OnInit {
    
    errorMessage: string;
    pages : Page[];
    loading = true;

    constructor(
        private pageService: PageHttpService
    ){}

    ngOnInit(){
        this.pageService.getPages().subscribe(
        pages=>{
            this.pages = pages
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
