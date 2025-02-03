import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { fetchMerkData, fetchCategoryData } from '../../../services/inventory/api';

const ProductCreateDialog = ({ visible, product, setProduct, hideDialog, saveProduct }) => {
    const [isInfiniteStock, setIsInfiniteStock] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [merkOptions, setMerkOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchMerkOptions = async () => {
            try {
                const data = await fetchMerkData();
                const merkNames = data.map(item => ({
                    label: item.merk_name,
                    value: item.id
                }));
                setMerkOptions(merkNames);
            } catch (error) {
                console.error('Error fetching merk options:', error);
            }
        };
        fetchMerkOptions();
    }, []);

    useEffect(() => {
        const fetchCategoryOptions = async () => {
            try {
                const data = await fetchCategoryData();
                const categoryNames = data.map(item => ({
                    label: item.category_name,
                    value: item.id
                }));
                setCategoryOptions(categoryNames);
            } catch (error) {
                console.error('Error fetching category options:', error);
            }
        };
        fetchCategoryOptions();
    }, []);

    const formatCurrency = (value) => {
        if (!value) return '';
        return `Rp ${value.toLocaleString('id-ID')}`;
    };

    const onInputChange = (e, name) => {
        let val = (e.target && e.target.value.trim()); // Trim spasi di awal/akhir
        if (name === 'price') {
            val = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
            if (val > 1000000000) val = 1000000000;
        }
        let _product = { ...product };
    
        // Set 'merk_id' and 'category_id' with the selected 'id' values
        if (name === 'merk') {
            _product.merk_id = val;
        } else if (name === 'category') {
            _product.category_id = val;
        } else {
            _product[name] = ['stock', 'minimal_stock', 'price'].includes(name) ? parseInt(val, 10) || 0 : val;
        }
        setProduct(_product);
    };
    
    const itemTemplate = (option) => {
        if (option.value === 'create_new') {
            return <span style={{ color: 'blue' }}>{option.label}</span>;
        }
        return option.label;
    };

    const onStatusChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            status: e.value === "Active" ? 1 : 2,
        }));
    };

    const toggleInfiniteStock = () => {
        setIsInfiniteStock(prev => !prev);
        setProduct(prevProduct => ({
            ...prevProduct,
            stock: !isInfiniteStock ? 999999999 : 0
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageFile(file);
                setProduct(prevProduct => ({
                    ...prevProduct,
                    image: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProductHandler = () => {
        if (
            !product.product_name ||
            !product.merk_id ||
            !product.category_id ||
            !product.price ||
            !product.minimal_stock ||
            (!isInfiniteStock && !product.stock) 
           ) {
            setSubmitted(true);
            return;
        }

        saveProduct();
        hideDialog();
    };

    const hideDialogHandler = () => {
        setSubmitted(false);
        hideDialog();
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialogHandler} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProductHandler} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '600px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialogHandler}>
            <div className="field">
                <label htmlFor="barcode">Barcode</label>
                <InputText
                    id="barcode"
                    value={product.barcode}
                    onChange={(e) => onInputChange(e, 'barcode')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !product.barcode })}
                />
            </div>
            <div className="field">
                <label htmlFor="product_name">Product name</label>
                <InputText
                    id="product_name"
                    value={product.product_name}
                    onChange={(e) => onInputChange(e, 'product_name')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !product.product_name })}
                />
                {submitted && !product.product_name && <small className="p-invalid">Product name is required.</small>}
            </div>

            <div className="field" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="merk">Merk</label>
                    <Dropdown
    id="merk"
    value={product.merk_id} // Use merk_id
    options={[...merkOptions, { label: 'Create New', value: 'create_new' }]}
    itemTemplate={itemTemplate}
    onChange={(e) => {
        if (e.value === 'create_new') window.location.href = '/pages/merk';
        else onInputChange(e, 'merk');
    }}
    optionLabel="label"
    optionValue="value"
    placeholder="Select Merk"
    className={classNames({ 'p-invalid': submitted && !product.merk_id })}
/>

                    {submitted && !product.merk && <small className="p-invalid">Merk is required.</small>}
                </div>

                <div style={{ flex: 1 }}>
                    <label htmlFor="category">Category</label>
                    <Dropdown
    id="category"
    value={product.category_id} // Use category_id
    options={[...categoryOptions, { label: 'Create New', value: 'create_new' }]}
    itemTemplate={itemTemplate}
    onChange={(e) => {
        if (e.value === 'create_new') window.location.href = '/pages/category';
        else onInputChange(e, 'category');
    }}
    optionLabel="label"
    optionValue="value"
    placeholder="Select Category"
    className={classNames({ 'p-invalid': submitted && !product.category_id })}
/>
                    {submitted && !product.category && <small className="p-invalid">Category is required.</small>}
                </div>
            </div>

            <div className="field" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="minimal_stock">Minimal Stock</label>
                    <InputText
                        id="minimal_stock"
                        value={product.minimal_stock}
                        onChange={(e) => onInputChange(e, 'minimal_stock')}
                        required
                        className={classNames({ 'p-invalid': submitted && !product.minimal_stock })}
                    />
                    {submitted && !product.minimal_stock && <small className="p-invalid">Minimal stock is required.</small>}
                </div>

                <div style={{ flex: 1 }}>
                    <label htmlFor="stock">Stock</label>
                    <InputText
                        id="stock"
                        value={isInfiniteStock ? '∞' : product.stock}
                        onChange={(e) => onInputChange(e, 'stock')}
                        required
                        disabled={isInfiniteStock}
                        className={classNames({ 'p-invalid': submitted && !product.stock })}
                    />
                    {submitted && !product.stock && <small className="p-invalid">Stock is required.</small>}
                </div>

                <div className="field-checkbox">
                    <Checkbox inputId="infiniteStock" checked={isInfiniteStock} onChange={toggleInfiniteStock} />
                    <label htmlFor="infiniteStock">Infinite Stock</label>
                </div>
            </div>

            <div className="field">
                <label htmlFor="price">Price</label>
                <InputText
                    id="price"
                    value={formatCurrency(product.price)}
                    onChange={(e) => onInputChange(e, 'price')}
                    required
                    className={classNames({ 'p-invalid': submitted && !product.price })}
                />
                {submitted && !product.price && <small className="p-invalid">Price is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                    id="description"
                    value={product.description}
                    onChange={(e) => onInputChange(e, 'description')}
                    rows={3}
                    cols={20}
                />
            </div>

            <div className="field-radiobutton">
                <RadioButton inputId="statusActive" name="status" value="Active" onChange={onStatusChange} checked={product.status === 1} />
                <label htmlFor="statusActive">Active</label>

                <RadioButton inputId="statusInactive" name="status" value="Inactive" onChange={onStatusChange} checked={product.status === 2} />
                <label htmlFor="statusInactive">Inactive</label>
            </div>
        </Dialog>
    );
};

export default ProductCreateDialog;
