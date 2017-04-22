import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Content} from '../content/content';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
import { TableComponent } from '../admin/table.component'

@Component({
    selector: 'content-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="filter" (keyup)='updateFilter(search.value)'></md-input-container>
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
            [rows]="rows"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class ContentTableComponent extends  TableComponent {
        
    @Input()
    rows : Content[] 

    columns = [
        { prop: 'id'},
        { prop: 'type'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'element_id'},
    ]
   
}