import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const ChartDemo = () => {
    const [options, setOptions] = useState({});
    const [data, setChartData] = useState({});
    const [firstDate, setFirstDate] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Data chart
        const lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
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
                        color: textColor
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

        // Menentukan first date dan last date
        const labels = lineData.labels;
        setFirstDate(labels[0]); // Tanggal pertama
        setLastDate(labels[labels.length - 1]); // Tanggal terakhir

        setOptions({ lineOptions });
        setChartData({ lineData });
    }, [layoutConfig]);

    return (
        <div className="grid p-fluid">
            {/* Sales Chart */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Chart</h5>
                    {firstDate && lastDate && (
                        <p>
                            <strong>First Date:</strong> {firstDate} | <strong>Last Date:</strong> {lastDate}
                        </p>
                    )}
                    <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                </div>
            </div>

            {/* Product Best Chart */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Product Best Chart</h5>
                    <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                </div>
            </div>

            {/* Payment Chart */}
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Payment Chart</h5>
                    <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>

            {/* Doughnut Chart */}
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Doughnut Chart</h5>
                    <Chart type="doughnut" data={data.pieData} options={options.pieOptions}></Chart>
                </div>
            </div>

            {/* Merk Type Chart */}
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Merk Type Chart</h5>
                    <Chart type="polarArea" data={data.polarData} options={options.polarOptions}></Chart>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Radar Chart</h5>
                    <Chart type="radar" data={data.radarData} options={options.radarOptions}></Chart>
                </div>
            </div>
        </div>
    );
};

export default ChartDemo;
