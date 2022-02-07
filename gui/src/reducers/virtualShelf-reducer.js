const INITIAL_STATE = {
  virtualShelvesList: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_VIRTUALSHELVES_PENDING':
    case 'ADD_VIRTUALSHELF_PENDING':
    case 'SAVE_VIRTUALSHELF_PENDING':
    case 'DELETE_VIRTUALSHELF_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_VIRTUALSHELVES_FULFILLED':
    case 'ADD_VIRTUALSHELF_FULFILLED':
    case 'SAVE_VIRTUALSHELF_FULFILLED':
    case 'DELETE_VIRTUALSHELF_FULFILLED':
      return { ...state, virtualShelvesList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
    case 'GET_VIRTUALSHELVES_REJECTED':
    case 'ADD_VIRTUALSHELF_REJECTED':
    case 'SAVE_VIRTUALSHELF_REJECTED':
    case 'DELETE_VIRTUALSHELF_REJECTED':
      return { ...state, virtualShelvesList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}
