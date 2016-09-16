import {Template} from './template';
import {Content} from './content';

export class TemplateInstance {
  id: number;
  name: string;
  template: Template;
  template_id: number;
  contents: Content[];
}