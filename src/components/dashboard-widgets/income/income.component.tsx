import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from 'chart.js';

import '../widgets.style.css'
import './income.style.css'
import Dropdown from '../../dropdown/dropdown.component'
import axios from "axios";
import Cookies from "js-cookie";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
    plugins: {
        title: {
            display: false,
        },
        legend: {
            display: false,
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                font: {
                    size: 10,
                    family: 'Roboto Condensed',
                    weight: "700"
                }
            }
        },
        y: {
            ticks: {
                font: {
                    size: 10,
                    family: 'Roboto Condensed',
                    weight: "700"
                }
            }
        }
    }
};


const chartColor = '#ff875e';
const chartBorderRadius = 16;

export default function Income() {

    let chartData = {
        y: [""],
        x: [0]
    }

    const [range, setRange] = useState('Week')
    const [total, setTotal] = useState(0)
    const [data, setData] = useState(
        {
            labels:[""],
            datasets: [
                {
                    data: [0],
                    backgroundColor: chartColor,
                    borderRadius: chartBorderRadius
                }
            ]
        }
    )

    useEffect(() => {
        rangeChanged(range);
    }, [range]);

    const rangeChanged = async (rangeString: string) => {
        const payload = {
            rangeString: rangeString
        };
        console.log(payload);
        const response =
            await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/calculate_income',
                payload,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
        console.log(response);
        chartData.x = response.data.x;
        chartData.y = response.data.y;
        console.log(chartData);
        let totalForRange = 0;
        chartData.x.forEach((data => totalForRange += data));
        setTotal(totalForRange);
        setData({
            labels: chartData.y,
            datasets: [
                {
                    data: chartData.x,
                    backgroundColor: chartColor,
                    borderRadius: chartBorderRadius
                }
            ]
        });
        // setRange(rangeString);
    }

    return (
        <div className="dashboard-widget-container dashboard-widget-col-container income-widget">
            <div className="income-header">
                <div className="income-header-text">
                    <span className="widget-title-text">Income</span>
                    <span className="widget-title-text-secondary">The amount you earned for the selected period</span>
                </div>
                <div className="income-total-container">
                    <div className="total-container">
                        <span>{total}</span>
                        <strong className="currency-container"> ₪</strong>
                    </div>
                    <div className="range-container">
                        <Dropdown model={["Week", "Month", "Year"]} onChanged={rangeChanged}/>
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <Bar options={options} data={data} />
            </div>
        </div>
    )
}