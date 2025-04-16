import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import AppConfig from '../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

const resetpassword = () => {
    // const [token, setToken] = useState('');
    const [new_password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    const [notification, setNotification] = useState({
        type: '', // 'success' or 'error'
        message: ''
    });
    const { token } = router.query;

    const handleForgot = async () => {
        setNotification({
            type: '',
            message: ''
        }); // Reset notification

        try {
            const response = await axios.post(`https://103.127.134.78:2356/api/auth/resetpassword?token=${token}`,  
                { new_password },
                {
                    headers: {
                        'X-Api-Key': '3f=Pr#g1@RU-nw=30'  // Adding the custom API key header
                    }
                }
            );
            
            if (response.status === 200) {
                // Anda dapat memeriksa respons dari server untuk pesan atau informasi tambahan jika diperlukan.
                // const data = response.data;

                // Redirect ke halaman tertentu setelah berhasil reset password
                router.push('/accounts/tap/login');
            } else {
                await handleLoginError(response);
            }
        } catch (error) {
            console.error('Error during reset password', error);
            setNotification({ type: 'error', message: 'An unexpected error occurred.' });
        }
    };

    const handleLoginError = async (response) => {
        try {
            const errorData = await response.json();
    
            if (errorData.meta && !errorData.meta.status && errorData.meta.message) {
                setNotification({
                    type: 'error',
                    message: errorData.meta.message
                });
            } else if (errorData.error) {
                setNotification({
                    type: 'error',
                    message: errorData.error
                });
            }
        } catch (error) {
            console.error('Error parsing reset password response', error);
            setNotification({
                type: 'error',
                message: 'An error occurred while processing the response.'
            });
        }
    };


    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Reset password!</div>                           
                            <span className="text-600 font-medium">
                            <div className={notification.type === 'error' ? 'alert alert-danger' : 'alert alert-success'}>
                                {notification.message}
                            </div>
                            </span>
                        </div>
                       
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                New password
                            </label>
                            
                            <Password inputid="password1" value={new_password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <Button className="w-full p-3 text-xl" onClick={handleForgot}>
                                 <span>Send</span>
                            </Button>
                            <Link href="/accounts/tap/register">
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>You Don't have account ?  
                                <a className="font-medium no-underline cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Register?
                                </a>
                                </div>  
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
    resetpassword.getLayout = function getLayout(page) {
        return (
            <React.Fragment>
                {page}
                <AppConfig simple />
            </React.Fragment>
        );
    };
    export default resetpassword;