

import * as msal from "@azure/msal-node";
import { SentMessageInfo, Transport, TransportOptions } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";

export interface AzureTransportOptions extends TransportOptions {
    clientId: string;
    clientSecret: string;
    tenantId: string;
    saveToSentItems?: boolean;
}

export class AzureTransport implements Transport<SentMessageInfo> {
    name: string;
    version: string;

    private config: AzureTransportOptions;
    private graphEndpoint: string;
    private tokenInfo: msal.AuthenticationResult | null;
    private msalClient: msal.ConfidentialClientApplication;

    public constructor(config: AzureTransportOptions) {
        this.name = "Azure";
        this.version = "0.1";
        this.config = config;
        this.graphEndpoint = "https://graph.microsoft.com";
        this.tokenInfo = null;

        // Create MSAL client once (to avoid re-instantiation)
        this.msalClient = new msal.ConfidentialClientApplication({
            auth: {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                authority: `https://login.microsoftonline.com/${config.tenantId}`,
            },
        });
    }

    /**
     * Check if the access token is expired
     */
    protected isTokenExpired() {
        if (!this.tokenInfo?.expiresOn) return false; // Assume token is valid if no expiration is set
        return Date.now() > this.tokenInfo.expiresOn.getTime();
    }


    /**
     * Get an access token from Azure AD
     */
    private async getAccessToken(): Promise<string> {
        if (!this.tokenInfo || this.isTokenExpired()) {
            try {
                this.tokenInfo = await this.msalClient.acquireTokenByClientCredential({
                    scopes: [`${this.graphEndpoint}/.default`],
                });

                if (!this.tokenInfo || !this.tokenInfo.accessToken) {
                    throw new Error("Failed to acquire access token from Azure.");
                }
            } catch (error) {
                console.error("Error acquiring Azure AD token:", error);
                throw new Error("Could not retrieve an access token.");
            }
        }
        return this.tokenInfo.accessToken;
    }

    /**
     * Send an email using Microsoft Graph API
     */
    public async send(
        mail: MailMessage<SentMessageInfo>,
        callback: (err: Error | null, info: SentMessageInfo | null) => void
    ) {
        try {
            const { subject, from, to, text, html, attachments = [] } = mail.data || {};

            if (!from || !to) {
                throw new Error("Missing 'from' or 'to' email address.");
            }

            const accessToken = await this.getAccessToken();

            const mailMessage = {
                message: {
                    subject,
                    from: { emailAddress: { address: from } },
                    toRecipients: Array.isArray(to)
                        ? to.map((recipient) => ({ emailAddress: { address: recipient } }))
                        : [{ emailAddress: { address: to } }],
                    body: {
                        content: html || text || "",
                        contentType: html ? "HTML" : "Text",
                    },
                    attachments: attachments?.map((item) => ({
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: item.filename,
                        contentType: item.contentType,
                        contentBytes: item.content,
                    })),
                },
                saveToSentItems: this.config.saveToSentItems ?? true,
            };

            const response = await fetch(`${this.graphEndpoint}/v1.0/users/${from}/sendMail`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mailMessage),
            });

