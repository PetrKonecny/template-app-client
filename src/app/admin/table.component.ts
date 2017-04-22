import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Template} from '../template/template';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 
export class TableComponent  {
        
    @Output()
    onDelete = new EventEmitter

    @Output()
    onEdit = new EventEmitter

    @Input()
    rows : any[] 

    @Input()
    columns = [
        { prop: 'id'},
    ]

    selected = [];

    temp = [];

    @Input()
    loadingIndicator: boolean = true;

   
    onDeleteClicked(){
       this.onDelete.emit(this.selected)
    }

    onEditClicked(){
        this.onEdit.emit(this.selected[0])
    }

    updateFilter(val: string ) {
        let split = val.split(":")
        let param
        if(split.length > 1){
            param = split[0]
            val = split[1]           
        }else{
            param = "not_valid" 
        }

        if(!this.temp.length && this.rows.length){
          this.temp = [...this.rows];
        }
        // filter our data
        let temp = this.temp.filter(function(d) {
          if(d[param]){
              return d[param].toString().indexOf(val) !== -1 || !val;
          }else{
              return true;
          }
        });

        // update the rows
        this.rows = temp;
    }
}