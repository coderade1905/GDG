interface UseEthiopianCalendarReturn {
    currentDay: number;
    currentMonth: number;
    currentYear: number;
    today: {
        day: number;
        month: number;
        year: number;
    };
    daysInCurrentMonth: number;
    monthName: string;
    monthAmharic: string;
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
    goToToday: () => void;
    setCurrentMonth: React.Dispatch<React.SetStateAction<number>>;
    setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
}
export declare function useEthiopianCalendar(): UseEthiopianCalendarReturn;
export {};
