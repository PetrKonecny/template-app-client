import {Element} from '../element/element';
import {Guide} from '../guide/guide'

export class Page {
  id: number;
  elements: Element[];
  rulers: Guide[];
  size: number;
  pageNumber: number;
  
}