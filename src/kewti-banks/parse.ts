
// ADOPTED FROM: https://github.com/Vixen878/verifier-api //


import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";


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

/**
 * Enhanced regex-based extractor for settled amount - multiple patterns like PHP version
 * @param htmlContent The raw HTML content
 * @returns Extracted settled amount or null
 */
function extractSettledAmountRegex(htmlContent: string): string | null {
    // Pattern 1: Direct match with the exact text structure
    const pattern1 = /የተከፈለው\s+መጠን\/Settled\s+Amount.*?<\/td>\s*<td[^>]*>\s*(\d+(?:\.\d{2})?\s+Birr)/is;
    let match = htmlContent.match(pattern1);
    if (match) return match[1].trim();

    // Pattern 2: Look for the table row structure
    const pattern2 = /<tr[^>]*>.*?የተከፈለው\s+መጠን\/Settled\s+Amount.*?<td[^>]*>\s*(\d+(?:\.\d{2})?\s+Birr)/is;
    match = htmlContent.match(pattern2);
    if (match) return match[1].trim();

    // Pattern 3: More flexible approach - look for any cell containing "Settled Amount" followed by amount
    const pattern3 = /Settled\s+Amount.*?(\d+(?:\.\d{2})?\s+Birr)/is;
    match = htmlContent.match(pattern3);
    if (match) return match[1].trim();

    // Pattern 4: Look specifically in the transaction details table
    const pattern4 = /የክፍያ\s+ዝርዝር\/Transaction\s+details.*?<tr[^>]*>.*?<td[^>]*>\s*[^<]*<\/td>\s*<td[^>]*>\s*[^<]*<\/td>\s*<td[^>]*>\s*(\d+(?:\.\d{2})?\s+Birr)/is;
    match = htmlContent.match(pattern4);
    if (match) return match[1].trim();

    return null;
}

/**
 * Enhanced regex-based extractor for service fee
 * @param htmlContent The raw HTML content
 * @returns Extracted service fee or null
 */
function extractServiceFeeRegex(htmlContent: string): string | null {
    // Pattern to match "የአገልግሎት ክፍያ/Service fee" followed by amount in Birr
    // Make sure we don't match VAT version
    const pattern = /የአገልግሎት\s+ክፍያ\/Service\s+fee(?!\s+ተ\.እ\.ታ).*?<\/td>\s*<td[^>]*>\s*(\d+(?:\.\d{2})?\s+Birr)/i;
    const match = htmlContent.match(pattern);
    if (match) return match[1].trim();

    return null;
}

/**
 * Enhanced regex-based extractor for receipt number
 * @param htmlContent The raw HTML content
 * @returns Extracted receipt number or null
 */
function extractReceiptNoRegex(htmlContent: string): string | null {
    // Extract receipt number from the transaction details table
    const pattern = /<td[^>]*class="[^"]*receipttableTd[^"]*receipttableTd2[^"]*"[^>]*>\s*([A-Z0-9]+)\s*<\/td>/i;
    const match = htmlContent.match(pattern);
    if (match) return match[1].trim();

    return null;
}

/**
 * Enhanced regex-based extractor for payment date
 * @param htmlContent The raw HTML content
 * @returns Extracted payment date or null
 */
function extractDateRegex(htmlContent: string): string | null {
    // Extract date in format DD-MM-YYYY HH:MM:SS
    const pattern = /(\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2})/;
    const match = htmlContent.match(pattern);
    if (match) return match[1].trim();

    return null;
}

/**
 * Generic regex extractor for other fields
 * @param htmlContent The raw HTML content
 * @param labelPattern The label to search for
 * @param valuePattern The pattern for the value (defaults to capturing any non-tag content)
 * @returns Extracted value or null
 */
function extractWithRegex(htmlContent: string, labelPattern: string, valuePattern: string = '([^<]+)'): string | null {
    // Escape special regex characters in the label pattern
    const escapedLabel = labelPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`${escapedLabel}.*?<\\/td>\\s*<td[^>]*>\\s*${valuePattern}`, 'i');
    const match = htmlContent.match(pattern);
    if (match) return match[1].replace(/<[^>]*>/g, '').trim(); // Strip any remaining HTML tags

    return null;
}

/**
 * Regex-based extractor for settled amount and service fee as fallback
 * @param htmlContent The raw HTML content
 * @returns Object containing extracted values
 */
