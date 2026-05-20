# Personal Portfolio — GitHub Pages

A modern, minimalist black-and-white developer portfolio. Built with semantic HTML5, pure CSS, and vanilla JavaScript. No frameworks, no dependencies.

## Project Structure

```
portfolio/
├── index.html          # Main HTML (semantic, SEO-ready)
├── css/
│   └── style.css       # All styles with CSS variables
├── js/
│   └── main.js         # Interactions & animations
├── assets/
│   └── favicon.svg     # SVG favicon
└── README.md
```

## Features

- **Brutalist minimalist** black & white aesthetic
- **Typing animation** in hero section
- **Scroll reveal** via Intersection Observer API
- **Custom cursor** with smooth follower
- **Scroll progress bar**
- **Project filtering** animation
- **Sticky navbar** with active section highlighting
- **Mobile hamburger menu**
- **Back-to-top** button
- **Contact form** with frontend validation
- **Fully responsive** — desktop, tablet, mobile
- **SEO-friendly** with Open Graph & Twitter Card meta tags
- **Accessible** — semantic HTML, ARIA labels, focus styles

---

## Deploying to GitHub Pages

### Step 1 — Create a Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it exactly: `yourusername.github.io`
   - Replace `yourusername` with your actual GitHub username
   - This special name enables GitHub Pages automatically
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload Your Files

**Option A: GitHub Web UI (easiest)**

1. Open your new repo on GitHub
2. Click **uploading an existing file**
3. Drag and drop all portfolio files:
   - `index.html`
   - `css/style.css`
   - `js/main.js`
   - `assets/favicon.svg`
4. Commit the files

**Option B: Git CLI**

```bash
# Initialize git in your portfolio folder
cd portfolio/
git init
git add .
git commit -m "Initial portfolio commit"

# Connect to GitHub and push
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main` / folder: `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes, then visit: `https://yourusername.github.io`

---

## Personalizing the Portfolio

### Update Your Info

Open `index.html` and replace all placeholder text:

| Placeholder | Replace with |
|---|---|
| `Your Name` | Your actual name |
| `YN` (logo) | Your initials |
| `your@email.com` | Your email |
| `yourprofile` | Your LinkedIn handle |
| `yourusername` | Your GitHub username |
| `yourusername.github.io` | Your actual URL |

### Update Project Links

Find each `.icon-link` in the Projects section and replace `href="#"` with your actual GitHub repo URL and live demo URL.

### Update Open Graph Image

Create an `assets/og-image.png` (1200×630px, black background, white text with your name) and it will automatically appear in link previews on social media.

### Add a Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap, Cloudflare)
2. In GitHub Pages settings, enter your domain in **Custom domain**
3. At your DNS provider, add a CNAME record:
   - Host: `www`
   - Value: `yourusername.github.io`
4. Enable **Enforce HTTPS**

### Integrate a Real Contact Form

The form currently simulates submission. To make it functional:

**Using Formspree (free):**

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form → get your endpoint
3. In `js/main.js`, replace the `setTimeout` simulation block with:

```javascript
const response = await fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});
if (response.ok) {
  showFeedback("// Message sent. I'll get back to you soon.", 'success');
  form.reset();
} else {
  showFeedback('Something went wrong. Please try again.', 'error');
}
```

---

## Performance Notes

- No external CSS frameworks
- Google Fonts loaded with `display=swap` for zero render blocking
- Intersection Observer replaces scroll event listeners for animations
- All SVG icons are inline — zero extra HTTP requests
- Fonts subset to only needed weights

---

## License

MIT — free to use and customize.
