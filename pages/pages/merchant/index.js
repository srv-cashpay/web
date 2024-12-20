import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import QRCode from 'react-qr-code';
import { fetchMerchantData, updateMerchantData, generateAuthenticatorCode } from '../merchant/api';

const Merchant = () => {
    const [merchantData, setMerchantData] = useState({
        id: '',
        owner_name: '',
        merchant_name: '',
        address: '',
        city: '',
        country: null, // Hanya menyimpan kode negara
        zip: null, // Zip sebagai integer
        phone: null, // Phone sebagai integer
    });
    const [dropdownItems, setDropdownItems] = useState([]);
    const [signupData, setSignupData] = useState({ email: '', password: '' });
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set predefined dropdown items
        setDropdownItems([
            { name: 'Indonesia', code: 1 },
            { name: 'Singapore', code: 2 },
        ]);

        // Fetch merchant data
        loadMerchantData();
    }, []);

    const loadMerchantData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchMerchantData();
            if (data.status && data.data.length > 0) {
                const merchant = data.data[0];
                setMerchantData({
                    id: merchant.id,
                    owner_name: merchant.update_by,
                    merchant_name: merchant.merchant_name,
                    address: merchant.address,
                    city: merchant.city,
                    country: merchant.country.code, // Ambil kode negara
                    zip: parseInt(merchant.zip, 10), // Konversi ke integer
                    phone: parseInt(merchant.phone, 10), // Konversi ke integer
                });
            }
        } catch (error) {
            console.error('Error fetching merchant data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setMerchantData((prevData) => ({
            ...prevData,
            [field]: ['zip', 'phone'].includes(field) && value ? value.replace(/\D/g, '') : value,
        }));
    };
    const handleUpdate = async () => {
        if (!validateForm()) return;
        try {
            setIsLoading(true);
            const payload = { ...merchantData, country: merchantData.country };
            const response = await updateMerchantData(payload);
            alert(response.status ? 'Data updated successfully' : 'Update failed');
        } catch (error) {
            console.error('Error updating merchant data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        if (!merchantData.merchant_name || !merchantData.phone) {
            alert("Merchant Name and Phone are required.");
            return false;
        }
        return true;
    };

    const handleSignup = () => {
        const dummyCredentials = { email: 'testUser', password: 'testPassword' };

        if (signupData.email === dummyCredentials.email && signupData.password === dummyCredentials.password) {
            const newQRCode = generateAuthenticatorCode(merchantData.merchant_name);
            setQrCodeValue(newQRCode);
        } else {
            alert('Signup failed. Please check your credentials.');
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Merchant</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="Owner Name">Owner Name</label>
                            <InputText
                                id="owner"
                                type="text"
                                value={merchantData.owner_name}
                                onChange={(e) => handleChange('owner_name', e.target.value)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="Merchant Name">Merchant Name</label>
                            <InputText
                                id="merchant_name"
                                type="text"
                                value={merchantData.merchant_name}
                                onChange={(e) => handleChange('merchant_name', e.target.value)}
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="address">Address</label>
                            <InputTextarea
                                id="address"
                                rows="4"
                                value={merchantData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="city">City</label>
                            <InputText
                                id="city"
                                type="text"
                                value={merchantData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="country">Country</label>
                            <Dropdown
                                id="country"
                                value={merchantData.country}
                                options={dropdownItems}
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Select One"
                                onChange={(e) => handleChange('country', e.value)}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText
                                id="zip"
                                type="number"
                                value={merchantData.zip || ''}
                                onChange={(e) => handleChange('zip', e.target.value)}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="phone">Phone</label>
                            <InputText
                                id="phone"
                                type="number"
                                value={merchantData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </div>
                        <Button label={isLoading ? 'Updating...' : 'Update'} onClick={handleUpdate} disabled={isLoading} />
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Authenticator</h5>
                    <div className="field">
                        {qrCodeValue && <QRCode value={qrCodeValue} size={200} />}
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-3">
                <div className="card">
                    <h5>Signup</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="email">email</label>
                            <InputText
                                id="email"
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <InputText
                                id="password"
                                type="password"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            />
                        </div>
                        <Button label="Signup" onClick={handleSignup} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Merchant;