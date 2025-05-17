import React, { useContext, useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { fetchMerchantData } from './Api'; // Import fungsi fetchMerchantData

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext); // Mengakses konfigurasi tata letak
    const [model, setModel] = useState([]); // Menyimpan data menu
    const [error, setError] = useState(null); // Menangani error

    useEffect(() => {
        const fullName = localStorage.getItem('fullName') || 'Guest'; // Mendapatkan nama pengguna dari localStorage

        const loadMenu = async () => {
            try {
                // Panggil fungsi fetchMerchantData dari API
                const data = await fetchMerchantData();

                // Pastikan bahwa data yang diterima sesuai dengan format yang diinginkan
                const fetchedItems = data.items || [];
                setModel([
                    {
                        label: `Welcome, ${fullName}!`,
                        items: [
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-fw pi-home',
                                to: '/accounts/tap/d/for/desk',
                                query: { switcher_access: localStorage.getItem('token') }
                            },
                            {
                                label: 'Merchant',
                                icon: 'pi pi-fw pi-id-card',
                                to: '/pages/merchant'
                            },
                            {
                                label: 'Merk',
                                icon: 'pi pi-fw pi-clone',
                                to: '/pages/merk'
                            },
                            {
                                label: 'Category',
                                icon: 'pi pi-fw pi-clone',
                                to: '/pages/category'
                            },
                            {
                                label: 'Unit',
                                icon: 'pi pi-fw pi-clone',
                                to: '/pages/unit'
                            },
                            {
                                label: 'Products',
                                icon: 'pi pi-fw pi-box',
                                to: '/pages/inventory'
                            },
                            {
                                label: 'Discounts',
                                icon: 'pi pi-fw pi-eraser',
                                to: '/pages/discount'
                            },
                            {
                                label: 'Tax/Pajak',
                                icon: 'pi pi-fw pi-percentage',
                                to: '/pages/tax'
                            },
                            {
                                label: 'Package',
                                icon: 'pi pi-fw pi-circle-off',
                                to: '/pages/package'
                            },
                            {
                                label: 'Payment',
                                icon: 'pi pi-fw pi-eraser',
                                to: '/pages/payment'
                            },
                            {
                                label: 'Reservation',
                                icon: 'pi pi-fw pi-flag-fill',
                                to: '/pages/table'
                            },
                            {   label: 'Report', 
                                icon: 'pi pi-fw pi-chart-bar', 
                                to: '/pages/report' 
                            },
                        ]
                    },
                    {
                        items: fetchedItems.map((item) => ({
                            label: item.label,
                            icon: item.icon,
                            to: item.to
                        }))
                    }
                ]);
            } catch (err) {
                setError(`Failed to load menu: ${err.message}`);
                console.error('Error loading menu:', err);
            }
        };

        loadMenu();
    }, []);

    // Menampilkan pesan error jika terjadi kesalahan
    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
            </div>
        );
    }

    // Render menu
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, index) => (
                    <AppMenuitem item={item} root={true} index={index} key={item.label} />
                ))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
