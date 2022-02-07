import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExportImport from './ExportImport'
import './App.css'
import VirtualShelfList from './VirtualShelfList'
import BookList from './BookList'

function App() {
  return (
    <div className="App">
      <header className="header">
        Examen Tehnologii Web
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VirtualShelfList></VirtualShelfList>}></Route>
          <Route path="/virtualShelves/:virtualShelfId" element={<BookList />}></Route>
          <Route path="/export-import" element={<ExportImport></ExportImport>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
