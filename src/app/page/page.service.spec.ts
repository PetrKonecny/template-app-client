
import { PageService } from './page.service'
import {Element } from '../element/element'
import {Page } from './page'
import {Guide} from '../guide/guide'
import { ElementDimensions, Border} from '../resizable.directive'

describe('Page service move test', () => {
  let service: PageService
  let element: Element
  let page: Page
  let guides: Guide[]
  beforeEach(() => { 
  	element = new Element
  	element.positionX = 0
  	element.positionY = 0
  	element.width = 50
  	element.height = 50
  	page = new Page
  	guides = []
  	service = new PageService
  })

  //Basoc tests that it moves

  it('should throw error on undefined params', ()=>{
  	expect(()=>{service.move(null,null,null,null)}).toThrow() 
  })

  it('should return 0,0 vector when given 0,0 movement vector ',()=>{
  	let movement = service.move(element,{left: 0, top: 0},page,guides)
  	expect(movement.left).toEqual(0)
  	expect(movement.top).toEqual(0)
  })

 it('should return 10,0 vector when given 10,0 vector ',()=>{
  	let movement = service.move(element,{left: 10, top: 0},page,guides)
  	expect(movement.left).toEqual(10)
  	expect(movement.top).toEqual(0)
  })

 it('should return 0,10 vector when given 0,10 vector ',()=>{
  	let movement = service.move(element,{left: 0, top: 10},page,guides)
  	expect(movement.left).toEqual(0)
  	expect(movement.top).toEqual(10)
  })

 it('should return 10,10 vector when given 10,10 vector ',()=>{
  	let movement = service.move(element,{left: 10, top: 10},page,guides)
  	expect(movement.left).toEqual(10)
  	expect(movement.top).toEqual(10)
  })

 it('should return -10,-10 vector when given -10,-10 vector ',()=>{
  	let movement = service.move(element,{left: -10, top: -10},page,guides)
  	expect(movement.left).toEqual(-10)
  	expect(movement.top).toEqual(-10)
  })

 //More complicacted tests that the guides funcionality works as expected

 
 it('should create guide object if sticking',()=>{
 	addNewElement(200,1000,75,125)
  	service.move(element,{left: 205, top: 0},page,guides)
  	expect(guides[0].positionX).toEqual(200)
 })

 it('should create two guide objects when sticking to two pararel edges',()=>{
 	addNewElement(200,1000,50,50)
  	service.move(element,{left: 205, top: 0},page,guides)
  	expect(guides.length).toEqual(2)
  	expect(guides[1].positionX).toEqual(200)
  	expect(guides[0].positionX).toEqual(250)
 })

 it('should create two guides if sticking to two perpendicular edges',()=>{
 	addNewElement(200,200,100,100)
	let movement = service.move(element,{left: 205, top: 205},page,guides)
	expect(guides.length).toEqual(2)
 })

 it('should break only in one dimension if threshold not broken in one',()=>{
 	addNewElement(200,200,100,100)
  	let movement = service.move(element,{left: 205, top: 205},page,guides)
  	element.positionX = movement.left
  	element.positionY = movement.top
  	//now stuck to two edges\
  	movement = service.move(element,{left:30,top:5},page,guides)
  	expect(movement.left).toEqual(30)
  	expect(movement.top).toEqual(0)
 })

 it('should break in both dimensions if threshold broken in both',()=>{
 	addNewElement(200,200,100,100)
  	let movement = service.move(element,{left: 205, top: 205},page,guides)
  	element.positionX = movement.left
  	element.positionY = movement.top
  	//now stuck to two edges\
  	movement = service.move(element,{left:30,top:30},page,guides)
  	expect(movement.left).toEqual(30)
  	expect(movement.top).toEqual(30)
 })


 it('should stick x when in sticking range x',()=>{
  	addNewElement(200,1000,50,50)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	expect(movement.left).toEqual(200)
  	expect(movement.top).toEqual(0)
 })

 it('should stick y when in sticking range y ',()=>{
 	addNewElement(1000,200,50,50)
  	let movement = service.move(element,{left: 0, top: 205},page,guides)
  	expect(movement.top).toEqual(200)
  	expect(movement.left).toEqual(0)
 })

 it('should stick x and y when in sticking ranges x and y',()=>{
 	addNewElement(200,200,100,100)
	let movement = service.move(element,{left: 205, top: 205},page,guides)
	expect(movement.top).toEqual(200)
	expect(movement.left).toEqual(200)
 })

 it('should not mova after sticking to guide unless moved over the threshhold',()=>{
	addNewElement(200,1000,175,75)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 10, top: 0},page,guides)
	expect(movement.left).toEqual(0)
 })

 it('should move again if threshhold is broken',()=>{
	addNewElement(200,1000,25,75)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 25, top: 0},page,guides)
	expect(movement.left).toEqual(25)
 })

 it('should not mova after sticking to two guides unless moved over the threshhold',()=>{
	addNewElement(200,1000,75,25)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 25, top: 0},page,guides)
	expect(movement.left).toEqual(25)
 })

 it('should stick by left edge if left edge is in sticking range',()=>{
 	addNewElement(200,1000,75,25)
 	let movement = service.move(element,{left: 155,top: 0},page,guides)
 	expect(movement.left).toEqual(150)
 })

 it('should stick by right edge if right edge is in sticking range',()=>{
 	addNewElement(200,1000,75,25)
 	let movement = service.move(element,{left: 270,top: 0},page,guides)
 	expect(movement.left).toEqual(275)
 })

 it('should be able to break with negatives',()=>{
 	addNewElement(200,1000,25,75)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: -25, top: 0},page,guides)
	expect(movement.left).toEqual(-25)
 })

 function addNewElement(x,y,width,height){
 	let element2 = new Element
 	element2.positionX = x
 	element2.positionY = y
 	element2.width = width
 	element2.height = height
 	page.elements = []
 	page.elements.push(element2)
 }
})

