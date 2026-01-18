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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
