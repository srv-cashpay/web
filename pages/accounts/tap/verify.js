import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useRef, useEffect } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import Link from 'next/link';

const VerifyPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const { token } = router.query; // Ambil token dari query parameter
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    const [notification, setNotification] = useState({
        type: '', // 'success' or 'error'
        message: ''
    });

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef([]);

    // Timer State
    const [timer, setTimer] = useState(240); // 4 menit (240 detik)
    const [canResend, setCanResend] = useState(false);

    // Cek apakah semua input OTP sudah terisi
    const isOtpComplete = otp.every(digit => digit !== '');

    useEffect(() => {
        if (!token) {
            setNotification({ type: 'error', message: 'Missing token in URL.' });
        }

        // Timer countdown
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev > 0) return prev - 1;
                clearInterval(interval);
                setCanResend(true);
                return 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [token]);

    const handleRegister = async () => {
        const otpCode = otp.join(''); // Gabungkan digit OTP menjadi satu string
    
        if (!token) {
            setNotification({ type: 'error', message: 'Missing token. Please try again.' });
            return;
        }
    
        try {
            const response = await axios.post(`https://103.127.134.78:2356/verify?token=${token}`, { otp: otpCode });
    
            // Cek jika respons berhasil
            if (response.data.status && response.data.code === 200) {
                // Gunakan pesan dari API
                setNotification({ type: 'success', message: response.data.message }); 
                router.push('/accounts/tap/login'); // Redirect ke login jika berhasil
            } else {
                // Jika tidak sukses, tampilkan pesan error dari API
                setNotification({ type: 'error', message: response.data.message || 'Verification failed.' });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setNotification({ type: 'error', message: 'An error occurred. Please try again later.' });
        }
    };
    

    const handleOtpChange = (index, value) => {
        if (value.length > 1 || isNaN(value)) return; // Hanya satu digit angka

        const newOtp = [...otp];
        newOtp[index] = value;

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1].focus(); // Pindah fokus ke input berikutnya
        } else if (!value && index > 0) {
            otpRefs.current[index - 1].focus(); // Kembali ke input sebelumnya
        }

        setOtp(newOtp);
    };

    const handleResendCode = async () => {
        // Reset state untuk resend code
        setCanResend(false);
        setTimer(240); // Mulai hitung mundur lagi

        try {
            // Kirim request PUT ke API
            const response = await axios.put(`https://103.127.134.78:2356/resend-otp?token=${token}`);
            if (response.data.success) {
                setNotification({ type: 'success', message: 'OTP resent successfully.' });
            } else {
                setNotification({ type: 'error', message: 'Failed to resend OTP. Please try again.' });
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            setNotification({ type: 'error', message: 'An error occurred while resending OTP. Please try again later.' });
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Verify OTP</div>
                            <span className="text-600 font-medium">
                                <div className={notification.type === 'error' ? 'alert alert-danger' : 'alert alert-success'}>
                                    {notification.message}
                                </div>
                            </span>
                        </div>

                        {/* Hanya tampilkan input OTP dan tombol Verify jika timer belum habis */}
                        {timer > 0 ? (
                            <>
                                <label htmlFor="otp" className="block text-900 text-xl font-medium mb-2">Enter OTP</label>
                                <div className="flex justify-content-center mb-5">
                                    {otp.map((digit, index) => (
                                        <InputText
                                            key={index}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            ref={el => otpRefs.current[index] = el}
                                            className="mx-1 text-center"
                                            style={{ width: '60px', height: '60px', padding: '0.5rem', textAlign: 'center' }}
                                            maxLength={1}
                                            type="text"
                                        />
                                    ))}
                                </div>

                                <Button 
                                    label="Verify" 
                                    className="w-full p-3 text-xl" 
                                    onClick={handleRegister} 
                                    disabled={!isOtpComplete} // Tombol Verify dinonaktifkan jika OTP belum lengkap
                                />
                            </>
                        ) : (
                            <p className="text-center text-red-600 mb-3">OTP expired. Please resend the OTP.</p>
                        )}

                        {/* Resend OTP */}
                        {canResend ? (
                            <Button
                                label="Resend Code"
                                className="w-full p-3 text-xl mt-3"
                                onClick={handleResendCode}
                                disabled={!canResend || isOtpComplete} // Tombol Resend dinonaktifkan jika OTP belum lengkap atau timer belum habis
                            />
                        ) : (
                            <p className="text-center mt-3">Resend code in {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`} minutes</p>
                        )}

                        <Link href="/accounts/tap/login">
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>You have account ?  
                                <a className="font-medium no-underline cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Login?
                                </a>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

VerifyPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default VerifyPage;