describe('Page service resize test', () => {
  let service: PageService
  let element: Element
  let page: Page
  let guides: Guide[]
  beforeEach(() => { 
  	element = new Element
  	element.positionX = 0
  	element.positionY = 0
  	element.width = 50
  	element.height = 50
  	page = new Page
  	guides = []
  	service = new PageService
  })

  it('should be able to resize element width',()=>{
  	let transform = service.resize(element,{width:10,height:0},page,guides)
  	expect(transform.height).toEqual(0)
  	expect(transform.width).toEqual(10)
  })

  it('should be able to resize element height',()=>{
  	let transform = service.resize(element,{width:0,height:10},page,guides)
  	expect(transform.height).toEqual(10)
  	expect(transform.width).toEqual(0)
  })

  it('should be able to resize width and height',()=>{
  	let transform = service.resize(element,{width:10,height:10},page,guides)
  	expect(transform.height).toEqual(10)
  	expect(transform.width).toEqual(10)
  })

  it('should stick when resized width into stick range',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:0},page,guides)
  	expect(transform.width).toEqual(150)
  })

  it('should stick when resized height into stick range',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:0,height:155},page,guides)
  	expect(transform.height).toEqual(150)
  })

  it('should stick at both when resized into both',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:155},page,guides)
  	expect(transform.height).toEqual(150)	
  	expect(transform.width).toEqual(150)	
  })

  it('should unstick when resized over threshhold',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:0},page,guides)
  	element.width = transform.width
  	element.height = transform.height
  	transform = service.resize(element,{width:25,height:0},page,guides)
  	expect(transform.width).toEqual(25)
  	expect(transform.height).toEqual(0)
  })

  it('should unstick one when resized over threshhold',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:155},page,guides)
  	element.width = transform.width
  	element.height = transform.height
  	transform = service.resize(element,{width:25,height:10},page,guides)
  	expect(transform.width).toEqual(25)
  	expect(transform.height).toEqual(0)
  })

  it('should unstick both when resized over threshhold',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:155},page,guides)
  	element.width = transform.width
  	element.height = transform.height
  	transform = service.resize(element,{width:25,height:30},page,guides)
  	expect(transform.width).toEqual(25)
  	expect(transform.height).toEqual(30)
  })

  it('should create one guide when resized into sticky range',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:0},page,guides)
  	expect(guides.length).toEqual(1)
  })

  it('should create two guides when resized into sticky range of both',()=>{
  	addNewElement(200,200,50,50)
  	let transform = service.resize(element,{width:155,height:155},page,guides)
  	expect(guides.length).toEqual(2)	
  })

  it('should resize and shift element instead of shrinking when given negative vaule if a left border is given',()=>{
  	element.positionX = 100
  	element.positionY = 100
  	let transform = service.resize(element,{width:-50,height:0},page,guides,{reverseWidth: true})
  	expect(transform.left).toEqual(-50)
  	expect(transform.width).toEqual(50)
  })

  it('should resize and shift element instead of expanding when given positive value if a left border is given',()=>{
  	element.positionX = 100
  	element.positionY = 100
  	let transform = service.resize(element,{width:50,height:0},page,guides,{reverseWidth: true})
  	expect(transform.left).toEqual(50)
  	expect(transform.width).toEqual(-50)
  })

  it('should resize and shift element instead of normal behaviour when given left border',()=>{
    element.positionX = 100
    element.positionY = 100
    let transform = service.resize(element,{width:-50,height:-50},page,guides,{reverseWidth: true, reverseHeight: true})
    expect(transform.left).toEqual(-50)
    expect(transform.top).toEqual(-50)
    expect(transform.width).toEqual(50)
    expect(transform.height).toEqual(50)
  })

  it('should stick even if resizing from left border',()=>{
  	let element2 = addNewElement(100,1000,50,50)
  	page.elements.push(element)
  	let transform = service.resize(element2,{width:-55,height:0},page,guides,{reverseWidth: true})
  	expect(transform.left).toEqual(-50)
  	expect(transform.width).toEqual(50)
  })

  it('should break on the proper side if resizing from sticky left border',()=>{
  	let element2 = addNewElement(100,1000,50,50)
  	page.elements.push(element)
  	let transform = service.resize(element2,{width:-55,height:0},page,guides,{reverseWidth: true})
  	element.width = transform.width
  	element.positionX = transform.left
  	//this should stick
  	transform = service.resize(element2,{width:-15,height:0},page,guides,{reverseWidth: true})
  	expect(transform.left+1).toEqual(1)
  	expect(transform.width+1).toEqual(1)
  	//this should not
  	transform = service.resize(element2,{width:-30,height:0},page,guides,{reverseWidth: true})
  	expect(transform.left).toEqual(-45)
  	expect(transform.width).toEqual(45)
  })

  it('should filter given edges',()=>{
    let element2 = addNewElement(1000,1000,50,50)
    let transform = service.resize(element,{width:155,height:155},page,guides,{filterThesePositions:[{x:1000}, {y:1000}]})
    expect(service.verticals.length).toEqual(0)
    expect(service.horizontals.length).toEqual(0)
  })

 function addNewElement(x,y,width,height){
 	let element2 = new Element
 	element2.positionX = x
 	element2.positionY = y
 	element2.width = width
 	element2.height = height
 	page.elements = []
 	page.elements.push(element2)
 	return element2
 }
})