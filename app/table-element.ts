import {Font} from './font';
import {Element} from './element'

export class TableElement extends Element {
    font_size: number;
    max_text_length: number;
    type: string = 'table_element';
    font: Font;
    table_width: number;
    table_height: number;
    row_height: number;
    
}