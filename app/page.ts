import {Element} from './element';
import {Guide} from './guide'

export class Page {
  id: number;
  elements: Element[];
  rulers: Guide[];
  size: number;
  pageNumber: number;
  
}