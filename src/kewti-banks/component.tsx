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
// TYPES & INTERFACES
// ==========================================
export interface TelebirrTransaction {
    id: string;
    receiverName?: string;    // Changed from payerName
    transactionTo?: string;   // Sometimes receipts use "Transaction To"
    phone?: string;
    payerTelebirrNo?: string;
    amount?: number;
    settledAmount?: number;
    timestamp: string;
}

export interface ValidationResult {
    isValid: boolean;
    date: string;
    errors: string[];
}

interface FormData {
    payerName: string;     // Changed from payerName
    phone: string;
    amount: number | string;
    date: string;
}

// ==========================================
// REACT COMPONENT
// ==========================================
export default function TransactionValidator() {
    // Expected Validation State
    const [expectedName, setExpectedName] = useState<string>(''); // Now represents Receiver Name
    const [expectedAmount, setExpectedAmount] = useState<string>('');
    const [expectedPhone, setExpectedPhone] = useState<string>('251912347666'); // Default/Example

    // Verification State
    const [transactionId, setTransactionId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Live Camera State
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<FormData>({
        payerName: '',
        phone: '',
        amount: '',
        date: '',
    });

    // 1. Auto-Load / Save Expected Payer Name from Local Storage
    useEffect(() => {
        const savedName = localStorage.getItem('expectedTelebirrPayerName');
        if (savedName) setExpectedName(savedName);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('expectedTelebirrPayerName', expectedName);
        }, 500); // Debounce save
        return () => clearTimeout(timeoutId);
    }, [expectedName]);

    // 2. Extracted OCR Logic (used by both File Upload and Live Scan)
    const runOCR = async (imageSource: string | File) => {
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
            } else {
                setError("Could not detect a valid 10-character Transaction ID in this image.");
                return false;
            }
        } catch (err) {
            console.error(err);
            setError("Failed to scan the image. Please try again or enter the ID manually.");
            return false;
        } finally {
            setIsScanning(false);
        }
    };

    // 3. Handlers for Scanning
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await runOCR(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const captureLivePhoto = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            await runOCR(imageSrc);
        }
    }, [webcamRef]);

    // 4. Handle Verification
    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
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

            const result = validateTransaction(
                telebirr,
                Number(expectedAmount),
                expectedPhone,
                expectedName
            );

            if (result.isValid) {
                setFormData({
                    // Fallbacks for however your parse.ts outputs the receiver's name
                    payerName: telebirr.payerName ,
                    phone: telebirr.payerTelebirrNo ,
                    amount: telebirr.settledAmount ,
                    date: result.date,
                });
                setSuccess(true);
            } else {
                const validationErrors = result.errors ?? [];
                setError(
                    `Validation Failed${validationErrors.length ? `: ${validationErrors.join(', ')}` : '.'}`
                );
            }
        } catch (err) {
            setError('An unexpected error occurred while verifying.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToDatabase = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Saving to database...', { transactionId, ...formData });
        alert('Transaction saved successfully to the database!');
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Verify Payment</CardTitle>
                    <CardDescription>
                        Set your expected values, then scan or enter a transaction ID.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    
                    {/* EXPECTED VALUES SECTION */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg border">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="expectedName">Expected Receiver Name (Auto-saves)</Label>
                            <Input
                                id="expectedName"
                                value={expectedName}
                                onChange={(e) => setExpectedName(e.target.value)}
                                placeholder="e.g. Ethio telecom"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expectedAmount">Expected Amount</Label>
                            <Input
                                id="expectedAmount"
                                type="number"
                                value={expectedAmount}
                                onChange={(e) => setExpectedAmount(e.target.value)}
                                placeholder="e.g. 10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expectedPhone">Expected Phone</Label>
                            <Input
                                id="expectedPhone"
                                value={expectedPhone}
                                onChange={(e) => setExpectedPhone(e.target.value)}
                                placeholder="e.g. 251912347666"
                            />
                        </div>
                    </div>

                    {/* LIVE CAMERA SECTION */}
                    {showCamera && (
                        <div className="relative mb-6 rounded-lg overflow-hidden border bg-black flex flex-col items-center">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "environment" }} // Tries to use rear camera
                                className="w-full max-h-[300px] object-cover"
                            />
                            <div className="absolute bottom-4 flex gap-2">
                                <Button onClick={captureLivePhoto} disabled={isScanning} variant="default">
                                    {isScanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                                    Capture & Scan
                                </Button>
                                <Button onClick={() => setShowCamera(false)} variant="destructive">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* VERIFICATION SECTION */}
                    <form onSubmit={handleVerify} className="mb-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Telebirr Transaction ID</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="transactionId"
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value.toUpperCase().trim())}
                                    placeholder="e.g. DEA6QVQ0QC"
                                    required
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                {/* Upload Image Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isScanning || isLoading}
                                    title="Upload Screenshot"
                                    className="px-3"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>

                                {/* Live Camera Button */}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowCamera(true)}
                                    disabled={isScanning || isLoading || showCamera}
                                    title="Live Camera Scan"
                                    className="px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200"
                                >
                                    <Video className="h-4 w-4" />
                                </Button>

                            </div>
                            {isScanning && (
                                <p className="text-sm text-muted-foreground animate-pulse mt-1">
                                    Processing image OCR...
                                </p>
                            )}
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading || isScanning || !transactionId}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Verifying with Backend...' : 'Verify Transaction'}
                        </Button>
                    </form>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* AUTO-FILLED FORM SECTION */}
                    {success && (
                        <div className="border-t pt-6 space-y-6">
                            <Alert className="bg-green-50 border-green-200 text-green-900">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Valid Transaction!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Details verified. Ready to save.
                                </AlertDescription>
                            </Alert>

                            <form onSubmit={handleSaveToDatabase} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="payerName">Verified Payer Name</Label>
                                    <Input id="payerName" value={formData.payerName} readOnly className="bg-muted" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Verified Phone Number</Label>
                                    <Input id="phone" value={formData.phone} readOnly className="bg-muted" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Settled Amount (ETB)</Label>
                                        <Input id="amount" value={formData.amount} readOnly className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Transaction Date</Label>
                                        <Input
                                            id="date"
                                            value={formData.date ? new Date(formData.date).toLocaleDateString() : ''}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700" size="lg">
                                    Confirm & Save to Database
                                </Button>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}