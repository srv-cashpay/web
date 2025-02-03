import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const PermissionUpdateDialog = ({ visible, permission, setPermission, hideDialog, updatePermission, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _permission = { ...permission };
        _permission[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setPermission(_permission);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setPermission(prevPermission => ({ ...prevPermission, status: value }));
    };

    const permissionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updatePermission} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Permission" modal className="p-fluid" footer={permissionDialogFooter} onHide={hideDialog}>
            {permission.image && <img src={`${permission.image}`} alt={permission.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Permission ID</label>
                <InputText id="id" value={permission.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="permission">Permission Name</label>
                <InputText id="permission" value={permission.permission} onChange={(e) => onInputChange(e, 'permission')} required autoFocus className={classNames({ 'p-invalid': submitted && !permission.permission })} />
                {submitted && !permission.permission && <small className="p-invalid">Permission name is required.</small>}
            </div>  
        </Dialog>
    );
};

export default PermissionUpdateDialog;
