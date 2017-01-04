import {Content} from '../content/content';

export class Element {
    id: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rotation: number;
    type: string;
    content: Content;
    draggable: boolean = true;
    static defaultBackgroundColor: string = "#ccc"
    background_color: string
}