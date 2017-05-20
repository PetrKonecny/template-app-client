import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Page} from '../page/page';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {PageHttpService} from '../page/page-http.service'
import {MdSnackBar} from '@angular/material'

@Component({
    selector: 'admin-pages',
    template: `
        <page-table [rows] = "pages" [loadingIndicator]="loading" (onDelete) = "onDeleteClicked($event)"></page-table>
    `,
    providers: []
})

//displays pages in the admin sections
export class AdminPagesComponent implements OnInit {
    
    //error thrown on loading pages
    errorMessage: string;
    //pages to be displayed
    pages : Page[];
    //loading indicator
    loading = true;

    /**
    @param pageService - injects service to get the pages
    @param snackBar - snack bar to display errors on
    */
    constructor(
        private pageService: PageHttpService, private snackBar: MdSnackBar
    ){}

    //triggered when delete clicked
    onDeleteClicked(pages: Page[]){
        pages.forEach(page =>{
            this.pageService.removePage(page.id).subscribe(
                ok => {
                    this.pages.splice(this.pages.indexOf(page),1)
                },
                error => {
                    this.snackBar.open("Chyba při mazání stránky",null,{duration: 2500})
                }
            )
        })
    }

    //gets pages from the API
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
