# 🕸️ Web Scraper Project  

A modern web scraping application (Specifically for Amazon.com) built with **Next.js** and powered by **Bright Data** for scalable scraping. It extracts and processes structured data using **Cheerio**, stores it in **MongoDB**, and includes email notifications via **Nodemailer**. The UI is built with **Headless UI** and **Tailwind CSS** for a clean and responsive design. Cron jobs is utilized to automate periodic scraping, ensuring data is up-to-date.

---

## 🚀 Features  

- 🌐 Scrapes structured data from websites using **Bright Data + Cheerio**  
- 📩 Sends automated email notifications with **Nodemailer**  
- 🗄️ Stores results securely in **MongoDB**  
- 🎨 Clean, responsive UI with **Tailwind CSS** & **Headless UI**  
- ⚡ Built on **Next.js** for performance and scalability  

---

## 🛠 Tech Stack  

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)  
[![Bright Data](https://img.shields.io/badge/Bright%20Data-005BBB?logo=databricks&logoColor=white)](https://brightdata.com/)  
[![Cheerio](https://img.shields.io/badge/Cheerio-FFCA28?logo=javascript&logoColor=black)](https://cheerio.js.org/)  
[![Nodemailer](https://img.shields.io/badge/Nodemailer-009688?logo=gmail&logoColor=white)](https://nodemailer.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)  
[![Headless UI](https://img.shields.io/badge/Headless%20UI-1E40AF?logo=tailwind-css&logoColor=white)](https://headlessui.com/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  

---

## 📦 Installation  

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo.git

# Navigate to project folder
cd your-repo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev

MONGODB_URI=your_mongodb_connection_string
BRIGHT_DATA_USERNAME=your_brightdata_api_key
BRIGHT_DATA_PASSWORD=your_brightdata_password
GOOGLE_APP_PASSWORD=your_gmail_app_password


.
├── app/          # Main application logic
├── components/   # Reusable UI components
├── lib/          # Utility functions and services
├── public/       # Static assets
├── types/        # TypeScript types
├── .env          # Environment variables
├── .gitignore    # Git ignore file
├── README.md     # Project documentation
├── next.config.mjs # Next.js configuration
├── package.json  # Project metadata and dependencies
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration


---
```
## 📧 For questions or feedback, feel free to reach out
   - Email: marquispierre27@gmail.com 
   - Linkedin: www.linkedin.com/in/marquis-pierre-263367183
   


