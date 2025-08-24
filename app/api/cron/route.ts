import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { NextResponse } from "next/server";





export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
   const updatedProducts = await Promise.all(
  products.map(async (currentProduct) => {
    try {
      // === 1. SCRAPE PRODUCT ===
      const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
      if (!scrapedProduct) {
        console.warn("No scraped data for:", currentProduct.url);
        return null;
      }

      const updatedPriceHistory = [
        ...currentProduct.priceHistory,
        {
          price: scrapedProduct.currentPrice,
        },
      ];

      const product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };

      // === 2. UPDATE PRODUCT IN DB ===
      const updatedProduct = await Product.findOneAndUpdate(
        { url: product.url },
        product,
        { new: true } // <- Return the updated doc
      );

      // === 3. CHECK NOTIF CONDITIONS ===
      const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

      if (emailNotifType && updatedProduct?.users.length > 0) {
        const productInfo = {
          title: updatedProduct.title,
          url: updatedProduct.url,
        };

        // === 4. GENERATE EMAIL + SEND ===
        try {
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          await sendEmail(emailContent, userEmails);
        } catch (emailErr) {
          console.error("Email sending error for:", updatedProduct.url, emailErr);
        }
      }

      return updatedProduct;
    } catch (scrapeOrDBErr) {
      console.error("Product scrape/update error for:", currentProduct.url, scrapeOrDBErr);
      return null; // continue to next product
    }
  })
);


    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}