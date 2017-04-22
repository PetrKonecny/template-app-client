import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { TemplateInstance} from '../template-instance/template-instance';
import { Router } from '@angular/router'
import { TableComponent } from '../admin/table.component'

@Component({
    selector: 'template-instance-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length" md-button (click)="onDeleteClicked()">Delete</button>
            <button *ngIf="selected.length == 1" md-button (click)="onEditClicked()">Edit</button>
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
            [rows]="rows"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class TemplateInstanceTableComponent extends TableComponent{
        
    
    @Input()
    rows : TemplateInstance[] 

    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'tagged'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'template_id'},
        { prop: 'user_id'}
    ]
}