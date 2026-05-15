import { useState } from 'react';
import { toEthiopianDate, isEthiopianLeapYear, ETHIOPIAN_MONTHS } from './utils';
export function useEthiopianCalendar() {
    // Get today in Ethiopian date as the starting point
    const todayET = toEthiopianDate(new Date());
    const [currentMonth, setCurrentMonth] = useState(todayET.month);
    const [currentYear, setCurrentYear] = useState(todayET.year);
    // Find the current month's data from our months array
    const monthData = ETHIOPIAN_MONTHS[currentMonth - 1];
    // Pagume has 6 days in a leap year, 5 otherwise
    const daysInCurrentMonth = currentMonth === 13
        ? isEthiopianLeapYear(currentYear) ? 6 : 5
        : 30;
    const goToPrevMonth = () => {
        if (currentMonth === 1) {
            // Wrap around — going back from Meskerem means going to prev year's Pagume
            setCurrentMonth(13);
            setCurrentYear(y => y - 1);
        }
        else {
            setCurrentMonth(m => m - 1);
        }
    };
    const goToNextMonth = () => {
        if (currentMonth === 13) {
            // Wrap around — after Pagume comes new year's Meskerem
            setCurrentMonth(1);
            setCurrentYear(y => y + 1);
        }
        else {
            setCurrentMonth(m => m + 1);
        }
    };
    const goToToday = () => {
        setCurrentMonth(todayET.month);
        setCurrentYear(todayET.year);
    };
    return {
        currentDay: todayET.day,
        currentMonth,
        currentYear,
        today: todayET,
        daysInCurrentMonth,
        monthName: monthData.name,
        monthAmharic: monthData.amharic,
        goToPrevMonth,
        goToNextMonth,
        goToToday,
        setCurrentMonth,
        setCurrentYear,
    };
}
