import {Element} from '../element/element';
import {Guide} from '../guide/guide'
import {StateSubject} from '../step-selector'

export class Page implements StateSubject {
  id: number;
  elements: Element[];
  rulers: Guide[];
  size: number;
  pageNumber: number;
  changing: boolean = false
  redoing: boolean = false 
  
}