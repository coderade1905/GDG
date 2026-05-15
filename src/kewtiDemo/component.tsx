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
        <div className="w-full flex items-start p-7 gap-6">
            <div className="w-full max-w-3xl flex flex-col items-center space-y-8 py-8">
                <h1 className="text-2xl font-bold">A simple page for testing components</h1>

                <section className="w-full flex flex-col items-center gap-6">
                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Kewti Input</div>
                            <div className="w-full flex justify-center"><KewtiInput variant="input" setUserInput={setUserInput} /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Kewti Map</div>
                            <div className="w-full flex justify-center"><KewtiMap /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Transaction Validator</div>
                            <div className="w-full flex justify-center"><TransactionValidator /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Gregorian - Habeshan Calendar</div>
                            <div className="w-full flex justify-center"><EthiopianCalendar /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Location Selector</div>
                            <div className="w-full flex justify-center"><KewtiLocationSelector setAddress={setAddress} /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Kewti Password</div>
                            <div className="w-full flex justify-center"><KewtiPassword setUserPassword={setUserPassword} /></div>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div className="w-full sm:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 px-3 text-sm font-medium">Ethiopian Date Picker</div>
                            <div className="w-full flex justify-center"><EthiopianDatePicker setUserDate={setUserDate} /></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}