import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const MerkCreateDialog = ({ visible, merk, setMerk, hideDialog, saveMerk, submitted }) => {   
    const onStatusChange = (e) => {
        setMerk(prevMerk => ({
            ...prevMerk,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value);
        val = val.trim(); // Pangkas spasi di awal/akhir
        if (val === '') {
            alert('Input tidak boleh hanya berisi spasi.');
            return;
        }
    
        let _merk = { ...merk };
        _merk[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setMerk(_merk);
    };

    const merkDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMerk} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Merk Details" modal className="p-fluid" footer={merkDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="merk_name">Merk name</label>
                <InputText
                    id="merk_name"
                    value={merk.merk_name}
                    onChange={(e) => onInputChange(e, 'merk_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !merk.merk_name })}
                />
                {submitted && !merk.merk_name && <small className="p-invalid">Merk name is required. Please provide a valid name.</small>}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={merk.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !merk.description })}
                />
                {submitted && !merk.description && <small className="p-invalid">Description is required. Please enter a merk description.</small>}
            </div>

           <div className="field-radiobutton">
                           <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={merk.status === 1} />
                           <label htmlFor="statusActive">Active</label>
           
                           <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={merk.status === 2} />
                           <label htmlFor="statusInactive">Inactive</label>
                       </div>
        </Dialog>
    );
};

export default MerkCreateDialog;
