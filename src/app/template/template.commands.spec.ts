
import { Template, AddPageAbovePage, AddPageBelowPage, DeletePage } from './template'
import {Page} from '../page/page'

describe('template commands test', () => {
  
  let template
  let factory
  beforeEach(() => { 
    	template = new Template
      template.pages = [{id:1},{id:2}]
  })

  it('should add page above',()=>{
      let page = new Page()
      page.id = 3
      let command = new AddPageAbovePage(template,template.pages[0],page)
      command.execute()
      expect(template.pages[0].id).toBe(3)
  })

  it('should reverse page add above',()=>{
      let page = new Page()
      page.id = 3
      let command = new AddPageAbovePage(template,template.pages[0],page)
      command.execute()
      command.unExecute()
      expect(template.pages[0].id).toBe(1)
  })

   it('should add page below',()=>{
      let page = new Page()
      page.id = 3
      let command = new AddPageBelowPage(template,template.pages[1],page)
      command.execute()
      expect(template.pages[2].id).toBe(3)
  })

  it('should reverse page add below',()=>{
      let page = new Page()
      page.id = 3
      let command = new AddPageBelowPage(template,template.pages[0],page)
      command.execute()
      command.unExecute()
      expect(template.pages[1].id).toBe(2)
  })

  it('should delete page',()=>{
      let command = new DeletePage(template,template.pages[1])
      command.execute()
      expect(template.pages.length).toBe(1)
  })

  it('should reverse page delete',()=>{
      let command = new DeletePage(template,template.pages[1])
      command.execute()
      command.unExecute()
      expect(template.pages.length).toBe(2)
  })
})