import { useEffect, useMemo, useRef, useState } from 'react'
import { User } from './types';
import './App.css'
import { UserLists } from './components/UserList';

const fetchUsers = (page:number) => {
  return fetch(`https://randomuser.me/api/?page=${page}&results=10&seed=foobar`)
  .then(resp=>{
    if(!resp.ok) throw new Error('Error en la petición');
    return resp.json()
  })
  .then(res => res.results)
  
}

function App() {

  const [user, setUser] = useState<User[]>([])
  const [showColor, setShowColor] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const toogleColors = () =>{
    setShowColor(!showColor)
  }

  const toogleSortByCountry = () =>{
    setSortByCountry(prevState => !prevState) 
  }

  const handleReset = () => {
    setUser(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = user.filter((user) => user.email != email)
    setUser(filteredUsers)
  }

  useEffect(()=> {
    setLoading(true)
    setError(false)

    fetchUsers(currentPage) .then(users =>{
      setUser(prevUsers => prevUsers.concat(users))
      originalUsers.current = users
    })
    .catch(error => {
      setError(error)
      console.error(error)
    }).finally(() => {
      setLoading(false)
    });
  }, [currentPage])

  const filteredUsers = useMemo(()=>{
    return typeof filterCountry === 'string' && filterCountry.length > 0 
    ? user.filter(user => {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    }) : user
        
  },[user, filterCountry]) 

  const sortedUsers = useMemo(()=>{
    return sortByCountry ? filteredUsers.sort((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    }) 
    : filteredUsers
  }, [filteredUsers, sortByCountry]); 

  return (
    <>
      <header>
        <button onClick={toogleColors}>Colorear filas</button>
        <button onClick={toogleSortByCountry}>{sortByCountry ? 'NO ordenar por País' : 'Ordenar por País'}</button>
        <button onClick={handleReset}>Resetear usuarios</button>

        <input placeholder='Filtra por país' onChange={(e)=>{setFilterCountry(e.target.value)}}/>
      </header>
      <main>
        { user.length > 0 && 
          <UserLists deleteUser={handleDelete} showColors={showColor} users={sortedUsers}></UserLists>
        }
        {loading && <p> Cargando ... </p>}
        {!loading && error && <p> Ha habido un error </p>}
        {!loading && !error && user.length === 0 && <p> No hay usuarios </p>}
        {!loading && !error && user.length > 0 && <button onClick={() => setCurrentPage(currentPage+1)}>Cargar más resultados</button>}
      </main>
    </>
  )
}

export default App
