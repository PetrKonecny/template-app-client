import {Content} from '../content/content';
import {StateSubject} from '../step-selector'

export class Element implements StateSubject {
    id: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rotation: number;
    type: string;
    content: Content;
    draggable: boolean = true;
    changing = false;
    redoing = false;
    static defaultBackgroundColor: string = "#ccc"
    static notRecordedParams: Array<string> = ['draggable','changing','redoing', 'clientState']
    background_color: string
}
