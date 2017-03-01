import {Injectable} from '@angular/core';

export interface Command{

	execute()
	unExecute()

}

@Injectable()
export class UndoRedoService{

	private undos: Command[] = new Array
	private redos: Command[] = new Array

	undo(){
		let command = this.undos.pop()
		command.unExecute()
		this.redos.push(command)
	}

	redo(){
		let command = this.redos.pop()
		command.execute()
		this.undos.push(command)
	}

	execute(command: Command){
		command.execute()
		this.redos = []
		this.undos.push(command)
	}


}