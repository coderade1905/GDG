export interface TelebirrTransaction {
    id: string;
    receiverName?: string;
    transactionTo?: string;
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
export default function TransactionValidator(): import("react/jsx-runtime").JSX.Element;
