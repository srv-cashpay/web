import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const UserCreateDialog = ({ visible, user, setUser, hideDialog, saveUser, submitted }) => {
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
    const [imageFile, setImageFile] = useState(null); // State to store the image file for submission
   
    const onStatusChange = (e) => {
        setUser(prevUser => ({
            ...prevUser,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _user = { ...user };
        _user[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setUser(_user);
    };

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="user">User name</label>
                <InputText
                    id="user"
                    value={user.user}
                    onChange={(e) => onInputChange(e, 'user')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !user.user })}
                />
                {submitted && !user.user && <small className="p-invalid">User name is required. Please provide a valid name.</small>}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={user.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !user.description })}
                />
                {submitted && !user.description && <small className="p-invalid">Description is required. Please enter a user description.</small>}
            </div>

           <div className="field-radiobutton">
                           <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={user.status === 1} />
                           <label htmlFor="statusActive">Active</label>
           
                           <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={user.status === 2} />
                           <label htmlFor="statusInactive">Inactive</label>
                       </div>
        </Dialog>
    );
};

export default UserCreateDialog;
