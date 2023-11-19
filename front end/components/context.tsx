import { deleteUserFromLocalStorage, getUserFromLocalStorage } from '@/app/Utils/utils';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { host } from '@/app/Utils/constants';

// Define the user type
export interface User {
    username: string,
    password: string,
}

export interface StatusImportance {
    id: number,
    name: string
}

export interface Todo {
    category: string | null
    dueDate: string
    estimate: string | null
    id?: number
    importanceID: number
    statusID: number
    title: string,
    userID:1
}

// Define the context type
interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    showUser: boolean,
    setShowUser: React.Dispatch<React.SetStateAction<boolean>>
    showAddTodo: boolean,
    setShowAddTodo: React.Dispatch<React.SetStateAction<boolean>>
    showQuote: boolean,
    setShowQuote: React.Dispatch<React.SetStateAction<boolean>>
    search: string 
    setSearch: React.Dispatch<React.SetStateAction<string>>
    statuses: StatusImportance[] | null
    setStatuses: React.Dispatch<React.SetStateAction<StatusImportance[] | null>>
    importances: StatusImportance[] | null
    setImportances: React.Dispatch<React.SetStateAction<StatusImportance[] | null>>
    todos: Todo[] | null,
    setTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>
    searchTodos: Todo[] | null,
    setSearchTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>
    isTodosLoading:boolean,
    setIsTodosLoading:React.Dispatch<React.SetStateAction<boolean>>,
    handleLogoutClick:()=>void
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const { push } = useRouter()

    const [showUser, setShowUser] = useState(false)

    const [showQuote, setShowQuote] = useState(true)

    const [statuses, setStatuses] = useState<StatusImportance[] | null>(null)

    const [importances, setImportances] = useState<StatusImportance[] | null>(null)

    const [todos, setTodos] = useState<Todo[] | null>(null)

    const [searchTodos , setSearchTodos] = useState<Todo[] | null>(null)

    const [showAddTodo, setShowAddTodo] = useState(false)

    const [isTodosLoading , setIsTodosLoading] = useState(false)

    const [search , setSearch] = useState("")
    
    const handleLogoutClick = () => {
        deleteUserFromLocalStorage('user')
        setUser(null)
    }

    useEffect(() => {
        (
            async function () {
                setIsTodosLoading(true)
                const ress = await fetch(`${host}/Todo/Statuses`)
                const datas = await ress.json()
                setStatuses(datas)
                const rest = await fetch(`${host}/Todo`)
                const datat = await rest.json()
                setTodos(datat)
                const resi = await fetch(`${host}/Todo/Importances`)
                const datai = await resi.json()
                setImportances(datai)
                setIsTodosLoading(false)
            }
        )();
    }, [])
    useEffect(() => {
        setUser(getUserFromLocalStorage('user'))
    }, [])

    useEffect(() => {
        if (user) push('/')
        else push('/login')
    }, [user])

    const contextValue: UserContextType = {
        user,
        setUser,
        showUser,
        setShowUser,
        showAddTodo,
        setShowAddTodo,
        showQuote,
        setShowQuote,
        statuses,
        setStatuses,
        importances,
        setImportances,
        todos,
        setTodos,
        searchTodos,
        setSearchTodos,
        handleLogoutClick,
        isTodosLoading,
        setIsTodosLoading,
        search,
        setSearch
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
