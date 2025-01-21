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

                // Membentuk struktur menu berdasarkan data API
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
                            }
                        ]
                    },
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-briefcase',
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

