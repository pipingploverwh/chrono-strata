import { useState } from "react";
import { 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  MessageCircle, 
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Image,
  Calendar,
  FileText,
  Smile,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Pencil,
  ChevronDown,
  Building2,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check,
  Rocket,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Career Resources Component
const CareerResourcesSection = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);

  const jobSearchLinks = [
    {
      category: "Growth Strategy Roles",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Remote US growth strategy positions",
      url: "https://www.linkedin.com/jobs/search?keywords=growth%20strategy&location=United%20States&f_WT=2&f_TPR=r86400",
      color: "from-green-500 to-emerald-600"
    },
    {
      category: "Growth Marketing & Leadership",
      icon: <Rocket className="w-5 h-5" />,
      description: "Remote growth marketing roles",
      url: "https://www.linkedin.com/jobs/search?keywords=remote%20growth%20marketing&location=United%20States&f_WT=2&f_TPR=r86400",
      color: "from-blue-500 to-indigo-600"
    },
    {
      category: "Consultant / Fractional Roles",
      icon: <Target className="w-5 h-5" />,
      description: "Remote consultant & fractional operator positions",
      url: "https://www.linkedin.com/jobs/search?keywords=remote%20consultant%20growth&location=United%20States&f_WT=2&f_TPR=r86400",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const searchPhrases = [
    '"remote" AND "trial project"',
    '"remote" AND "work sample"',
    '"remote" AND "contract"',
    '"remote" AND "fractional"',
    '"remote" AND "consultant"',
    'remote consultant AND growth AND contract'
  ];

  const filterRecommendations = [
    { filter: "Location", value: "United States", icon: <MapPin className="w-4 h-4" /> },
    { filter: "Remote", value: "Remote", icon: <Globe className="w-4 h-4" /> },
    { filter: "Date Posted", value: "Past 24h / Week", icon: <Clock className="w-4 h-4" /> },
    { filter: "Experience Level", value: "Senior / Director", icon: <Award className="w-4 h-4" /> },
    { filter: "Job Type", value: "Contract / Full-Time", icon: <Briefcase className="w-4 h-4" /> }
  ];

  const targetTitles = [
    "Growth Marketing Manager (Remote)",
    "Head of Growth (Remote)",
    "Growth Consultant (Remote)",
    "Strategy Consultant / Growth Strategy Director",
    "Fractional Growth Lead",
    "Remote Growth Strategist"
  ];

  const outreachTemplates = [
    {
      title: "Skills-First Introduction",
      context: "When reaching out about a role that may allow work samples",
      template: `Hi [Name],

I'm very interested in the [Role Title] position and prefer to demonstrate fit via a practical work sample or short project.

I can start immediately and would be happy to share a 30-day strategic plan or conduct a brief audit of your current growth initiatives.

Would you be open to a trial-based approach?`
    },
    {
      title: "Fractional/Consultant Pitch",
      context: "For roles that might accept fractional or project work",
      template: `Hi [Name],

I noticed you're hiring for [Role]. I specialize in growth strategy and have helped companies scale from $0 to $1M+ ARR.

I'm open to starting on a fractional or project basis—this often gives both sides a chance to evaluate fit before a full commitment.

Would you be open to discussing a trial engagement?`
    },
    {
      title: "Direct Value Proposition",
      context: "When you have specific relevant experience",
      template: `Hi [Name],

I saw your [Role] posting and wanted to reach out directly.

In my previous role, I [specific achievement relevant to role]. I'd love to bring that experience to [Company Name].

I'm available for an initial call this week and can also prepare a brief strategic assessment if helpful.`
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(index);
    toast.success("Template copied to clipboard!");
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Career Resources</h2>
          <p className="text-sm text-gray-500">Remote growth & strategy job search toolkit</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Job Search Links */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#0a66c2]" />
          Live LinkedIn Job Search Links
        </h3>
        <div className="grid gap-3">
          {jobSearchLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#0a66c2] hover:shadow-md transition group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center text-white`}>
                {link.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#0a66c2]">{link.category}</h4>
                <p className="text-xs text-gray-500">{link.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0a66c2]" />
            </a>
          ))}
        </div>
      </div>

      {/* Search Phrases */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#0a66c2]" />
          Search Phrases for Skills-Test Roles
        </h3>
        <div className="flex flex-wrap gap-2">
          {searchPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigator.clipboard.writeText(phrase);
                toast.success("Search phrase copied!");
              }}
              className="px-3 py-1.5 bg-[#eef3f8] text-gray-700 rounded-full text-xs font-medium hover:bg-[#0a66c2] hover:text-white transition flex items-center gap-1"
            >
              <code className="font-mono">{phrase}</code>
              <Copy className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Filter Recommendations */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0a66c2]" />
          Recommended LinkedIn Filters
        </h3>
        <div className="bg-[#f8fafc] rounded-lg p-4 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filterRecommendations.map((rec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0a66c2]">
                  {rec.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{rec.filter}</p>
                  <p className="text-sm font-medium text-gray-900">{rec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Titles */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#0a66c2]" />
          Job Titles to Target
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {targetTitles.map((title, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outreach Templates */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#0a66c2]" />
          Outreach Message Templates
        </h3>
        <div className="space-y-4">
          {outreachTemplates.map((template, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#0a66c2]/5 to-[#0a66c2]/10 px-4 py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{template.title}</h4>
                  <p className="text-xs text-gray-500">{template.context}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(template.template, idx)}
                  className="border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
                >
                  {copiedTemplate === idx ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-white">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {template.template}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">Pro Tip</h4>
            <p className="text-sm text-amber-800 mt-1">
              When you find roles, message the poster or recruiter directly with a value-first pitch. 
              Many remote and growth teams are open to trial-based or work-sample approaches—it de-risks hiring for both sides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkedInCEOPage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const ceoProfile = {
    name: "Marcus Chen",
    headline: "CEO & Founder at LAVANDAR | Building Weather-Intelligent Infrastructure | Forbes 30 Under 30",
    location: "Charlottesville, Virginia, United States",
    connections: "500+",
    followers: "12,847",
    about: `Serial entrepreneur and technologist passionate about leveraging AI and weather intelligence to transform how industries operate.

After 8 years at leading tech companies including roles at Google Cloud and Microsoft Azure, I founded LAVANDAR to solve one of the most overlooked challenges in modern business: weather-driven decision making.

Our platform helps enterprises across construction, aviation, marine, and events industries make smarter, faster decisions by integrating real-time weather data with operational intelligence.

🎯 What drives me:
• Building products that create measurable impact
• Assembling and empowering exceptional teams
• Turning complex data into actionable insights

🏆 Recent milestones:
• Raised $2.3M seed round (2024)
• Expanded to 47 enterprise clients
• Filed 3 patents in predictive weather analytics

Always open to connecting with fellow founders, investors, and anyone passionate about climate tech and enterprise SaaS.

📧 marcus@lavandar.io`,
    experience: [
      {
        title: "CEO & Founder",
        company: "LAVANDAR",
        logo: "🌿",
        duration: "Jan 2023 - Present · 2 yrs 1 mo",
        location: "Charlottesville, Virginia",
        description: "Leading a weather intelligence platform that helps enterprises make data-driven operational decisions. Grew from 0 to $1.2M ARR in 18 months."
      },
      {
        title: "Senior Product Manager",
        company: "Google Cloud",
        logo: "🔷",
        duration: "Mar 2020 - Dec 2022 · 2 yrs 10 mos",
        location: "San Francisco Bay Area",
        description: "Led product strategy for Cloud AI/ML services. Launched 3 major features used by 10,000+ enterprise customers."
      },
      {
        title: "Product Manager",
        company: "Microsoft Azure",
        logo: "🟦",
        duration: "Jun 2017 - Feb 2020 · 2 yrs 9 mos",
        location: "Seattle, Washington",
        description: "Managed Azure IoT product line. Drove 40% YoY revenue growth."
      }
    ],
    education: [
      {
        school: "University of Virginia",
        degree: "MBA, Darden School of Business",
        years: "2015 - 2017",
        logo: "🎓"
      },
      {
        school: "MIT",
        degree: "BS, Computer Science",
        years: "2011 - 2015",
        logo: "🏛️"
      }
    ],
    skills: [
      { name: "Product Strategy", endorsements: 99 },
      { name: "Enterprise SaaS", endorsements: 87 },
      { name: "AI/ML", endorsements: 76 },
      { name: "Startup Leadership", endorsements: 64 },
      { name: "Cloud Computing", endorsements: 58 }
    ],
    posts: [
      {
        content: `Excited to announce that LAVANDAR just closed our seed round! 🎉

$2.3M raised to help enterprises make weather-intelligent decisions.

A huge thank you to our investors at Foundry Group and Techstars for believing in our vision.

What's next?
→ Expanding our engineering team (we're hiring!)
→ Launching our aviation vertical
→ Building deeper AI prediction models

The journey is just beginning. 🚀

#startup #seedround #weathertech #enterprise`,
        likes: 847,
        comments: 124,
        reposts: 56,
        time: "1w"
      },
      {
        content: `Hot take: Most B2B SaaS products are solving the wrong problem.

They focus on "features" instead of "outcomes."

At LAVANDAR, we don't sell weather data.
We sell operational confidence.

When a construction manager knows they can pour concrete tomorrow, that's worth more than any dashboard.

What outcomes does your product deliver?`,
        likes: 432,
        comments: 67,
        reposts: 28,
        time: "2w"
      },
      {
        content: `3 lessons from scaling 0 → $1M ARR in 18 months:

1. Your first 10 customers define your product
   - Listen obsessively. They'll tell you what to build.

2. Pricing is positioning
   - We 3x'd our prices and close rates went UP.

3. Hire people who've done it before
   - Our first 3 hires had direct industry experience.

Building in public. Ask me anything 👇`,
        likes: 1243,
        comments: 189,
        reposts: 112,
        time: "3w"
      }
    ],
    featured: [
      {
        type: "Article",
        title: "How Weather Intelligence is Transforming Enterprise Operations",
        source: "Forbes",
        image: "📰"
      },
      {
        type: "Post",
        title: "Announcing our $2.3M Seed Round",
        engagement: "847 reactions",
        image: "🎉"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* LinkedIn Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">in</span>
            </div>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[280px] h-[34px] bg-[#eef3f8] rounded pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
              />
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            {[
              { icon: "🏠", label: "Home" },
              { icon: "👥", label: "My Network" },
              { icon: "💼", label: "Jobs" },
              { icon: "💬", label: "Messaging" },
              { icon: "🔔", label: "Notifications" },
            ].map((item) => (
              <button key={item.label} className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-black">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[11px] hidden lg:block">{item.label}</span>
              </button>
            ))}
            <div className="flex items-center gap-1 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-xs font-semibold">
                MC
              </div>
              <span className="text-[11px] text-gray-600 hidden lg:block">Me</span>
              <ChevronDown className="w-3 h-3 text-gray-600" />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[790px_1fr] gap-6">
          {/* Main Content */}
          <div className="space-y-2">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Cover Image */}
              <div className="h-[200px] bg-gradient-to-r from-[#0a66c2] via-[#004182] to-[#0a66c2] relative">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full" />
                  <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full" />
                  <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-white/25 rounded-full" />
                </div>
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100">
                  <Pencil className="w-4 h-4 text-[#0a66c2]" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="px-6 pb-6 relative">
                {/* Profile Picture */}
                <div className="absolute -top-[88px] left-6">
                  <div className="w-[176px] h-[176px] rounded-full border-4 border-white bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                    MC
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
                </div>

                <div className="pt-24">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold text-gray-900">{ceoProfile.name}</h1>
                        <CheckCircle2 className="w-5 h-5 text-[#0a66c2] fill-[#0a66c2]" />
                      </div>
                      <p className="text-base text-gray-900 mt-1">{ceoProfile.headline}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{ceoProfile.location}</span>
                        <span>·</span>
                        <a href="#" className="text-[#0a66c2] font-semibold hover:underline">Contact info</a>
                      </div>

                      <div className="flex items-center gap-2 text-sm mt-2">
                        <a href="#" className="text-[#0a66c2] font-semibold hover:underline">{ceoProfile.connections} connections</a>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{ceoProfile.followers} followers</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-2xl">🌿</span>
                          <span className="text-sm font-medium">LAVANDAR</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-2xl">🎓</span>
                          <span className="text-sm font-medium">University of Virginia</span>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold">
                      <Plus className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                    <Button variant="outline" className="border-[#0a66c2] text-[#0a66c2] rounded-full px-6 font-semibold hover:bg-[#0a66c2]/10 hover:border-[#004182]">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" className="border-gray-400 text-gray-600 rounded-full px-6 font-semibold hover:bg-gray-100 hover:border-gray-600">
                      More
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">About</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Pencil className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {ceoProfile.about}
              </p>
            </div>

            {/* Featured Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {ceoProfile.featured.map((item, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer">
                    <div className="h-24 bg-gradient-to-br from-[#0a66c2]/20 to-[#0a66c2]/5 flex items-center justify-center text-4xl">
                      {item.image}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500">{item.type}</p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                      {item.source && <p className="text-xs text-gray-500 mt-1">{item.source}</p>}
                      {item.engagement && <p className="text-xs text-gray-500 mt-1">{item.engagement}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
                  <p className="text-sm text-[#0a66c2]">{ceoProfile.followers} followers</p>
                </div>
                <Button variant="outline" className="border-[#0a66c2] text-[#0a66c2] rounded-full px-4 font-semibold hover:bg-[#0a66c2]/10">
                  Create a post
                </Button>
              </div>

              {/* Activity Tabs */}
              <div className="flex gap-2 mt-4 border-b border-gray-200">
                {["Posts", "Comments", "Images"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab.toLowerCase()
                        ? "text-green-700 border-b-2 border-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Posts */}
              <div className="mt-4 space-y-4">
                {ceoProfile.posts.map((post, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        MC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">Marcus Chen</span>
                          <span className="text-gray-500 text-sm">posted this · {post.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{post.content}</p>
                        
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[#0a66c2] text-sm">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[#0a66c2] text-sm">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[#0a66c2] text-sm">
                            <Repeat2 className="w-4 h-4" />
                            <span>{post.reposts}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[#0a66c2] text-sm">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold text-sm py-3 mt-2">
                Show all posts →
              </button>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {ceoProfile.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                      {exp.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-sm text-gray-700">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {ceoProfile.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                      {edu.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                      <p className="text-sm text-gray-700">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {ceoProfile.skills.map((skill, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-500">{skill.endorsements} endorsements</p>
                    </div>
                    <Button variant="outline" className="border-gray-300 text-gray-600 rounded-full text-sm">
                      Endorse
                    </Button>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-gray-500 hover:text-gray-700 font-semibold text-sm py-3 mt-2">
                Show all 23 skills →
              </button>
            </div>

            {/* Career Resources Section */}
            <CareerResourcesSection />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-2">
            {/* Profile Language */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Profile language</span>
                <Pencil className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">English</p>
            </div>

            {/* Public Profile & URL */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Public profile & URL</span>
                <Pencil className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">linkedin.com/in/marcuschen</p>
            </div>

            {/* People Also Viewed */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">People also viewed</h3>
              <div className="space-y-4">
                {[
                  { name: "Sarah Kim", title: "CEO at WeatherFlow", mutual: "12 mutual" },
                  { name: "James Wright", title: "Founder, Climate Analytics", mutual: "8 mutual" },
                  { name: "Elena Rodriguez", title: "VP Product, Accuweather", mutual: "5 mutual" },
                ].map((person, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                      {person.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-500">{person.title}</p>
                      <p className="text-xs text-gray-400">{person.mutual}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-600 rounded-full text-xs h-8">
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* People You May Know */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">People you may know</h3>
              <div className="space-y-4">
                {[
                  { name: "Alex Thompson", title: "VC Partner at Foundry", mutual: "3 mutual" },
                  { name: "Maria Santos", title: "CTO at BuildWeather", mutual: "7 mutual" },
                ].map((person, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {person.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{person.name}</h4>
                      <p className="text-xs text-gray-500">{person.title}</p>
                      <p className="text-xs text-gray-400">{person.mutual}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-400 text-gray-600 rounded-full text-xs h-8">
                      <Plus className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f4f2ee] py-6 mt-8">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-[56px] h-[14px] bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">Linked</span>
              <span className="text-white font-bold text-[10px] bg-white/20 px-0.5 rounded">in</span>
            </div>
            <span>© 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LinkedInCEOPage;
