import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Calendar } from 'primereact/calendar'; // Import Calendar for date picker

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date
    const { layoutConfig } = useContext(LayoutContext);

    const handleDateChange = (name, value) => {
        if (name === 'start') {
            setStartDate(value);
        } else if (name === 'end') {
            setEndDate(value);
        }
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        // Filter the chart data based on the selected date range (startDate and endDate)
        const filteredData = barData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.filter((_, index) => {
                const date = new Date(barData.labels[index]);
                return (!startDate || date >= startDate) && (!endDate || date <= endDate);
            }),
        }));

        const barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setOptions({
            barOptions,
        });
        setChartData({
            barData: { ...barData, datasets: filteredData },
        });
    }, [layoutConfig, startDate, endDate]); // Recalculate when the date range changes

    return (
        <div className="grid p-fluid">
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Chart</h5>
                    <div className="p-d-flex p-jc-between">
                        <span>Start Date:</span>
                        <Calendar
                            value={startDate}
                            onChange={(e) => handleDateChange('start', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                            placeholder="Select start date"
                        />
                    </div>
                    <div className="p-d-flex p-jc-between mt-2">
                        <span>End Date:</span>
                        <Calendar
                            value={endDate}
                            onChange={(e) => handleDateChange('end', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                            placeholder="Select end date"
                        />
                    </div>
                    <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
