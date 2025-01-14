import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const MerkUpdateDialog = ({ visible, unit, setMerk, hideDialog, updateMerk, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _unit = { ...unit };
        _unit[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setMerk(_unit);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setMerk(prevMerk => ({ ...prevMerk, status: value }));
    };

    const unitDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateMerk} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Merk" modal className="p-fluid" footer={unitDialogFooter} onHide={hideDialog}>
            {unit.image && <img src={`${unit.image}`} alt={unit.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Merk ID</label>
                <InputText id="id" value={unit.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="unit_name">Merk Name</label>
                <InputText id="unit_name" value={unit.unit_name} onChange={(e) => onInputChange(e, 'unit_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !unit.unit_name })} />
                {submitted && !unit.unit_name && <small className="p-invalid">Merk name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={unit.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !unit.description })} />
                            {submitted && !unit.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Merk Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={unit.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={unit.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default MerkUpdateDialog;
