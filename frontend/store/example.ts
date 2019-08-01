import {createContext} from 'react';
import { action, observable, computed } from 'mobx'
import { useStaticRendering } from 'mobx-react'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

export class Todo {
    id = Math.random()
    @observable title = ""
    @observable finished = false

    constructor(props) {
        this.title = props 
    }
}

class TodoList {
    @observable todos = []
    @computed
    get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length
    }
}

type Phase = "preflop"|"flop"|"turn"|"river";
class PlayerLabel {
    @observable name = "";
    @observable now = {phase: "", labelNum:""};
    @observable labelList: {[index in Phase]:string[]} = {"preflop":[], "flop":[], "turn":[], "river":[]};
    // phase: [player labels]
    @computed
    get prefloplist() {
        return this.labelList.preflop.filter(todo => todo)
    }
}
export const playerLabel = createContext(new PlayerLabel());

export default TodoList;
