import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Page} from '../page/page';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
@Component({
    selector: 'page-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;"> 
            <md-input-container><input #search mdInput type="search" placeholder="filter" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  md-button>Upload</button>
            <button  *ngIf="selected.length" md-button>Delete</button>
            <button *ngIf="selected.length == 1" md-button>Edit</button>
        </md-toolbar>
         <ngx-datatable
             class="material"
             style="padding-top: 64px;"
            [columnMode]="'force'"
            [headerHeight]="50"
            [loadingIndicator]="loadingIndicator"
            [footerHeight]="50"
            [rowHeight]="'auto'"
            [selected]="selected"
            [selectionType]="'multi'"
            [rows]="pages"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class PageTableComponent  {
        
    
    @Input()
    pages : Page[] 

    @Input()
    user: User

    selected = [];

    temp = [];

    @Input()
    loadingIndicator: boolean = true;

    columns = [
        { prop: 'id'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
    ]
    
    constructor(private router: Router){}
    
    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
    }


    updateFilter(val: string) {
        if(!this.temp.length && this.pages.length){
          this.temp = [...this.pages];
        }
        // filter our data
        let temp = this.temp.filter(function(d) {
          return d.type.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.pages = temp;
    }
}