import getConfig from 'next/config';
import React, { useContext, useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import Cookies from 'js-cookie';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [fullName, setFullName] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFullName =  localStorage.getItem('fullName');
            const token = localStorage.getItem('token');

            if (token) setToken(token);
            if (storedFullName) {
                setFullName(storedFullName);
            }
        }
    }, []);
    
    const model = [
        {
            label: `Welcome, ${fullName}!`,
            items: [{ 
                label: 'Dashboard', 
                icon: 'pi pi-fw pi-home', 
                to: '/accounts/tap/d/for/desk', 
                query: { switcher_access: token }
            }],            
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Merchant',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/pages/merchant'
                },
                {
                    label: 'User Account',
                    icon: 'pi pi-fw pi-user',
                    to: '/pages/user'
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
                    label: 'Satuan',
                    icon: 'pi pi-fw pi-clone',
                    to: '/pages/merk'
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
                // {
                //     label: 'Landing',
                //     icon: 'pi pi-fw pi-globe',
                //     to: '/landing'
                // },
                // ////{
                //     label: 'Auth',
                //     icon: 'pi pi-fw pi-user',
                //     items: [
                //         {
                //             label: 'Permision',
                //             icon: 'pi pi-fw pi-sign-in',
                //             to: '/auth/login'
                //         },
                //         {
                //             label: 'Role',
                //             icon: 'pi pi-fw pi-sitemap',
                //             to: '/auth/error'
                //         }
                //     ]
                // ////},
                // {
                //     label: 'Attendance',
                //     icon: 'pi pi-fw pi-calendar',
                //     to: '/pages/attendance'
                // },
                // ///{
                //     label: 'Ticket',
                //     icon: 'pi pi-fw pi-pencil',
                //     to: '/pages/ticket'
                // },                
                // {
                //     label: 'Job',
                //     icon: 'pi pi-fw pi-file',
                //     to: '/pages/job'
                // },
                // {
                //     label: 'Timeline',
                //     icon: 'pi pi-fw pi-calendar',
                //     to: '/pages/timeline'
                // },
                // {
                //     label: 'Not Found',
                //     icon: 'pi pi-fw pi-exclamation-circle',
                //     to: '/pages/notfound'
                // },
                // {
                //     label: 'Empty',
                //     icon: 'pi pi-fw pi-circle-off',
                //     to: '/pages/empty'
                // },
                {
                    label: 'Package',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/package'
                },
                {
                    label: 'Reservation',
                    icon: 'pi pi-fw pi-flag-fill',
                    to: '/pages/table'
                },
                {   label: 'Report', 
                    icon: 'pi pi-fw pi-chart-bar', 
                    to: '/pages/charts' 
                },
                // {
                //     label: 'Setting',
                //     icon: 'pi pi-fw pi-wrench',
                //     to: '/pages/setting'
                // },

            ]
        },
        // {
        //     label: 'UI Components',
        //     items: [
        //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
        //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
        //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
        //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
        //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
        //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
        //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
        //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
        //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
        //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
        //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
        //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
        //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
        //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
        //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
        //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        //     ]
        // },
        // {
        //     label: 'Utilities',
        //     items: [
        //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
        //     ]
        // },
     
      
        // {
        //     label: 'Get Started',
        //     items: [
        //         {
        //             label: 'Documentation',
        //             icon: 'pi pi-fw pi-question',
        //             to: '/documentation'
        //         },
        //         {
        //             label: 'View Source',
        //             icon: 'pi pi-fw pi-search',
        //             url: 'https://github.com/primefaces/sakai-react',
        //             target: '_blank'
        //         }
        //     ]
        // }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://www.primefaces.org/primeblocks-react">
                    <a target="_blank" style={{ cursor: 'pointer' }}>
                        <img alt="Prime Blocks" className="w-full mt-3" src={`${contextPath}/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                    </a>
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
