import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
@Component({
    selector: 'user-table',
    template: `
        <md-toolbar style="position: fixed; z-index:1000;">
            <md-input-container><input #search mdInput type="search" placeholder="filter" (keyup)='updateFilter(search.value)'></md-input-container>
            <button  *ngIf="selected.length" md-button>Delete</button>
            <button *ngIf="selected.length == 1" md-button>Edit</button>
            <button *ngIf="selected.length == 1" md-button>Templates</button>
            <button *ngIf="selected.length == 1" md-button>Documents</button>
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

export class UserTableComponent  {
        
    
    @Input()
    users : User[] 

    @Input()
    user: User

    selected = [];

    temp = [];

    @Input()
    loadingIndicator: boolean = true;

    columns = [
        { prop: 'id'},
        { prop: 'name'},
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
        if(!this.temp.length && this.users.length){
          this.temp = [...this.users];
        }
        // filter our data
        let temp = this.temp.filter(function(d) {
          return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.users = temp;
    }
}