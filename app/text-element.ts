import {Font} from './font';
import {Element} from './element'

export class TextElement extends Element {
    fontSize: number;
    maxTextLength: number;
    type: string = 'text_element';
    font: Font;
}