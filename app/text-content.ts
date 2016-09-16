import {Content} from './content';

export class TextContent extends Content {
    text: string;
    type: string = "text_content";
}