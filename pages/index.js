import React, { useContext, useRef } from 'react';
import Link from 'next/link';
import getConfig from 'next/config';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { LayoutContext } from '../layout/context/layoutcontext';

const LandingPage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/">
                        <a className="flex align-items-center">
                            <img src={`${contextPath}/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                            <span className="text-900 font-medium text-2xl line-height-3 mr-8">Cashpay</span>
                        </a>
                    </Link>
                    <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                                    <a href="#home" className="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                        <span>Home</span>
                                    </a>
                                <Ripple />
                            </li>
                            <li>
                                    <a href='#features' className="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                        <span>Features</span>
                                    </a>
                                <Ripple />
                            </li>
                            <li>
                                    <a href="#highlights" className="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                        <span>Highlights</span>
                                    </a>
                                <Ripple />
                            </li>
                            
                        </ul>
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Link href="/accounts/tap/login">
                            <Button label="Sign In" className="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500"></Button>
                          </Link>  
                          <Link href="/accounts/tap/register">
                            <Button label="TRY FOR FREE" className="p-button-rounded border-none ml-5 font-light line-height-2 bg-blue-500 text-white"></Button>
                        </Link>  
                        </div>
                    </div>
                </div>

                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)', clipPath: 'ellipse(150% 87% at 93% 13%)' }}>
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-6xl font-bold text-gray-900 line-height-2">Cashpay
                            {/* <span className="font-light block"></span>Swipe To Connect */}
                        </h1>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Point of Sale (POS) mengacu pada tempat dan sistem di mana transaksi ritel terjadi. Pada dasarnya, sistem POS adalah gabungan antara perangkat keras dan perangkat lunak yang memungkinkan suatu bisnis untuk menyelesaikan penjualan, melacak inventaris, memproses pembayaran, dan menghasilkan struk.</p>
                        <Button type="button" label="Get Started" className="p-button-rounded text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"></Button>
                    </div>
                    <div className="flex justify-content-center md:justify-content-end">
                        <img src={`${contextPath}/demo/images/landing/screen-1.png`} alt="Hero Image" className="w-9 md:w-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default LandingPage;
