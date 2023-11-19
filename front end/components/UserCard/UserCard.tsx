import s from './UserCard.module.css'
import Image from 'next/image'
import { useUser } from '../context'
import Logout from '../SVG/Logout'
export default function UserCard() {

    const {setShowUser , user , handleLogoutClick} = useUser()
  return (
    <div className={s.user} onClick={() => setShowUser(false)}>
                    <Image className={s['profile-image']} src={require("../../public/profile/Bitmap.png")} alt={''} />
                    <div className={s['user-info']}>
                        <span > {user?.username} </span>
                        <span onClick={handleLogoutClick} style={{ display: 'flex', gap: '10px' }}>
                            Logout <Logout />
                        </span>
                    </div>
                </div>
  )
}
