import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import {ColorPickerService} from 'ct-angular2-color-picker/component'


bootstrap(AppComponent,[
    APP_ROUTER_PROVIDERS, ColorPickerService
]);