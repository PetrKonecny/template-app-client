import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core'
import { Album } from '../album/album'
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance'
import { TableComponent } from '../admin/table.component'

@Component({
    selector: 'album-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="filter" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length == 1" (click)="onOpenClicked()" md-button>Open</button>
            <button  *ngIf="selected.length" (click)="onDeleteClicked()" md-button>Delete</button>
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
            [rows]="albums"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class AlbumTableComponent extends  TableComponent {
        
    @Input()
    albums : Album[]

    @Output()
    onOpen = new EventEmitter

    onOpenClicked(){
        this.onOpen.emit(this.selected[0])
    } 

    columns = [
        { prop: 'id'},
        { prop: 'name'},
        { prop: 'public'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'user_id'},
    ]
   
}