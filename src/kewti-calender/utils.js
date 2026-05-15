// The 13 Ethiopian months
// Pagume is the 13th month — 5 days normally, 6 in a leap year
export const ETHIOPIAN_MONTHS = [
    { index: 1, name: 'Meskerem', amharic: 'መስከረም', days: 30 },
    { index: 2, name: 'Tikimt', amharic: 'ጥቅምት', days: 30 },
    { index: 3, name: 'Hidar', amharic: 'ህዳር', days: 30 },
    { index: 4, name: 'Tahsas', amharic: 'ታህሳስ', days: 30 },
    { index: 5, name: 'Tir', amharic: 'ጥር', days: 30 },
    { index: 6, name: 'Yekatit', amharic: 'የካቲት', days: 30 },
    { index: 7, name: 'Megabit', amharic: 'መጋቢት', days: 30 },
    { index: 8, name: 'Miyazia', amharic: 'ሚያዚያ', days: 30 },
    { index: 9, name: 'Ginbot', amharic: 'ግንቦት', days: 30 },
    { index: 10, name: 'Sene', amharic: 'ሰኔ', days: 30 },
    { index: 11, name: 'Hamle', amharic: 'ሐምሌ', days: 30 },
    { index: 12, name: 'Nehase', amharic: 'ነሐሴ', days: 30 },
    { index: 13, name: 'Pagume', amharic: 'ጳጉሜ', days: 5 },
];
// Ethiopian leap year logic 
export function isEthiopianLeapYear(etYear) {
    return etYear % 4 === 3;
}
// Convert Gregorian date to Ethiopian
export function toEthiopianDate(date) {
    const gcYear = date.getFullYear();
    const gcMonth = date.getMonth() + 1;
    const gcDay = date.getDate();
    const isAfterNewYear = gcMonth > 9 || (gcMonth === 9 && gcDay >= 11);
    const etYear = isAfterNewYear ? gcYear - 7 : gcYear - 8;
    // If we're before Sept 11, the ET new year that started this ET year
    // was Sept 11 of the PREVIOUS Gregorian year
    const newYearGCYear = isAfterNewYear ? gcYear : gcYear - 1;
    const etNewYearInGC = new Date(newYearGCYear, 8, 11);
    const msPerDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor((date.getTime() - etNewYearInGC.getTime()) / msPerDay);
    const etMonth = Math.floor(dayOfYear / 30) + 1;
    const etDay = (dayOfYear % 30) + 1;
    return { day: etDay, month: etMonth, year: etYear };
}
// Convert Ethiopian date back to Gregorian
export function toGregorianDate(day, month, year) {
    // ET New Year = Sept 11 of (ET year + 7) in Gregorian
    const gcYear = year + 7;
    const etNewYear = new Date(gcYear, 8, 11); // Sept 11
    const daysToAdd = (month - 1) * 30 + (day - 1);
    const result = new Date(etNewYear);
    result.setDate(result.getDate() + daysToAdd);
    return result;
}
export function getEthiopianMonthStartDay(month, year) {
    const gcDate = toGregorianDate(1, month, year);
    return gcDate.getDay();
}
