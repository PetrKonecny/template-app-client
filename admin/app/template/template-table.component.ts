import { Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Template} from '../../../src/app/template/template';
import { User } from '../../../src/app/user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../../../src/app/template-instance/template-instance';
import { TableComponent } from '../table.component'
 
@Component({
    selector: 'template-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length" md-button (click)="onDeleteClicked()">Delete</button>
            <button *ngIf="selected.length == 1" md-button (click)="onEditClicked()">Edit</button>
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

//displays table of templates and some navigation on top of the table
export class TemplateTableComponent extends TableComponent {
        
    
    @Input()
    rows : Template[] 

    //columns of the table
    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'tagged'},
        { prop: 'public'},
        { prop: 'user_id'}
    ]
  
}