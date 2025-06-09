import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const ContentSetting = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        androidLink: '',
        appleLink: '',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Kirim data ke backend jika diperlukan
        console.log('Data Submitted:', { ...formData, image });
        alert('Data submitted (cek console untuk detail)');
    };

    return (
        <div className="card p-fluid">
            <h3>Upload App Info</h3>

            <div className="field">
                <label>Upload Gambar</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '10%', height: 'auto', marginTop: '10px' }} />
                    </div>
                )}
            </div>

            <div className="field">
                <label>Title</label>
                <InputText value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
            </div>

            <div className="field">
                <label>Description</label>
                <InputTextarea rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
            </div>

            <div className="field">
                <label>Android Link</label>
                <InputText value={formData.androidLink} onChange={(e) => handleInputChange('androidLink', e.target.value)} />
            </div>

            <div className="field">
                <label>Apple Link</label>
                <InputText value={formData.appleLink} onChange={(e) => handleInputChange('appleLink', e.target.value)} />
            </div>

            <Button label="Submit" onClick={handleSubmit} />
        </div>
    );
};

export default ContentSetting;
