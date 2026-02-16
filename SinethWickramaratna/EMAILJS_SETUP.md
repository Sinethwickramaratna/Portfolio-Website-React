# EmailJS Setup Guide

Follow these steps to connect your contact form to EmailJS:

## Step 1: Create an EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

## Step 2: Create an Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Choose your email provider (Gmail, Outlook, etc.)
   - **For Gmail**: You'll need to generate an App Password
4. Name your service (e.g., "Gmail")
5. Copy your **Service ID** (it looks like: `service_xxxxx`)

## Step 3: Create an Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Name it something like "Portfolio Contact Form"
4. In the template content, add these variables:
   - `{{from_name}}` - Visitor's name
   - `{{from_email}}` - Visitor's email
   - `{{message}}` - Their message
   - `{{reply_to}}` - Reply-to email

Example template:
```
Hello,

You've received a new message from your portfolio contact form!

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Reply directly to: {{reply_to}}
```

5. Copy your **Template ID** (it looks like: `template_xxxxx`)

## Step 4: Get Your Public Key
1. In your EmailJS dashboard, go to **Account > API Keys**
2. Copy your **Public Key** (starts with "public_")

## Step 5: Update Your Contact Form
Open `src/Components/ContactSection.jsx` and replace:

```javascript
emailjs.init("YOUR_PUBLIC_KEY"); 
// Replace YOUR_PUBLIC_KEY with your actual public key
```

and

```javascript
emailjs.send(
  "YOUR_SERVICE_ID",      // Replace with your service ID
  "YOUR_TEMPLATE_ID",     // Replace with your template ID
  {
    to_email: "YOUR_EMAIL@gmail.com",  // Replace with your actual email
    // ... rest of the fields
  }
)
```

## Step 6: Install Dependencies
Run this command in your project directory:
```bash
npm install
```

## Step 7: Test Your Form
1. Start your development server: `npm run dev`
2. Fill out the contact form and submit
3. Check your email to verify it works!

## Troubleshooting

**Issue: "Failed to send message"**
- Check that your Service ID is correct
- Check that your Template ID is correct
- Check that your Public Key is correct
- Make sure your email service is verified in EmailJS

**Issue: Email not received**
- Check your spam/junk folder
- Verify that your email service credentials are correct in EmailJS
- Check the EmailJS dashboard for error logs

**Issue: CORS errors**
- This usually means your Public Key is invalid
- Regenerate your API keys and try again

For more help, visit: https://www.emailjs.com/docs/
