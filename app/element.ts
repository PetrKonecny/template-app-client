import {Page} from './page';
import {Content} from './content';

export class Element {
    id: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rotation: number;
    type: string;
    page: Page;
    content: Content;
    draggable: boolean = true;
    background_color: string = "#000"
}