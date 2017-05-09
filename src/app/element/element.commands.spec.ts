import {Element,ChangeElementDimensions, ChangeElementOpacity, SetElementDimensions, ChangeBackgroundColor} from './element'

describe('element commands tests',()=>{

	let element
	beforeEach(() => { 
    	element = new Element()
   		element.positionX = 0;
   		element.positionY = 50;
   		element.width = 100;
   		element.height = 100;
  	})

  	it('should change element dimensions',()=>{
  		let command = new ChangeElementDimensions(element,{left: 20,top:-10,width:20,height:30})
  		command.execute()
  		expect([element.positionX,element.positionY,element.width,element.height]).toEqual([20,40,120,130])
  	})

  	it ('should reverse element dimensions',()=>{
  		let command = new ChangeElementDimensions(element,{left: 20,top:30,width:20,height:30})
  		command.execute()
  		command.unExecute()
  		expect([element.positionX,element.positionY,element.width,element.height]).toEqual([0,50,100,100])
  	})

  	it ('should set element dimensions',()=>{
  		let command = new SetElementDimensions(element,{left:0,top:-100,width:200,height:300})
  		command.execute()
  		expect([element.positionX,element.positionY,element.width,element.height]).toEqual([0,-100,200,300])
  	})

  	it ('should reverse set element dimensions',()=>{
  		let command = new SetElementDimensions(element,{left:0,top:-100,width:200,height:300})
  		command.execute()
  		command.unExecute()
  		expect([element.positionX,element.positionY,element.width,element.height]).toEqual([0,50,100,100])
  	})

  	it ('should change element opacity',()=>{
  		let command = new ChangeElementOpacity(element,50)
  		command.execute()
  		expect(element.opacity).toBe(50)
  	})

  	it ('should reverse change element opacity',()=>{
  		let command = new ChangeElementOpacity(element,50)
  		command.execute()
  		command.unExecute()
  		expect(element.opacity).toBe(100)
  	})

  	it ('should change element background color',()=>{
  		let command = new ChangeBackgroundColor(element,"blue")
  		command.execute()
  		expect(element.background_color).toBe("blue")
  	})

  	it ('should reverse change element background color',()=>{
  		element.background_color = "red"
  		let command = new ChangeBackgroundColor(element,"blue")
  		command.execute()
  		command.unExecute()
  		expect(element.background_color).toBe("red")
  	})
})