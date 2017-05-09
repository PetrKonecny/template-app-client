import {TableElement, Row, Cell, AddRowAbove,AddRowBelow,AddColumnLeft,AddColumnRight,DeleteRow,DeleteColumn,mergeSCells,changeSCellsBold,changeSCellsItalic,changeSCellsParam,ChangeSCellsFont} from './table-element'
import {Font} from '../font/font'

describe('table element commands',()=>{

	let element
	let selectedCells

	beforeEach(() => {
		element = new TableElement()
		let row1 = new Row()
		let cell1 = new Cell()
		cell1.position =  {x:0,y:0}
		let cell2 = new Cell()
		cell2.position =  {x:1,y:0}
		let cell3 = new Cell()
		cell3.position =  {x:0,y:1}
		let cell4 = new Cell()
		cell4.position =  {x:1,y:1}
		row1.cells = [cell1,cell2]
		let row2 = new Row()
		row2.cells = [cell3,cell4]
		element.content = {rows: [{cells :[{text :'A'},{text : 'B'}]},{cells: [{text :'C'},{text : 'D'}]}]} 
		element.rows = [row1,row2]
    	
  	})

  	it('should add row above',()=>{
  		let commands = new AddRowAbove(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows.length).toBe(3)
  	})

  	it('should reverse add row above',()=>{
  		let commands = new AddRowAbove(element,element.rows[0].cells[0]) 
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows.length).toBe(2)
  	})
  	it('should add row below',()=>{
  		let commands = new AddRowBelow(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows.length).toBe(3) 		
  	})

  	it('should reverse add row below',()=>{
  		let commands = new AddRowBelow(element,element.rows[0].cells[0]) 
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows.length).toBe(2)		
  	})

  	it('should add column left',()=>{
  		let commands = new AddColumnLeft(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows[0].cells.length).toBe(3)
  	})

  	it('should reverse add column left',()=>{
  		let commands = new AddColumnLeft(element,element.rows[0].cells[0]) 
  		commands.execute()
  		 commands.unExecute()
  		expect(element.rows[0].cells.length).toBe(2)
  	})

  	it('should add column right',()=>{
  		let commands = new AddColumnRight(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows[0].cells.length).toBe(3)
  	})

  	it('should reverse add column right',()=>{
  		let commands = new AddColumnRight(element,element.rows[0].cells[0]) 
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells.length).toBe(2)	
  	})

  	it('should delete row',()=>{
  		let commands = new DeleteRow(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows.length).toBe(1)	
  	})

  	it('should reverse delete row',()=>{
  		let commands = new DeleteRow(element,element.rows[0].cells[0]) 
  		commands.execute()
  		 commands.unExecute()
  		expect(element.rows.length).toBe(2)	
  	})

  	it('should delete column',()=>{
  		let commands = new DeleteColumn(element,element.rows[0].cells[0]) 
  		commands.execute()
  		expect(element.rows[0].cells.length).toBe(1)
  	})

  	it('should reverse delete column',()=>{
  		let commands = new DeleteColumn(element,element.rows[0].cells[0]) 
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells.length).toBe(2)		
  	})

  	it('should merge cells',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new mergeSCells(element)
  		commands.execute()
  		expect(element.rows[0].cells.length).toBe(1)
  		expect(element.rows[0].cells[0].colspan).toBe(2)
  	})

  	it('should reverse merge cells',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new mergeSCells(element)
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells.length).toBe(2)
  	})

  	it('should change cells bold',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsBold(element)
  		commands.execute()
  		expect(element.rows[0].cells[1].bold).toBe(true)
  	})

  	it('should reverse change cells bold',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsBold(element)
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells[1].bold).toBeFalsy()
  	})

  	it('should change cells italic',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsItalic(element)
  		commands.execute()
  		expect(element.rows[0].cells[1].italic).toBe(true)
  	})

  	it('should reverse change cells italic',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsItalic(element)
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells[1].italic).toBeFalsy()		
  	})

  	it('should change cells font',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let font = new Font
  		font.id = 1
  		let commands = new ChangeSCellsFont(element,font)
  		commands.execute()
  		expect(element.rows[0].cells[1].font.id).toBe(1)
  		
  	})

  	/*
  	it('should reverse change cells font',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let font = new Font
  		font.id = 1
  		let commands = new ChangeSCellsFont(element,font)
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells[1].font).toBeFalsy()
  	})
  	*/

  	it('should change cells params',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsParam(element,'width', 140)
  		commands.execute()
  		expect(element.rows[0].cells[1].width).toBe(140)
  	})

  	it('should reverse change cells params',()=>{
  		element.selectedCells = [element.rows[0].cells[0],element.rows[0].cells[1]]
  		element.selectionWidth = 2
  		element.selectionHeight = 1
  		let commands = new changeSCellsParam(element,'width', 140)
  		commands.execute()
  		commands.unExecute()
  		expect(element.rows[0].cells[1].width).toBeFalsy()
  	})

})