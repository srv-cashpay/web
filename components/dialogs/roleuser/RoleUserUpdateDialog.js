import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const RoleUpdateDialog = ({ visible, roleuser, setRole, hideDialog, updateRole, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _roleuser = { ...roleuser };
        _roleuser[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setRole(_roleuser);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setRole(prevRole => ({ ...prevRole, status: value }));
    };

    const roleuserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateRole} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Role" modal className="p-fluid" footer={roleuserDialogFooter} onHide={hideDialog}>
            {roleuser.image && <img src={`${roleuser.image}`} alt={roleuser.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Role ID</label>
                <InputText id="id" value={roleuser.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="roleuser">Role Name</label>
                <InputText id="roleuser" value={roleuser.roleuser} onChange={(e) => onInputChange(e, 'roleuser')} required autoFocus className={classNames({ 'p-invalid': submitted && !roleuser.roleuser })} />
                {submitted && !roleuser.roleuser && <small className="p-invalid">Role name is required.</small>}
            </div>  
        </Dialog>
    );
};

export default RoleUpdateDialog;
