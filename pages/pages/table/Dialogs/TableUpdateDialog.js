import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const TableUpdateDialog = ({ visible, table, setTable, hideDialog, updateTable, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _table = { ...table };
        _table[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setTable(_table);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setTable(prevTable => ({ ...prevTable, status: value }));
    };

    const tableDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateTable} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Table" modal className="p-fluid" footer={tableDialogFooter} onHide={hideDialog}>
            {table.image && <img src={`${table.image}`} alt={table.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Table ID</label>
                <InputText id="id" value={table.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="table">Table Name</label>
                <InputText id="table" value={table.table} onChange={(e) => onInputChange(e, 'table')} required autoFocus className={classNames({ 'p-invalid': submitted && !table.table })} />
                {submitted && !table.table && <small className="p-invalid">Table name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={table.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !table.description })} />
                            {submitted && !table.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
        </Dialog>
    );
};

export default TableUpdateDialog;
