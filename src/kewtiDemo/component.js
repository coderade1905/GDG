import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EthiopianCalendar } from "../kewti-calender/EthiopianCalendar";
import { KewtiInput } from "../kewti-inputs/component";
import { KewtiMap } from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";
import { KewtiLocationSelector } from "../kewti-regions/component";
import { KewtiPassword } from "../kewti-passwords/component";
import { EthiopianDatePicker } from "../kewti-calender/DateInput";
import { useEffect, useState } from "react";
export default function KewtiDemo() {
    const [userDate, setUserDate] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [address, setAddress] = useState([]);
    const [userPassword, setUserPassword] = useState("");
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
    useEffect(() => {
        if (userPassword) {
            console.log("User password:", userPassword);
        }
    }, [userPassword]);
    useEffect(() => {
        if (address.length > 0) {
            console.log("Selected address:", address.join(", "));
        }
    }, [address]);
    return (_jsx("div", { className: "h-full w-full flex items-center justify-center", children: _jsxs("div", { className: "mt-30", children: [_jsx("h1", { children: "A simple page for testing components" }), _jsx(KewtiInput, { variant: "input", setUserInput: setUserInput }), _jsx(KewtiMap, {}), _jsx(TransactionValidator, {}), _jsx("h1", { children: "Gregorian - Habeshan Calendar Component" }), _jsx(EthiopianCalendar, {}), _jsx(KewtiLocationSelector, { setAddress: setAddress }), _jsx(KewtiPassword, { setUserPassword: setUserPassword }), _jsx(EthiopianDatePicker, { setUserDate: setUserDate })] }) }));
}
