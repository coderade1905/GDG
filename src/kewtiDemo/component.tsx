import { EthiopianCalendar } from "../kewti-calender/EthiopianCalendar";
import {KewtiInput} from "../kewti-inputs/component";
import {KewtiMap} from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";
import {KewtiLocationSelector} from "../kewti-inputs/location_selector";
import {KewtiPassword} from "../kewti-passwords/component";
import {EthiopianDatePicker} from "../kewti-calender/DateInput";
import { useEffect, useState } from "react";

export default function KewtiDemo() {
    const [userDate, setUserDate] = useState<Date | null>(null);
    useEffect(() => {
        if (userDate) {
            console.log("User selected date:", userDate);
        }
    }, [userDate]);
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="mt-30">
                <h1>A simple page for testing components</h1>
                <KewtiInput variant="input" />
                <KewtiMap />
                <TransactionValidator />
                <h1>Gregorian - Habeshan Calendar Component</h1>
                <EthiopianCalendar />
                <KewtiLocationSelector />
                <KewtiPassword />
                <EthiopianDatePicker setUserDate={setUserDate} />
            </div>
        </div>
    );
}