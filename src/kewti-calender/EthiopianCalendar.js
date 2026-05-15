import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getHolidaysForYear, HolidayTags } from 'kenat';
import { useEthiopianCalendar } from './useEthiopianCalendar';
import { getEthiopianMonthStartDay, toGregorianDate, toEthiopianDate } from './utils';
function buildHolidaysMap(etYear) {
    const map = {};
    try {
        const holidays = getHolidaysForYear(etYear, {
            filter: HolidayTags.PUBLIC
        });
        holidays.forEach((h) => {
            const key = `${h.ethiopian.year}-${h.ethiopian.month}-${h.ethiopian.day}`;
            map[key] = {
                name: h.name,
                description: h.description
            };
        });
    }
    catch (error) {
        console.error('Failed to load holidays from kenat:', error);
    }
    return map;
}
const GC_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const ET_YEAR_RANGE = Array.from({ length: 151 }, (_, i) => 1900 + i);
const DAYS_OF_WEEK_EN = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];
const DAYS_OF_WEEK_AM = [
    'እሑድ',
    'ሰኞ',
    'ማክሰኞ',
    'ረቡዕ',
    'ሐሙስ',
    'ዓርብ',
    'ቅዳሜ'
];
export function EthiopianCalendar({ value, onDateSelect }) {
    const [mode, setMode] = useState('ethiopian');
    const [hoveredDay, setHoveredDay] = useState(null);
    // TEMP SELECTION
    const [tempDate, setTempDate] = useState(value);
    // HOLIDAYS
    const [holidaysMap, setHolidaysMap] = useState({});
    const today = new Date();
    const [gcMonth, setGcMonth] = useState(value ? value.getMonth() : today.getMonth());
    const [gcYear, setGcYear] = useState(value ? value.getFullYear() : today.getFullYear());
    useEffect(() => {
        setTempDate(value);
    }, [value]);
    const { currentMonth, currentYear, today: todayET, daysInCurrentMonth, monthName, monthAmharic, goToPrevMonth, goToNextMonth, goToToday, setCurrentYear } = useEthiopianCalendar();
    useEffect(() => {
        const etDateForGc = toEthiopianDate(new Date(gcYear, gcMonth, 15));
        const targetYear = mode === 'ethiopian'
            ? currentYear
            : etDateForGc.year;
        setHolidaysMap({
            ...buildHolidaysMap(targetYear - 1),
            ...buildHolidaysMap(targetYear),
            ...buildHolidaysMap(targetYear + 1)
        });
    }, [currentYear, gcYear, gcMonth, mode]);
    const etDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
    const etMonthStartDay = getEthiopianMonthStartDay(currentMonth, currentYear);
    const daysInGcMonth = new Date(gcYear, gcMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(gcYear, gcMonth, 1).getDay();
    const gcDays = Array.from({ length: daysInGcMonth }, (_, i) => i + 1);
    const goToPrevGcMonth = () => {
        if (gcMonth === 0) {
            setGcMonth(11);
            setGcYear((y) => y - 1);
        }
        else {
            setGcMonth((m) => m - 1);
        }
    };
    const goToNextGcMonth = () => {
        if (gcMonth === 11) {
            setGcMonth(0);
            setGcYear((y) => y + 1);
        }
        else {
            setGcMonth((m) => m + 1);
        }
    };
    const etSelected = tempDate
        ? toEthiopianDate(tempDate)
        : null;
    const isSelectedInCurrentEtView = etSelected?.month === currentMonth &&
        etSelected?.year === currentYear;
    const isSelectedInCurrentGcView = tempDate?.getMonth() === gcMonth &&
        tempDate?.getFullYear() === gcYear;
    const selectedHoliday = etSelected
        ? holidaysMap[`${etSelected.year}-${etSelected.month}-${etSelected.day}`]
        : null;
    return (_jsxs("div", { className: "w-fit rounded-xl border bg-background p-4 shadow-sm", children: [_jsx("div", { className: "mb-4 flex gap-2", children: ['ethiopian', 'gregorian'].map((m) => (_jsx("button", { onClick: () => setMode(m), className: cn('rounded-lg px-4 py-1 text-xs font-medium transition-colors capitalize cursor-pointer', mode === m
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'), children: m }, m))) }), mode === 'ethiopian' ? (_jsxs(_Fragment, { children: [tempDate &&
                        isSelectedInCurrentEtView &&
                        etSelected ? (_jsxs("div", { className: "animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("p", { className: "text-xs font-semibold text-foreground", children: [monthAmharic, " ", etSelected.day, " \u00B7", ' ', etSelected.year, " ET"] }), selectedHoliday && (_jsx("span", { title: selectedHoliday.description, className: "text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold cursor-help", children: selectedHoliday.name }))] }), _jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: ["=", ' ', GC_MONTHS[tempDate.getMonth()], ' ', tempDate.getDate(), ",", ' ', tempDate.getFullYear(), " GC"] })] })) : (_jsx("div", { className: "mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground", children: "Click a day to select it" })), _jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("button", { onClick: goToPrevMonth, className: "rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer", children: "\u2190" }), _jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("p", { className: "text-base font-bold text-foreground", children: monthAmharic }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: monthName }), _jsx("select", { value: currentYear, onChange: (e) => setCurrentYear(Number(e.target.value)), className: "rounded-md border bg-background px-2 py-1 text-xs outline-none", children: ET_YEAR_RANGE.map((year) => (_jsx("option", { value: year, children: year }, year))) })] })] }), _jsx("button", { onClick: goToNextMonth, className: "rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer", children: "\u2192" })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-1", children: DAYS_OF_WEEK_AM.map((d) => (_jsx("p", { className: "text-center text-[10px] font-medium text-muted-foreground", children: d }, d))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1", children: [Array.from({
                                length: etMonthStartDay
                            }).map((_, i) => (_jsx("div", {}, `empty-${i}`))), etDays.map((day) => {
                                const isToday = day === todayET.day &&
                                    currentMonth === todayET.month &&
                                    currentYear === todayET.year;
                                const isSelected = etSelected?.day === day &&
                                    etSelected?.month === currentMonth &&
                                    etSelected?.year === currentYear;
                                const isDimmed = tempDate &&
                                    !isSelected &&
                                    !isToday;
                                const holiday = holidaysMap[`${currentYear}-${currentMonth}-${day}`];
                                return (_jsxs("button", { title: holiday
                                        ? `${holiday.name}\n${holiday.description}`
                                        : undefined, onClick: () => {
                                        if (isSelected) {
                                            setTempDate(undefined);
                                        }
                                        else {
                                            setTempDate(toGregorianDate(day, currentMonth, currentYear));
                                        }
                                    }, onMouseEnter: () => setHoveredDay(day), onMouseLeave: () => setHoveredDay(null), className: cn('relative rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center', isToday &&
                                        'bg-primary text-primary-foreground scale-105', isSelected &&
                                        !isToday &&
                                        'bg-muted text-foreground ring-1 ring-border', hoveredDay === day &&
                                        !isSelected &&
                                        !isToday &&
                                        'bg-muted/60 scale-105', isDimmed && 'opacity-30', holiday &&
                                        !isToday &&
                                        !isSelected &&
                                        'text-red-500 font-bold', !isToday &&
                                        !isSelected &&
                                        !holiday &&
                                        hoveredDay !== day &&
                                        'text-muted-foreground'), children: [day, holiday && (_jsx("span", { className: cn('absolute bottom-1 w-1 h-1 rounded-full', isToday || isSelected
                                                ? 'bg-background'
                                                : 'bg-red-500') }))] }, day));
                            })] }), _jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [_jsx("button", { onClick: () => {
                                    goToToday();
                                    setTempDate(new Date());
                                }, className: "w-full rounded-lg bg-muted py-2 text-xs text-muted-foreground hover:bg-muted/80 transition-colors", children: "Today" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setTempDate(undefined), className: "flex-1 rounded-lg border py-2 text-xs hover:bg-muted transition-colors", children: "Clear" }), _jsx("button", { onClick: () => onDateSelect?.(tempDate), className: "flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-xs", children: "Done" })] })] })] })) : (_jsxs(_Fragment, { children: [tempDate &&
                        isSelectedInCurrentGcView &&
                        etSelected ? (_jsxs("div", { className: "animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-md border border-border bg-muted/40 px-3 py-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("p", { className: "text-xs font-semibold text-foreground", children: [GC_MONTHS[tempDate.getMonth()], ' ', tempDate.getDate(), " \u00B7", ' ', tempDate.getFullYear(), " GC"] }), selectedHoliday && (_jsx("span", { title: selectedHoliday.description, className: "text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold cursor-help", children: selectedHoliday.name }))] }), _jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: ["= ", etSelected.month, "/", etSelected.day, "/", etSelected.year, " ET"] })] })) : (_jsx("div", { className: "mb-4 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground", children: "Click a day to select it" })), _jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("button", { onClick: goToPrevGcMonth, className: "rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer", children: "\u2190" }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-base font-bold text-foreground", children: GC_MONTHS[gcMonth] }), _jsx("p", { className: "text-xs text-muted-foreground", children: gcYear })] }), _jsx("button", { onClick: goToNextGcMonth, className: "rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer", children: "\u2192" })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-1", children: DAYS_OF_WEEK_EN.map((d) => (_jsx("p", { className: "text-center text-[10px] font-medium text-muted-foreground", children: d }, d))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1", children: [Array.from({
                                length: firstDayOfMonth
                            }).map((_, i) => (_jsx("div", {}, `empty-${i}`))), gcDays.map((day) => {
                                const isToday = day === today.getDate() &&
                                    gcMonth === today.getMonth() &&
                                    gcYear === today.getFullYear();
                                const isSelected = tempDate?.getDate() === day &&
                                    tempDate?.getMonth() === gcMonth &&
                                    tempDate?.getFullYear() ===
                                        gcYear;
                                const isDimmed = tempDate &&
                                    !isSelected &&
                                    !isToday;
                                const mappedEtDate = toEthiopianDate(new Date(gcYear, gcMonth, day));
                                const holiday = holidaysMap[`${mappedEtDate.year}-${mappedEtDate.month}-${mappedEtDate.day}`];
                                return (_jsxs("button", { title: holiday
                                        ? `${holiday.name}\n${holiday.description}`
                                        : undefined, onClick: () => {
                                        if (isSelected) {
                                            setTempDate(undefined);
                                        }
                                        else {
                                            setTempDate(new Date(gcYear, gcMonth, day));
                                        }
                                    }, onMouseEnter: () => setHoveredDay(day), onMouseLeave: () => setHoveredDay(null), className: cn('relative rounded-lg p-2 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center', isToday &&
                                        'bg-primary text-primary-foreground scale-105', isSelected &&
                                        !isToday &&
                                        'bg-muted text-foreground ring-1 ring-border', hoveredDay === day &&
                                        !isSelected &&
                                        !isToday &&
                                        'bg-muted/60 scale-105', isDimmed && 'opacity-30', holiday &&
                                        !isToday &&
                                        !isSelected &&
                                        'text-red-500 font-bold', !isToday &&
                                        !isSelected &&
                                        !holiday &&
                                        hoveredDay !== day &&
                                        'text-muted-foreground'), children: [day, holiday && (_jsx("span", { className: cn('absolute bottom-1 w-1 h-1 rounded-full', isToday || isSelected
                                                ? 'bg-background'
                                                : 'bg-red-500') }))] }, day));
                            })] }), _jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [_jsx("button", { onClick: () => {
                                    setGcMonth(today.getMonth());
                                    setGcYear(today.getFullYear());
                                    setTempDate(new Date());
                                }, className: "w-full rounded-lg bg-muted py-2 text-xs text-muted-foreground hover:bg-muted/80 transition-colors", children: "Today" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setTempDate(undefined), className: "flex-1 rounded-lg border py-2 text-xs hover:bg-muted transition-colors", children: "Clear" }), _jsx("button", { onClick: () => onDateSelect?.(tempDate), className: "flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-xs", children: "Done" })] })] })] }))] }));
}
