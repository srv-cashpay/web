import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';

const PermissionCreateDialog = ({ visible, permission, setPermission, hideDialog, savePermission, submitted }) => {
    // Handle input change for the fields
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        // Update the permission object with new field values
        let _permission = { ...permission };
        _permission[name] = val;
        setPermission(_permission); // Update the state
    };

    // Dialog footer with Cancel and Save buttons
    const permissionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePermission} />
        </>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '600px' }} 
            header="Permission Details" 
            modal 
            className="p-fluid" 
            footer={permissionDialogFooter} 
            onHide={hideDialog}
        >
            <div className="field">
                <label htmlFor="label">Label</label>
                <InputText
                    id="label"
                    value={permission.label}
                    onChange={(e) => onInputChange(e, 'label')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !permission.label })}
                />
                {submitted && !permission.label && <small className="p-invalid">Label is required. Please provide a valid label.</small>}
            </div>

            <div className="field">
                <label htmlFor="icon">Icon</label>
                <InputText
                    id="icon"
                    value={permission.icon}
                    onChange={(e) => onInputChange(e, 'icon')}
                    required
                    className={classNames({ 'p-invalid': submitted && !permission.icon })}
                />
                {submitted && !permission.icon && <small className="p-invalid">Icon is required. Please provide a valid icon.</small>}
            </div>

            <div className="field">
                <label htmlFor="to">To (URL)</label>
                <InputText
                    id="to"
                    value={permission.to}
                    onChange={(e) => onInputChange(e, 'to')}
                    required
                    className={classNames({ 'p-invalid': submitted && !permission.to })}
                />
                {submitted && !permission.to && <small className="p-invalid">URL is required. Please provide a valid URL.</small>}
            </div>
        </Dialog>
    );
};

export default PermissionCreateDialog;
