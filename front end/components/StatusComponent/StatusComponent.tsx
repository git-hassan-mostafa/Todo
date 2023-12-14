import React from 'react'
import { StatusImportance, useUser } from '../context'
import s from './StatusComponent.module.css'
import Flex from '@/app/Built-In Compoents/Flex/Flex'
import TodoCard from '../TodoCard/TodoCard'
import TodoCardAdd from '../TodoCardAdd/TodoCardAdd'
import Todo from '../SVG/Todo'
import Doing from '../SVG/Doing'
import Done from '../SVG/Done'
import { Todo as TodoType } from '../context'
import { fetchData } from '@/app/Utils/utils'
import { host } from '@/app/Utils/constants'
export default function StatusComponent({ status }: { status: StatusImportance }) {
    const { statuses, showQuote, todos, importances, showAddTodo, setShowQuote , setTodos , setIsTodosLoading } = useUser()
    const statusIcons = [<Todo />, <Doing />, <Done />]

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedTodo = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(droppedTodo, status.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };


    const onDrop = async (droppedTodo: TodoType, newStatusId: number) => {
        const updatedTodoList = await Promise.all(todos?.map(async (todo) => {
            if (todo.id === droppedTodo.id) {
                if(todo.statusID===newStatusId) return todo
                const data = await fetchData<{ statusID: number | null }>(`${host}/Todo/${todo.id}`, { statusID: newStatusId }, 'PUT');
                if (data) console.log('estimate updated successfully');
                return { ...todo, statusID: newStatusId };
            }
            return todo;
        }) || []);
        // Now updatedTodoList contains the updated todos
        setTodos(updatedTodoList)
        console.log(updatedTodoList);
    };
    

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={s.todos} key={status.id}>
            <h1 className={`${s['status-name']} ${showQuote ? `${s['status-name-with-quote']}` : `${s['status-name-without-quote']}`}`}> {statusIcons[status.id - 1]}  {status.name} </h1>
            <Flex properties={{ gap: 20, flexDirection: 'column' }} >
                {
                    todos?.filter(todo => todo.statusID === status.id).map(todo => (
                        <TodoCard key={todo.id} todo={todo} />
                    ))
                }
                {status.id === 1 && showAddTodo &&
                 <div id='add-todo'>
                    <TodoCardAdd />
                </div>
                }
            </Flex>
        </div>
    )
}
