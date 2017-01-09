import {Page} from '../page/page';
import {User} from '../user/user'

export class Template {
  id: number;
  name: string;
  pages: Page[];
  user: User
}