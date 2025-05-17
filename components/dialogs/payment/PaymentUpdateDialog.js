import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const PaymentUpdateDialog = ({ visible, payment, setPayment, hideDialog, updatePayment, submitted }) => {
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

    const onStatusChange = (e) => {
        const value = e.value; 
        setPayment(prevPayment => ({ ...prevPayment, status: value }));
    };

    const paymentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updatePayment} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Payment" modal className="p-fluid" footer={paymentDialogFooter} onHide={hideDialog}>
            {payment.image && <img src={`${payment.image}`} alt={payment.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Payment ID</label>
                <InputText id="id" value={payment.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="payment_name">Payment Name</label>
                <InputText id="payment_name" value={payment.payment_name} onChange={(e) => onInputChange(e, 'payment_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.payment_name })} />
                {submitted && !payment.payment_name && <small className="p-invalid">Payment name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="payment_percentage">Payment Percentage</label>
                <div className="p-inputgroup" style={{ maxWidth: '200px' }}>
                <InputText id="payment_percentage" 
                value={payment.payment_percentage} onChange={(e) => onInputChange(e, 'payment_percentage')} 
                required 
                        className={classNames({ 'p-invalid': submitted && (payment.payment_percentage < 0 || payment.payment_percentage > 100) })}
                />
                <span className="p-inputgroup-addon">%</span>
                </div>
                {submitted && (payment.payment_percentage < 0 || payment.payment_percentage > 100) && (
                    <small className="p-invalid">Payment must be between 0% and 100%.</small>
                )}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={payment.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !payment.description })} />
                            {submitted && !payment.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Payment Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={payment.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={payment.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default PaymentUpdateDialog;
