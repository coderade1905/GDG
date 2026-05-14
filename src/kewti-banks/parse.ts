export interface TransactionData {
    payerName: string | null;
    payerAccount: string | null;
    receiverName: string | null;
    receiverAccount: string | null;
    paymentDateTime: string | null;
    referenceNo: string | null;
    transferredAmount: number | null;
}

export interface ValidationResult {
    isValid: boolean;
    date?: string | null;
    errors?: string[];
    extractedData?: TransactionData;
}


export function normalizeName(name: string): string {
    return name
        .toUpperCase()
        // Remove common titles (word boundaries)
        .replace(/\b(MR|MS|MRS|MISS|DR)\b\.?/g, '')
        // Remove unwanted punctuation
        .replace(/[^A-Z0-9\s]/g, '')
        // Collapse multiple spaces into one
        .replace(/\s+/g, ' ')
        .trim();
}


export function parseReceiptText(text: string): TransactionData {
    const data: TransactionData = {
        payerName: null,
        payerAccount: null,
        receiverName: null,
        receiverAccount: null,
        paymentDateTime: null,
        referenceNo: null,
        transferredAmount: null,
    };

    const payerMatch = text.match(/Payer\s+(.+)/i);
    if (payerMatch) data.payerName = payerMatch[1].trim();

    const receiverMatch = text.match(/Receiver\s+(.+)/i);
    if (receiverMatch) data.receiverName = receiverMatch[1].trim();

    // Extract Accounts (First match is payer, second match is receiver)
    const accountMatches = [...text.matchAll(/Account\s+([0-9*]+)/gi)];
    if (accountMatches.length >= 1) data.payerAccount = accountMatches[0][1];
    if (accountMatches.length >= 2) data.receiverAccount = accountMatches[1][1];

    // Extract Date and Time
    const dateMatch = text.match(/Payment Date & Time\s+(.+)/i);
    if (dateMatch) data.paymentDateTime = dateMatch[1].trim();

    // Extract Reference Number
    const refMatch = text.match(/Reference No.*?VAT Invoice No\)\s+(.+)/i);
    if (refMatch) data.referenceNo = refMatch[1].trim();

    // Extract Transferred Amount
    const amountMatch = text.match(/Transferred Amount\s+([\d,.]+)\s*ETB/i);
    if (amountMatch) {
        data.transferredAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    return data;
}


export function validateTransaction(
    receiptText: string,
    expectedAmount: number,
    expectedReceiverAccount: string,
    expectedReceiverName: string
): ValidationResult {
    const parsedData = parseReceiptText(receiptText);
    const errors: string[] = [];

    // 1. Validate Amount
    if (parsedData.transferredAmount !== expectedAmount) {
        errors.push(`Amount mismatch. Expected ${expectedAmount}, found ${parsedData.transferredAmount}`);
    }

    // 2. Validate Receiver Name (Prefix-safe & handles partial matches)
    if (!parsedData.receiverName) {
        errors.push("Receiver name could not be extracted from the receipt.");
    } else {
        const normExtractedName = normalizeName(parsedData.receiverName);
        const normExpectedName = normalizeName(expectedReceiverName);

        if (!normExtractedName.includes(normExpectedName)) {
            errors.push(`Name mismatch. Expected "${normExpectedName}", found "${normExtractedName}" (Raw: "${parsedData.receiverName}").`);
        }
    }

    if (!parsedData.receiverAccount) {
        errors.push("Receiver account could not be extracted from the receipt.");
    } else {
        const maskParts = parsedData.receiverAccount.split(/\*+/);
        const startsWithValid = expectedReceiverAccount.startsWith(maskParts[0]);
        const endsWithValid = expectedReceiverAccount.endsWith(maskParts[maskParts.length - 1]);

        if (!startsWithValid || !endsWithValid) {
            errors.push(`Account number mismatch. Expected ${expectedReceiverAccount} does not match receipt mask ${parsedData.receiverAccount}.`);
        }
    }

    if (errors.length > 0) {
        return { isValid: false, errors, extractedData: parsedData };
    }

    return {
        isValid: true,
        date: parsedData.paymentDateTime,
        extractedData: parsedData
    };
}


const samplePdfText = `
Payment / Transaction Information
Payer MR ABEBE TESFAYE ANTENEH
Account 1****1234
Receiver DANIEL ABEBE TESFAYE
Account 1****5678
Payment Date & Time 5/13/2026, 12:50:00 PM
Reference No. (VAT Invoice No) FT123456789G
Reason / Type of service Pay done via Mobile
Transferred Amount 135.00 ETB
Total amount debited from customers account 135.61 ETB
`;

console.log("Test 1: User input has NO prefix, Receipt has 'MR");
const result1 = validateTransaction(
    samplePdfText,
    135.00,
    "1000123455678",
    "Daniel Abebe Tesfaye"
);
console.log(`Status: ${result1.isValid ? "Valid" : "Invalid"}`);
if (result1.isValid) console.log(`Date: ${result1.date}\n`);


console.log("Test 2: User input has 'Mr.', Receipt has 'MR'");
const result2 = validateTransaction(
    samplePdfText,
    135.00,
    "1000123455678",
    "Mr. Daniel Abebe Tesfaye"
);
console.log(`Status: ${result2.isValid ? "Valid" : "Invalid"}\n`);

console.log("Test 3: Invalid amount");
const result3 = validateTransaction(
    samplePdfText,
    136.00,
    "1000123455678",
    "Mr. Daniel Abebe Tesfaye"
);
console.log(`Status: ${result3.isValid ? "Valid" : "Invalid"}\n`);
if (result3.errors) {
    console.log(result3.errors);
}


console.log("Test 3: Checking Extracted Payer Name Normalization");
const parsed = parseReceiptText(samplePdfText);
console.log(`Raw Payer Name: "${parsed.payerName}"`);
console.log(`Normalized Payer Name: "${normalizeName(parsed.payerName || '')}"`);