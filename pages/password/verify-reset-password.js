import { useState } from 'react'; 
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';

const VerifyResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [notification, setNotification] = useState({ type: '', message: '' });
    const router = useRouter();
    const { token, email } = router.query; // Assuming the token and email are in the query parameters

    const handleVerify = async () => {
        setNotification({ type: '', message: '' }); // Reset notification

        if (otp.length !== 4 || isNaN(otp)) {
            setNotification({ type: 'error', message: 'PIN must be a 4-digit number.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://192.168.14.248:2356/api/auth/verify-reset?token=${token}`,
                { otp },
                {
                    headers: {
                        'X-Api-Key': '3f=Pr#g1@RU-nw=30'  // Adding the custom API key header
                    }
                }
            );

            if (response.status === 200) {
                const data = response.data;
                setNotification({ type: 'success', message: 'PIN verified successfully!' });
                setTimeout(() => {
                    router.push(`/password/reset-password?token=${data.data.token}`);  // Pass token as a query parameter
                }, 2000);
            } else {
                handleVerifyError(response);
            }
        } catch (error) {
            console.error('Error during verification:', error);
            setNotification({ type: 'error', message: 'An unexpected error occurred.' });
        }
    };

    const handleVerifyError = async (response) => {
<<<<<<< HEAD
        const errorMessage = response.data.meta.message || response.data.error || 'Verification failed.';
=======
        const errorMessage = response.data.meta.message || response?.data?.error || 'Verification failed.';
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
        setNotification({ type: 'error', message: errorMessage });
    };

    // Resend OTP request
    const handleResendOtp = async () => {
        setNotification({ type: '', message: '' }); // Reset notification

        try {
            const response = await axios.post(
                `http://192.168.14.248:2356/api/auth/resend-reset?token=${token}`, 
                { email },
                {
                    headers: {
                        'X-Api-Key': '3f=Pr#g1@RU-nw=30'  // Adding the custom API key header
                    }
                }
            );

            if (response.status === 200) {
                setNotification({ type: 'success', message: 'PIN has been resent to your email!' });
            } else {
                setNotification({ type: 'error', message: 'Failed to resend PIN.' });
            }
        } catch (error) {
            console.error('Error during resend:', error);
            setNotification({ type: 'error', message: 'An error occurred while resending the PIN.' });
        }
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'
    );

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-2xl font-medium mb-2">Verify PIN</div>
                            <p className="text-600">Enter the 4-digit PIN sent to your email to proceed.</p>
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
                            <label htmlFor="otp" className="block text-900 text-lg font-medium mb-2">
                                PIN Code
                            </label>
                            <InputText
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Allow only digits
                                maxLength={4}
                                className="w-full"
                                style={{ padding: '0.75rem', fontSize: '1rem', textAlign: 'center', letterSpacing: '0.5rem' }}
                                placeholder="****"
                            />
                            <Button
                                className="w-full mt-4"
                                style={{
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                }}
                                onClick={handleVerify}
                            >
                                Verify PIN
                            </Button>
                            <div className="text-center mt-4">
                                <span className="text-600">Didn't receive the PIN? </span>
                                <button
                                    className="font-medium"
                                    style={{ color: 'var(--primary-color)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={handleResendOtp} // Resend OTP function
                                >
                                    Resend PIN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

VerifyResetPassword.getLayout = function getLayout(page) {
    return page;
};

export default VerifyResetPassword;
