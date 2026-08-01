# ELI5: How to Set Up the PyArcana Dynamic LMS Server

**Audience:** Someone who bought domains and hosting from Hostinger and wants to run the full PyArcana LMS (not just the static site).
**Prerequisite:** You have `pyarcana.dev` and `pyarcana.com` registered at Hostinger, plus a VPS or hosting plan and email service.
**No prior server experience needed.** This guide explains every step in plain language.

---

## What You Need (Shopping List)

1. **A VPS (Virtual Private Server)** from Hostinger — this is a computer in the cloud that runs your website 24/7. Get the cheapest plan with at least 2GB RAM.
2. **Your domains** — `pyarcana.dev` (for the live site) and `pyarcana.com` (redirects to .dev).
3. **A Firebase project** — free at https://console.firebase.google.com (for user accounts and data storage).
4. **A GitHub account** — you already have this (PillB/pyarcana).
5. **SSH access** — Hostinger gives you this when you buy a VPS. It's a way to control the server from your laptop.

---

## Step 1: Buy and Start Your VPS (5 minutes)

1. Log into Hostinger → hPanel → VPS.
2. Buy the cheapest VPS (2GB RAM minimum, 4GB recommended).
3. Choose **Ubuntu 22.04** as the operating system.
4. After purchase, Hostinger shows you:
   - **IP address** (like `82.123.45.67`) — this is your server's address on the internet.
   - **Root password** — keep this safe.
5. Write down the IP address. You'll need it for DNS.

---

## Step 2: Point Your Domain to the VPS (10 minutes)

1. Go to Hostinger → hPanel → Domains → `pyarcana.dev` → DNS / Nameservers.
2. Add a DNS record:
   - **Type:** A
   - **Name:** `@` (means "the main domain")
   - **Value:** Your VPS IP address (from Step 1)
   - **TTL:** 3600
3. Add another:
   - **Type:** A
   - **Name:** `www`
   - **Value:** Your VPS IP address
   - **TTL:** 3600
4. Do the same for `pyarcana.com` (point it to the same IP).
5. Wait 5-30 minutes for DNS to propagate. Check at https://dnschecker.org/#A/pyarcana.dev.

---

## Step 3: Set Up Email (10 minutes)

1. Go to Hostinger → hPanel → Email → Email Accounts.
2. Create these mailboxes:
   - `hola@pyarcana.dev` — general contact
   - `soporte@pyarcana.dev` — technical support
   - `no-reply@pyarcana.dev` — automated emails
3. Go to DNS for `pyarcana.dev` and add email records:
   - **MX record:** Name `@`, Value `mx1.hostingermail.com`, Priority 10
   - **MX record:** Name `@`, Value `mx2.hostingermail.com`, Priority 50
   - **TXT record:** Name `@`, Value `v=spf1 include:_spf.hostingermail.com ~all`
   - **TXT record:** Name `_dmarc`, Value `v=DMARC1; p=quarantine; rua=mailto:postmaster@pyarcana.dev`
4. Enable DKIM in hPanel → Email → DKIM → copy the CNAME to DNS.

---

## Step 4: Create a Firebase Project (10 minutes)

1. Go to https://console.firebase.google.com → **Add project**.
2. Name it `pyarcana-prod`.
3. Select **Blaze (pay-as-you-go)** plan (needed for Firestore in production).
4. Set Firestore location to `sa-east1` (São Paulo — closest to Peru).
5. Enable **Authentication** → Sign-in methods → enable Email/Password and Google.
6. Enable **Firestore Database** → Production mode.
7. Go to Project Settings → General → scroll down to "Your apps" → add a Web app.
8. Copy the config values (apiKey, authDomain, projectId, etc.) — you'll need them.
9. Go to Project Settings → Service Accounts → generate a new private key → download the JSON file. **Keep this file secret.**

---

## Step 5: Connect to Your Server (5 minutes)

From your laptop terminal:
```bash
ssh root@YOUR_VPS_IP
```
Enter the root password from Step 1.

---

## Step 6: Install Software on the Server (10 minutes)

Run these commands one at a time on the server:

```bash
# Update the system
apt update && apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Install Bun (JavaScript package manager)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install Caddy (web server with automatic HTTPS)
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

# Install Git
apt install -y git

# Install Python (for audit scripts)
apt install -y python3 python3-pip
```

---

## Step 7: Download Your Code (5 minutes)

```bash
cd /var/www
git clone https://github.com/PillB/pyarcana.git
cd pyarcana
bun install
```

---

## Step 8: Create the Secret Configuration File (5 minutes)

```bash
nano /var/www/pyarcana/.env.local
```

Paste this (replace the placeholder values with your real Firebase values from Step 4):

