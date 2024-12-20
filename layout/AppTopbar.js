import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=-99999999; path=/; login;`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleLogout = async () => {
        const token = getCookie('token'); // Mengambil token dari cookie

        try {
            const response = await fetch('http://localhost:2356/api/logout', {
                method: 'POST', // Atur metode sesuai kebutuhan API Anda
                headers: {
                    'Authorization': `Bearer ${token}` // Menggunakan token dari cookie
                }
            });
    
            if (response.ok) {
                // Sukses logout
                console.log('Logout successful');
                
                // Hapus token dari storage (jika ada)
                // Misal, jika Anda menyimpan token di local storage:
                deleteCookie('token');
                deleteCookie('refresh_token');

                localStorage.removeItem('token');

                // Redirect ke halaman login atau halaman lain yang sesuai
                router.push('/accounts/tap/login');
            } else {
                // Handle kesalahan logout
                console.error('Failed to logout', response);
            }
        } catch (error) {
            console.error('Error during logout', error);
        }
    };
    

    return (
        <div className="layout-topbar">
            <Link href="/">
                <a className="layout-topbar-logo">
                    <>
                        {/* <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} widt={'true'} alt="logo" /> */}
                        <span>CashPay</span>
                    </>
                </a>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <Link href="/profile">
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                </Link>

                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
                    <button type="button" className="p-link layout-topbar-button" onClick={handleLogout}>
                        <i className="pi pi-sign-out"></i>
                        <span>Logout</span>
                    </button>
            </div>
        </div>
    );
});

export default AppTopbar;
