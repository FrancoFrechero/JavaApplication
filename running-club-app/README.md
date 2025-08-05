# Running Club App

A modern, animated, mobile-first React application for running clubs with social features, event management, and community engagement.

## Features

### 🏃‍♀️ Core Features
- **Authentication**: Login/Signup with email/password (mocked)
- **Main Feed**: Browse upcoming runs with join/leave functionality
- **Run Details**: Full event information with participant lists and sharing
- **Profile Page**: Personal stats with animated charts and badges
- **Tips Page**: Health and running articles with categories
- **Admin Dashboard**: User management, event creation, and statistics
- **Community Feed**: Social interactions with posts, likes, and comments

### 🎨 Design & UX
- **Mobile-First**: Responsive design optimized for mobile devices
- **Modern UI**: Inspired by Nike Run Club and Strava
- **Smooth Animations**: Framer Motion for all transitions and interactions
- **Beautiful Charts**: Recharts for data visualization
- **Tailwind CSS**: Utility-first styling with custom design system

### 🛠️ Technical Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **MirageJS** for API mocking
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd running-club-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Demo Credentials

Use these credentials to test the application:

- **Email**: `sarah@example.com`
- **Password**: `password`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx  # Main navigation component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── mirage/            # API mocking
│   └── server.ts      # MirageJS server setup
├── pages/             # Page components
│   ├── AuthPage.tsx   # Login/Signup page
│   ├── FeedPage.tsx   # Main runs feed
│   ├── RunDetailsPage.tsx # Individual run details
│   ├── ProfilePage.tsx # User profile with charts
│   ├── TipsPage.tsx   # Running tips and articles
│   ├── AdminDashboard.tsx # Admin panel
│   └── CommunityPage.tsx # Social feed
├── types/             # TypeScript type definitions
│   └── index.ts       # Data model interfaces
├── App.tsx           # Main app component
└── index.tsx         # App entry point
```

## Features in Detail

### Authentication
- Email/password login and registration
- Persistent session management
- Protected routes
- Demo credentials for testing

### Main Feed
- Browse upcoming runs with filters
- Search by title or location
- Filter by difficulty level
- Join/leave runs with real-time updates
- Participant avatars and counts

### Run Details
- Complete event information
- Participant list with user details
- Share functionality
- Add to calendar integration
- Join/leave actions

### Profile Page
- Personal running statistics
- Animated charts showing progress
- Badge system with achievements
- Editable profile information
- Weekly and monthly progress tracking

### Tips Page
- Categorized running articles
- Search and filter functionality
- Modal view for detailed reading
- Like, share, and save actions

### Admin Dashboard
- User management with approval system
- Event creation and editing
- Statistics overview
- User detail modals
- Role-based access control

### Community Feed
- Social media-style posts
- Like and comment functionality
- User avatars and timestamps
- Create new posts
- Comment modal system

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  totalRuns: number;
  totalDistance: number;
  avgPace: string;
  badges: string[];
}
```

### Run
```typescript
{
  id: string;
  title: string;
  distance: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  pace: string;
  location: string;
  time: string;
  participants: string[];
  maxParticipants: number;
  description: string;
}
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Primary: Blue shades for main actions
- Secondary: Purple shades for accents
- Custom animations and keyframes

### Adding New Features
1. Create new page components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Add API endpoints in `src/mirage/server.ts`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Lazy loading for better performance
- Optimized animations with Framer Motion
- Responsive images and icons
- Efficient state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
