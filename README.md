# Gemini Chat - AI Conversational Interface

A modern, responsive chat application built with Next.js 15 that replicates Google Gemini's interface and user experience. Features real-time conversations, dark mode support, infinite scroll, and a beautiful Google Gemini-inspired design system.

## 🌟 Live Demo
> Add your live deployment link here

## 📋 Project Overview

Gemini Chat is a sophisticated AI chat interface that provides:
- **Modern UI/UX**: Google Gemini-inspired design with smooth animations
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dark Mode**: System preference detection with manual toggle
- **Real-time Chat**: Instant messaging with typing indicators
- **Image Support**: Upload and share images in conversations
- **Infinite Scroll**: Load older messages seamlessly
- **Search Functionality**: Find conversations with debounced search
- **Form Validation**: Robust phone and OTP validation
- **State Management**: Persistent chat rooms with Zustand

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gemini-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
gemini-frontend/
├── app/                          # Next.js 15 App Router
│   ├── globals.css              # Global styles and design system
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Landing page with features
│   ├── auth/
│   │   └── page.tsx            # Authentication flow (Phone + OTP)
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard with chat rooms
│   └── chatroom/
│       └── [id]/
│           └── page.tsx        # Individual chat interface
├── components/
│   └── DarkModeToggle.tsx      # Reusable dark mode toggle
├── store/
│   └── chatroomStore.ts        # Zustand state management
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

### Key Components

#### 🏠 **Landing Page** (`app/page.tsx`)
- Hero section with Google Gemini branding
- Feature showcase with icons
- Call-to-action buttons
- Responsive design

#### 🔐 **Authentication** (`app/auth/page.tsx`)
- Phone number input with country code selection
- OTP verification (use `123456` for demo)
- Form validation with React Hook Form + Zod
- Multi-step authentication flow

#### 📊 **Dashboard** (`app/dashboard/page.tsx`)
- Chat room management
- Search with debounced input
- Create new conversations
- Dark mode toggle
- Responsive conversation list

#### 💬 **Chat Interface** (`app/chatroom/[id]/page.tsx`)
- Real-time message display
- Image upload support
- Infinite scroll pagination
- Message copy functionality
- Typing indicators
- Dark mode support

## 🛠 Technical Implementation

### Throttling & Debouncing
- **Search Input**: 300ms debounce implementation in dashboard
  ```typescript
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(handler);
  }, [search]);
  ```

### Pagination & Infinite Scroll
- **Page Size**: 20 messages per page
- **Implementation**: Slice-based pagination with scroll detection
  ```typescript
  const paginatedMessages = allMessages.slice(-page * PAGE_SIZE);
  
  useEffect(() => {
    const container = messagesTopRef.current?.parentElement;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder && paginatedMessages.length < allMessages.length) {
        setLoadingOlder(true);
        setTimeout(() => {
          setPage((p) => p + 1);
          setLoadingOlder(false);
        }, 700);
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadingOlder, paginatedMessages.length, allMessages.length]);
  ```

### Form Validation
- **Library**: React Hook Form with Zod resolver
- **Phone Validation**: Country code + phone number format
- **OTP Validation**: 6-digit numeric validation
  ```typescript
  const phoneSchema = z.object({
    countryCode: z.string().min(1, "Select a country code"),
    phone: z.string()
      .min(7, "Phone number too short")
      .max(15, "Phone number too long")
      .regex(/^\d+$/, "Phone number must be digits only"),
  });
  ```

### State Management
- **Zustand Store**: Persistent chat room management
- **Features**: Add, delete, search chat rooms
- **Persistence**: localStorage integration
- **Hydration**: Client-side only hydration

### Dark Mode Implementation
- **System Detection**: `prefers-color-scheme` media query
- **Manual Toggle**: Per-page dark mode switches
- **Persistence**: localStorage theme storage
- **CSS Variables**: Dynamic theming system

## 🎨 Design System

### Color Palette
- **Primary**: Google Gemini blue (#1a73e8)
- **Gradient**: Blue to purple to pink
- **Dark Mode**: Automatic color inversion
- **Semantic Colors**: Success, error, warning states

### Typography
- **Font**: System font stack
- **Hierarchy**: h1-h6 with proper sizing
- **Responsive**: Mobile-optimized text sizes

### Components
- **Buttons**: Primary, secondary, ghost, danger variants
- **Cards**: Elevated with soft shadows
- **Inputs**: Focus states and validation
- **Navigation**: Responsive header with toggles

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations
- Touch-friendly button sizes
- Collapsible navigation
- Stacked form layouts
- Optimized image sizing
- Reduced spacing on small screens

## 🔧 Tech Stack

### Core Framework
- **Next.js 15**: App Router with React 19
- **TypeScript**: Full type safety
- **Tailwind CSS 4**: Utility-first styling

### Dependencies
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Zustand**: State management
- **React Hot Toast**: Notifications
- **Autoprefixer**: CSS vendor prefixes

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast development builds

## 🌙 Dark Mode Features

- System preference detection
- Manual toggle on each page
- Persistent theme storage
- Smooth transitions
- Dark-optimized colors

## 📸 Screenshots

> Add screenshots of your application here showing:
> - Landing page
> - Authentication flow
> - Dashboard with chat rooms
> - Chat interface
> - Dark mode examples
> - Mobile responsive views

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini for design inspiration
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- React Hook Form for form handling
- Zustand for state management

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
