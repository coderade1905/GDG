export interface TelebirrData {
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
export declare function validateTransaction(data: TelebirrData, expectedAmount: number, expectedReceiverAccount: string, expectedReceiverName: string): {
    isValid: boolean;
    date: string;
    errors: string[] | undefined;
};
