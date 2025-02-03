import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const DiscountCreateDialog = ({ visible, discount, setDiscount, hideDialog, saveDiscount, submitted }) => {
    const onStatusChange = (e) => {
        setDiscount((prevDiscount) => ({
            ...prevDiscount,
            status: e.value === "Active" ? 1 : 2,
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir

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

    const discountDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDiscount} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Discount Details" modal className="p-fluid" footer={discountDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="discount_name">Discount Name</label>
                <InputText
                    id="discount_name"
                    value={discount.discount_name}
                    onChange={(e) => onInputChange(e, 'discount_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !discount.discount_name })}
                />
                {submitted && !discount.discount_name && <small className="p-invalid">Discount name is required.</small>}
            </div>

            <div className="field">
                <label htmlFor="discount_percentage">Discount Percentage</label>
                <div className="p-inputgroup" style={{ maxWidth: '200px' }}>
                    <InputText
                        id="discount_percentage"
                        value={discount.discount_percentage || ''}
                        onChange={(e) => onInputChange(e, 'discount_percentage')}
                        required
                        className={classNames({ 'p-invalid': submitted && (discount.discount_percentage < 0 || discount.discount_percentage > 100) })}
                    />
                    <span className="p-inputgroup-addon">%</span>
                </div>
                {submitted && (discount.discount_percentage < 0 || discount.discount_percentage > 100) && (
                    <small className="p-invalid">Discount must be between 0% and 100%.</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={discount.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    className={classNames({ 'p-invalid': submitted && !discount.description })}
                />
                {submitted && !discount.description && <small className="p-invalid">Description is required.</small>}
            </div>

            <div className="field-radiobutton">
                <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={discount.status === 1} />
                <label htmlFor="statusActive">Active</label>

                <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={discount.status === 2} />
                <label htmlFor="statusInactive">Inactive</label>
            </div>
        </Dialog>
    );
};

export default DiscountCreateDialog;
