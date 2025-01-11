import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { fetchProfileData, updateProfile } from './api_profile';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedValue, setUpdatedValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProfileData();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        loadData();
    }, []);

    const handleEdit = (field) => {
        setEditingField(field);
        setUpdatedValue(profileData[field]);
    };

    const handleSave = async (field) => {
        try {
            setLoading(true);
            setError(null);

            const updatedData = await updateProfile(profileData.id, field, updatedValue);
            setProfileData((prevData) => ({
                ...prevData,
                [field]: updatedData[field],
            }));
            setEditingField(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="surface-0 px-4 py-8 md:px-6 lg:px-80">
            <div className="font-medium text-3xl text-900 mb-3">Personal Information</div>
            <ul className="list-none p-0 m-0">
                {/* Full Name */}
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Full Name</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {editingField === 'full_name' ? (
                            <InputText
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            profileData.full_name
                        )}
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        {editingField === 'full_name' ? (
                            <>
                                <Button
                                    label={loading ? 'Saving...' : 'Save'}
                                    icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                    className="p-button-text"
                                    onClick={() => handleSave('full_name')}
                                    disabled={loading}
                                />
                                <Button
                                    label="Cancel"
                                    icon="pi pi-times"
                                    className="p-button-text"
                                    onClick={() => setEditingField(null)}
                                    disabled={loading}
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="p-button-text"
                                onClick={() => handleEdit('full_name')}
                            />
                        )}
                    </div>
                </li>

                {/* Email */}
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{profileData.email}</div>
                </li>

                {/* Whatsapp */}
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Whatsapp</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {editingField === 'whatsapp' ? (
                            <InputText
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            profileData.whatsapp
                        )}
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        {editingField === 'whatsapp' ? (
                            <>
                                <Button
                                    label={loading ? 'Saving...' : 'Save'}
                                    icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                    className="p-button-text"
                                    onClick={() => handleSave('whatsapp')}
                                    disabled={loading}
                                />
                                <Button
                                    label="Cancel"
                                    icon="pi pi-times"
                                    className="p-button-text"
                                    onClick={() => setEditingField(null)}
                                    disabled={loading}
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="p-button-text"
                                onClick={() => handleEdit('whatsapp')}
                            />
                        )}
                    </div>
                </li>

                {/* Password */}
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Password</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {editingField === 'password' ? (
                            <InputText
                                type="password"
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            '********'
                        )}
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        {editingField === 'password' ? (
                            <>
                                <Button
                                    label={loading ? 'Saving...' : 'Save'}
                                    icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                    className="p-button-text"
                                    onClick={() => handleSave('password')}
                                    disabled={loading}
                                />
                                <Button
                                    label="Cancel"
                                    icon="pi pi-times"
                                    className="p-button-text"
                                    onClick={() => setEditingField(null)}
                                    disabled={loading}
                                />
                            </>
                        ) : (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="p-button-text"
                                onClick={() => handleEdit('password')}
                            />
                        )}
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Profile;
