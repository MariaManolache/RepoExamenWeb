const INITIAL_STATE = {
    dataList: [],
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'EXPORT_VIRTUALSHELVES_PENDING':
      case 'IMPORT_VIRTUALSHELVES_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'EXPORT_VIRTUALSHELVES_FULFILLED':
      case 'IMPORT_VIRTUALSHELVES_FULFILLED':
        return { ...state, dataList: action.payload, error: null, fetching: false, fetched: true }
      case 'EXPORT_VIRTUALSHELVES_REJECTED':
      case 'IMPORT_VIRTUALSHELVES_REJECTED':
        return { ...state, dataList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }
  