import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../../layout/AppConfig';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import Link from 'next/link';
import { LayoutContext } from '../../layout/context/layoutcontext';

const RequestForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState({ type: '', message: '' });
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleForgot = async () => {
        setNotification({ type: '', message: '' }); // Reset notification
        try {
            const response = await axios.post(
                'https://103.127.134.78:2356/api/auth/request-reset-password',
                { email },
                {
                    headers: {
                        'X-Api-Key': '3f=Pr#g1@RU-nw=30'  // Adding the custom API key header
                    }
                }
            );
    

            if (response.status === 200) {
                const data = response.data;
                setNotification({ type: 'success', message: 'Password reset email sent successfully!' });
                setTimeout(() => {
                    router.push(`/password/verify-reset-password?token=${data.data.token}`);  // Pass token as a query parameter
                }, 2000);
            } else {
                handleLoginError(response);
            }
        } catch (error) {
            console.error('Error during request:', error);
            setNotification({ type: 'error', message: 'An unexpected error occurred.' });
        }
    };

    const handleLoginError = async (response) => {
        const errorMessage = response.data.meta.message || response.data.error || 'An error occurred.';
        setNotification({ type: 'error', message: errorMessage });
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
            <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>

                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                    <div className="text-center mb-5">
                    <div className="text-900 text-2xl font-medium mb-2">Reset Your Password</div>
                            {notification.message && (
                                <div
                                    className={classNames(
                                        'p-2 rounded text-center mb-3',
                                        notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    )}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    {notification.message}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-lg font-medium mb-2">
                                Email Address
                            </label>
                            <InputText
                                id="email1"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                                style={{ padding: '0.75rem', fontSize: '1rem' }}
                                placeholder="Enter your email"
                            />
                            <Button
                                className="w-full mt-4"
                                style={{
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                }}
                                onClick={handleForgot}
                            >
                                Send Reset Link
                            </Button>
                            <div className="text-center mt-4">
                                <span className="text-600">Don't have an account? </span>
                                <Link href="/accounts/tap/register">
                                    <a
                                        className="font-medium"
                                        style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}
                                    >
                                        Register here
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

RequestForgotPassword.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default RequestForgotPassword;
