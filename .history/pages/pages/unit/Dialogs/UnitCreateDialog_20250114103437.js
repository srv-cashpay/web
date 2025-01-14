import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const UnitCreateDialog = ({ visible, unit, setUnit, hideDialog, saveUnit, submitted }) => {   
    const onStatusChange = (e) => {
        setUnit(prevUnit => ({
            ...prevUnit,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir
        let _unit = { ...unit };
        _unit[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setUnit(_unit);
    };

    const unitDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUnit} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Unit Details" modal className="p-fluid" footer={unitDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="unit_name">Unit name</label>
                <InputText
                    id="unit_name"
                    value={unit.unit_name}
                    onChange={(e) => onInputChange(e, 'unit_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !unit.unit_name })}
                />
                {submitted && !unit.unit_name && <small className="p-invalid">Unit name is required. Please provide a valid name.</small>}
            </div>
        </Dialog>
    );
};

export default UnitCreateDialog;
