import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4,
                },
            ],
        };

        const barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sales',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [50, 60, 70, 80, 90, 100, 110],
                },
            ],
        };

        const pieData = {
            labels: ['Category A', 'Category B', 'Category C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-500'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                },
            ],
        };

        setChartData({ lineData, barData, pieData });
        setFilteredData({ lineData, barData, pieData });

        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        setOptions({ lineOptions, barOptions: lineOptions, pieOptions: lineOptions });
    }, [layoutConfig]);

    const filterData = (data, firstDate, lastDate) => {
        if (!firstDate || !lastDate || !data.labels) return data;

        const startIndex = data.labels.indexOf(firstDate);
        const endIndex = data.labels.indexOf(lastDate) + 1;

        return {
            ...data,
            labels: data.labels.slice(startIndex, endIndex),
            datasets: data.datasets.map((dataset) => ({
                ...dataset,
                data: dataset.data.slice(startIndex, endIndex),
            })),
        };
    };

    return (
        <div className="grid p-fluid">
            {/* Sales Chart */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Chart</h5>
                    <div className="grid">
                        <div className="col-6">
                            <Calendar
                                placeholder="First Date"
                                dateFormat="MM yy"
                                view="month"
                                onChange={(e) => {
                                    setFilteredData((prev) => ({
                                        ...prev,
                                        lineData: filterData(data.lineData, e.value, prev.lineData?.lastDate),
                                    }));
                                }}
                            />
                        </div>
                        <div className="col-6">
                            <Calendar
                                placeholder="Last Date"
                                dateFormat="MM yy"
                                view="month"
                                onChange={(e) => {
                                    setFilteredData((prev) => ({
                                        ...prev,
                                        lineData: filterData(data.lineData, prev.lineData?.firstDate, e.value),
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <Chart type="line" data={filteredData.lineData || data.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>

            {/* Product Best Chart */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Product Best Chart</h5>
                    <div className="grid">
                        <div className="col-6">
                            <Calendar
                                placeholder="First Date"
                                dateFormat="MM yy"
                                view="month"
                                onChange={(e) => {
                                    setFilteredData((prev) => ({
                                        ...prev,
                                        barData: filterData(data.barData, e.value, prev.barData?.lastDate),
                                    }));
                                }}
                            />
                        </div>
                        <div className="col-6">
                            <Calendar
                                placeholder="Last Date"
                                dateFormat="MM yy"
                                view="month"
                                onChange={(e) => {
                                    setFilteredData((prev) => ({
                                        ...prev,
                                        barData: filterData(data.barData, prev.barData?.firstDate, e.value),
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <Chart type="bar" data={filteredData.barData || data.barData} options={options.barOptions}></Chart>
                </div>
            </div>

            {/* Payment Chart */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Payment Chart</h5>
                    {/* Pie chart does not use date filtering */}
                    <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
