import {Font} from './font';
import {Element} from './element'

export class TextElement extends Element {
    font_size: number;
    max_text_length: number;
    type: string = 'text_element';
    font: Font;
}