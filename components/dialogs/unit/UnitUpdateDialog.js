import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const UnitUpdateDialog = ({ visible, unit, setUnit, hideDialog, updateUnit, submitted }) => {
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
        setUnit(_unit);
    };

    const unitDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateUnit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Unit" modal className="p-fluid" footer={unitDialogFooter} onHide={hideDialog}>
            {unit.image && <img src={`${unit.image}`} alt={unit.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Unit ID</label>
                <InputText id="id" value={unit.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="unit_name">Unit Name</label>
                <InputText id="unit_name" value={unit.unit_name} onChange={(e) => onInputChange(e, 'unit_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !unit.unit_name })} />
                {submitted && !unit.unit_name && <small className="p-invalid">Unit name is required.</small>}
            </div>
        </Dialog>
    );
};

export default UnitUpdateDialog;
