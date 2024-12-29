// Install dependencies before using this code:
// npm install primereact primeicons react-icons
// npm install @emotion/react @emotion/styled

import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const TableReservation = () => {
    const [selectedTables, setSelectedTables] = useState([]);
    const [reservationDetails, setReservationDetails] = useState({
        name: '',
        date: null,
    });
    const [showDialog, setShowDialog] = useState(false);

    const tables = Array.from({ length: 15 }, (_, i) => ({
        label: `Table ${i + 1}`,
        value: `Table ${i + 1}`
    }));

    const handleTableSelection = (tableValue) => {
        setSelectedTables((prevSelected) => {
            if (prevSelected.includes(tableValue)) {
                return prevSelected.filter((value) => value !== tableValue);
            } else {
                return [...prevSelected, tableValue];
            }
        });
    };

    const handleReservationSubmit = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!reservationDetails.name || !reservationDetails.date || selectedTables.length === 0) {
            alert('Please fill in all details!');
            return;
        }

        if (reservationDetails.date < today) {
            alert('Reservation date cannot be in the past!');
            return;
        }

        setShowDialog(true);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2>Table Reservation</h2>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="name">Name</label>
                    <InputText
                        id="name"
                        value={reservationDetails.name}
                        onChange={(e) => setReservationDetails({ ...reservationDetails, name: e.target.value })}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="date">Reservation Date</label>
                    <Calendar
                        id="date"
                        value={reservationDetails.date}
                        onChange={(e) => setReservationDetails({ ...reservationDetails, date: e.value })}
                        showTime
                        placeholder="Select date and time"
                        minDate={new Date()}
                    />
                </div>

                <Button 
                    label="Reserve Table" 
                    onClick={handleReservationSubmit} 
                    className="p-button-primary" 
                />
            </div>

            <Dialog 
                visible={showDialog} 
                onHide={() => setShowDialog(false)} 
                header="Reservation Confirmed"
            >
                <p>Thank you, {reservationDetails.name}!</p>
                <p>Your reservation for the following tables is confirmed on {reservationDetails.date?.toLocaleString()}:</p>
                <ul>
                    {selectedTables.map((table, index) => (
                        <li key={index}>{table}</li>
                    ))}
                </ul>
            </Dialog>

            <h3 style={{ marginTop: '40px' }}>Table Layout</h3>
            <div 
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '10px', 
                    marginTop: '20px' 
                }}
            >
                {tables.map((table, index) => (
                    <div
                        key={index}
                        onClick={() => handleTableSelection(table.value)}
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            textAlign: 'center',
                            backgroundColor: selectedTables.includes(table.value) ? '#d1e7dd' : '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        {table.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableReservation;
