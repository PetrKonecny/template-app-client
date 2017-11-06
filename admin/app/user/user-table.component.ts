import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { User } from '../../../src/app/user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../../../src/app/template-instance/template-instance';
import { TableComponent } from '../table.component'

@Component({
    selector: 'user-table',
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
            [rows]="users"
            [columns]="columns">
          </ngx-datatable>
    `,
})

//displays table of users and some navigation on top of the table
export class UserTableComponent extends TableComponent  {
        
    
    @Input()
    users : User[] 

    columns = [
        { prop: 'id'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'admin'}
    ]
}