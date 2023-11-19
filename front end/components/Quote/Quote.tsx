import Flex from '../../app/Built-In Compoents/Flex/Flex'
import Close from '../SVG/Close'
import s from './Quote.module.css'
import { useUser } from '../context'
export default function Quote() {

  const {setShowQuote} = useUser()
  return (
    <Flex properties={{ justifyContent: 'space-between' }} className={s.quote}>
                <span> "Anything that can go wrong, will go wrong!" </span>
                <div onClick={()=>setShowQuote(false)}>
                    <Close className={s.close} />
                </div>
                
            </Flex>
  )
}
