# CM Studio — DesignRoom

A web design showcase and brief submission system for CM Studio. Clients can browse web components (backgrounds, navbars, heroes, color schemes, cards, footers, forms, animations), select items they like, and submit a comprehensive design brief.

## Features

- **Component Showcase**: Browse 8 categories of web components with live previews
- **Color Schemes**: 10 curated color palettes with one-click apply to entire showroom
- **Interactive Selection**: Click to select components, build your design brief visually
- **Questionnaire Wizard**: 5-step form to capture project requirements
- **Live Preview**: See your selections assembled into a working mockup
- **Admin Panel**: Secure admin interface to view and manage client submissions
- **File Uploads**: Mood board image uploads to Supabase storage
- **Email Notifications**: Automatic confirmations via EmailJS

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Supabase (PostgreSQL + Storage)
- **Email**: EmailJS
- **Fonts**: Google Fonts (Bebas Neue, Syne, DM Sans, JetBrains Mono)

## File Structure

```
├── index.html          # Main showroom application
├── admin.html          # Admin panel for viewing submissions
├── css/
│   ├── main.css        # Main styles and component previews
│   ├── themes.css      # Color scheme definitions
│   └── intro.css       # Intro screen styles
├── js/
│   ├── app.js          # Main application logic
│   ├── canvas.js       # Animated background canvases
│   ├── cursor.js       # Custom cursor effects
│   ├── intro.js        # Intro sequence
│   └── submit.js       # Form submission handling
└── assets/
    └── *.svg           # Logo assets
```

## Setup

1. **Clone or download** the repository
2. **Open `index.html`** in a browser to view the showroom
3. **Open `admin.html`** to access the admin panel

### Admin Access

- **Password**: `designroom2025` (change this in production!)
- The password is hashed using SHA-256 for security
- Session expires after 8 hours

### Supabase Configuration

The project uses Supabase for data storage. Credentials are pre-configured:
- URL: `https://keqizgtvunwdabwvgrik.supabase.co`
- Key: Publishable key (safe for client-side)

**Note**: For production, consider moving sensitive operations to a backend server.

## Color Schemes

10 curated color schemes available:
1. Charcoal + Cyan (default)
2. Navy + Gold
3. Black + White
4. Dark + Red
5. Slate + Emerald
6. Dark Forest
7. Deep Purple + Violet
8. Copper + Orange
9. Midnight + Pink
10. Ocean Dark + Teal

Select any color scheme card, then click **"◐ Apply Scheme"** to apply it across the entire showroom.

## Security Notes

- Admin password is SHA-256 hashed (not plaintext)
- Session-based authentication with 8-hour expiry
- Supabase Row Level Security (RLS) recommended for production
- File uploads restricted to images (PNG, JPG, WEBP) up to 5MB

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

© CM Studio — Cian McCaul. All rights reserved.

