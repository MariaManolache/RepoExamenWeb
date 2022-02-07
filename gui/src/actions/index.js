import { SERVER } from '../config/global'

export const getVirtualShelves = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_VIRTUALSHELVES',
    payload: async () => {
      const response = await fetch(`${SERVER}/virtualshelves?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addVirtualShelf = (virtualShelf, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_VIRTUALSHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(virtualShelf)
      })
      response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveVirtualShelf = (id, virtualShelf, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_VIRTUALSHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(virtualShelf)
      })
      response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteVirtualShelf = (id, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'DELETE_VIRTUALSHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const getBooks = (idVirtualShelf, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_BOOKS',
    payload: async () => {
      const response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addBook = (idVirtualShelf, book) => {
  return {
    type: 'ADD_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
      response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books`)
      const data = await response.json()
      return data
    }
  }
}

export const saveBook = (idVirtualShelf, id, book) => {
  return {
    type: 'SAVE_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
      response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteBook = (idVirtualShelf, id) => {
  return {
    type: 'DELETE_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books`)
      const data = await response.json()
      return data
    }
  }
}

export const importVirtualShelves = (virtualShelves) => {
  return {
    type: 'IMPORT_VIRTUALSHELVES',
    payload: async () => {
      let response = await fetch(`${SERVER}/import`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(virtualShelves)
      })
      // response = await fetch(`${SERVER}/virtualShelves/${idVirtualShelf}/books?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      // const data = await response.json()
      // return data
    }
  }
}

export const exportVirtualShelves = () => {
  return {
    type: 'EXPORT_VIRTUALSHELVES',
    payload: async () => {
      const response = await fetch(`${SERVER}/export`)
      const data = await response.json()
      return data
    }
  }
}


