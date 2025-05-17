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
        gross_amount: 72650, // Rp49.000 + PPN 11%
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
            const response = await fetch('https://cashpay.my.id:2358/api/merchant/packages/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.status && data.data.token) {
                setPaymentToken(data.data.token);
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
            {/* Deskripsi di bagian atas halaman */}
            <div className="col-12">
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <h2>Upgrade to Premium</h2>
                <p>Dapatkan semua fitur premium untuk meningkatkan pengalaman dan performa penjualan Anda:</p>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                        <li>✓ Langganan selama 1 bulan</li>
                        <li>✓ Bebas Iklan</li>
                        <li>✓ Laporan Penjualan Lengkap</li>
                        <li>✓ Dukungan Prioritas</li>
                        <li>✓ Fitur Khusus Merchant</li>
                    </ul>
                </div>
            </div>

            {/* Form & Order Summary */}
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
                            await fetchPaymentToken();
                            handleMidtransPayment();
                        }}
                        className="p-button-success"
                    />
                </div>
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="col-12 md:col-6">
                <div className="card p-fluid" style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                    <h5 style={{ color: '#000', marginBottom: '1rem' }}>Order Summary</h5>
                    <div className="field grid align-items-center">
                        <div className="col-6">
                            <h5 style={{ color: '#000', margin: 0 }}>Subtotal</h5>
                        </div>
                        <div className="col-6 text-right">
                            <h5 style={{ color: '#000', margin: 0 }}>Rp49,000</h5>
                        </div>
                    </div>

                    <div className="field grid align-items-center">
                        <div className="col-6">
                            <h5 style={{ color: '#000', margin: 0 }}>PPN @ 11.00%</h5>
                        </div>
                        <div className="col-6 text-right">
                            <h5 style={{ color: '#000', margin: 0 }}>Rp5,390</h5>
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
