import {Content} from './content';
import {Editor} from '../editor/editor'
export class TextContent extends Content {
    text: string
    type: string = "text_content";
    editor: Editor
}

