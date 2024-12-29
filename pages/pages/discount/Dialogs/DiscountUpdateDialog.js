import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const DiscountUpdateDialog = ({ visible, discount, setDiscount, hideDialog, updateDiscount, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _discount = { ...discount };
        _discount[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
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
                <label htmlFor="discount">Discount Name</label>
                <InputText id="discount" value={discount.discount} onChange={(e) => onInputChange(e, 'discount')} required autoFocus className={classNames({ 'p-invalid': submitted && !discount.discount })} />
                {submitted && !discount.discount && <small className="p-invalid">Discount name is required.</small>}
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
