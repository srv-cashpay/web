import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';

const ProductUpdateDialog = ({ visible, product, setProduct, hideDialog, updateProduct, submitted }) => {
    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir
        
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, '')) || 0; // Hapus karakter selain angka
            // Batasi harga maksimum hingga 1 miliar
        if (val > 1000000000) {
            val = 1000000000;
        }
        }
        
        let _product = { ...product };
        _product[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val) || 0 : val;
        setProduct(_product);
    };

    const onStatusChange = (e) => {
        const value = e.value; 
        setProduct(prevProduct => ({ ...prevProduct, status: value }));
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updateProduct} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Product" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            {product.image && <img src={`${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
            
            <div className="field">
                <label htmlFor="id">Product ID</label>
                <InputText id="id" value={product.id} onChange={(e) => onInputChange(e, 'id')} disabled />
            </div>
            <div className="field">
                <label htmlFor="product_name">Product Name</label>
                <InputText id="product_name" value={product.product_name} onChange={(e) => onInputChange(e, 'product_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.product_name })} />
                {submitted && !product.product_name && <small className="p-invalid">Product name is required.</small>}
            </div>
            <div className="field" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="merk">Merk</label>
                                <InputText id="merk" value={product.merk} onChange={(e) => onInputChange(e, 'merk')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.merk })} />
                                {submitted && !product.merk && <small className="p-invalid">Merk is required.</small>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="price">Price</label>
                                <InputText id="price" value={product.price} onChange={(e) => onInputChange(e, 'price')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.price })} />
                                {submitted && !product.price && <small className="p-invalid">Stock is required.</small>}
                            </div>
                        </div>
                        <div className="field" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="minimal_stock">Minimal Stock</label>
                                <InputText id="minimal_stock" value={product.minimal_stock} onChange={(e) => onInputChange(e, 'minimal_stock')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.minimal_stock })} />
                                {submitted && !product.minimal_stock && <small className="p-invalid">Minimal stock is required.</small>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="stock">Stock</label>
                                <InputText id="stock" value={product.stock} onChange={(e) => onInputChange(e, 'stock')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.stock })} />
                                {submitted && !product.stock && <small className="p-invalid">Stock is required.</small>}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.description })} />
                            {submitted && !product.price && <small className="p-invalid">Name is required.</small>}
                        </div>            
            <div className="field">
                <label className="mb-3">Product Status</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status1" name="status" value={1} onChange={onStatusChange} checked={product.status === 1} />
                        <label htmlFor="status1">Active</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="status2" name="status" value={2} onChange={onStatusChange} checked={product.status === 2} />
                        <label htmlFor="status2">Non Active</label>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductUpdateDialog;
