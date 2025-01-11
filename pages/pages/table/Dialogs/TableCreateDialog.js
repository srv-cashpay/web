import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const TableCreateDialog = ({ visible, table, setTable, hideDialog, saveTable, submitted }) => {
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
    const [imageFile, setImageFile] = useState(null); // State to store the image file for submission
   
    const onStatusChange = (e) => {
        setTable(prevTable => ({
            ...prevTable,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _table = { ...table };
        _table[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setTable(_table);
    };

    const tableDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTable} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Table Details" modal className="p-fluid" footer={tableDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="table">Table name</label>
                <InputText
                    id="table"
                    value={table.table}
                    placeholder='1a'
                    onChange={(e) => onInputChange(e, 'table')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !table.table })}
                />
                {submitted && !table.table && <small className="p-invalid">Table name is required. Please provide a valid name.</small>}
            </div>
            <div className="field">
            <label htmlFor="table">lantai (bangunan)</label>
            <InputText
                    id="floor"
                    value={table.floor}
                    placeholder='1'
                    onChange={(e) => onInputChange(e, 'floor')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !table.floor })}
                />
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={table.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !table.description })}
                />
                {submitted && !table.description && <small className="p-invalid">Description is required. Please enter a table description.</small>}
            </div>
        </Dialog>
    );
};

export default TableCreateDialog;
