import { Component,Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Template} from '../template/template';
import { User } from '../user/user'
import { Router } from '@angular/router'
import { TemplateInstance} from '../template-instance/template-instance';
 

 //generic table component that can be extended in each model to provide unified experience
export class TableComponent  {
        
    @Output()
    //triggered when delete button clicked
    onDelete = new EventEmitter

    @Output()
    //triggered when edit button clicked
    onEdit = new EventEmitter

    @Input()
    //rows of the table
    rows : any[] 

    @Input()
    //columns of the table
    columns = [
        { prop: 'id'},
    ]

    //contains selected rows
    selected = [];

    //temp
    temp = [];

    @Input()
    //indicates whether table is loading or not
    loadingIndicator: boolean = true;

    //triggered when delete cliccked   
    onDeleteClicked(){
       this.onDelete.emit(this.selected)
    }

    //triggered when edit clicked
    onEditClicked(){
        this.onEdit.emit(this.selected[0])
    }

    /** filters the table
    @param string - sring in format <param>:<value> that filters table
    by given parameter and its value
    */
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