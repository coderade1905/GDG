import { getHolidaysForYear, HolidayTags } from 'kenat';
 
const year = 2017; // E.C.
 
// Example 1: Get only public holidays by passing a single tag.
const publicHolidays = getHolidaysForYear(year, {
filter: HolidayTags.PUBLIC
});
 
console.log(`Found ${publicHolidays.length} public holidays in ${year} E.C.`);
// Expected: Lists all holidays tagged as 'public'.
 
 
// Example 2: Get holidays that are 'MUSLIM' OR 'STATE'.
// Pass an array of tags to the filter option.
const muslimOrStateHolidays = getHolidaysForYear(year, {
    filter: [HolidayTags.MUSLIM, HolidayTags.STATE]
});
 
console.log(`Found ${muslimOrStateHolidays.length} holidays that are either Muslim or State holidays.`);
 
 // Example 3: Get holidays for a specific month
import { getHolidaysInMonth } from 'kenat';
const monthHolidays = getHolidaysInMonth(year, 1, { filter: HolidayTags.PUBLIC });
console.log(monthHolidays);
 
 // Example 4: Get a single holiday by key
import { getHoliday } from 'kenat';
const meskel = getHoliday('meskel', year);
console.log(meskel);