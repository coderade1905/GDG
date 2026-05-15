import { verifyTelebirr } from './parse.ts';
export function validateTransaction(data, expectedAmount, expectedReceiverAccount, expectedReceiverName) {
    const errors = [];
    // 1. Status Validation
    if (data.transactionStatus !== 'Completed') {
        errors.push(`Transaction status is ${data.transactionStatus}, expected 'Completed'.`);
    }
    // 2. Amount Validation (Converts "10 Birr" to number 10)
    const actualAmount = parseFloat(data.settledAmount.replace(/[^\d.]/g, ''));
    if (actualAmount !== expectedAmount) {
        errors.push(`Amount mismatch: Expected ${expectedAmount}, found ${actualAmount}`);
    }
    // 3. Name Validation (Removes Mr/Ms/Mrs/Dr effortlessly and ignores case)
    const normalizeName = (name) => name
        .replace(/\b(mr|ms|mrs|dr|ato|wro)\b\.?/gi, '') // Strip titles
        .replace(/\s+/g, ' ') // Remove double spaces
        .trim()
        .toLowerCase();
    const cleanActualName = normalizeName(data.creditedPartyName);
    const cleanExpectedName = normalizeName(expectedReceiverName);
    // Checks if names partially match 
    if (!cleanActualName.includes(cleanExpectedName) && !cleanExpectedName.includes(cleanActualName)) {
        errors.push(`Name mismatch: Expected "${expectedReceiverName}", found "${data.creditedPartyName}"`);
    }
    // 4. Account Number Validation (Handles the "2519****1234" masking)
    const maskParts = data.creditedPartyAccountNo.split(/\*+/); // Splits into ["2519", "1234"]
    const startsValid = expectedReceiverAccount.startsWith(maskParts[0]);
    const endsValid = expectedReceiverAccount.endsWith(maskParts[maskParts.length - 1]);
    if (!startsValid || !endsValid) {
        errors.push(`Account mismatch: Expected ${expectedReceiverAccount}, found ${data.creditedPartyAccountNo}`);
    }
    return {
        isValid: errors.length === 0,
        date: data.paymentDate,
        errors: errors.length > 0 ? errors : undefined
    };
}
async function run() {
    const telebirr = await verifyTelebirr('DEA6QVQ0QC');
    if (!telebirr) {
        console.log('Failed to fetch transaction data');
        return;
    }
    const result = validateTransaction(telebirr, 10, '251912347666', 'Mr. Shegaw Misene');
    if (result.isValid) {
        console.log('Transaction is Valid!');
        console.log([telebirr, result.date]);
    }
    else {
        console.log('Transaction Failed Validation:');
        console.log(result.errors);
    }
}
run();
