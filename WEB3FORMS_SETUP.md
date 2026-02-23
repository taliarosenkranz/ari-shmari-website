# ARI Website - Contact Form Setup

## Web3Forms Integration

This website uses [Web3Forms](https://web3forms.com) to handle contact form submissions without a backend server.

### Setup Instructions

1. **Get your Web3Forms Access Key:**
   - Go to [https://web3forms.com](https://web3forms.com)
   - Enter your email address: `hello.ari.shmari@gmail.com`
   - Click "Get Started"
   - Copy the access key from your email

2. **For Local Development:**
   - Copy `.env.example` to `.env` in the `client` directory
   - Paste your access key in `.env`:
     ```
     VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
     ```

3. **For GitHub Pages Deployment:**
   - Go to your GitHub repository settings
   - Navigate to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VITE_WEB3FORMS_ACCESS_KEY`
   - Value: Paste your access key
   - Click "Add secret"

4. **Test the form:**
   - Fill out the contact form on your website
   - You should receive an email at `hello.ari.shmari@gmail.com`

### How It Works

- When a user submits the form, data is sent directly to Web3Forms API
- Web3Forms forwards the submission to your email
- No backend server required
- Works perfectly with static hosting (GitHub Pages)

### Email Content

Each submission will include:
- Name
- Email
- Phone (if provided)
- Event Type
- Message (if provided)

### Free Plan Limits

Web3Forms free plan includes:
- 250 submissions per month
- No credit card required
- Spam filtering included
