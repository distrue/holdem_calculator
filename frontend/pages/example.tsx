import * as React from 'react';
import {Component} from 'react';
import TodoList, {Todo} from '../store';
import { observer } from "mobx-react"

interface TodoListView extends Component {
    props: any;
}
@observer
class TodoListView extends Component {
    render() {
        return (
            <div>
                <ul>
                    {this.props.todoList.todos.map(todo => (
                        <TodoView todo={todo} key={todo.id} />
                    ))}
                </ul>
                Tasks left: {this.props.todoList.unfinishedTodoCount}
            </div>
        )
    }
}

const TodoView = observer(({ todo }) => (
    <li>
        <input
            type="checkbox"
            checked={todo.finished}
            onClick={() => (todo.finished = !todo.finished)}
        />
        {todo.title}
    </li>
))

const store = new TodoList();

export default () => {
    return (<>
        <button onClick={e => store.todos.push(new Todo("Get Coffee"), new Todo("Write simpler code"))}/>
        <TodoListView todoList={store} />
    </>);
}