            if (!response.ok) {
                throw new Error(`Failed to send email. Status: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.text();
            callback(null, responseData as unknown as SentMessageInfo);
        } catch (error: any) {
            console.error("Error sending email:", error);
            callback(error, null);
        }
    }
}

Usage Example
To use this transport in a Nodemailer setup, initialize it with your Azure credentials:

import * as nodemailer from "nodemailer";
import { AzureTransport } from "./AzureTransport";

/**
 * Main function to send an email using AzureTransport with Microsoft Graph API.
 */
async function main() {
    try {
        // Create a transport service using AzureTransport with Microsoft authentication credentials.
        const service = nodemailer.createTransport(
            new AzureTransport({
                clientId: "YOUR_CLIENT_ID", // Replace with your Azure AD Application Client ID
                clientSecret: "YOUR_CLIENT_SECRET", // Replace with your Azure AD Application Client Secret
                tenantId: "YOUR_TENANT_ID" // Replace with your Azure AD Tenant ID
            })
        );

        // Send an email using the configured transport service.
        await service.sendMail({
            to: "recipient@example.com", // Replace with recipient's email address
            from: "sender@example.com", // Replace with sender's email address
            subject: `Test Email ${new Date()}`, // Email subject with timestamp
            html: `<html><body>Hello: ${new Date()}</body></html>`, // Email body content
            attachments: [
                {
                    filename: "text1.txt", // Name of the attachment file
                    content: "aGVsbG8gd29ybGQh", // Base64-encoded string content
                    encoding: "base64" // Encoding type
                }
            ]
        });

        console.log("Email sent successfully");
    } catch (err: any) {
        console.error("ERROR: Failed to send email");
        console.error(err);
        if (err.cause?.body) {
            console.error("Error details:", await err.cause.body.text());
        }
    }
}

// Execute the main function
main();

Conclusion
If you’re running into Azure's SMTP limitations but still want to leverage Nodemailer, using Microsoft Graph API with a custom transport is a powerful and flexible solution.

This solution provides a simplistic approach, but it should give you enough information to enhance it according to your needs.

Happy coding! 🚀

profile
Datadog
Promoted

Image of Datadog

How to Diagram Your Cloud Architecture
Cloud architecture diagrams provide critical visibility into the resources in your environment and how they’re connected. In our latest eBook, AWS Solution Architects Jason Mimick and James Wenzel walk through best practices on how to build effective and professional diagrams.

Download the Free eBook

Top comments (0)
Subscribe
pic
Add to the discussion
Code of Conduct • Report abuse
profile
AWS
Promoted

AWS Security LIVE!

Join us for AWS Security LIVE!
Discover the future of cloud security. Tune in live for trends, tips, and solutions from AWS and AWS Partners.

Learn More

Read next
skelingtonboi profile image
My Attempt at the Cloud Resume Challenge (Azure Edition)
SkelingtonBoi - Feb 11

jeevith_wolverine profile image
Azure App Service doesn't returned compressed (gzip) files for Angular application?
Jeevith Kumar.V - Jan 7

marktinderholt profile image
Mocking TelemetryClient in Application Insights: A Simple Workaround
Mark Tinderholt - Feb 7

hazhayder profile image
Integrating Azure OpenAI with .NET Applications Using Microsoft.Extensions.AI
hazhayder - Jan 15


Gevik Babakhani
Follow
Location
Netherlands
Joined
Aug 8, 2018
Trending on DEV Community 
Ben Halpern profile image
Meme Monday
#discuss #watercooler #jokes
Ramkumar M N profile image
5 Cloud Certifications in 5 Months: Study Plan, Resources & Tips ⚡ 🔥
#beginners #certification #aws #azure
Olloyor profile image
Beginner in Python – Looking for Advice from Experienced Devs
#python #beginners #career #discuss
profile
AWS
Promoted

AWS GenAI LIVE image

How is generative AI increasing efficiency?
Join AWS GenAI LIVE! to find out how gen AI is reshaping productivity, streamlining processes, and driving innovation.

Learn more

import * as msal from "@azure/msal-node";
import { SentMessageInfo, Transport, TransportOptions } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";

export interface AzureTransportOptions extends TransportOptions {
    clientId: string;
    clientSecret: string;
    tenantId: string;
    saveToSentItems?: boolean;
}

export class AzureTransport implements Transport<SentMessageInfo> {
    name: string;
    version: string;

    private config: AzureTransportOptions;
    private graphEndpoint: string;
    private tokenInfo: msal.AuthenticationResult | null;
    private msalClient: msal.ConfidentialClientApplication;

    public constructor(config: AzureTransportOptions) {
        this.name = "Azure";
        this.version = "0.1";
        this.config = config;
        this.graphEndpoint = "https://graph.microsoft.com";
        this.tokenInfo = null;

        // Create MSAL client once (to avoid re-instantiation)
        this.msalClient = new msal.ConfidentialClientApplication({
            auth: {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                authority: `https://login.microsoftonline.com/${config.tenantId}`,
            },
        });
    }

    /**
     * Check if the access token is expired
     */
    protected isTokenExpired() {
        if (!this.tokenInfo?.expiresOn) return false; // Assume token is valid if no expiration is set
        return Date.now() > this.tokenInfo.expiresOn.getTime();
    }


    /**
     * Get an access token from Azure AD
     */
    private async getAccessToken(): Promise<string> {
        if (!this.tokenInfo || this.isTokenExpired()) {
            try {
                this.tokenInfo = await this.msalClient.acquireTokenByClientCredential({
                    scopes: [`${this.graphEndpoint}/.default`],
                });

                if (!this.tokenInfo || !this.tokenInfo.accessToken) {
                    throw new Error("Failed to acquire access token from Azure.");
                }
            } catch (error) {
                console.error("Error acquiring Azure AD token:", error);
                throw new Error("Could not retrieve an access token.");
            }
        }
        return this.tokenInfo.accessToken;
    }

    /**
     * Send an email using Microsoft Graph API
     */
    public async send(
        mail: MailMessage<SentMessageInfo>,
        callback: (err: Error | null, info: SentMessageInfo | null) => void
    ) {
        try {
            const { subject, from, to, text, html, attachments = [] } = mail.data || {};

            if (!from || !to) {
                throw new Error("Missing 'from' or 'to' email address.");
            }

            const accessToken = await this.getAccessToken();

            const mailMessage = {
                message: {
                    subject,
                    from: { emailAddress: { address: from } },
                    toRecipients: Array.isArray(to)
                        ? to.map((recipient) => ({ emailAddress: { address: recipient } }))
                        : [{ emailAddress: { address: to } }],
                    body: {
                        content: html || text || "",
                        contentType: html ? "HTML" : "Text",
                    },
                    attachments: attachments?.map((item) => ({
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: item.filename,
                        contentType: item.contentType,
                        contentBytes: item.content,
                    })),
                },
                saveToSentItems: this.config.saveToSentItems ?? true,
            };

            const response = await fetch(`${this.graphEndpoint}/v1.0/users/${from}/sendMail`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mailMessage),
            });

            if (!response.ok) {
                throw new Error(`Failed to send email. Status: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.text();
            callback(null, responseData as unknown as SentMessageInfo);
        } catch (error: any) {
            console.error("Error sending email:", error);
            callback(error, null);
        }
    }
}

import * as msal from "@azure/msal-node";
import { SentMessageInfo, Transport, TransportOptions } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";

export interface AzureTransportOptions extends TransportOptions {
    clientId: string;
    clientSecret: string;
    tenantId: string;
    saveToSentItems?: boolean;
}

export class AzureTransport implements Transport<SentMessageInfo> {
    name: string;
    version: string;

    private config: AzureTransportOptions;
    private graphEndpoint: string;
    private tokenInfo: msal.AuthenticationResult | null;
    private msalClient: msal.ConfidentialClientApplication;

    public constructor(config: AzureTransportOptions) {
        this.name = "Azure";
        this.version = "0.1";
        this.config = config;
        this.graphEndpoint = "https://graph.microsoft.com";
        this.tokenInfo = null;

        // Create MSAL client once (to avoid re-instantiation)
        this.msalClient = new msal.ConfidentialClientApplication({
            auth: {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                authority: `https://login.microsoftonline.com/${config.tenantId}`,
            },
        });
    }

    /**
     * Check if the access token is expired
     */
    protected isTokenExpired() {
        if (!this.tokenInfo?.expiresOn) return false; // Assume token is valid if no expiration is set
        return Date.now() > this.tokenInfo.expiresOn.getTime();
    }


    /**
     * Get an access token from Azure AD
     */
    private async getAccessToken(): Promise<string> {
        if (!this.tokenInfo || this.isTokenExpired()) {
            try {
                this.tokenInfo = await this.msalClient.acquireTokenByClientCredential({
                    scopes: [`${this.graphEndpoint}/.default`],
                });

                if (!this.tokenInfo || !this.tokenInfo.accessToken) {
                    throw new Error("Failed to acquire access token from Azure.");
                }
            } catch (error) {
                console.error("Error acquiring Azure AD token:", error);
                throw new Error("Could not retrieve an access token.");
            }
        }
        return this.tokenInfo.accessToken;
    }

    /**
     * Send an email using Microsoft Graph API
     */
    public async send(
        mail: MailMessage<SentMessageInfo>,
        callback: (err: Error | null, info: SentMessageInfo | null) => void
    ) {
        try {
            const { subject, from, to, text, html, attachments = [] } = mail.data || {};

            if (!from || !to) {
                throw new Error("Missing 'from' or 'to' email address.");
            }

            const accessToken = await this.getAccessToken();

            const mailMessage = {
                message: {
                    subject,
                    from: { emailAddress: { address: from } },
                    toRecipients: Array.isArray(to)
                        ? to.map((recipient) => ({ emailAddress: { address: recipient } }))
                        : [{ emailAddress: { address: to } }],
                    body: {
                        content: html || text || "",
                        contentType: html ? "HTML" : "Text",
                    },
                    attachments: attachments?.map((item) => ({
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: item.filename,
                        contentType: item.contentType,
                        contentBytes: item.content,
                    })),
                },
                saveToSentItems: this.config.saveToSentItems ?? true,
            };

            const response = await fetch(`${this.graphEndpoint}/v1.0/users/${from}/sendMail`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mailMessage),
            });

            if (!response.ok) {
                throw new Error(`Failed to send email. Status: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.text();
            callback(null, responseData as unknown as SentMessageInfo);
        } catch (error: any) {
            console.error("Error sending email:", error);
            callback(error, null);
        }
    }
}