function extractWithRegexLegacy(htmlContent: string): { settledAmount: string | null; serviceFee: string | null } {
    // Use the new enhanced extractors
    const settledAmount = extractSettledAmountRegex(htmlContent);
    const serviceFee = extractServiceFeeRegex(htmlContent);

    return {
        settledAmount,
        serviceFee
    };
}

/**
 * Scrapes Telebirr receipt data from HTML content
 * @param html The HTML content to scrape
 * @returns Extracted Telebirr receipt data
 */
function scrapeTelebirrReceipt(html: string): TelebirrReceipt {
    const $ = cheerio.load(html);

    // Log HTML content in debug mode to help diagnose scraping issues
    console.log(`HTML content length: ${html.length} bytes`);
    if (html.length < 100) {
        console.log(`Suspiciously short HTML response: ${html}`);
    }

    const getText = (selector: string): string =>
        $(selector).next().text().trim();

    const getPaymentDate = (): string => {
        // First try regex extraction
        const regexDate = extractDateRegex(html);
        if (regexDate) return regexDate;

        // Fallback to cheerio
        return $('.receipttableTd').filter((_: any, el: any) => $(el).text().includes("-202")).first().text().trim();
    };

    const getReceiptNo = (): string => {
        // First try regex extraction
        const regexReceiptNo = extractReceiptNoRegex(html);
        if (regexReceiptNo) return regexReceiptNo;

        // Fallback to cheerio
        return $('td.receipttableTd.receipttableTd2')
            .eq(1) // second match: the value, not the label
            .text()
            .trim();
    };

    const getSettledAmount = (): string => {
        // First try the enhanced regex approach
        const regexAmount = extractSettledAmountRegex(html);
        if (regexAmount) return regexAmount;

        // Fallback to cheerio approach
        let amount = $('td.receipttableTd.receipttableTd2')
            .filter((_: any, el: any) => {
                const prevTd = $(el).prev();
                return prevTd.text().includes("የተከፈለው መጠን") || prevTd.text().includes("Settled Amount");
            })
            .text()
            .trim();

        // If that doesn't work, try looking in the transaction details table
        if (!amount) {
            amount = $('tr')
                .filter((_: any, el: any) => {
                    return $(el).find('td').first().text().includes("የተከፈለው መጠን") ||
                        $(el).find('td').first().text().includes("Settled Amount");
                })
                .find('td')
                .last()
                .text()
                .trim();
        }

        return amount;
    };

    const getServiceFee = (): string => {
        // First try the enhanced regex approach
        const regexFee = extractServiceFeeRegex(html);
        if (regexFee) return regexFee;

        // Fallback to cheerio approach - look for service fee but not service fee VAT
        let fee = $('td.receipttableTd1')
            .filter((_: any, el: any) => {
                const text = $(el).text();
                return (text.includes("የአገልግሎት ክፍያ") || text.includes("Service fee")) &&
                    !text.includes("ተ.እ.ታ") && !text.includes("VAT");
            })
            .next('td.receipttableTd.receipttableTd2')
            .text()
            .trim();

        // Alternative approach - look in table rows
        if (!fee) {
            fee = $('tr')
                .filter((_: any, el: any) => {
                    const text = $(el).text();
                    return (text.includes("የአገልግሎት ክፍያ") || text.includes("Service fee")) &&
                        !text.includes("ተ.እ.ታ") && !text.includes("VAT");
                })
                .find('td')
                .last()
                .text()
                .trim();
        }

        return fee;
    };

    // Helper function to extract text using regex first, then cheerio
    const getTextWithFallback = (labelText: string, cheerioSelector?: string): string => {
        // Try regex first
        const regexResult = extractWithRegex(html, labelText);
        if (regexResult) return regexResult;

        // Fallback to cheerio if selector provided
        if (cheerioSelector) {
            return getText(cheerioSelector);
        }

        // Default cheerio approach
        return getText(`td:contains("${labelText}")`);
    };

    console.log("SERVICE FEE: ", getServiceFee());
    console.log("SETTLED AMOUNT: ", getSettledAmount());

    // Get regex results as backup for debugging
    const regexResults = extractWithRegexLegacy(html);
    console.log("Regex results:", regexResults);

    let creditedPartyName = getTextWithFallback("የገንዘብ ተቀባይ ስም/Credited Party name");
    let creditedPartyAccountNo = getTextWithFallback("የገንዘብ ተቀባይ ቴሌብር ቁ./Credited party account no");
    let bankName = "";

    const bankAccountNumberRaw = getTextWithFallback("የባንክ አካውንት ቁጥር/Bank account number");

    if (bankAccountNumberRaw) {
        bankName = creditedPartyName; // The original credited party name is the bank
        const bankAccountRegex = /(\d+)\s+(.*)/;
        const match = bankAccountNumberRaw.match(bankAccountRegex);
        if (match) {
            creditedPartyAccountNo = match[1].trim();
            creditedPartyName = match[2].trim();
        }
    }


    return {
        payerName: getTextWithFallback("የከፋይ ስም/Payer Name"),
        payerTelebirrNo: getTextWithFallback("የከፋይ ቴሌብር ቁ./Payer telebirr no."),
        creditedPartyName,
        creditedPartyAccountNo,
        transactionStatus: getTextWithFallback("የክፍያው ሁኔታ/transaction status"),
        receiptNo: getReceiptNo(),
        paymentDate: getPaymentDate(),
        settledAmount: getSettledAmount(),
        serviceFee: getServiceFee(),
        serviceFeeVAT: getTextWithFallback("የአገልግሎት ክፍያ ተ.እ.ታ/Service fee VAT"),
        totalPaidAmount: getTextWithFallback("ጠቅላላ የተከፈለ/Total Paid Amount"),
        bankName
    };
}

