export const fetchUsers = async (pageParam: any) => {
    const resp = await fetch(`https://randomuser.me/api/?page=${pageParam}&results=10&seed=foobar`);
    if (!resp.ok) throw new Error('Error en la petición');
    const res = await resp.json();
    const currentPage = Number(res.info.page)
    const nextCursor = currentPage > 3 ? undefined : currentPage+1;
    return {
      users: res.results,
      nextCursor
    };
  }