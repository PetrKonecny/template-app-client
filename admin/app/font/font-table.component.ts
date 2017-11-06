import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Font} from '../../../src/app/font/font';
import { User } from '../../../src/app/user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../../../src/app/template-instance/template-instance';
import { TableComponent } from '../table.component'

@Component({
    selector: 'font-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  md-button (click)="onUploadClick()">Upload</button>
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

//displays table of fonts and some navigation on top of the table
export class FontTableComponent extends TableComponent {
           
    @Input()
    //fonts to be displayed
    rows : Font[] 

    @Output()
    onUploadClicked = new EventEmitter

    //columns of the table
    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'extension'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
    ]

    onUploadClick(){
        this.onUploadClicked.emit()
    }

}