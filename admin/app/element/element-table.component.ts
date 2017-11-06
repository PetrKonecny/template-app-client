import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Template} from '../../../src/app/template/template';
import { User } from '../../../src/app/user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../../../src/app/template-instance/template-instance';
import { TableComponent } from '../table.component'

@Component({
    selector: 'element-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length" (click)="onDeleteClicked()" md-button>Delete</button>
        </md-toolbar>
         <ngx-datatable
             class="material"
            [columnMode]="'force'"
            [headerHeight]="50"
            [loadingIndicator]="loadingIndicator"
            [footerHeight]="50"
            [rowHeight]="'auto'"
            [selected]="selected"
            [selectionType]="'multi'"
            [rows]="rows"
            [columns]="columns">
          </ngx-datatable>
    `,
})

//displays table of elements and some navigation on top of the table
export class ElementTableComponent  extends TableComponent{
        
    
    @Input()
    //elements to be displayed
    rows : Element[] 

    //columns of the table
    columns = [
        { prop: 'id'},
        { prop: 'type'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'page_id'},
    ]
    
}