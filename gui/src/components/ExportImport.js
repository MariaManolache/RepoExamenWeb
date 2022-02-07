import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { exportVirtualShelves, importVirtualShelves } from '../actions'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';

const dataSelector = state => state.dataReducer.dataList

function ExportImport() {

  const [dataImport, setDataImport] = useState('')
  const [dataExport, setDataExport] = useState('')

  const dispatch = useDispatch()
  const dataFinal = useSelector(dataSelector);

  useEffect(() => {
    dispatch(exportVirtualShelves())
  }, [])


  const handleImportClick = () => {
    dispatch(importVirtualShelves(JSON.parse(dataImport)))
    setDataImport("")
  }

  const handleExportClick = () => {
    // dispatch(exportVirtualShelves());
    setDataExport(JSON.stringify(dataFinal))
  }



  return (
    <div className="flex-container">
      <div>
      <InputTextarea className='text-area' rows={5} cols={100} onChange={(evt) => setDataImport(evt.target.value)} value={dataImport}></InputTextarea>
      <Button label='Import' icon='pi pi-save' onClick={() => handleImportClick()} />
      </div>
      <div>
      <InputTextarea className='text-area' rows={5} cols={100} value={dataExport}></InputTextarea>
      <Button label='Export' icon='pi pi-save' onClick={() => handleExportClick()} />
      </div>
    </div>
  )
}

export default ExportImport