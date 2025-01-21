import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown'; // For selecting granularity

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const [startDate, setStartDate] = useState(null); // Start Date state
    const [endDate, setEndDate] = useState(null); // End Date state
    const [granularity, setGranularity] = useState('month'); // Granularity state (per day, per month, per year)
    const { layoutConfig } = useContext(LayoutContext);

    const handleDateChange = (name, value) => {
        if (name === 'start') {
            setStartDate(value);
        } else if (name === 'end') {
            setEndDate(value);
        }
    };

    const handleGranularityChange = (e) => {
        setGranularity(e.value);
    };

    // Utility function to generate date labels
    const generateLabels = (startDate, endDate, granularity) => {
        const labels = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const label = new Date(currentDate);
            if (granularity === 'day') {
                labels.push(label.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1); // Move to next day
            } else if (granularity === 'month') {
                labels.push(`${label.getFullYear()}-${(label.getMonth() + 1).toString().padStart(2, '0')}-01`); // Format as YYYY-MM-01
                currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
            } else if (granularity === 'year') {
                labels.push(`${label.getFullYear()}-01-01`); // Format as YYYY-01-01
                currentDate.setFullYear(currentDate.getFullYear() + 1); // Move to next year
            }
        }
        return labels;
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Generate labels dynamically based on the start date, end date, and granularity
        const labels = generateLabels(startDate, endDate, granularity);

        const barData = {
            labels, // Use the generated labels
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: Array(labels.length).fill(Math.floor(Math.random() * 100)) // Random data, replace with your actual data logic
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: Array(labels.length).fill(Math.floor(Math.random() * 100)) // Random data, replace with your actual data logic
                }
            ]
        };

        // Filter the chart data based on the selected granularity (day, month, year)
        const filteredData = barData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.filter((_, index) => {
                const date = new Date(barData.labels[index]);

                let startDateCheck = true;
                let endDateCheck = true;

                if (startDate) {
                    switch (granularity) {
                        case 'day':
                            startDateCheck = date >= startDate;
                            break;
                        case 'month':
                            startDateCheck = (date.getMonth() >= startDate.getMonth() && date.getFullYear() >= startDate.getFullYear());
                            break;
                        case 'year':
                            startDateCheck = date.getFullYear() >= startDate.getFullYear();
                            break;
                        default:
                            startDateCheck = true;
                            break;
                    }
                }

                if (endDate) {
                    switch (granularity) {
                        case 'day':
                            endDateCheck = date <= endDate;
                            break;
                        case 'month':
                            endDateCheck = (date.getMonth() <= endDate.getMonth() && date.getFullYear() <= endDate.getFullYear());
                            break;
                        case 'year':
                            endDateCheck = date.getFullYear() <= endDate.getFullYear();
                            break;
                        default:
                            endDateCheck = true;
                            break;
                    }
                }

                return startDateCheck && endDateCheck;
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
    }, [layoutConfig, startDate, endDate, granularity]); // Recalculate when the date range or granularity changes

    const granularityOptions = [
        { label: 'Per Day', value: 'day' },
        { label: 'Per Month', value: 'month' },
        { label: 'Per Year', value: 'year' }
    ];

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
                    <div className="mt-3">
                        <Dropdown
                            value={granularity}
                            options={granularityOptions}
                            onChange={handleGranularityChange}
                            placeholder="Select Granularity"
                        />
                    </div>
                    <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
