import { EthiopianCalendar } from "../kewti-calender/EthiopianCalendar";
import {KewtiInput} from "../kewti-inputs/component";
import {KewtiMap} from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";
import {KewtiLocationSelector} from "../kewti-regions/component";
import {KewtiPassword} from "../kewti-passwords/component";
import {EthiopianDatePicker} from "../kewti-calender/DateInput";
import { useEffect, useState } from "react";


export default function KewtiDemo() {
    const [userDate, setUserDate] = useState<Date | null>(null);
    const [userInput, setUserInput] = useState<string>("");
    const [address, setAddress] = useState<string[]>([]);
    const [userPassword, setUserPassword] = useState<string>("");

    useEffect(() => {
        if (userDate) {
            console.log("User selected date:", userDate);
        }
    }, [userDate]);
    useEffect(() => {
        if (userInput) {
            console.log("User input:", userInput);
        }
    }, [userInput]);
    useEffect(() => {        if (userPassword) {
            console.log("User password:", userPassword);
        }   
    }, [userPassword]);
    useEffect(() => {
        if (address.length > 0) {
            console.log("Selected address:", address.join(", "));
        }
    }, [address]);
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="mt-30">
                <h1>A simple page for testing components</h1>
                <KewtiInput variant="input" setUserInput={setUserInput} />
                <KewtiMap />
                <TransactionValidator />
                <h1>Gregorian - Habeshan Calendar Component</h1>
                <EthiopianCalendar />
                <KewtiLocationSelector setAddress={setAddress} />
                <KewtiPassword setUserPassword={setUserPassword} />
                <EthiopianDatePicker setUserDate={setUserDate} />
            </div>
        </div>
    );
}