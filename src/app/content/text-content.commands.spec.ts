import {TextContent,ChangeText} from './text-content'
import {Image} from '../image/image'

fdescribe('element commands tests',()=>{

	let content
	beforeEach(() => {
    content = new TextContent 
  })

  it('should change text',()=>{
    let command = new ChangeText(content,"hello")
    command.execute()
    expect(content.text).toBe("hello")
  })

  it('should reverse change text',()=>{
    let command = new ChangeText(content,"hello")
    command.execute()
    command.unExecute()
    expect(content.text).toBeFalsy()
  })

})