import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

const CategoryCreateDialog = ({ visible, category, setCategory, hideDialog, saveCategory, submitted }) => {
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL
    const [imageFile, setImageFile] = useState(null); // State to store the image file for submission
   
    const onStatusChange = (e) => {
        setCategory(prevCategory => ({
            ...prevCategory,
            status: e.value === "Active" ? 1 : 2, 
        }));
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value) || '';

        let _category = { ...category };
        _category[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setCategory(_category);
    };

    const categoryDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="category_name">Category name</label>
                <InputText
                    id="category_name"
                    value={category.category_name}
                    onChange={(e) => onInputChange(e, 'category_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !category.category_name })}
                />
                {submitted && !category.category_name && <small className="p-invalid">Category name is required. Please provide a valid name.</small>}
            </div>

            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={category.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    required
                    rows={3}
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !category.description })}
                />
                {submitted && !category.description && <small className="p-invalid">Description is required. Please enter a category description.</small>}
            </div>

           <div className="field-radiobutton">
                           <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={category.status === 1} />
                           <label htmlFor="statusActive">Active</label>
           
                           <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={category.status === 2} />
                           <label htmlFor="statusInactive">Inactive</label>
                       </div>
        </Dialog>
    );
};

export default CategoryCreateDialog;
