import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'


import { getBooks, addBook, saveBook, deleteBook } from '../actions'

const bookSelector = state => state.book.bookList

const options = [
    { value: 'COMEDY', label: 'Comedy' },
    { value: 'TRAGEDY', label: 'Tragedy' },
    { value: 'HISTORY', label: 'History' }
]

function BookList() {
    const [isDialogShown, setIsDialogShown] = useState(false)
    const [title, setTitle] = useState('')
    const [genre, setGenre] = useState(null)
    const [url, setUrl] = useState('')
    const [isNewRecord, setIsNewRecord] = useState(true)
    const [selectedBook, setSelectedBook] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);

    let virtualShelfId = localStorage.virtualShelfId;

    const books = useSelector(bookSelector)

    const dispatch = useDispatch()

    console.log(virtualShelfId)

    useEffect(() => {
        dispatch(getBooks(virtualShelfId))
    }, [])

    const handleAddClick = (evt) => {
        setIsDialogShown(true)
        setIsNewRecord(true)
        setTitle('')
        setGenre('')
        setUrl('')
    }

    const hideDialog = () => {
        setIsDialogShown(false)
    }

    const handleSaveClick = () => {
        if (isNewRecord) {
            dispatch(addBook(virtualShelfId, { title, genre, url }))
        } else {
            dispatch(saveBook(virtualShelfId, selectedBook, { title, genre, url }))
        }
        setIsDialogShown(false)
        setSelectedBook(null)
        setTitle('')
        setGenre('')
        setUrl('')
    }

    const editBook = (rowData) => {
        setSelectedBook(rowData.id)
        setTitle(rowData.title)
        setGenre(rowData.genre)
        setUrl(rowData.url)
        setIsDialogShown(true)
        setIsNewRecord(false)
    }

    const handleDeleteBook = (rowData) => {
        dispatch(deleteBook(virtualShelfId, rowData.id))
    }

    const tableFooter = (
        <div>
            <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
        </div>
    )

    const dialogFooter = (
        <div>
            <Button label='Save' icon='pi pi-save' onClick={handleSaveClick} />
        </div>
    )

    const opsColumn = (rowData) => {
        return (
            <>
                <Button label='Edit' icon='pi pi-pencil' onClick={() => editBook(rowData)} />
                <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteBook(rowData)} />
            </>
        )
    }

    return (
        <div className='book-list'>
            <DataTable value={books} footer={tableFooter}>
                <Column header='Title' field='title' />
                <Column header='Genre' field='genre' />
                <Column header='Url' field='url' />
                <Column body={opsColumn} />
            </DataTable>
            <Dialog header='A book' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
                <div>
                    <InputText placeholder='title' onChange={(evt) => setTitle(evt.target.value)} value={title} />
                </div>
                <div>
                    <Dropdown 	style={{ width: 250 }} value={genre} options={options} onChange={(e) => {
                        const newGenre = e.value
                        setGenre(newGenre)
                    }}>
                    {/* <option value="COMEDY">Comedy</option>
                    <option value="TRAGEDY">Tragedy</option>
                    <option value="HISTORY">History</option> */}
                    </Dropdown>
                </div>
                <div>
                    <InputText placeholder='url' onChange={(evt) => setUrl(evt.target.value)} value={url} />
                </div>
            </Dialog>
        </div>
    )
}

export default BookList
