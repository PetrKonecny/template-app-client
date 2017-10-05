import { Component, OnInit, Injectable, Output, EventEmitter, Input} from '@angular/core';
import {Font} from './font'
import {FontStore} from './font.store'
import { MdDialog } from '@angular/material'
import { UploadComponent } from '../uploader.component'
import {AppConfig} from '../app.config'

@Component({
    selector: 'font-toolbar',
    template: `
                <ng2-dropdown (onItemClicked)="onFontSizeClicked($event.value)">
                    <ng2-dropdown-button>
                        {{fontSizeLabel ? fontSizeLabel : 'velikost fontu'}}
                    </ng2-dropdown-button>
                    <ng2-dropdown-menu>
                        <ng2-menu-item *ngFor="let fontSize of fontSizes" [value]="fontSize">
                            {{ fontSize }}
                        </ng2-menu-item>                        
                    </ng2-dropdown-menu>
                </ng2-dropdown>
                <ng2-dropdown (onItemClicked)="onFontClicked($event.value)">
                    <ng2-dropdown-button>
                        {{fontLabel ? fontLabel : 'vybrat font'}}
                    </ng2-dropdown-button>
                        <ng2-dropdown-menu>
                            <ng2-menu-item *ngFor="let font of fonts" [value]="font">
                                <font-display [font]="font"></font-display>
                            </ng2-menu-item>
                            <ng2-menu-item>
                                  <button md-icon-button md-raised-button (click)="openUploadModal()"><md-icon>add</md-icon></button>
                            </ng2-menu-item>
                        </ng2-dropdown-menu>
                </ng2-dropdown>
            `,
})

@Injectable()
/**Component that is used in the editor to select the font and its size
*/
export class FontToolbarComponent implements OnInit {
    
    //fonts that can be selected
    fonts: Font[];
    @Input()
    //label displayed in the selector
    fontLabel: string
    @Input()
    //size displayed in the selector
    fontSizeLabel: string
    @Output()
    //triggered when she font size is selected
    onFontSizeSelected = new EventEmitter
    @Output()
    //triggered when the font is selected
    onFontSelected = new EventEmitter

    //font sizes to choose from
    fontSizes=[8,9,10,11,12,14,18,24,30,36,48,60,72,96]
   
    /**
    @param fontStore - injects store containing available cfonts
    @param dilaog - injects dialog service to display font upload dialog
    @param config - injects config to get the APi url 
    */
    constructor(private fontStore: FontStore, public dialog: MdDialog, private config: AppConfig){}
     
    ngOnInit(){
        this.fontStore.fonts.subscribe(fonts => this.fonts = fonts.concat(this.fontStore.getDefaultFonts()));
    }
    
    //triggered on font selected
    onFontClicked(font: Font){
        if(font){
            this.onFontSelected.emit(font)
        }
    }

    //trigered on font size selected
    onFontSizeClicked(size: number){
        this.onFontSizeSelected.emit(size)
    }

    //opens upload modal used to upload new fonts
    openUploadModal() {
        let dialogRef = this.dialog.open(UploadComponent, {
          height: '90%',
          width: '60%',
        });
        dialogRef.afterClosed().subscribe(closed =>{
          this.ngOnInit()
        })
        dialogRef.componentInstance.uploadUrl = this.config.getConfig('api-url')+'/font';       
    }
  
}