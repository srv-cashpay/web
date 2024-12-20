import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import React, { useState, useRef,useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

const LoginPage = () => {
    const toast = useRef(null);
    const [loginMethod, setLoginMethod] = useState('whatsapp'); // Default login method (whatsapp or email)
    const [countryCode, setCountryCode] = useState('+62'); // Default +62
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState(''); // Add state for email
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [notification, setNotification] = useState({
        type: '',
        message: ''
    });
    const router = useRouter();

    useEffect(() => {
        if (Cookies.get('token')) {
            router.push('./d/for/desk');
        }
    }, []);

    const formatWhatsappNumber = (value) => {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.length > 0 && cleaned[0] !== '8') {
            cleaned = '8' + cleaned;
        }
        let formatted = cleaned;
        if (cleaned.length > 3) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
        }
        if (cleaned.length > 7) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
        }
        return formatted;
    };

    useEffect(() => {
        setWhatsapp(formatWhatsappNumber(whatsapp));
    }, [whatsapp]);

    const handleLogin = async () => {
        setNotification({ type: '', message: '' });

        try {
            // Choose the correct login data based on method
            const loginData = loginMethod === 'whatsapp' ? { whatsapp, password } : { email, password };
            const response = await axios.post('http://127.0.0.1:2356/api/auth/signin', loginData, {
                headers: {
                    'X-Api-Key': '3f=Pr#g1@RU-nw=30'
                }
            });

            if (response.data.status) {
                const data = response.data.data;
                Cookies.set('token', data.token);
                Cookies.set('refresh_token', data.refresh_token);
                localStorage.setItem('token', data.merchant_id);
                router.push({
                    pathname: './d/for/desk',
                    query: { switcher_access: data.merchant_id }
                });
            } else {
                setNotification({ type: 'error', message: meta.message });
            }
        } catch (error) {
            const errorMessage =
            error.response?.data?.meta?.message;
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000,
            });

        }
    };

    // Cek apakah semua input sudah terisi
    const isFormFilled = () => {
        if (loginMethod === 'whatsapp') {
            return whatsapp && password;
        } else {
            return email && password;
        }
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden');

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                    <Toast ref={toast} />
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Sign in to continue!</div>
                            {notification.message && (
                                <div className={notification.type === 'error' ? 'alert alert-danger' : 'alert alert-success'}>
                                    {notification.message}
                                </div>
                            )}
                        </div>
                        <div>
                            {/* Add Tabs to switch between WhatsApp and Email */}
                            <div className="flex justify-content-center mb-3">
                                <Button label="Login with WhatsApp" className={`mr-2 ${loginMethod === 'whatsapp' ? 'p-button-primary' : 'p-button-outlined'}`} onClick={() => setLoginMethod('whatsapp')} />
                                <Button label="Login with Email" className={loginMethod === 'email' ? 'p-button-primary' : 'p-button-outlined'} onClick={() => setLoginMethod('email')} />
                            </div>

                            {loginMethod === 'whatsapp' ? (
                                <div className="flex mb-2">
                                    <InputText
                                        inputid="countryCode"
                                        type="text"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="mr-2"
                                        style={{ padding: '1rem', width: '4rem' }}
                                        placeholder='+62'
                                        disabled
                                    />
                                    <InputText
                                        inputid="whatsapp1"
                                        type="text"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="w-full"
                                        style={{ padding: '1rem' }}
                                        placeholder='Input WhatsApp Number'
                                    />
                                </div>
                            ) : (
                                <div className="mb-2">
                                    <InputText
                                        inputid="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full"
                                        style={{ padding: '1rem' }}
                                        placeholder='Input Email Address'
                                    />
                                </div>
                            )}

                            {/* Password input will only be shown if email or whatsapp input has been filled */}
                            {(loginMethod === 'whatsapp' && whatsapp.length > 11) || (loginMethod === 'email' && email.length > 0) ? (
                                <div className="mb-3">
                                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-24rem" />
                                </div>
                            ) : null}

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2" />
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <Link href="/password/request-forgot-password">
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Forgot password?
                                    </a>
                                </Link>
                            </div>

                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin} disabled={!isFormFilled()}></Button>

                            <Link href="/accounts/tap/register">
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    You Don't have an account?
                                    <span className="font-medium no-underline cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Register?
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default LoginPage;
