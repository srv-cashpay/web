import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const DiscountUpdateDialog = ({ visible, discount, setDiscount, hideDialog, updateDiscount, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _discount = { ...discount };
        if (name === 'discount_percentage') {
            // Parse to float and ensure it's within range
            const parsedVal = parseFloat(val) || 0;
            if (parsedVal >= 0 && parsedVal <= 100) {
                _discount[name] = parsedVal;
            }
        } else {
            _discount[name] = val;
        }
        setDiscount(_discount);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setDiscount(prevDiscount => ({ ...prevDiscount, status: value }));
    };

    const discountDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateDiscount} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Discount" modal className="p-fluid" footer={discountDialogFooter} onHide={hideDialog}>
            {discount.image && <img src={`${discount.image}`} alt={discount.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Discount ID</label>
                <InputText id="id" value={discount.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="discount_name">Discount Name</label>
                <InputText id="discount_name" value={discount.discount_name} onChange={(e) => onInputChange(e, 'discount_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !discount.discount_name })} />
                {submitted && !discount.discount_name && <small className="p-invalid">Discount name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="discount_percentage">Discount Percentage</label>
                <div className="p-inputgroup" style={{ maxWidth: '200px' }}>
                <InputText id="discount_percentage" 
                value={discount.discount_percentage} onChange={(e) => onInputChange(e, 'discount_percentage')} 
                required 
                        className={classNames({ 'p-invalid': submitted && (discount.discount_percentage < 0 || discount.discount_percentage > 100) })}
                />
                <span className="p-inputgroup-addon">%</span>
                </div>
                {submitted && (discount.discount_percentage < 0 || discount.discount_percentage > 100) && (
                    <small className="p-invalid">Discount must be between 0% and 100%.</small>
                )}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={discount.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !discount.description })} />
                            {submitted && !discount.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Discount Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={discount.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={discount.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default DiscountUpdateDialog;
