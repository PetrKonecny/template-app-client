import { Component, OnInit, Injectable, Output, EventEmitter, Input} from '@angular/core';
import {Font} from './font'
import {FontSelector} from './font-selector'
import {FontStore} from './font.store'

@Component({
    selector: 'font-selector',
    template: `
                <ng2-dropdown (onItemClicked)="onFontSizeClicked($event.value)">
                    <ng2-dropdown-button>
                        {{fontSizeLabel}}
                    </ng2-dropdown-button>
                    <ng2-dropdown-menu>
                        <ng2-menu-item *ngFor="let fontSize of fontSizes" [value]="fontSize">
                            {{ fontSize }}
                        </ng2-menu-item>
                    </ng2-dropdown-menu>
                </ng2-dropdown>
                <ng2-dropdown (onItemClicked)="onFontClicked($event.value)">
                    <ng2-dropdown-button>
                        {{fontLabel}}
                    </ng2-dropdown-button>
                        <ng2-dropdown-menu>
                            <ng2-menu-item *ngFor="let font of fonts" [value]="font">
                                <font-display [font]="font"></font-display>
                            </ng2-menu-item>
                        </ng2-dropdown-menu>
                </ng2-dropdown>
            `,
})

@Injectable()
export class FontSelectorComponent implements OnInit {
    
    private fonts: Font[];
    @Input()
    fontLabel: string = "Change Font"
    @Input()
    fontSizeLabel: string = "Font Size"

    fontSizes=[10,20,30,40,50]
   
    constructor(private fontSelector: FontSelector,  private fontStore: FontStore){}
     
    ngOnInit(){
        this.fontStore.fonts.subscribe(fonts => this.fonts = fonts.concat(this.fontStore.getDefaultFonts()));
    }
    
    onFontClicked(font: Font){
        this.fontSelector.selectFont(font)
        this.fontSelector.closeSelectorWindow()
    }

    onFontSizeClicked(size: number){
        this.fontSelector.changeFontSize(size)
    }
  
}