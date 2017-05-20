import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Element} from '../element/element';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {ElementHttpService} from '../element/element-http.service'
import {MdSnackBar} from '@angular/material'

@Component({
    selector: 'admin-elements',
    template: `
        <element-table [rows] = "elements" [loadingIndicator]="loading" (onDelete) = "onDeleteClicked($event)"></element-table>
    `,
    providers: []
})

//displays elements in album index
export class AdminElementsComponent implements OnInit {
    
    //erro when loading elements
    errorMessage: string;
    //array of elements to display
    elements : Element[];
    //loading indicator
    loading = true;
    
    /**
    @param elementService - service that calls API to get elements
    @param snackBar - snackbar do display errors on
    */
    constructor(
        private elementService: ElementHttpService, private snackBar: MdSnackBar
    ){}

    //triggered when delete clicked
    onDeleteClicked(elements: Element[]){
        elements.forEach(element =>{
            this.elementService.removeElement(element.id).subscribe(
                ok => {
                    this.elements.splice(this.elements.indexOf(element),1)
                },
                error => {
                    this.snackBar.open("Chyba při mazání prvku",null,{duration: 2500})
                }
            )
        })
    }

    //gets elements from the API
    ngOnInit(){
        this.elementService.getElements().subscribe(
        elements=>{
            this.elements = elements
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }


}
