import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { uploadImage } from '../../../services/inventory/api';

const UploadImageDialog = ({ visible, product, setProduct, hideDialog }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds the 2MB limit');
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPG and PNG files are allowed');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        if (!product.id) {
            alert('Product ID is missing');
            return;
        }

        try {
            // Pass product.id along with imageFile
            const response = await uploadImage(product.id, imageFile);
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: response.path, // Use the path returned by the server
            }));
            alert('Image uploaded successfully');
        } catch (error) {
            alert('Failed to upload image');
        }
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Upload" icon="pi pi-check" className="p-button-text" onClick={handleUpload} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Update Product" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="id">Product ID</label>
                <InputText id="id" value={product.id} onChange={(e) => setProduct((prev) => ({ ...prev, id: e.target.value }))} disabled />
            </div>
            <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                <label htmlFor="image" style={{ marginRight: '10px' }}>Product Image</label>
                <input
                    type="file"
                    id="image"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                />
                {imagePreview && <img src={imagePreview} alt="Product Preview" width="90" className="ml-3 shadow-2" />}
            </div>
        </Dialog>
    );
};

export default UploadImageDialog;
