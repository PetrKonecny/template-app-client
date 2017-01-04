import {Template} from '../template/template';
import {Content} from '../content/content';

export class TemplateInstance {
  id: number;
  name: string;
  template: Template;
  template_id: number;
  contents: Content[];
}