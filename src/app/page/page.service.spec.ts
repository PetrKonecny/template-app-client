
import { PageService } from './page.service'
import {Element } from '../element/element'
import {Page } from './page'
import {Guide} from '../guide/guide'

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

  it('true is true', () => expect(true).toBe(true))

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

 
 it('should create guide object on left edge if in range',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 75
 	element2.height = 125
 	page.elements = []
 	page.elements.push(element2)
  	service.move(element,{left: 205, top: 0},page,guides)
  	expect(guides[0].positionX).toEqual(200)
 })

 it('should create two guide objects if two oposite edges are in range at the same time',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 50
 	element2.height = 50
 	page.elements = []
 	page.elements.push(element2)
  	service.move(element,{left: 205, top: 0},page,guides)
  	expect(guides.length).toEqual(2)
  	expect(guides[1].positionX).toEqual(200)
  	expect(guides[0].positionX).toEqual(250)
 })


 it('should return position x when given vector ending within 10 of another element with x = position x ',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 50
 	element2.height = 50
 	page.elements = []
 	page.elements.push(element2)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	expect(movement.left).toEqual(200)
  	expect(movement.top).toEqual(0)
 })

 it('should return position y when given vector ending within 10 of another element with y = position y ',()=>{
 	let element2 = new Element
 	element2.positionX = 1000
 	element2.positionY = 200
 	element2.width = 50
 	element2.height = 50
 	page.elements = []
 	page.elements.push(element2)
  	let movement = service.move(element,{left: 0, top: 205},page,guides)
  	expect(movement.top).toEqual(200)
  	expect(movement.left).toEqual(0)
 })

 it('should return position x and y when vector ending withing 10 of another element with y = position x and y = position y',()=>{
	let element2 = new Element
	element2.positionX = 200
	element2.positionY = 200
	element2.width = 50
	element2.height = 50
	page.elements = []
	page.elements.push(element2)
	let movement = service.move(element,{left: 205, top: 205},page,guides)
	expect(movement.top).toEqual(200)
	expect(movement.left).toEqual(200)
 })

 it('should not mova after geting stuck on guide unless moved over the threshhold',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 175
 	element2.height = 75
 	page.elements = []
 	page.elements.push(element2)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 10, top: 0},page,guides)
	expect(movement.left).toEqual(0)
 })

 it('should move again if threshhold is broken',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 25
 	element2.height = 75
 	page.elements = []
 	page.elements.push(element2)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 25, top: 0},page,guides)
	expect(movement.left).toEqual(25)
 })

 it('should not mova after geting stuck on two guides unless moved over the threshhold',()=>{
 	let element2 = new Element
 	element2.positionX = 200
 	element2.positionY = 1000
 	element2.width = 75
 	element2.height = 25
 	page.elements = []
 	page.elements.push(element2)
  	let movement = service.move(element,{left: 205, top: 0},page,guides)
  	element.positionX = movement.left
  	//now it is stuckon guide and should not move unless moved more than 20
  	movement = service.move(element,{left: 25, top: 0},page,guides)
	expect(movement.left).toEqual(25)
 })



})