/**
 * Parses Telebirr receipt data from JSON response
 * @param jsonData The JSON data from the proxy endpoint
 * @returns Extracted Telebirr receipt data
 */
function parseTelebirrJson(jsonData: any): TelebirrReceipt | null {
    try {
        // Check if the response has the expected structure
        if (!jsonData || !jsonData.success || !jsonData.data) {
            console.log("Invalid JSON structure from proxy endpoint", { jsonData });
            return null;
        }

        const data = jsonData.data;

        return {
            payerName: data.payerName || "",
            payerTelebirrNo: data.payerTelebirrNo || "",
            creditedPartyName: data.creditedPartyName || "",
            creditedPartyAccountNo: data.creditedPartyAccountNo || "",
            transactionStatus: data.transactionStatus || "",
            receiptNo: data.receiptNo || "",
            paymentDate: data.paymentDate || "",
            settledAmount: data.settledAmount || "",
            serviceFee: data.serviceFee || "",
            serviceFeeVAT: data.serviceFeeVAT || "",
            totalPaidAmount: data.totalPaidAmount || "",
            bankName: data.bankName || ""
        };
    } catch (error) {
        console.log("Error parsing JSON from proxy endpoint", { error, jsonData });
        return null;
    }
}

/**
 * Fetches and processes Telebirr receipt data from the primary source (HTML)
 * @param reference The Telebirr reference number
 * @param baseUrl The base URL to fetch the receipt from
 * @returns The scraped receipt data or null if failed
 */
async function fetchFromPrimarySource(reference: string, baseUrl: string): Promise<TelebirrReceipt | null> {
    const url = `${baseUrl}${reference}`;

    try {
        console.log(`Attempting to fetch Telebirr receipt from primary source: ${url}`);
        const response = await axios.get(url, { timeout: 30000 }); // 30 second timeout to be safe
        console.log(`Received response with status: ${response.status}`);

        const html = response.data?.html;

        if (typeof html !== "string") {
            console.log("Invalid HTML payload:", response.data);
            return null;
        }

        const extractedData = scrapeTelebirrReceipt(html);

        console.log("Extracted data from HTML:", extractedData);
        console.log(`Successfully extracted Telebirr data for reference: ${reference}`, {
            receiptNo: extractedData.receiptNo,
            payerName: extractedData.payerName,
            transactionStatus: extractedData.transactionStatus,
            settledAmount: extractedData.settledAmount,
            serviceFee: extractedData.serviceFee
        });

        return extractedData;
    } catch (error) {
        // Enhanced error logging with request details
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;

        // Check if it's an Axios error to safely access response properties
        const axiosError = error as AxiosError;
        const responseDetails = axiosError.response ? {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            responseData: axiosError.response.data
        } : {};

        console.log(`Error fetching Telebirr receipt from primary source ${url}:`, {
            error: errorMessage,
            stack: errorStack,
            ...responseDetails
        });

        return null;
    }
}

export class TelebirrVerificationError extends Error {
    public details?: string;
    constructor(message: string, details?: string) {
        super(message);
        this.name = 'TelebirrVerificationError';
        this.details = details;
    }
}

