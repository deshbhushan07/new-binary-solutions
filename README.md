# New Binary Solutions — Portfolio Website

**Company:** New Binary Solutions, Kolhapur  
**Founder:** Mr. Vishwajeet Khot  
**Co-Founder:** Mr. Deshbhushan Chougule  
**Contact:** +91 99218 89500 | newbinarysolutions@gmail.com

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for Production

```bash
npm run build
# Output will be in the /dist folder
```

---

## File Structure

```
new-binary-solutions/
├── public/
│   ├── favicon.svg         # Site favicon
│   └── _redirects          # Netlify SPA routing
├── src/
│   ├── App.jsx             # Main website component (all sections)
│   └── main.jsx            # React entry point
├── index.html              # HTML shell with SEO meta tags
├── package.json
├── vite.config.js
├── netlify.toml            # Netlify deployment config
├── vercel.json             # Vercel deployment config
└── .gitignore
```

---

## How to Add Real Portfolio Projects

Open `src/App.jsx` and find the `PORTFOLIO` array (~line 300):

```js
const PORTFOLIO = [
  {
    name: "Your Project Name",
    industry: "Industry Type",
    desc: "Project description here.",
    tech: ["React", "Node.js"],
    color: "#2563EB",
    placeholder: false,        // set to false when real
    image: "/projects/proj1.png", // add screenshot to /public/projects/
  },
  // ... more projects
];
```

Then in the Portfolio section component, replace the placeholder div with:
```jsx
<img src={p.image} alt={p.name} style={{width:"100%",height:"220px",objectFit:"cover"}}/>
```

---

## Customization Guide

| What to change | Where in App.jsx |
|---|---|
| Company stats (50+, 30+) | `StatCounter` calls in `About` section |
| Services list | `SERVICES` array |
| Industries list | `INDUSTRIES` array |
| Testimonials | `TESTIMONIALS` array |
| Portfolio projects | `PORTFOLIO` array |
| Contact details | `Contact` and `Footer` components |
| WhatsApp number | Search `wa.me/919921889500` → replace |
| Colors | `C` object at top of file |
