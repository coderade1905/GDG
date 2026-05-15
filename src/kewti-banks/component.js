import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import { verifyTelebirr } from './parse.ts';
import { validateTransaction } from './index.ts';
// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Camera, Upload, Video } from "lucide-react";
// ==========================================
// REACT COMPONENT
// ==========================================
export default function TransactionValidator() {
    // Expected Validation State
    const [expectedName, setExpectedName] = useState(''); // Now represents Receiver Name
    const [expectedAmount, setExpectedAmount] = useState('');
    const [expectedPhone, setExpectedPhone] = useState('251912347666'); // Default/Example
    // Verification State
    const [transactionId, setTransactionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    // Live Camera State
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        payerName: '',
        phone: '',
        amount: '',
        date: '',
    });
    // 1. Auto-Load / Save Expected Payer Name from Local Storage
    useEffect(() => {
        const savedName = localStorage.getItem('expectedTelebirrPayerName');
        if (savedName)
            setExpectedName(savedName);
    }, []);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('expectedTelebirrPayerName', expectedName);
        }, 500); // Debounce save
        return () => clearTimeout(timeoutId);
    }, [expectedName]);
    // 2. Extracted OCR Logic (used by both File Upload and Live Scan)
    const runOCR = async (imageSource) => {
        setIsScanning(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await Tesseract.recognize(imageSource, 'eng');
            const text = result.data.text;
            const regex = /\b[A-Z0-9]{10}\b/g;
            const matches = text.match(regex);
            if (matches && matches.length > 0) {
                const extractedId = matches[matches.length - 1];
                setTransactionId(extractedId);
                setShowCamera(false); // Close camera if successful
                return true;
            }
            else {
                setError("Could not detect a valid 10-character Transaction ID in this image.");
                return false;
            }
        }
        catch (err) {
            console.error(err);
            setError("Failed to scan the image. Please try again or enter the ID manually.");
            return false;
        }
        finally {
            setIsScanning(false);
        }
    };
    // 3. Handlers for Scanning
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        await runOCR(file);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const captureLivePhoto = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            await runOCR(imageSrc);
        }
    }, [webcamRef]);
    // 4. Handle Verification
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!transactionId || !expectedAmount || !expectedName) {
            setError("Please fill out the expected amount, receiver name, and transaction ID.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const telebirr = await verifyTelebirr(transactionId);
            if (!telebirr) {
                setError('Failed to fetch transaction data. Invalid ID.');
                setIsLoading(false);
                return;
            }
            const result = validateTransaction(telebirr, Number(expectedAmount), expectedPhone, expectedName);
            if (result.isValid) {
                setFormData({
                    // Fallbacks for however your parse.ts outputs the receiver's name
                    payerName: telebirr.payerName,
                    phone: telebirr.payerTelebirrNo,
                    amount: telebirr.settledAmount,
                    date: result.date,
                });
                setSuccess(true);
            }
            else {
                const validationErrors = result.errors ?? [];
                setError(`Validation Failed${validationErrors.length ? `: ${validationErrors.join(', ')}` : '.'}`);
            }
        }
        catch (err) {
            setError('An unexpected error occurred while verifying.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSaveToDatabase = (e) => {
        e.preventDefault();
        console.log('Saving to database...', { transactionId, ...formData });
        alert('Transaction saved successfully to the database!');
    };
    return (_jsx("div", { className: "max-w-lg mx-auto mt-10 p-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-2xl", children: "Verify Payment" }), _jsx(CardDescription, { children: "Set your expected values, then scan or enter a transaction ID." })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg border", children: [_jsxs("div", { className: "space-y-2 col-span-2", children: [_jsx(Label, { htmlFor: "expectedName", children: "Expected Receiver Name (Auto-saves)" }), _jsx(Input, { id: "expectedName", value: expectedName, onChange: (e) => setExpectedName(e.target.value), placeholder: "e.g. Ethio telecom" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "expectedAmount", children: "Expected Amount" }), _jsx(Input, { id: "expectedAmount", type: "number", value: expectedAmount, onChange: (e) => setExpectedAmount(e.target.value), placeholder: "e.g. 10" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "expectedPhone", children: "Expected Phone" }), _jsx(Input, { id: "expectedPhone", value: expectedPhone, onChange: (e) => setExpectedPhone(e.target.value), placeholder: "e.g. 251912347666" })] })] }), showCamera && (_jsxs("div", { className: "relative mb-6 rounded-lg overflow-hidden border bg-black flex flex-col items-center", children: [_jsx(Webcam, { audio: false, ref: webcamRef, screenshotFormat: "image/jpeg", videoConstraints: { facingMode: "environment" }, className: "w-full max-h-[300px] object-cover" }), _jsxs("div", { className: "absolute bottom-4 flex gap-2", children: [_jsxs(Button, { onClick: captureLivePhoto, disabled: isScanning, variant: "default", children: [isScanning ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : _jsx(Camera, { className: "h-4 w-4 mr-2" }), "Capture & Scan"] }), _jsx(Button, { onClick: () => setShowCamera(false), variant: "destructive", children: "Cancel" })] })] })), _jsxs("form", { onSubmit: handleVerify, className: "mb-6 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "transactionId", children: "Telebirr Transaction ID" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { id: "transactionId", type: "text", value: transactionId, onChange: (e) => setTransactionId(e.target.value.toUpperCase().trim()), placeholder: "e.g. DEA6QVQ0QC", required: true }), _jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleImageUpload, className: "hidden" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => fileInputRef.current?.click(), disabled: isScanning || isLoading, title: "Upload Screenshot", className: "px-3", children: _jsx(Upload, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => setShowCamera(true), disabled: isScanning || isLoading || showCamera, title: "Live Camera Scan", className: "px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200", children: _jsx(Video, { className: "h-4 w-4" }) })] }), isScanning && (_jsx("p", { className: "text-sm text-muted-foreground animate-pulse mt-1", children: "Processing image OCR..." }))] }), _jsxs(Button, { type: "submit", className: "w-full", disabled: isLoading || isScanning || !transactionId, children: [isLoading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), isLoading ? 'Verifying with Backend...' : 'Verify Transaction'] })] }), error && (_jsxs(Alert, { variant: "destructive", className: "mb-6", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Error" }), _jsx(AlertDescription, { children: error })] })), success && (_jsxs("div", { className: "border-t pt-6 space-y-6", children: [_jsxs(Alert, { className: "bg-green-50 border-green-200 text-green-900", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx(AlertTitle, { className: "text-green-800", children: "Valid Transaction!" }), _jsx(AlertDescription, { className: "text-green-700", children: "Details verified. Ready to save." })] }), _jsxs("form", { onSubmit: handleSaveToDatabase, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "payerName", children: "Verified Payer Name" }), _jsx(Input, { id: "payerName", value: formData.payerName, readOnly: true, className: "bg-muted" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Verified Phone Number" }), _jsx(Input, { id: "phone", value: formData.phone, readOnly: true, className: "bg-muted" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "amount", children: "Settled Amount (ETB)" }), _jsx(Input, { id: "amount", value: formData.amount, readOnly: true, className: "bg-muted" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "date", children: "Transaction Date" }), _jsx(Input, { id: "date", value: formData.date ? new Date(formData.date).toLocaleDateString() : '', readOnly: true, className: "bg-muted" })] })] }), _jsx(Button, { type: "submit", className: "w-full mt-2 bg-green-600 hover:bg-green-700", size: "lg", children: "Confirm & Save to Database" })] })] }))] })] }) }));
}
