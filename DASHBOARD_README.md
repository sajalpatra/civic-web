# 🏛️ CivicApp Professional Dashboard

A modern, professional dashboard built with Next.js 15, React 19, and the latest UI libraries for managing civic reports and citizen engagement.

## ✨ Features

### 🎯 Real-Time Dashboard

- **Live Statistics**: Real-time metrics from your Supabase database
- **Interactive Charts**: Reports over time, category distribution, response times
- **Smart Search**: Search reports with advanced filtering
- **Live Updates**: Real-time subscriptions for instant data updates

### 🎨 Modern UI Components

- **Professional Design**: Built with Radix UI primitives
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Complete dark/light theme system
- **Smooth Animations**: Framer Motion for engaging interactions

### ⚡ Advanced Functionality

- **Command Palette**: Quick navigation with `Ctrl+K`
- **Floating Actions**: Quick access to common tasks
- **Toast Notifications**: Real-time feedback system
- **Status Management**: Live status updates with database sync

### 📊 Data Visualization

- **Recharts Integration**: Beautiful, interactive charts
- **Real-Time Data**: Direct connection to Supabase
- **Performance Metrics**: Response times, resolution rates
- **Category Analytics**: Distribution by issue types

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 🗄️ Database Schema

### Required Tables

#### `reports` table:

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_progress', 'resolved', 'closed')),
  location_latitude DECIMAL,
  location_longitude DECIMAL,
  address TEXT,
  user_id UUID REFERENCES auth.users(id),
  department TEXT,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  comments JSONB DEFAULT '[]'::jsonb
);
```

#### `profiles` table (optional, for user management):

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  department TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust based on your needs)
CREATE POLICY "Reports are viewable by everyone"
ON reports FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own reports"
ON reports FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 🎛️ Dashboard Features

### 📈 Statistics Cards

- **Total Reports**: Live count from database
- **Resolved Reports**: Completed issues with resolution rate
- **Pending Reports**: Active issues requiring attention
- **Active Users**: Registered user count

### 📊 Interactive Charts

1. **Reports Over Time**: Monthly trends with resolved vs pending
2. **Category Distribution**: Pie chart showing issue types
3. **Response Times**: Line chart showing performance metrics

### 📋 Reports Management

- **Live Table**: Real-time report list with search and filters
- **Status Updates**: Click to change status with database sync
- **Quick Actions**: View, edit, delete buttons
- **Smart Filtering**: Filter by status, category, priority, date

## ⌨️ Keyboard Shortcuts

- `Ctrl+K` (or `Cmd+K`): Open command palette
- `Escape`: Close modals/overlays
- `Enter`: Execute search or commands

## 🎨 UI Components

### Built with Modern Libraries:

- **Radix UI**: Accessible component primitives
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualization
- **cmdk**: Command palette functionality
- **clsx**: Conditional CSS classes
- **Lucide React**: Beautiful icons

### Theme System:

- Tailwind CSS for styling
- Dark/light mode support
- Responsive design
- Custom color palette

## 🔧 Customization

### Adding New Dashboard Sections

1. Create component in `src/components/dashboard/`
2. Add to sidebar navigation in `Sidebar.tsx`
3. Include in route handler in `page.tsx`

### Custom Charts

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Custom Chart</CardTitle>
      </CardHeader>
      <CardContent>{/* Your chart content */}</CardContent>
    </Card>
  );
}
```

### Adding Real-Time Features

```tsx
import { subscribeToReports } from "@/lib/dashboardService";

useEffect(() => {
  const unsubscribe = subscribeToReports((reports) => {
    // Handle real-time updates
    setReports(reports);
  });

  return unsubscribe;
}, []);
```

## 📱 Mobile Support

The dashboard is fully responsive and works great on:

- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (responsive sidebar, touch-friendly)

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- CSRF protection built into Next.js

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Other Platforms

- Works with any Node.js hosting platform
- Requires environment variables setup
- Build command: `npm run build`
- Start command: `npm start`

## 📞 Support

For issues or questions:

1. Check the console for errors
2. Verify Supabase connection
3. Ensure environment variables are set
4. Check database schema matches requirements

## 🎯 Roadmap

- [ ] Advanced filtering and search
- [ ] Export functionality (CSV, PDF)
- [ ] Email notifications
- [ ] User role management
- [ ] Advanced analytics
- [ ] Mobile app integration
- [ ] API webhooks

---

Built with ❤️ using modern web technologies for efficient civic engagement management.
