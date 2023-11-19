'use client'

import s from './Home.module.css'
import { useUser } from '../context'
import UserCard from '../UserCard/UserCard'
import Header from '../Header/Header'
import Quote from '../Quote/Quote'
import Todos from '../Todos/Todos'



export default function Home() {

    const {showQuote , showUser , isTodosLoading  } = useUser()


    return (
        <main>
            <Header  />    
            { showQuote && <Quote /> }
            { showUser && <UserCard  />}
            <div className={`${s['space']} ${showQuote ? `${s['space-with-quote']}` : `${s['space-without-quote']}`}`} />
            {isTodosLoading ? <h1 className={s.loading}> Loading...</h1> : <Todos /> }
        </main>
    )
}
