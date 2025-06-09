import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const RoleCreateDialog = ({ visible, roleuserpermission, setRole, hideDialog, saveRole, submitted }) => {
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
    const [imageFile, setImageFile] = useState(null); // State to store the image file for submission
   
    const onStatusChange = (e) => {
        setRole(prevRole => ({
            ...prevRole,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _roleuserpermission = { ...roleuserpermission };
        _roleuserpermission[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setRole(_roleuserpermission);
    };

    const roleuserpermissionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRole} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Role Details" modal className="p-fluid" footer={roleuserpermissionDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="roleuserpermission">Role name</label>
                <InputText
                    id="roleuserpermission"
                    value={roleuserpermission.roleuserpermission}
                    onChange={(e) => onInputChange(e, 'roleuserpermission')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !roleuserpermission.roleuserpermission })}
                />
                {submitted && !roleuserpermission.roleuserpermission && <small className="p-invalid">Role name is required. Please provide a valid name.</small>}
            </div>
        </Dialog>
    );
};

export default RoleCreateDialog;
