import { useMemo, useState } from 'react'
import './App.css'
import { UserLists } from './components/UserList';
import { useUsers } from './hooks/useUsers';

function App() {
  
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } = useUsers()

  const [showColor, setShowColor] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toogleColors = () =>{
    setShowColor(!showColor)
  }

  const toogleSortByCountry = () =>{
    setSortByCountry(prevState => !prevState) 
  }

  const handleReset = () => {
    refetch()
  }

  const handleDelete = (email: string) => {
    //const filteredUsers = user.filter((user) => user.email != email)
    //setUser(filteredUsers)
  }

  const filteredUsers = useMemo(()=>{
    return typeof filterCountry === 'string' && filterCountry.length > 0 
    ? users.filter(user => {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    }) : users
        
  },[users, filterCountry]) 

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
        { users.length > 0 && 
          <UserLists deleteUser={handleDelete} showColors={showColor} users={sortedUsers}></UserLists>
        }
        {isLoading && <p> Cargando ... </p>}
        {!isLoading && isError && <p> Ha habido un error </p>}
        {!isLoading && !isError && users.length === 0 && <p> No hay usuarios </p>}
        {!isLoading && !isError && hasNextPage && users.length > 0 && <button onClick={() => fetchNextPage()}>Cargar más resultados</button>}
        {!isLoading && !isError && !hasNextPage && <p>No hay más resultados</p>}
      </main>
    </>
  )
}

export default App
