import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const RoleUpdateDialog = ({ visible, role, setRole, hideDialog, updateRole, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _role = { ...role };
        _role[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setRole(_role);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setRole(prevRole => ({ ...prevRole, status: value }));
    };

    const roleDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateRole} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Role" modal className="p-fluid" footer={roleDialogFooter} onHide={hideDialog}>
            {role.image && <img src={`${role.image}`} alt={role.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Role ID</label>
                <InputText id="id" value={role.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="role">Role Name</label>
                <InputText id="role" value={role.role} onChange={(e) => onInputChange(e, 'role')} required autoFocus className={classNames({ 'p-invalid': submitted && !role.role })} />
                {submitted && !role.role && <small className="p-invalid">Role name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={role.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !role.description })} />
                            {submitted && !role.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Role Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={role.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={role.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default RoleUpdateDialog;
