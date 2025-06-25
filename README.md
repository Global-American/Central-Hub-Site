# Global American Logistics - Landing Page

A modern, responsive landing page for Global American, a comprehensive logistics and freight forwarding company. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional interface with smooth animations and transitions
- **Video Background**: Engaging hero section with background video
- **Responsive Layout**: Optimized for all device sizes
- **Interactive Components**: Dynamic typewriter effects, scroll animations, and hover states
- **Service Showcase**: Comprehensive display of logistics services including:
  - Air Freight (Express delivery)
  - Ocean Freight (Cost-effective shipping)
  - Express Courier (Premium handling)
  - Returns Management
  - Global Last Mile Delivery
  - 3PL Services (Third-party logistics)
- **Contact Integration**: Built-in contact forms and modals
- **Brand Presentation**: Dedicated section for showcasing partner brands
- **Performance Optimized**: Built with modern React patterns and optimization techniques

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: CSS animations and transitions
- **Theme**: Next Themes for dark/light mode support

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── global-american-landing-page.tsx  # Main landing page
│   ├── hero-section.tsx  # Hero section with video background
│   ├── services-section.tsx  # Services showcase
│   ├── our-brands-section.tsx  # Brand partners display
│   ├── contact-section.tsx  # Contact information
│   ├── video-section.tsx  # Additional video content
│   ├── header-nav.tsx    # Navigation header
│   └── footer.tsx        # Site footer
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── videos/          # Video assets
└── styles/              # Additional stylesheets
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

The project uses a custom design system built on Tailwind CSS. Key customization points:

- **Colors**: Defined in `tailwind.config.ts`
- **Components**: Located in `components/ui/`
- **Layouts**: Responsive breakpoints and spacing
- **Animations**: CSS transitions and keyframe animations

## 📱 Responsive Design

The landing page is fully responsive with breakpoints for:
- Mobile (sm): 640px+
- Tablet (md): 768px+
- Desktop (lg): 1024px+
- Large Desktop (xl): 1280px+

## 🌐 Deployment

This project is optimized for deployment on Vercel, Netlify, or any platform that supports Next.js.

