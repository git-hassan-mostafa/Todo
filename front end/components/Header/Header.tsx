import React, { useState } from 'react'
import HeaderComponent from '../../app/Built-In Compoents/Header/HeaderComponent'
import Image from 'next/image'
import Search from '../SVG/Search'
import Circule from '../SVG/Circule'
import s from './Header.module.css'
import { useRouter } from 'next/navigation'
import { useUser } from '../context'
export default function Header() {


  const { setShowAddTodo, setShowUser, showAddTodo, setIsTodosLoading, setSearchTodos , search , setSearch } = useUser()
  const [IsfirstRender, setIsFirstRender] = useState(true)
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState<string | null>("");

  const router = useRouter()

  const handleShowAddTodo = () => {
    if (!showAddTodo) router.replace('/#add-todo')
    setShowAddTodo(prev => !prev)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // useEffect(() => {
  //   if (IsfirstRender) {
  //     setIsFirstRender(false)
  //     return
  //   }
  //   const timeoutId = setTimeout(() => {
  //     (async function () {
  //       setIsTodosLoading(true)
  //       const res = await fetch(`${host}/Todo/search-todos?searchTerm=${search}`)
  //       const data = await res.json();
  //       if (res.ok)
  //         if (data) {
  //           console.log(data)
  //           setSearchTodos(data)
  //         }
  //       setIsTodosLoading(false)
  //     })()
  //     setDebouncedSearchValue(search);
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [search, 1000]);
  return (
    <HeaderComponent
      className={s.header}
      iconBar={{
        gap: undefined,
        elements: <Image width={100} src={require('../../public/Logo/Logo.png')} alt={''} />
      }} navigationBar={{
        gap: undefined,
        elements: undefined
      }} featuresBar={{
        gap: 30,
        elements: <>
          <div className={s['search-container']}>
            <div className={s['search-icon']}> <Search />  </div>
            <input onChange={handleSearchChange} value={search as string} placeholder='What are you looking for?' className={s['search-input']} />

          </div>
          <div onClick={handleShowAddTodo}>
            <Circule />
          </div>

          <Image onClick={() => setShowUser(prev => !prev)} width={40} height={40} className={s.profile} src={require('../../public/profile/Bitmap.png')} alt={''} />
        </>
      }} />
  )
}
