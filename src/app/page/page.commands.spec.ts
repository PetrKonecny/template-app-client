
import { Page, AddElement, RemoveElement, BringElementForward, PushElementBack } from './page'
import { TextElement } from '../element/text-element'

describe('page commands test', () => {
  
  let page
  beforeEach(() => { 
    	page = new Page
      page.elements = [{id:1},{id:2},{id:3}]
  })

  it('should add element',()=>{
      let element = new TextElement()
      element.id = 4
      let command = new AddElement(page,element)
      command.execute()
      expect(page.elements.length).toBe(4)
  })

  it('should reverse add element',()=>{
      let element = new TextElement()
      element.id = 4
      let command = new AddElement(page,element)
      command.execute()
      command.unExecute()
      expect(page.elements.length).toBe(3)
  })

  it('should remove element',()=>{
      let command = new RemoveElement(page,page.elements[0])
      command.execute()
      expect(page.elements.length).toBe(2)
  })

  it('should reverse add element',()=>{
      let command = new RemoveElement(page,page.elements[0])
      command.execute()
      command.unExecute()
      expect(page.elements.length).toBe(3)
  })

  it('should bring element forward',()=>{
      let command = new BringElementForward(page,page.elements[1])
      command.execute()
      expect(page.elements[2].id).toBe(2)
  })

  it('should reverse bring element forward',()=>{
      let command = new BringElementForward(page,page.elements[1])
      command.execute()
      command.unExecute()
      expect(page.elements[1].id).toBe(2)
  })

  it('should push element back',()=>{
      let command = new PushElementBack(page,page.elements[1])
      command.execute()
      expect(page.elements[0].id).toBe(2)
  })

  it('should reverse push element back',()=>{
      let command = new PushElementBack(page,page.elements[1])
      command.execute()
      command.unExecute()
      expect(page.elements[1].id).toBe(2)
  })


})