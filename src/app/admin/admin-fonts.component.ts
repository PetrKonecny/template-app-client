import { Component, OnInit, Input} from '@angular/core';
import {TemplateListComponent} from '../template/template-list.component';
import { TemplateService } from '../template/template.service';
import { Font} from '../font/font';
import { Observable }     from 'rxjs/Observable';
import {User } from '../user/user'
import {ActivatedRoute} from '@angular/router';
import {FontService} from '../font/font.service'

@Component({
    selector: 'admin-fonts',
    template: `
        <font-table [rows] = "fonts" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></font-table>
    `,
    providers: []
})

//displays fonts in the admin section
export class AdminFontsComponent implements OnInit {
    
    //error thrown when loading fonts
    errorMessage: string;
    //array of fonts to be displayed
    fonts : Font[];
    //loading indicator
    loading = true;

    /**
    @param - fontService - font service to load fonts
    */
    constructor(
        private fontService: FontService
    ){}

    //loads fonts from the API
    ngOnInit(){
        this.fontService.getFonts().subscribe(
        fonts=>{
            this.fonts = fonts
            this.loading = false
        },
        error =>{
            this.errorMessage = error
            this.loading = false
        })
    }
}
