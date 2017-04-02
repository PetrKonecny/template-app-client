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
        <font-table [fonts] = "fonts" [loadingIndicator]="loading" (onDeleteClicked) = "onDeleteClicked($event)"></font-table>
    `,
    providers: []
})

export class AdminFontsComponent implements OnInit {
    
    errorMessage: string;
    fonts : Font[];
    loading = true;

    constructor(
        private fontService: FontService
    ){}

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
