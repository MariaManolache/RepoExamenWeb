import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import {useNavigate} from "react-router";


import { getVirtualShelves, addVirtualShelf, saveVirtualShelf, deleteVirtualShelf} from '../actions'

const virtualShelfSelector = state => state.virtualShelf.virtualShelvesList
const virtualShelfCountSelector = state => state.virtualShelf.count

function VirtualShelfList () {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date());
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedVirtualShelf, setSelectedVirtualShelf] = useState(null)
  const [filterString, setFilterString] = useState('')

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const [filters, setFilters] = useState({
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
      description: { value: null, matchMode: FilterMatchMode.CONTAINS },
      date: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  const virtualShelves = useSelector(virtualShelfSelector)
  const count = useSelector(virtualShelfCountSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getVirtualShelves(filterString, page, 4, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setDescription('')
    setDate((new Date()).toLocaleString())
  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    if (isNewRecord) {
      dispatch(addVirtualShelf({ description, date}))
    } else {
      dispatch(saveVirtualShelf(selectedVirtualShelf, { description, date }))
    }
    setIsDialogShown(false)
    setSelectedVirtualShelf(null)
    setDescription('')
    setDate((new Date()).toLocaleString())
  }

  const editVirtualShelf = (rowData) => {
    setSelectedVirtualShelf(rowData.id)
    setDescription(rowData.description)
    // setDate(new Date().toLocaleString())
    setDate(rowData.date)
    setIsDialogShown(true)
    setIsNewRecord(false)
  }

  const handleDeleteVirtualShelf = (rowData) => {
    dispatch(deleteVirtualShelf(rowData.id))
  }

  const navigate = useNavigate();

  const handleSeeBooks = (rowData) => {
    localStorage.setItem("virtualShelfId", rowData.id)
    localStorage.virtualShelfId = rowData.id;
    console.log(localStorage.virtualShelfId);
    setSelectedVirtualShelf(rowData.id)
    navigate(`/virtualShelves/${rowData.id}`);
  }

  const handleExportImport = () => {
    navigate('export-import');
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
      <Button label='Export or import data' icon='pi pi-plus' onClick={handleExportImport} />
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
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editVirtualShelf(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteVirtualShelf(rowData)} />
        <Button label='See Books' icon='pi pi-folder-open' className='p-button p-folder-open' onClick={() => handleSeeBooks(rowData)} />
      </>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 2)
  }

  const handleSort = (evt) => {
    console.warn(evt)
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  const data = selectedVirtualShelf;

  return (
    <div className='virtual-shelves-list'>
      <DataTable class="virtual-shelves-list"
        value={virtualShelves}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={4}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header='Description' field='description' filter filterField='description' filterPlaceholder='filter by description' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column header='Date' field='date' filter filterField='date' filterPlaceholder='filter by date' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='A virtual shelf' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='description' onChange={(evt) => setDescription(evt.target.value)} value={description} />
        </div>
        <div>
          <InputText placeholder='date' type={"date"} onChange={(evt) => setDate(evt.target.value)} value={date} />
        </div>
        {/* <div>
          <InputText placeholder='date' type={"date"} value={date} onChange={(evt) => setDate(evt.target.value)} ></InputText>
        </div> */}
      </Dialog>
    </div>
  )
}

export default VirtualShelfList
