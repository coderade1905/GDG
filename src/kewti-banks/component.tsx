import React, { useState } from 'react';
import { verifyTelebirr } from './parse.ts';
import { validateTransaction } from './index.ts';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================
export interface TelebirrTransaction {
    id: string;
    payerName: string;
    phone: string;
    amount: number;
    timestamp: string;
}

export interface ValidationResult {
    isValid: boolean;
    date: string;
    errors: string[];
}

interface FormData {
    payerName: string;
    phone: string;
    amount: number | string;
    date: string;
}

export default function TransactionValidator() {
    const [transactionId, setTransactionId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        payerName: '',
        phone: '',
        amount: '',
        date: '',
    });

    // 1. Handle the verification process
    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!transactionId) return;

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Step 1: Fetch transaction data
            const telebirr = await verifyTelebirr(transactionId);

            if (!telebirr) {
                setError('Failed to fetch transaction data. Invalid ID.');
                setIsLoading(false);
                return;
            }

            // Step 2: Validate the transaction
            const result = validateTransaction(
                telebirr,
                10,
                '251912347666',
                'Mr. Shegaw Misene'
            );

            // Step 3: Handle the result
            if (result.isValid) {
                console.log('Transaction is Valid!');
                console.log([telebirr, result.date]);

                // Auto-fill the form state
                setFormData({
                    payerName: telebirr.payerName,
                    phone: telebirr.payerTelebirrNo,
                    amount: telebirr.settledAmount,
                    date: result.date,
                });
                setSuccess(true);
            } else {
                console.log('Transaction Failed Validation:');
                console.log(result.errors);
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

    // 2. Handle saving to the database
    const handleSaveToDatabase = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would make your API call to save to your database
        console.log('Saving to database...', { transactionId, ...formData });
        alert('Transaction saved successfully to the database!');
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Verify Payment</CardTitle>
                    <CardDescription>
                        Enter the Telebirr transaction ID to validate and record the payment.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* VERIFICATION SECTION */}
                    <form onSubmit={handleVerify} className="mb-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Telebirr Transaction ID</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="transactionId"
                                    type="text"
                                    value={transactionId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setTransactionId(e.target.value.toUpperCase())
                                    }
                                    placeholder="e.g. DEA6QVQ0QC"
                                    required
                                />
                                <Button type="submit" disabled={isLoading || !transactionId}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? 'Verifying...' : 'Verify'}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* AUTO-FILLED FORM SECTION (Only shows if valid) */}
                    {success && (
                        <div className="border-t pt-6 space-y-6">
                            <Alert className="bg-green-50 border-green-200 text-green-900">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Valid Transaction!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Transaction details have been securely fetched and auto-filled.
                                </AlertDescription>
                            </Alert>

                            <form onSubmit={handleSaveToDatabase} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="payerName">Payer Name</Label>
                                    <Input
                                        id="payerName"
                                        value={formData.payerName}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (ETB)</Label>
                                        <Input
                                            id="amount"
                                            value={formData.amount}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            value={formData.date ? new Date(formData.date).toLocaleDateString() : ''}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-2" size="lg">
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