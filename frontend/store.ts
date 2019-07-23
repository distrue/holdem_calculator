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

export default TodoList;