```bash
# Firebase (from Step 4 — public config, safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...your-key...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pyarcana-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pyarcana-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pyarcana-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Firebase Admin (SECRET — from the JSON file you downloaded)
FIREBASE_ADMIN_PROJECT_ID=pyarcana-prod
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@pyarcana-prod.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# NextAuth (generate a random secret)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://pyarcana.dev

# Database
DATABASE_URL=file:/var/www/pyarcana/db/custom.db

# Email (from Step 3)
SMTP_HOST=smtp.hostingermail.com
SMTP_PORT=465
SMTP_USER=no-reply@pyarcana.dev
SMTP_PASSWORD=your-email-password
SMTP_FROM="PyArcana <no-reply@pyarcana.dev>"

# Credential signing (generate a random secret)
CREDENTIAL_SIGNING_KEY=$(openssl rand -base64 32)
```

Save with Ctrl+O, Enter, Ctrl+X.

**IMPORTANT:** Never commit this file to GitHub. The `.gitignore` already excludes it.

---

## Step 9: Initialize the Database (2 minutes)

```bash
cd /var/www/pyarcana
bun run db:generate
bun run db:push
```

This creates the database tables (users, progress, exams, credentials, etc.).

---

## Step 10: Build the Dynamic LMS (5 minutes)

```bash
cd /var/www/pyarcana
bun run build
```

This creates a production-optimized version of the full LMS (with accounts, exams, credentials, supervisor flows, admin dashboard).

---

## Step 11: Configure Caddy (Automatic HTTPS) (5 minutes)

```bash
nano /etc/caddy/Caddyfile
```

Replace everything with:

```
pyarcana.dev {
    reverse_proxy localhost:3000
    encode gzip zstd
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}

www.pyarcana.dev {
    redir https://pyarcana.dev{uri} 301
}

pyarcana.com, www.pyarcana.com {
    redir https://pyarcana.dev{uri} 301
}
```

Save and restart Caddy:
```bash
systemctl restart caddy
```

Caddy automatically gets an SSL certificate from Let's Encrypt. Your site now has the padlock icon (HTTPS).

---

## Step 12: Start the Application (2 minutes)

```bash
cd /var/www/pyarcana
bun run start &
```

The `&` at the end means "run in the background." Your LMS is now live at https://pyarcana.dev.

---

## Step 13: Make It Start Automatically on Reboot (3 minutes)

```bash
nano /etc/systemd/system/pyarcana.service
```

Paste:
```ini
[Unit]
Description=PyArcana Dynamic LMS
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/pyarcana
ExecStart=/root/.bun/bin/bun run start
Restart=on-failure
RestartSec=10
EnvironmentFile=/var/www/pyarcana/.env.local

[Install]
WantedBy=multi-user.target
```

Enable it:
```bash
systemctl enable pyarcana
systemctl start pyarcana
```

Now if the server reboots, PyArcana starts automatically.

---

## Step 14: Add Authorized Domains to Firebase (2 minutes)

1. Go to Firebase Console → Authentication → Settings → Authorized domains.
2. Add:
   - `pyarcana.dev`
   - `www.pyarcana.dev`
   - `localhost` (for development)

---

## Step 15: Deploy Firestore Security Rules (2 minutes)

```bash
cd /var/www/pyarcana
npm install -g firebase-tools
firebase login
firebase use pyarcana-prod
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## Step 16: Create Your Admin Account (3 minutes)

1. Visit https://pyarcana.dev → click "Crear cuenta" → register with your email.
2. SSH into your server:
   ```bash
   sqlite3 /var/www/pyarcana/db/custom.db
   ```
3. Run:
   ```sql
   UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   .quit
   ```
4. Log out and log back in. You now have admin access.

---

## Step 17: Verify Everything Works (5 minutes)

1. Visit https://pyarcana.dev — should load the LMS.
2. Register an account — should work.
3. Complete a section — progress should save.
4. Visit https://pyarcana.com — should redirect to .dev.
5. Visit https://pyarcana.dev/credential-policy — should show the policy.
6. Visit https://pyarcana.dev/verify — should show the verification page.
7. Check email: send a test notification — should arrive from no-reply@pyarcana.dev.

---

## Troubleshooting

**Site doesn't load:**
- Check Caddy is running: `systemctl status caddy`
- Check PyArcana is running: `systemctl status pyarcana`
- Check DNS: `dig pyarcana.dev A`

**Email doesn't work:**
- Verify MX records propagated: `dig pyarcana.dev MX`
- Check SPF/DKIM/DMARC records exist
- Test at https://mail-tester.com

**Firebase Auth fails:**
- Verify authorized domains include pyarcana.dev
- Check .env.local has correct Firebase config
- Check server can reach Google: `curl https://www.googleapis.com`

**Database errors:**
- Run `bun run db:push` again
- Check the DATABASE_URL path is writable

**Credential issuance fails:**
- Set CREDENTIAL_SIGNING_KEY in .env.local
- Verify the user has passed all 13 gate sections
- Check server logs: `journalctl -u pyarcana -f`
