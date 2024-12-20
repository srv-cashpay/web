import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Cookies from 'js-cookie';
import Link from 'next/link';
    
const Package = () => {
    const [paymentToken, setPaymentToken] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        gross_amount: 1,
    });

    const getTokenFromCookie = () => Cookies.get('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchPaymentToken = async () => {
        const token = getTokenFromCookie();
        try {
            const response = await fetch('http://localhost:2358/api/merchant/packages/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (data.status && data.data.token) {
                console.log('Token fetched:', data.data.token); // Log untuk memastikan token benar
                setPaymentToken(data.data.token); // Simpan token untuk digunakan di Snap.js
            } else {
                console.error('Invalid response:', data);
                alert('Gagal mengambil token pembayaran');
            }
        } catch (error) {
            console.error('Error fetching payment token:', error);
            alert('Gagal mengambil token pembayaran, periksa koneksi Anda');
        }
    };
    

    const handleMidtransPayment = () => {
        if (!paymentToken) {
            alert('Token pembayaran tidak tersedia. Coba klik PAY lagi.');
            return;
        }

        if (window.snap) {
            window.snap.pay(paymentToken, {
                onClose: function () {
                    alert('Jendela pembayaran Midtrans ditutup.');
                },
            });
        } else {
            alert('Snap.js belum terinisialisasi!');
        }
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="first_name">First Name</label>
                        <InputText
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="last_name">Last Name</label>
                        <InputText
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                        />
                    </div>
                    <Button
                        label="PAY"
                        onClick={async () => {
                            await fetchPaymentToken(); // Dapatkan token sebelum membuka Snap
                            handleMidtransPayment(); // Lanjutkan dengan pembayaran jika token berhasil didapatkan
                        }}
                        className="p-button-success"
                    />
                </div>
            </div>
            
            <div className="col-12 md:col-6">
                <div className="card p-fluid" style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#000', marginBottom: '1rem' }}>Order Summary</h5>
                    <div className="field grid align-items-center">
                        <div className="col-6">
                            <h5 style={{ color: '#000', margin: 0 }}>Subtotal</h5>
                        </div>
                        <div className="col-6 text-right">
                            <h5 style={{ color: '#000', margin: 0 }}>Rp.49,000</h5>
                        </div>
                    </div>

                    <div className="field grid align-items-center">
                        <div className="col-6">
                            <h5 style={{ color: '#000', margin: 0 }}>PPN @ 11.00%</h5>
                        </div>
                        <div className="col-6 text-right">
                            <h5 style={{ color: '#000', margin: 0 }}>Rp.23,650</h5>
                        </div>
                    </div>

                    <hr style={{ borderColor: '#000', opacity: 0.2, margin: '1rem 0' }} />

                    <div className="field grid align-items-center">
                        <div className="col-6">
                            <h5 style={{ color: '#000', margin: 0 }}>Total Monthly</h5>
                        </div>
                        <div className="col-6 text-right">
                            <h5 style={{ color: '#000', margin: 0 }}>
                                Rp{formData.gross_amount.toLocaleString('id-ID')}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default Package;
