import Flex from '../../app/Built-In Compoents/Flex/Flex'
import s from './Todos.module.css'
import ShowQuote from '../SVG/ShowQuote'
import { useUser } from '../context'
import StatusComponent from '../StatusComponent/StatusComponent'

export default function Todos() {

    const {statuses , showQuote ,setShowQuote} = useUser()

    return (
        <Flex properties={{ gap: 30 }} className={s.statuses}>
            {
                statuses?.map(status => (
                    <StatusComponent key={status.id} status={status} />
                ))
            }
            {!showQuote &&<div className={s['show-quote']}>  <span onClick={() => setShowQuote(true)}> <ShowQuote /> </span>  </div> }

        </Flex>
    )
}
