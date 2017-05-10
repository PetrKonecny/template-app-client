import {ImageContent,SetImage, ChangeImageContentDimensions} from './image-content'
import {Image} from '../image/image'

describe('element commands tests',()=>{

	let content
	beforeEach(() => { 
    	content =  new ImageContent()
  })

  it('should set image',()=>{
    let image = new Image()
    image.id = 42
    let command = new SetImage(content,image)
    command.execute()
    expect(content.image.id).toBe(42)
  })


  it('should reverse set image',()=>{
    let image = new Image()
    image.id = 42
    let command = new SetImage(content,image)
    command.execute()
    command.unExecute()
    expect(content.image).toBeFalsy()
  })

  it('should change image content dimensions',()=>{
    content.left = 100
    content.top = 100
    content.width = 100
    content.height = 100
    let command = new ChangeImageContentDimensions(content,{left:200,top:300,width:100,height:100})
    command.execute()
    expect([content.left,content.top,content.width,content.height]).toEqual([300,400,200,200])
  })

  it('should reverse change image content dimensions',()=>{
    content.left = 100
    content.top = 100
    content.width = 100
    content.height = 100
    let command = new ChangeImageContentDimensions(content,{left:200,top:300,width:100,height:100})
    command.execute()
    command.unExecute()
    expect([content.left,content.top,content.width,content.height]).toEqual([100,100,100,100])
  })

})