/**
 * Fetches and processes Telebirr receipt data from the fallback proxy (JSON)
 * @param reference The Telebirr reference number
 * @param proxyUrl The proxy URL to fetch the receipt from
 * @returns The parsed receipt data or null if failed
 */
async function fetchFromProxySource(reference: string, proxyUrl: string): Promise<TelebirrReceipt | null> {
    const proxyKey = "" //import.meta.env.VITE_TELEBIRR_PROXY_KEY || '';
    const url = `${proxyUrl}${reference}${proxyKey ? `&key=${proxyKey}` : ''}`;

    try {
        console.log(`Attempting to fetch Telebirr receipt from proxy: ${url}`);
        const response = await axios.get(url, {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'VerifierAPI/1.0'
            }
        });

        console.log(`Received proxy response with status: ${response.status}`);

        // Check if response is JSON
        let data = response.data;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.log("Proxy response is not valid JSON, attempting to scrape as HTML");
                return scrapeTelebirrReceipt(response.data);
            }
        }

        if (data && data.success === false && data.error) {
            console.log(`Proxy returned explicit error: ${data.error}`);
            throw new TelebirrVerificationError(data.error, data.details);
        }

        const extractedData = parseTelebirrJson(data);
        if (!extractedData) {
            console.log("Failed to parse JSON from proxy, attempting to scrape as HTML");
            return scrapeTelebirrReceipt(response.data);
        }

        console.log("Extracted data from JSON:", extractedData);
        console.log(`Successfully extracted Telebirr data from proxy for reference: ${reference}`, {
            receiptNo: extractedData.receiptNo,
            payerName: extractedData.payerName,
            transactionStatus: extractedData.transactionStatus
        });

        return extractedData;
    } catch (error) {
        if (error instanceof Error && error.name === 'TelebirrVerificationError') {
            throw error;
        }

        const axiosError = error as AxiosError;
        if (axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED' || axiosError.code === 'ECONNREFUSED') {
            const detailMsg = axiosError.message;
            throw new TelebirrVerificationError("The fallback proxy server (leul.et) is unreachable or timed out.", detailMsg);
        }

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;

        const responseDetails = axiosError.response ? {
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            responseData: axiosError.response.data
        } : {};

        console.log(`Error fetching Telebirr receipt from proxy ${url}:`, {
            error: errorMessage,
            stack: errorStack,
            ...responseDetails
        });

        return null;
    }
}

export async function verifyTelebirr(reference: string): Promise<TelebirrReceipt | null> {
    const primaryUrl = "http://localhost:3001/api/telebirr/receipt/";


    const envProxies = "" //import.meta.env.VITE_FALLBACK_PROXIES || "";
    const fallbackProxies = envProxies.split(',')
        .map((url: string) => url.trim())
        .filter((url: string | any[]) => url.length > 0);
    const skipPrimary = false // import.meta.env.VITE_SKIP_PRIMARY_VERIFICATION === "true";

    if (!skipPrimary) {
        console.log(`Attempting primary verification for: ${reference}`);
        const primaryResult = await fetchFromPrimarySource(reference, primaryUrl);

        if (primaryResult && isValidReceipt(primaryResult)) {
            return primaryResult;
        }
        console.log(`Primary verification failed. Moving to fallback proxy pool...`);
    } else {
        console.log(`Skipping primary verifier (SKIP_PRIMARY_VERIFICATION=true).`);
    }

    if (fallbackProxies.length === 0 && skipPrimary) {
        console.log("CRITICAL: Primary check skipped, but no FALLBACK_PROXIES defined in .env!");
        return null;
    }

    for (const proxyUrl of fallbackProxies) {
        try {
            console.log(`Attempting verification with proxy: ${proxyUrl}`);
            const fallbackResult = await fetchFromProxySource(reference, proxyUrl);

            if (fallbackResult && isValidReceipt(fallbackResult)) {
                console.log(`Successfully verified using proxy: ${proxyUrl}`);
                return fallbackResult;
            }
        } catch (error) {
            console.log(`Proxy ${proxyUrl} failed or timed out. Trying next...`);
        }
    }

    console.log(`All primary and proxy verification methods failed for reference: ${reference}`);
    return null;
}

// Add this helper function to validate receipt data
function isValidReceipt(receipt: TelebirrReceipt): boolean {
    // Check if essential fields have values
    return Boolean(
        receipt.receiptNo &&
        receipt.payerName &&
        receipt.transactionStatus
    );
}