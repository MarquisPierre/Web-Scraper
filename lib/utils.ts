import { PriceHistoryItem, Product } from "@/types";

/**
 * Extracts and returns the first found price from a list of possible elements.
 * @param elements - List of DOM elements that may contain price information.
 * @returns The extracted price as a string, or an empty string if no valid price is found.
 */
export function extractPrice(...elements: any): string {
    for (const element of elements) {
        const priceText = element.text().trim();  // Extract and trim the text content of the element
        
        if (priceText) {
            // Clean the price text by removing non-numeric characters except for decimal points
            const cleanPrice = priceText.replace(/[^\d.]/g, '');
            
            let firstPrice; 
            
            if (cleanPrice) {
                // Try to match a price in the format of digits followed by a decimal point and two digits
                firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
            }
            
            // Return the first matched price if found, otherwise return the cleaned price
            return firstPrice || cleanPrice;
        }
    }
    
    return '';  // Return an empty string if no price is found
}

/**
 * Extracts and returns the currency symbol from a DOM element.
 * @param element - DOM element containing the currency symbol.
 * @returns The first character of the element's text content, or an empty string if not found.
 */
export function extractCurrency(element: any): string {
    const currencyText = element.text().trim().slice(0, 1);  // Extract the first character of the text content
    return currencyText ? currencyText : "";  // Return the currency symbol or an empty string
}

/**
 * Extracts and returns the product description from a set of possible DOM elements on Amazon.
 * @param $ - jQuery or similar DOM manipulation object.
 * @returns The combined text content of matching elements, or an empty string if no description is found.
 */
export function extractDescription($: any): string {
    // List of possible selectors for elements that may contain product descriptions
    const selectors = [
        ".a-unordered-list .a-list-item",  // Selector for unordered list items
        ".a-expander-content p",           // Selector for expanded content paragraphs
        // Add more selectors if needed
    ];
    
    for (const selector of selectors) {
        const elements = $(selector);  // Find elements matching the selector
        if (elements.length > 0) {
            // Map the found elements to their text content, trim whitespace, and join them with newlines
            const textContent = elements
                .map((_: any, element: any) => $(element).text().trim())
                .get()
                .join("\n");
            return textContent;
        }
    }
    
    return "";  // Return an empty string if no description is found
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Finds and returns the highest price from a list of price history items.
 * @param priceList - Array of PriceHistoryItem objects containing price data.
 * @returns The highest price found in the price list.
 */
export function getHighestPrice(priceList: PriceHistoryItem[]): number {
    let highestPrice = priceList[0];  // Initialize with the first price item
    
    // Iterate over the price list to find the highest price
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }
    
    return highestPrice.price;  // Return the highest price found
}

/**
 * Finds and returns the lowest price from a list of price history items.
 * @param priceList - Array of PriceHistoryItem objects containing price data.
 * @returns The lowest price found in the price list.
 */
export function getLowestPrice(priceList: PriceHistoryItem[]): number {
    let lowestPrice = priceList[0];  // Initialize with the first price item
    
    // Iterate over the price list to find the lowest price
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }
    
    return lowestPrice.price;  // Return the lowest price found
}


export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;
  
    return averagePrice;
  }
  
//   export const getEmailNotifType = (
//     scrapedProduct: Product,
//     currentProduct: Product
//   ) => {
//     const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  
//     if (scrapedProduct.currentPrice < lowestPrice) {
//       return Notification.LOWEST_PRICE as keyof typeof Notification;
//     }
//     if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
//       return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
//     }
//     if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
//       return Notification.THRESHOLD_MET as keyof typeof Notification;
//     }
  
//     return null;
//   };
  
  export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
