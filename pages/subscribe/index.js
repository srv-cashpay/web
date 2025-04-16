import { Button } from 'primereact/button';
import React, { useState,useEffect  } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

const BlocksDemo = () => {
    
    const [packages, setPackages] = useState([]);
    const getTokenFromCookie = () => {
        const token = Cookies.get('token'); // <-- Replace 'yourCookieName' with the actual name of your cookie

        return token;
    };


    const handlePayment = async (code) => {
        const token = getTokenFromCookie();

        const response = await axios.get(`https://103.127.134.78:8080/api/v1/package/${code}`, {
          headers: {
            Authorization: `Bearer ${token}`
        }
    });
        
    const data = response.data;
        // const data = await response.json();
        // window.snap.pay(data.snap.token);
        console.log(data);

      };

    // 2. Fetch Data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getTokenFromCookie();
    
                const response = await axios.get(`https://103.127.134.78:8080/api/v1/package`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                // Check if the response status is not in the range of 200-299
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                // Axios automatically parses the response for you
                const data = response.data;
    
                // Assuming data is an array, set it to the state
                setPackages(data);  
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    return (
        <>  

            <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
                <div className="grid">
                    {packages.map((pkg) => (
                        <div className="col-12 lg:col-4" key={pkg.id}>
                            <div className="p-3 h-full">
                                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                                    <div className="text-900 font-medium text-xl mb-2">{pkg.name}</div>
                                    <div className="text-600">Plan description</div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <div className="flex align-items-center">
                                        <span className="font-bold text-2xl text-900">{pkg.price}</span>
                                        <span className="ml-2 font-medium text-600">per month</span>
                                    </div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <ul className="list-none p-0 m-0 flex-grow-1">
                                        {Object.entries(pkg.description).map(([key, value]) => (
                                            <li key={key} className="flex align-items-center mb-3">
                                                <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                <span>{key}: {value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                                    <Link href={`/subscribe/checkout?code=${pkg.code}`}>
                                        <Button 
                                            label="Buy Now" 
                                            className="p-3 w-full mt-auto"
                                            disabled={pkg.name === "FREE"} // Disable the button if the package name is "FREE"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default BlocksDemo;
