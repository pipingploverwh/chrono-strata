import { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Globe, 
  ExternalLink, 
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  MoreHorizontal,
  Bookmark,
  Bell,
  Building2,
  Calendar,
  TrendingUp,
  Award,
  Briefcase,
  ChevronDown,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import linkedInCover from '@/assets/linkedin-company-cover.jpg';
import lavandarLogo from '@/assets/lavandar-logo.png';

// LinkedIn company data
const companyData = {
  name: 'LAVANDAR',
  tagline: 'Weather Intelligence & AI Analytics Platform',
  industry: 'Software Development',
  companySize: '11-50 employees',
  headquarters: 'Tokyo, Japan',
  type: 'Privately Held',
  founded: '2024',
  specialties: ['Weather Intelligence', 'AI Analytics', 'Predictive Modeling', 'Defense Technology', 'Enterprise Software'],
  website: 'https://chrono-strata.lovable.app',
  followers: '2,847',
  employees: '23',
  about: `LAVANDAR is a sovereign AI platform designed for high-stakes aerospace and defense applications. We integrate patented behavioral detection systems with real-time predictive intelligence to deliver mission-critical weather and operational analytics.

Our STRATA platform provides unified intelligence across aviation, marine, construction, events, and defense operations. Powered by the Rubin patent portfolio, we offer predictive accuracy exceeding 84.7% for weather-critical decision making.

Core verticals:
• Aviation Operations – Flight safety and GPS integrity monitoring
• Marine Logistics – Weather-critical shipping and port operations  
• Construction Planning – Project timeline optimization
• Event Management – Large-scale venue weather intelligence
• Defense Systems – Electronic warfare and threat detection`,
};

// Sample posts data
const posts = [
  {
    id: 1,
    content: `🚀 Excited to announce our partnership with the Kraft Group for NFL stadium weather intelligence!

Our STRATA Events module delivered 87.3% prediction accuracy during the 2025-2026 season at Gillette Stadium.

Key results:
✅ <5 minute alert response time
✅ 23% improvement in weather-related decisions
✅ Zero weather-related safety incidents

Learn more about our enterprise solutions → chrono-strata.lovable.app/kraft-case-study

#WeatherIntelligence #AI #SportsOperations #Innovation`,
    timeAgo: '2d',
    likes: 847,
    comments: 63,
    reposts: 124,
    image: null,
  },
  {
    id: 2,
    content: `📊 STRATA Platform Update: Real-time GPS integrity monitoring now live!

Our aviation module now includes:
• Spoofing detection algorithms
• Real-time flight tracking integration
• Automated pilot alerts

Protecting pilots and passengers with AI-powered situational awareness.

#Aviation #FlightSafety #AI #Technology`,
    timeAgo: '1w',
    likes: 523,
    comments: 41,
    reposts: 89,
    image: null,
  },
  {
    id: 3,
    content: `🎯 Series A Update: We're raising at a $100M valuation

LAVANDAR is expanding our patent-protected technology to new markets:

• 3 patents (1 granted, 2 pending)
• 84.7%+ algorithm accuracy
• Active enterprise partnerships
• Growing defense pipeline

Qualified investors: chrono-strata.lovable.app/investor-hub

#StartupFunding #SeriesA #AI #WeatherTech`,
    timeAgo: '2w',
    likes: 1243,
    comments: 156,
    reposts: 287,
    image: null,
  },
];

// Jobs data
const jobs = [
  {
    title: 'Senior ML Engineer',
    location: 'Tokyo, Japan (Hybrid)',
    posted: '1 week ago',
  },
  {
    title: 'Full Stack Developer',
    location: 'Remote',
    posted: '2 weeks ago',
  },
  {
    title: 'Defense Sales Director',
    location: 'Washington, DC',
    posted: '3 weeks ago',
  },
];

export default function LinkedInCompanyPage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f2ee' }}>
      {/* LinkedIn Header */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: '#ffffff', borderColor: '#e0dfdc' }}
      >
        <div className="max-w-[1128px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* LinkedIn Logo */}
            <Link to="/linkedin-company">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="#0a66c2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Link>
            
            {/* Search Bar */}
            <div 
              className="hidden md:flex items-center px-3 py-2 rounded"
              style={{ backgroundColor: '#edf3f8' }}
            >
              <svg className="w-4 h-4 mr-2" style={{ color: '#666666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search"
                className="bg-transparent outline-none text-sm w-48"
                style={{ color: '#191919' }}
              />
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            {[
              { icon: '🏠', label: 'Home' },
              { icon: '👥', label: 'My Network' },
              { icon: '💼', label: 'Jobs' },
              { icon: '💬', label: 'Messaging' },
              { icon: '🔔', label: 'Notifications' },
            ].map((item) => (
              <button 
                key={item.label}
                className="flex flex-col items-center text-xs hover:opacity-70"
                style={{ color: '#666666' }}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        {/* Company Card */}
        <div 
          className="rounded-lg overflow-hidden shadow-sm mb-4"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
        >
          {/* Cover Image */}
          <div className="h-48 md:h-64 relative">
            <img 
              src={linkedInCover} 
              alt="LAVANDAR Cover" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Company Info */}
          <div className="px-6 pb-6 relative">
            {/* Logo */}
            <div 
              className="absolute -top-16 left-6 w-28 h-28 rounded-lg overflow-hidden border-4"
              style={{ backgroundColor: '#ffffff', borderColor: '#ffffff' }}
            >
              <img 
                src={lavandarLogo} 
                alt="LAVANDAR Logo" 
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="pt-16">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold" style={{ color: '#191919' }}>
                    {companyData.name}
                  </h1>
                  <p className="text-base mt-1" style={{ color: '#191919' }}>
                    {companyData.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm" style={{ color: '#666666' }}>
                    <span>{companyData.industry}</span>
                    <span>·</span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {companyData.headquarters}
                    </span>
                    <span>·</span>
                    <span className="flex items-center" style={{ color: '#0a66c2' }}>
                      {companyData.followers} followers
                    </span>
                    <span>·</span>
                    <span>{companyData.employees} employees</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`rounded-full font-semibold ${
                      isFollowing 
                        ? 'bg-transparent border-2 hover:bg-gray-50' 
                        : ''
                    }`}
                    style={isFollowing ? { 
                      borderColor: '#0a66c2', 
                      color: '#0a66c2',
                      backgroundColor: 'transparent'
                    } : { 
                      backgroundColor: '#0a66c2',
                      color: '#ffffff'
                    }}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full font-semibold"
                    style={{ borderColor: '#0a66c2', color: '#0a66c2' }}
                    asChild
                  >
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                      Visit website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    style={{ color: '#666666' }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div 
            className="border-t px-6 flex space-x-6 overflow-x-auto"
            style={{ borderColor: '#e0dfdc' }}
          >
            {['Home', 'About', 'Posts', 'Jobs', 'People'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-current'
                    : 'border-transparent hover:opacity-70'
                }`}
                style={{ 
                  color: activeTab === tab.toLowerCase() ? '#057642' : '#666666',
                  borderColor: activeTab === tab.toLowerCase() ? '#057642' : 'transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* About Section */}
            <div 
              className="rounded-lg p-6 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#191919' }}>
                About
              </h2>
              <p className="text-sm whitespace-pre-line" style={{ color: '#191919' }}>
                {companyData.about}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t" style={{ borderColor: '#e0dfdc' }}>
                <div>
                  <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </div>
                  <a 
                    href={companyData.website} 
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#0a66c2' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyData.website.replace('https://', '')}
                  </a>
                </div>
                <div>
                  <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Company size
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#191919' }}>
                    {companyData.companySize}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Industry
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#191919' }}>
                    {companyData.industry}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm" style={{ color: '#666666' }}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Founded
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#191919' }}>
                    {companyData.founded}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e0dfdc' }}>
                <div className="text-sm mb-2" style={{ color: '#666666' }}>Specialties</div>
                <div className="flex flex-wrap gap-2">
                  {companyData.specialties.map((specialty) => (
                    <span 
                      key={specialty}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#f4f2ee', color: '#191919' }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div 
              className="rounded-lg shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
            >
              <div className="p-4 border-b" style={{ borderColor: '#e0dfdc' }}>
                <h2 className="text-lg font-semibold" style={{ color: '#191919' }}>
                  Posts
                </h2>
              </div>

              {posts.map((post, idx) => (
                <div 
                  key={post.id}
                  className={`p-4 ${idx < posts.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: '#e0dfdc' }}
                >
                  {/* Post Header */}
                  <div className="flex items-start space-x-3 mb-3">
                    <img 
                      src={lavandarLogo} 
                      alt="LAVANDAR" 
                      className="w-12 h-12 rounded-lg object-contain p-1"
                      style={{ backgroundColor: '#f4f2ee' }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: '#191919' }}>
                            {companyData.name}
                          </h4>
                          <p className="text-xs" style={{ color: '#666666' }}>
                            {companyData.followers} followers
                          </p>
                          <p className="text-xs" style={{ color: '#666666' }}>
                            {post.timeAgo} · 🌐
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" style={{ color: '#666666' }} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm whitespace-pre-line mb-4" style={{ color: '#191919' }}>
                    {post.content}
                  </p>

                  {/* Engagement Stats */}
                  <div 
                    className="flex items-center justify-between py-2 border-b text-xs"
                    style={{ borderColor: '#e0dfdc', color: '#666666' }}
                  >
                    <div className="flex items-center">
                      <span className="flex -space-x-1 mr-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#0a66c2' }}>👍</span>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#df704d' }}>❤️</span>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#7fc15e' }}>🎉</span>
                      </span>
                      {post.likes.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>{post.comments} comments</span>
                      <span>{post.reposts} reposts</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {[
                      { icon: ThumbsUp, label: 'Like' },
                      { icon: MessageCircle, label: 'Comment' },
                      { icon: Share2, label: 'Repost' },
                      { icon: Send, label: 'Send' },
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                        style={{ color: '#666666' }}
                      >
                        <action.icon className="w-5 h-5" />
                        <span className="text-sm font-semibold hidden sm:inline">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Jobs Card */}
            <div 
              className="rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: '#191919' }}>
                  Open positions
                </h3>
                <span 
                  className="text-sm font-semibold"
                  style={{ color: '#0a66c2' }}
                >
                  See all
                </span>
              </div>

              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div 
                      className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#f4f2ee' }}
                    >
                      <Briefcase className="w-6 h-6" style={{ color: '#666666' }} />
                    </div>
                    <div>
                      <h4 
                        className="font-semibold text-sm hover:underline cursor-pointer"
                        style={{ color: '#0a66c2' }}
                      >
                        {job.title}
                      </h4>
                      <p className="text-xs" style={{ color: '#666666' }}>
                        {job.location}
                      </p>
                      <p className="text-xs" style={{ color: '#666666' }}>
                        {job.posted}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Pages */}
            <div 
              className="rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: '#191919' }}>
                Similar pages
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Tomorrow.io', followers: '45K', industry: 'Weather Tech' },
                  { name: 'Climavision', followers: '12K', industry: 'Climate Analytics' },
                  { name: 'DTN', followers: '78K', industry: 'Weather Intelligence' },
                ].map((page) => (
                  <div key={page.name} className="flex items-start space-x-3">
                    <div 
                      className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#f4f2ee' }}
                    >
                      <Building2 className="w-6 h-6" style={{ color: '#666666' }} />
                    </div>
                    <div className="flex-1">
                      <h4 
                        className="font-semibold text-sm hover:underline cursor-pointer"
                        style={{ color: '#191919' }}
                      >
                        {page.name}
                      </h4>
                      <p className="text-xs" style={{ color: '#666666' }}>
                        {page.industry}
                      </p>
                      <p className="text-xs" style={{ color: '#666666' }}>
                        {page.followers} followers
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      style={{ borderColor: '#666666', color: '#666666' }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Placeholder */}
            <div 
              className="rounded-lg p-4 shadow-sm text-center"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e0dfdc' }}
            >
              <p className="text-xs mb-2" style={{ color: '#666666' }}>
                Ad · See all
              </p>
              <div 
                className="h-48 rounded flex items-center justify-center"
                style={{ backgroundColor: '#f4f2ee' }}
              >
                <p className="text-sm" style={{ color: '#666666' }}>
                  Promote your company
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-center space-y-2" style={{ color: '#666666' }}>
              <div className="flex flex-wrap justify-center gap-2">
                <span>About</span>
                <span>·</span>
                <span>Accessibility</span>
                <span>·</span>
                <span>Help Center</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span>Privacy & Terms</span>
                <span>·</span>
                <span>Ad Choices</span>
              </div>
              <div className="flex items-center justify-center mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-5" fill="#0a66c2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="ml-1">Corporation © 2026</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
