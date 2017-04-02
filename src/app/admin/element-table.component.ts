import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Template} from '../template/template';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
@Component({
    selector: 'element-table',
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
            [rows]="elements"
            [columns]="columns">
          </ngx-datatable>
    `,
})

export class ElementTableComponent  {
        
    
    @Input()
    elements : Element[] 

    @Input()
    user: User

    selected = [];

    temp = [];

    @Input()
    loadingIndicator: boolean = true;

    columns = [
        { prop: 'id'},
        { prop: 'type'},
        { prop: 'created_at'},
        { prop: 'updated_at'},
        { prop: 'page_id'},
    ]
    
    constructor(private router: Router){}
    
    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
    }

    onActivate(event) {
    }


    updateFilter(val: string) {
        if(!this.temp.length && this.elements.length){
          this.temp = [...this.elements];
        }
        // filter our data
        let temp = this.temp.filter(function(d) {
          return d.type.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.elements = temp;
    }
}