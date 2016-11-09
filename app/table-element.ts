import {Font} from './font';
import {Element} from './element'

export class TableElement extends Element {
    font_size: number;
    type: string = 'table_element';
    font: Font;
    rows: Array<Row>;
    cells: Array<Cell>;  
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