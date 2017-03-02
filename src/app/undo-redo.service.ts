import {Injectable} from '@angular/core';

export interface Command{

	execute()
	unExecute()

}


export interface BufferCommand extends Command{

	getStoredState(): any
	setStoredState(state: any)
}

@Injectable()
export class UndoRedoService{

	private undos: Command[] = new Array
	private redos: Command[] = new Array
	private buffer: BufferCommand[]

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

	addToBufferAndExecute(command: BufferCommand){
		if(!this.buffer){
			this.buffer = new Array
		}
		command.execute()
		this.buffer.push(command)
	}

	saveBuffer(){
		if(this.buffer){
			let first = this.buffer[0]
			let last = this.buffer[this.buffer.length -1]
			if(this.buffer.length > 1 && first.constructor == last.constructor) {
				last.setStoredState(first.getStoredState())
				this.undos.push(last)
				this.redos = []
			}
			this.buffer = null
		}
	}


}