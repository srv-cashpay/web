import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const TaxUpdateDialog = ({ visible, tax, setTax, hideDialog, updateTax, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _tax = { ...tax };
        if (name === 'tax_percentage') {
            // Parse to float and ensure it's within range
            const parsedVal = parseFloat(val) || 0;
            if (parsedVal >= 0 && parsedVal <= 100) {
                _tax[name] = parsedVal;
            }
        } else {
            _tax[name] = val;
        }
        setTax(_tax);
    };
    
    const onStatusChange = (e) => {
        const value = e.value; 
        setTax(prevTax => ({ ...prevTax, status: value }));
    };

    const taxDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateTax} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Tax" modal className="p-fluid" footer={taxDialogFooter} onHide={hideDialog}>
            {tax.image && <img src={`${tax.image}`} alt={tax.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Tax ID</label>
                <InputText id="id" value={tax.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="tax">Tax Name</label>
                <InputText id="tax" value={tax.tax} onChange={(e) => onInputChange(e, 'tax')} required autoFocus className={classNames({ 'p-invalid': submitted && !tax.tax })} />
                {submitted && !tax.tax && <small className="p-invalid">Tax name is required.</small>}
            </div>
            <div className="field">
                            <label htmlFor="tax_percentage">Tax Percentage</label>
                            <div className="p-inputgroup" style={{ maxWidth: '200px' }}>
                            <InputText id="tax_percentage" 
                            value={tax.tax_percentage} onChange={(e) => onInputChange(e, 'tax_percentage')} 
                            required 
                                    className={classNames({ 'p-invalid': submitted && (tax.tax_percentage < 0 || tax.tax_percentage > 100) })}
                            />
                            <span className="p-inputgroup-addon">%</span>
                            </div>
                            {submitted && (tax.tax_percentage < 0 || tax.tax_percentage > 100) && (
                                <small className="p-invalid">Tax must be between 0% and 100%.</small>
                            )}
                        </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={tax.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !tax.description })} />
                            {submitted && !tax.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Tax Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={tax.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={tax.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default TaxUpdateDialog;
