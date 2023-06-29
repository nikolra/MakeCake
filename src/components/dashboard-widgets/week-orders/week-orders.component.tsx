import React, { useState, useEffect } from 'react'
import './calendar.style.css';
import '../widgets.style.css';

export default function WeekOrders() {
    const [value, onChange] = useState(new Date());
    return (
        <div className="calendar-container dashboard-widget-container">
            <div className="dashboard-widget-title">
                <span>Week schedule</span>
            </div>
            <div className="dashboard-widget-content">
            </div>
        </div>
    )
}