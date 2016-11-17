import {Font} from './font';
import {Element} from './element'

export class TableElement extends Element {
    font_size: number;
    type: string = 'table_element';
    font: Font;
    default_cell_width: number = 100
    default_row_height: number = 30
    rows: Array<Row>;
    cells: Array<Cell>;
    locked: boolean = true;
    editable: boolean = false;  
}


export class Row{
    height: number
    constructor(height: number){
        this.height = height
    }
}

export class Cell{
    width: number
    constructor(width: number){
        this.width = width
    }
}