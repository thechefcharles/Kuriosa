# Deployment Checklist

## 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your **Kuriosa** (or kuriosa) repository
4. Vercel will detect Next.js automatically — keep the default settings
5. Ensure **Framework Preset** is set to **Next.js**
6. Leave **Output Directory** empty (Next.js handles this)

## 2. Add Environment Variables

Before deploying, add these in Vercel **Project Settings** → **Environment Variables**:

| Variable | Where to get it | Required for |
|----------|-----------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | App to run |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API | App to run |
| `OPENAI_API_KEY` | platform.openai.com → API keys | AI features (later) |

Add them for **Production**, **Preview**, and **Development** if you want all deployments to work.

## 3. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Note your deployment URL (e.g. `https://kuriosa.vercel.app`)

## 4. Verify Preview Deployment

1. Push a branch (not main) to GitHub
2. Vercel creates a **Preview** deployment automatically
3. Open the Preview URL from the Vercel dashboard
4. Visit `https://your-preview-url.vercel.app/api/health`
5. You should see: `{"status":"ok","app":"Kuriosa","timestamp":"..."}`

## 5. Verify Production Deployment

1. Merge to `main` or push to your production branch
2. Vercel deploys to your main domain
3. Visit `https://your-domain.vercel.app`
4. Visit `https://your-domain.vercel.app/api/health`

## Troubleshooting

- **Build fails with "Output Directory"**: Set Framework Preset to Next.js and clear Output Directory
- **404 on routes**: Ensure you're using the App Router (`src/app/`)
- **Env vars not working**: Restart/redeploy after adding variables
