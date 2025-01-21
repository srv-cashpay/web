import React, { useContext, useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem'; // Komponen menu item
import { LayoutContext } from './context/layoutcontext'; // Konteks tata letak
import { MenuProvider } from './context/menucontext'; // Konteks menu
import { fetchMerchantData } from './Api'; // Fungsi fetch data dari API

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext); // Konfigurasi tata letak
    const [model, setModel] = useState([]); // Data menu
    const [error, setError] = useState(null); // Pesan error

    useEffect(() => {
        const fullName = localStorage.getItem('fullName') || 'Guest'; // Nama pengguna

        const loadMenu = async () => {
            try {
                // Panggil API untuk mendapatkan data menu
                const data = await fetchMerchantData();

                // Bentuk model menu berdasarkan data API
                const fetchedItems = data.items || [];
                setModel([
                    {
                        label: `Welcome, ${fullName}!`,
                        items: [
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-fw pi-home',
                                to: '/accounts/tap/d/for/desk',
                                query: { switcher_access: localStorage.getItem('token') },
                            },
                        ],
                    },
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-briefcase',
                        items: fetchedItems.map((item) => ({
                            label: item.label,
                            icon: item.icon,
                            to: item.to,
                        })),
                    },
                ]);
            } catch (err) {
                setError(`Failed to load menu: ${err.message}`);
                console.error('Error loading menu:', err);
            }
        };

        loadMenu();
    }, []);

    // Render pesan error jika terjadi kesalahan
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
