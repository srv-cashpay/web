import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import Link from 'next/link';

const RegisterPage = () => {
    const [full_name, setFullName] = useState('');
    const [countryCode, setCountryCode] = useState('+62');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State untuk loading
    const [notification, setNotification] = useState({
        type: '', // 'success' or 'error'
        message: ''
    });

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
        const isValid = full_name && whatsapp && email && password;
        setIsFormValid(isValid);
        setWhatsapp(formatWhatsappNumber(whatsapp));
    }, [full_name, whatsapp, email, password]);

    const handleRegister = async () => {
        setIsLoading(true); // Aktifkan loading saat registrasi dimulai
        try {
            const fullWhatsappNumber = `${countryCode}${whatsapp}`;
            const response = await axios.post('http://127.0.0.1:2356/api/auth/signup', {
                full_name,
                email,
                password,
                whatsapp: fullWhatsappNumber
            }, {
                headers: {
                    'x-api-key': '3f=Pr#g1@RU-nw=30'
                }
            });

            if (response.status === 200) {
                const data = response.data;

                // Alihkan ke halaman verifikasi dengan token
                router.push(`/accounts/tap/verify?token=${data.data.token}`);
            } else {
                setNotification({ type: 'error', message: 'Registration failed.' });
            }
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                setNotification({ type: 'error', message: data.meta.message });
            } else {
                console.error('Error during registration', error);
                setNotification({ type: 'error', message: 'An unexpected error occurred.' });
            }
        } finally {
            setIsLoading(false); // Matikan loading setelah selesai
        }
    };

    return (
        <div className={classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' })}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Sign up to continue!</div>
                            <span className="text-600 font-medium">
                                <div className={notification.type === 'error' ? 'alert alert-danger' : 'alert alert-success'}>
                                    {notification.message}
                                </div>
                            </span>
                        </div>

                        {isLoading ? ( // Tampilkan spinner jika loading
                            <div className="flex justify-content-center">
                                <ProgressSpinner />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="fullname1" className="block text-900 text-xl font-medium mb-2">*Full Name</label>
                                <InputText id="fullname1" type="text" value={full_name} onChange={(e) => setFullName(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} placeholder='Input Your Name' />

                                <label htmlFor="whatsapp1" className="block text-900 text-xl font-medium mb-2">*No Whatsapp</label>
                                <div className="flex">
                                    <InputText inputid="countryCode" type="text" value={countryCode} className="mb-5 mr-2" style={{ padding: '1rem', width: '4rem' }} disabled />
                                    <InputText inputid="whatsapp1" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full md:w-25,2rem mb-5" style={{ padding: '1rem' }} placeholder='Input WhatsApp Number' />
                                </div>

                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">*Email</label>
                                <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} placeholder='Email Company' />

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">*Password</label>
                                <Password id="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link href="/password/request-forgot-password">
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>Forgot password?</a>
                                    </Link>
                                </div>

                                <Button label="Sign Up" className="w-full p-3 text-xl" onClick={handleRegister} disabled={!isFormValid || isLoading} />
                                <Link href="/accounts/tap/login">
                                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                        Already have an account?
                                        <a className="font-medium no-underline cursor-pointer" style={{ color: 'var(--primary-color)' }}>Login?</a>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default RegisterPage;
