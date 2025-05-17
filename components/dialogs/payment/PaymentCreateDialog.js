import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const PaymentCreateDialog = ({ visible, payment, setPayment, hideDialog, savePayment, submitted }) => {
    const onStatusChange = (e) => {
        setPayment((prevPayment) => ({
            ...prevPayment,
            status: e.value === "Active" ? 1 : 2,
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir

        let _payment = { ...payment };
        if (name === 'payment_percentage') {
            // Parse to float and ensure it's within range
            const parsedVal = parseFloat(val) || 0;
            if (parsedVal >= 0 && parsedVal <= 100) {
                _payment[name] = parsedVal;
            }
        } else {
            _payment[name] = val;
        }
        setPayment(_payment);
    };

    const paymentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePayment} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Payment Details" modal className="p-fluid" footer={paymentDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="payment_name">Payment Name</label>
                <InputText
                    id="payment_name"
                    value={payment.payment_name}
                    onChange={(e) => onInputChange(e, 'payment_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !payment.payment_name })}
                />
                {submitted && !payment.payment_name && <small className="p-invalid">Payment name is required.</small>}
            </div>

            <div className="field">
                <label htmlFor="payment_percentage">Payment Percentage</label>
                <div className="p-inputgroup" style={{ maxWidth: '200px' }}>
                    <InputText
                        id="payment_percentage"
                        value={payment.payment_percentage || ''}
                        onChange={(e) => onInputChange(e, 'payment_percentage')}
                        required
                        className={classNames({ 'p-invalid': submitted && (payment.payment_percentage < 0 || payment.payment_percentage > 100) })}
                    />
                    <span className="p-inputgroup-addon">%</span>
                </div>
                {submitted && (payment.payment_percentage < 0 || payment.payment_percentage > 100) && (
                    <small className="p-invalid">Payment must be between 0% and 100%.</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={payment.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    className={classNames({ 'p-invalid': submitted && !payment.description })}
                />
                {submitted && !payment.description && <small className="p-invalid">Description is required.</small>}
            </div>

            <div className="field-radiobutton">
                <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={payment.status === 1} />
                <label htmlFor="statusActive">Active</label>

                <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={payment.status === 2} />
                <label htmlFor="statusInactive">Inactive</label>
            </div>
        </Dialog>
    );
};

export default PaymentCreateDialog;
