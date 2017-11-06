import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core'
import { Album } from '../../../src/app/album/album'
import { User } from '../../../src/app/user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../../../src/app/template-instance/template-instance'
import { TableComponent } from '../table.component'

@Component({
    selector: 'album-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="column_name:query" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length == 1" (click)="onOpenClicked()" md-button>Open</button>
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
            [rows]="albums"
            [columns]="columns">
          </ngx-datatable>
    `,
})
//displays table of albums and some navigation on top of the table
export class AlbumTableComponent extends  TableComponent {
        
    @Input()
    //albums in the table
    albums : Album[]

    @Output()
    onOpen = new EventEmitter

    onOpenClicked(){
        this.onOpen.emit(this.selected[0])
    } 
    //columns displayed in the table
    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'public'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'user_id'},
    ]
   
}