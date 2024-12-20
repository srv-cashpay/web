import React, { useRef, useState , useEffect } from 'react';

import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import withAuth from './../layout/context/withAuth';
import Cookies from 'js-cookie';


const getTokenFromCookie = () => {
const token = Cookies.get('token'); // <-- Replace 'yourCookieName' with the actual name of your cookie

    return token;
};
const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getTokenFromCookie();

                const response = await fetch('http://localhost:8080/api/v1/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProfileData(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="surface-0 px-4 py-8 md:px-6 lg:px-80">
            <div className="font-medium text-3xl text-900 mb-3">Personal Information</div>
            <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
            <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Full Name</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{profileData.full_name}</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Genre</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Chip label="Crime" className="mr-2" />
                        <Chip label="Drama" className="mr-2" />
                        <Chip label="Thriller" />
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{profileData.email}</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Do not Edit" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Username</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{profileData.username}</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Company Name</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{profileData.company_name}.</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                    <Button label="Do not Edit" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Whatsapp</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{profileData.whatsapp}.</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                    <Button label="Do not Edit" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">KTP</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{profileData.ktp}.</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Deactive Account</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">.</div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Request" icon="pi pi-exclamation-triangle" className="p-button-text" />
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default withAuth(Profile);
