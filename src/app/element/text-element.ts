import {Font} from '../font/font';
import {Element} from './element'

export class TextElement extends Element {
    font_size: number;
    max_text_length: number;
    type: string = 'text_element';
    font: Font;
    text_align: string;
    text_align_vertical: string;
    static defaultTextColor: string = "#000"
    text_color: string
}