# 🕸️ Web Scraper Project  

A modern web scraping application built with **Next.js** and powered by **Bright Data** for scalable scraping. It extracts and processes structured data using **Cheerio**, stores it in **MongoDB**, and includes email notifications via **Nodemailer**. The UI is built with **Headless UI** and **Tailwind CSS** for a clean and responsive design.  

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
BRIGHT_DATA_API_KEY=your_brightdata_api_key
GOOGLE_APP_PASSWORD=your_gmail_app_password
EMAIL_USER=your_email
EMAIL_FROM=your_email


.
├── components/       # UI components
├── lib/              # Utility functions
├── pages/            # Next.js pages
├── styles/           # Global styles
├── scripts/          # Scraping scripts
└── ...

---
