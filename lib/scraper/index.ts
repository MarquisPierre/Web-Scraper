import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

/**
 * Scrapes product information from an Amazon product page.
 * @param url - The URL of the Amazon product page to scrape.
 * @returns A data object containing product details like title, price, description, and more.
 */
export async function scrapeAmazonProduct(url: string) {
    if (!url) return;  // If no URL is provided, exit the function early.
    
    // Bright Data proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);  // Proxy username from environment variables
    const password = String(process.env.BRIGHT_DATA_PASSWORD);  // Proxy password from environment variables
    const port = 22225;  // Proxy port
    const session_id = (1000000 * Math.random()) | 0;  // Generate a random session ID
    
    // Proxy options for axios request
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,  // Create username with session ID
            password,  // Use the password from environment variables
        },
        host: 'brd.superproxy.io',  // Proxy host
        port,  // Proxy port
        rejectUnauthorized: false,  // Allow unauthorized certificates
    };

    try {
        // Send a GET request to the Amazon product page using axios and the proxy options
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);  // Load the HTML response into cheerio for DOM manipulation

        // Extract the product title from the page
        const title = $('#productTitle').text().trim();  // Extract and trim the product title text

        // Extract the current price using various possible price element selectors
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );
    
        // Extract the original price using other possible price element selectors
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );
    
        // Check if the product is out of stock by inspecting the availability text
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
    
        // Extract the product image URLs from dynamic image attributes
        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') || 
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}';  // Default to an empty object if no images are found
    
        // Parse the image URLs from the extracted JSON
        const imageUrls = Object.keys(JSON.parse(images));
    
        // Extract the currency symbol from the page
        const currency = extractCurrency($('.a-price-symbol'));
        
        // Extract the discount rate by removing non-numeric characters from the percentage
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
    
        // Extract the product description using predefined selectors
        const description = extractDescription($);
        
        // Construct a data object with the scraped information
        const data = {
            url,  // The URL of the product page
            currency: currency || '$',  // Use the extracted currency or default to '$'
            image: imageUrls[0],  // Use the first image URL in the list
            title,  // The extracted product title
            currentPrice: Number(currentPrice) || Number(originalPrice),  // Convert the current price to a number or fallback to the original price
            originalPrice: Number(originalPrice) || Number(currentPrice),  // Convert the original price to a number or fallback to the current price
            priceHistory: [],  // Initialize an empty price history array
            discountRate: Number(discountRate),  // Convert the discount rate to a number
            category: 'category',  // Placeholder for the product category (can be modified as needed)
            reviewsCount: 100,  // Placeholder for the number of reviews (can be replaced with actual data)
            stars: 4.5,  // Placeholder for the average star rating (can be replaced with actual data)
            isOutOfStock: outOfStock,  // Whether the product is out of stock
            description,  // The extracted product description
            lowestPrice: Number(currentPrice) || Number(originalPrice),  // Lowest price is either the current or original price
            highestPrice: Number(originalPrice) || Number(currentPrice),  // Highest price is either the original or current price
            averagePrice: Number(currentPrice) || Number(originalPrice),  // Average price is calculated based on available prices
        };
        
        return data;  // Output the scraped data to the console
    } catch (error: any) {
        // Handle any errors during the scraping process
        throw new Error(`Failed to scrape product: ${error.message}`);
    }
}
