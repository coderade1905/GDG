export interface TelebirrReceipt {
    payerName: string;
    payerTelebirrNo: string;
    creditedPartyName: string;
    creditedPartyAccountNo: string;
    transactionStatus: string;
    receiptNo: string;
    paymentDate: string;
    settledAmount: string;
    serviceFee: string;
    serviceFeeVAT: string;
    totalPaidAmount: string;
    bankName: string;
}
export declare class TelebirrVerificationError extends Error {
    details?: string;
    constructor(message: string, details?: string);
}
export declare function verifyTelebirr(reference: string): Promise<TelebirrReceipt | null>;
