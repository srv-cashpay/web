import React, { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import axios from 'axios'; // Import Axios

const Checkout = () => {
    const router = useRouter();
    const { code } = router.query; // Mengambil nilai dari parameter 'code'
    const [data, setData] = useState(null);  // Pastikan Anda memiliki baris ini
    const [paymentData, setPaymentData] = useState({
        id: "",
        price: "",
        name: ""
    });
    const getTokenFromCookie = () => {
        const token = Cookies.get('token'); // <-- Replace 'yourCookieName' with the actual name of your cookie
        return token;
    };

    useEffect(() => {
        if (code) { // Memeriksa apakah ada kode yang diterima dari URL
            const fetchData = async () => {
                try {
                    const token = getTokenFromCookie();
                    const response = await axios.get(`https://103.127.134.78:8080/api/v1/package/${code}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    setData(response.data.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [code]);

    useEffect(() => {
        if (data) {
            setPaymentData({
                id: data.id,
                price: data.price,
                name: data.name
            });
        }
    }, [data]);

    const initiatePayment = async () => {
        try {
            const token = getTokenFromCookie();

            const response = await axios.post('https://103.127.134.78:8080/api/v1/payment', paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.status && response.data.code === 200) {
                window.location.href = response.data.data.redirect_url;
            } else {
                console.error("Payment initiation failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
        }
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-8">
                <div className="card">
                    <h3>Contact Information</h3>
                    <div className="flex align-items-center flex-wrap gap-2 mb-3">
                        <label htmlFor="username1" className="col-fixed w-9rem">
                            Username
                        </label>
                        <InputText id="username1" onChange={(e) => setUsername(e.target.value)} required className="p-invalid" />
                        <Message severity="error" text="Username is required" />
                    </div>
                    <div className="flex align-items-center flex-wrap gap-2">
                        <label htmlFor="email" className="col-fixed w-9rem">
                            Email
                        </label>
                        <InputText id="email"  onChange={(e) => setEmail(e.target.value)} required className="p-invalid" />
                        <Message severity="error" />
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-4">
                <div className="card">
                    <h5>Help Text</h5>
                    {data && (
                        <div className="package-item">
                            {/* Tampilkan informasi paket di sini */}
                            <p><strong>ID:</strong> {data.id}</p>
                            <p><strong>Package:</strong> {data.name}</p>
                            <p><strong>Code:</strong> {data.code}</p>
                            <p><strong>Price:</strong> {data.price}</p>
                            {/* ... tambahkan informasi lainnya sesuai kebutuhan */}
                        </div>
                    )}
                </div>
            </div>
            <div>
            <h1>Checkout Page</h1>
            <button onClick={initiatePayment}>Bayar dengan Midtrans</button>
        </div>
        </div>
    );
};

export default Checkout;