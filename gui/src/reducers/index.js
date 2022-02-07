import { combineReducers } from 'redux'
import virtualShelf from './virtualShelf-reducer'
import book from './book-reducer'
import dataReducer from './data-reducer'

export default combineReducers({
  virtualShelf, book, dataReducer
})
