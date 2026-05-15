export declare const ETHIOPIAN_MONTHS: {
    index: number;
    name: string;
    amharic: string;
    days: number;
}[];
export declare function isEthiopianLeapYear(etYear: number): boolean;
export declare function toEthiopianDate(date: Date): {
    day: number;
    month: number;
    year: number;
};
export declare function toGregorianDate(day: number, month: number, year: number): Date;
export declare function getEthiopianMonthStartDay(month: number, year: number): number;
