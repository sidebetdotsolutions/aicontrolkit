# AI Control Kit

A governance policy generator for AI systems. Generates jurisdiction-specific compliance policies through an interactive wizard.

## Stack

- **Frontend**: Static HTML + Alpine.js (no build step)
- **Backend**: Cloudflare Workers (serverless functions)
- **Email**: Resend API
- **Hosting**: Cloudflare Pages

## Local Development

### Prerequisites

- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account (free tier works)

### Setup

1. Clone the repo and install dependencies:

```bash
cd ai-control-kit
npm install
```

2. Create a `.dev.vars` file for local secrets:

```bash
RESEND_API_KEY=re_your_test_key
TOKEN_SECRET=local-development-secret-min-32-chars
RESEND_AUDIENCE_ID=your_audience_id
```

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:8788

### Project Structure

```
ai-control-kit/
├── public/                     # Static frontend (served by Cloudflare Pages)
│   ├── index.html              # Landing page
│   ├── wizard.html             # Wizard application
│   ├── css/
│   │   └── styles.css          # Global styles
│   ├── js/
│   │   ├── app.js              # Alpine.js wizard logic
│   │   └── api.js              # API client
│   └── assets/
│       └── logo.svg
│
├── functions/                  # Cloudflare Workers (API endpoints)
│   └── api/
│       ├── jurisdictions.js    # GET /api/jurisdictions
│       ├── questions/
│       │   └── [id].js         # GET /api/questions/:id
│       ├── generate.js         # POST /api/generate
│       ├── pdf.js              # GET /api/pdf?token=xxx
│       └── subscribe.js        # POST /api/subscribe
│
├── lib/                        # Shared server-side code
│   ├── jurisdictions/          # Jurisdiction definitions
│   ├── templates/              # Policy generation logic
│   ├── pdf/                    # PDF generation
│   └── hooks/                  # Analytics, rate limiting, etc.
│
├── wrangler.toml               # Cloudflare configuration
└── package.json
```

## Deployment

### First-time setup

1. Login to Cloudflare:

```bash
wrangler login
```

2. Create the Pages project:

```bash
wrangler pages project create ai-control-kit
```

3. Set production secrets:

```bash
wrangler secret put RESEND_API_KEY
wrangler secret put TOKEN_SECRET
wrangler secret put RESEND_AUDIENCE_ID
```

### Deploy

```bash
npm run deploy
```

Or push to your connected Git repository for automatic deployments.

## Adding a New Jurisdiction

1. Create `lib/jurisdictions/[code].js` following the existing pattern
2. Add to the registry in `lib/jurisdictions/index.js`
3. Test locally with `npm run dev`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Resend API key for email | Yes |
| `TOKEN_SECRET` | Secret for signing PDF tokens (min 32 chars) | Yes |
| `RESEND_AUDIENCE_ID` | Resend audience ID for waitlist | Yes |
| `ENVIRONMENT` | `development` or `production` | No |

## License

Proprietary. All rights reserved.
