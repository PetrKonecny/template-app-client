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
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
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

//displays table of contents and some navigation on top of the table
export class ContentTableComponent extends  TableComponent {
        
    @Input()
    rows : Content[] 

    //columns in the table
    columns = [
        { prop: 'id'},
        { prop: 'type'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'element_id'},
    ]
   
}