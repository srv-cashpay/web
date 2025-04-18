import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const CategoryUpdateDialog = ({ visible, category, setCategory, hideDialog, updateCategory, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _category = { ...category };
        _category[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setCategory(_category);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setCategory(prevCategory => ({ ...prevCategory, status: value }));
    };

    const categoryDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateCategory} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Category" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
            {category.image && <img src={`${category.image}`} alt={category.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Category ID</label>
                <InputText id="id" value={category.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="category_name">Category Name</label>
                <InputText id="category_name" value={category.category_name} onChange={(e) => onInputChange(e, 'category_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.category_name })} />
                {submitted && !category.category_name && <small className="p-invalid">Category name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}></div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={category.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.description })} />
                            {submitted && !category.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Category Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={category.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={category.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default CategoryUpdateDialog;
