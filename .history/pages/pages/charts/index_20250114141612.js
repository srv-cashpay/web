import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [firstDate, setFirstDate] = useState(null);
    const [lastDate, setLastDate] = useState(null);
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
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
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

    const filterDataByDate = () => {
        if (firstDate && lastDate) {
            const filterDataset = (dataset, labels) => ({
                labels: labels.filter(
                    (label, index) =>
                        index >= labels.indexOf(firstDate) &&
                        index <= labels.indexOf(lastDate)
                ),
                datasets: dataset.datasets.map((dataSet) => ({
                    ...dataSet,
                    data: dataSet.data.slice(
                        dataset.labels.indexOf(firstDate),
                        dataset.labels.indexOf(lastDate) + 1
                    ),
                })),
            });

            setFilteredData({
                lineData: filterDataset(data.lineData, data.lineData.labels),
                barData: filterDataset(data.barData, data.barData.labels),
                pieData: data.pieData, // Pie chart doesn't use date filtering
            });
        }
    };

    useEffect(() => {
        filterDataByDate();
    }, [firstDate, lastDate]);

    return (
        <div className="grid p-fluid">
            {/* Date Filters */}
            <div className="col-12">
                <div className="card">
                    <h5>Select Date Range</h5>
                    <div className="grid">
                        <div className="col-6">
                            <Calendar
                                value={firstDate}
                                onChange={(e) => setFirstDate(e.value)}
                                placeholder="First Date"
                                dateFormat="MM yy"
                                view="month"
                            />
                        </div>
                        <div className="col-6">
                            <Calendar
                                value={lastDate}
                                onChange={(e) => setLastDate(e.value)}
                                placeholder="Last Date"
                                dateFormat="MM yy"
                                view="month"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Chart</h5>
                    <Chart type="line" data={filteredData.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Product Best Chart</h5>
                    <Chart type="bar" data={filteredData.barData} options={options.barOptions}></Chart>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Payment Chart</h5>
                    <Chart type="pie" data={filteredData.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
