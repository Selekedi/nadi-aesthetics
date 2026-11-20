import React, { useEffect, useState } from "react";
import "./DatePicker.css";

function getWeekDates(date) {
  const today = new Date(date);
  today.setHours(2, 0, 0, 0); // normalize
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i); // start from yesterday
    return d;
  });
}

export default function DatePicker({onDateChange}){
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        onDateChange(selectedDate); // Notify parent
    }, [selectedDate, onDateChange]);

    const currentWeek = getWeekDates(today);

    const isInCurrentWeek = (date) => {
        const base = new Date(today);
        base.setHours(2, 0, 0, 0);

        const start = new Date(base);
        start.setDate(base.getDate()); // today

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const target = new Date(date);
        target.setHours(2, 0, 0, 0);

        return target >= start && target <= end;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="date-selector">
            <div className="week-strip">
            {currentWeek.map((date) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                <button
                    key={date.toISOString()}
                    className={`day-btn ${isSelected ? "selected" : ""}`}
                    onClick={() => handleDateChange(date)}
                >
                    <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div>{date.getDate()}</div>
                </button>
                );
            })}
            </div>
        </div>
    )

}
