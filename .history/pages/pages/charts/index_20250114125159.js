import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterDataByDate = (originalData, labels) => {
        if (!startDate || !endDate) {
            return { filteredData: originalData, filteredLabels: labels };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const filteredData = originalData.filter((_, index) => {
            const currentDate = new Date(labels[index]);
            return currentDate >= start && currentDate <= end;
        });

        const filteredLabels = labels.filter((label) => {
            const currentDate = new Date(label);
            return currentDate >= start && currentDate <= end;
        });

        return { filteredData, filteredLabels };
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const labels = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01'];
        const dataset1 = [65, 59, 80, 81, 56, 55, 40];
        const dataset2 = [28, 48, 40, 19, 86, 27, 90];

        const { filteredData: filteredDataset1, filteredLabels } = filterDataByDate(dataset1, labels);
        const { filteredData: filteredDataset2 } = filterDataByDate(dataset2, labels);

        const lineData = {
            labels: filteredLabels,
            datasets: [
                {
                    label: 'First Dataset',
                    data: filteredDataset1,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: filteredDataset2,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    tension: 0.4
                }
            ]
        };

        const lineOptions = {
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
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
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

        setOptions({ lineOptions });
        setChartData({ lineData });
    }, [layoutConfig, startDate, endDate]);

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h5>Select Date Range</h5>
                    <div className="grid">
                        <div className="col-6">
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-inputtext p-component"
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-inputtext p-component"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Filtered Sales Chart</h5>
                    <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
