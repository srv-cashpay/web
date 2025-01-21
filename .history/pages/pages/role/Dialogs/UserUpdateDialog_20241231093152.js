import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const UserUpdateDialog = ({ visible, user, setUser, hideDialog, updateUser, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _user = { ...user };
        _user[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setUser(_user);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setUser(prevUser => ({ ...prevUser, status: value }));
    };

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateUser} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update User" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            {user.image && <img src={`${user.image}`} alt={user.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">User ID</label>
                <InputText id="id" value={user.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="user">User Name</label>
                <InputText id="user" value={user.user} onChange={(e) => onInputChange(e, 'user')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.user })} />
                {submitted && !user.user && <small className="p-invalid">User name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={user.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.description })} />
                            {submitted && !user.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">User Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={user.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={user.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default UserUpdateDialog;
