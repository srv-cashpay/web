import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const TaxCreateDialog = ({ visible, tax, setTax, hideDialog, saveTax, submitted }) => {
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
    const [imageFile, setImageFile] = useState(null); // State to store the image file for submission
   
    const onStatusChange = (e) => {
        setTax(prevTax => ({
            ...prevTax,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _tax = { ...tax };
        _tax[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setTax(_tax);
    };

    const taxDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTax} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Tax Details" modal className="p-fluid" footer={taxDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="tax">Tax name</label>
                <InputText
                    id="tax"
                    value={tax.tax}
                    onChange={(e) => onInputChange(e, 'tax')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !tax.tax })}
                />
                {submitted && !tax.tax && <small className="p-invalid">Tax name is required. Please provide a valid name.</small>}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={tax.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !tax.description })}
                />
                {submitted && !tax.description && <small className="p-invalid">Description is required. Please enter a tax description.</small>}
            </div>

           <div className="field-radiobutton">
                           <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={tax.status === 1} />
                           <label htmlFor="statusActive">Active</label>
           
                           <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={tax.status === 2} />
                           <label htmlFor="statusInactive">Inactive</label>
                       </div>
        </Dialog>
    );
};

export default TaxCreateDialog;
