# Methma & Virajitha — Wedding Invitation

Next.js 14 + Supabase (free tier) + Vercel (free tier). Mobile-first single-page invitation with RSVP database and a private admin area.

## 1. Install and run locally
```bash
npm install
cp .env.example .env.local   # then fill in the values (step 2 and 3)
npm run dev                  # http://localhost:3000  (admin: /admin)
```
The site works before Supabase is set up (it shows the built-in wording and photos); RSVPs and admin need Supabase.

## 2. Configure Supabase
1. Create a free project at supabase.com.
2. **SQL Editor** → paste and run `supabase/schema.sql` (creates the `rsvps` and `site_content` tables and the public `invitation` storage bucket; row-level security is on, so the public key cannot read or write data).
3. **Project Settings → API**: copy the Project URL, the `anon` key and the `service_role` key.

## 3. Environment variables (`.env.local`, and Vercel → Settings → Environment Variables)
| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (used only for admin sign-in) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key. **Server-only; never share or commit it** |
| `ADMIN_EMAIL` | the email of the admin account below |

## 4. Create the admin account
Supabase → **Authentication → Users → Add user** → enter your email and a strong password (tick auto-confirm). Then **Authentication → Sign In / Providers → turn off "Allow new users to sign up"**. Only the email in `ADMIN_EMAIL` can use `/admin`; this is checked on the server for every request.

## 5. Music
Add a royalty-free MP3 as `public/music/wedding.mp3`, or upload one in **/admin → Photos & Music** (4 MB max on Vercel's free tier). Playback tries to start automatically and otherwise starts on the guest's first tap or scroll. There is no visible player.

## 6. Deploy to Vercel
Push to GitHub → vercel.com → **Add New Project** → import the repo → add the four environment variables → **Deploy**. Share the resulting URL (or attach your own domain).

## Editing later
- **/admin → RSVPs**: totals, search, filter, sort, CSV export.
- **/admin → Wording & Details**: names, date, times, venue, address, map link, quote, music URL.
- **/admin → Photos & Music**: replace any photo; it is resized in your browser before upload.
Changes appear within ~30 seconds. The Google Calendar button and the countdown follow the date and times you set.

Photo slots: Save the Date = photo 1, Love Story = photo 4, Celebration = photo 3, before RSVP = photo 5, opening background = photo 2 (darkened).
