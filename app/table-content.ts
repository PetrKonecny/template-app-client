import {Content} from './content'

export class TableContent extends Content {
    type: string = 'table_content';
    rows: Array<RowContent>;
}

export class RowContent{
    cells: Array<CellContent>
}

export class CellContent{
    text: string
}