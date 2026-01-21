import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const HackerNewsPost = () => {
  return (
    <div className="min-h-screen bg-[#f6f6ef]">
      {/* HN-style header */}
      <header className="bg-[#ff6600] px-2 py-1">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
          <span className="font-bold text-black">Y</span>
          <nav className="flex items-center gap-2 text-black">
            <span className="font-bold">Hacker News</span>
            <span>|</span>
            <span>new</span>
            <span>|</span>
            <span>past</span>
            <span>|</span>
            <span>comments</span>
            <span>|</span>
            <span>ask</span>
            <span>|</span>
            <span>show</span>
            <span>|</span>
            <span>jobs</span>
            <span>|</span>
            <span>submit</span>
          </nav>
        </div>
      </header>

      {/* Essay content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-[#828282] hover:text-[#ff6600] text-sm mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to LAVANDAR
        </Link>

        <article className="font-serif">
          <h1 className="text-xl font-normal text-black mb-2">
            Show HN: I built an enterprise weather intelligence platform with Lovable
          </h1>
          
          <div className="text-xs text-[#828282] mb-8">
            by lavandar | 2 hours ago | 127 points | 43 comments
          </div>

          <div className="prose prose-sm max-w-none text-[#000000] leading-relaxed space-y-4">
            <p>
              January 2026
            </p>

            <p>
              The best startup ideas come from noticing something everyone else ignores. 
              For me, it was watching a stadium operations manager check five different 
              weather apps before deciding whether to cover the field.
            </p>

            <p>
              He wasn't looking for a forecast. He was looking for a <em>decision</em>.
            </p>

            <p>
              That's the gap. Weather data is abundant. Weather intelligence—knowing 
              what to <em>do</em> about the weather—is scarce.
            </p>

            <h2 className="text-lg font-normal mt-8 mb-4">The Problem</h2>

            <p>
              Operations teams in aviation, marine, construction, and events spend 
              enormous amounts of time translating atmospheric data into actions. 
              A pilot doesn't need to know the dew point. She needs to know if she 
              can take off. A concert promoter doesn't care about millibars. He needs 
              to know if he should move equipment.
            </p>

            <p>
              The existing solutions fall into two categories: consumer apps that 
              are too simple, and enterprise systems that cost six figures and take 
              months to implement.
            </p>

            <p>
              There's no middle ground. No tool that says "here's what you should 
              actually do" in plain language.
            </p>

            <h2 className="text-lg font-normal mt-8 mb-4">What We Built</h2>

            <p>
              LAVANDAR converts meteorological data into operational decisions. Not 
              predictions—decisions. The difference matters.
            </p>

            <p>
              When you load a location, you don't see temperature and humidity. You 
              see: "PROCEED WITH CAUTION: Fog formation likely between 0400-0600. 
              Recommend delaying ground operations until visibility exceeds 800m."
            </p>

            <p>
              We built industry-specific modules:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Aviation</strong> — Go/no-go recommendations based on 
                crosswind limits, visibility minimums, and runway conditions
              </li>
              <li>
                <strong>Marine</strong> — Route optimization that factors swell 
                period, not just wave height
              </li>
              <li>
                <strong>Construction</strong> — Concrete pour windows, crane 
                operation limits, heat stress indices
              </li>
              <li>
                <strong>Events</strong> — Crowd safety thresholds, lightning 
                protocols, evacuation timing
              </li>
            </ul>

            <p>
              Everything feeds into a unified command center we call STRATA. One 
              screen. Multiple locations. Real-time intelligence.
            </p>

            <h2 className="text-lg font-normal mt-8 mb-4">How I Built It</h2>

            <p>
              Here's the part that might interest HN: I built this entire platform 
              using Lovable.
            </p>

            <p>
              Not as an experiment. As my production stack.
            </p>

            <p>
              I'm technical enough to write React, but not fast enough to ship at 
              the pace I needed. The gap between "I know how to code this" and "I 
              have time to code this" was killing momentum.
            </p>

            <p>
              With Lovable, I describe what I want. It writes the code. I review, 
              iterate, and ship. The feedback loop collapsed from days to hours.
            </p>

            <p>
              Some specifics:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                The entire frontend is React + TypeScript + Tailwind, generated 
                and refined through conversation
              </li>
              <li>
                Backend runs on Supabase with Edge Functions—also built through 
                Lovable's interface
              </li>
              <li>
                Complex features like the 3D apparel blueprint system and PDF 
                export templates took hours, not weeks
              </li>
              <li>
                The codebase is clean enough that I can still edit it manually 
                when needed
              </li>
            </ul>

            <p>
              I'm not saying AI replaces developers. I'm saying it changes what 
              a single technical founder can accomplish. The ceiling moved.
            </p>

            <h2 className="text-lg font-normal mt-8 mb-4">What I Learned</h2>

            <p>
              Three things surprised me:
            </p>

            <p>
              <strong>1. Domain expertise matters more than code.</strong> The 
              hard part wasn't building features. It was knowing <em>which</em> 
              features to build. Understanding that marine operators care about 
              swell period (not just height) came from conversations with actual 
              captains. Lovable can write the code. It can't have those conversations.
            </p>

            <p>
              <strong>2. Speed creates clarity.</strong> When implementation is 
              fast, you can test ideas instead of debating them. We built three 
              different dashboard layouts in one afternoon and showed them to users. 
              The winner was obvious. Without rapid iteration, we'd still be in 
              meetings.
            </p>

            <p>
              <strong>3. The market exists.</strong> Enterprise buyers are less 
              skeptical of AI-built products than I expected. They care about 
              results, not provenance. If the platform saves them money and reduces 
              risk, they don't ask what IDE I used.
            </p>

            <h2 className="text-lg font-normal mt-8 mb-4">What's Next</h2>

            <p>
              We're running pilots with two NFL stadiums and a regional airline. 
              The goal is proving ROI: fewer weather-related delays, better crew 
              scheduling, reduced insurance claims.
            </p>

            <p>
              If you operate in a weather-sensitive industry, I'd love to talk. 
              Email is in my profile.
            </p>

            <p>
              And if you're a solo founder wondering whether AI-assisted development 
              is viable for production software: it is. The tools are ready. The 
              question is whether you have something worth building.
            </p>

            <p className="text-[#828282] mt-8 pt-4 border-t border-[#e0e0e0]">
              <a 
                href="https://chrono-strata.lovable.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#ff6600] hover:underline inline-flex items-center gap-1"
              >
                Live demo: chrono-strata.lovable.app
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </article>

        {/* HN-style comments section header */}
        <div className="mt-12 pt-8 border-t border-[#e0e0e0]">
          <div className="text-sm text-[#828282] mb-4">
            43 comments
          </div>
          
          <textarea 
            placeholder="Add a comment..."
            className="w-full p-2 border border-[#e0e0e0] text-sm font-sans resize-none h-20 bg-white"
          />
          
          <button className="mt-2 px-3 py-1 bg-[#f6f6ef] border border-[#e0e0e0] text-sm hover:bg-[#e0e0e0] transition-colors">
            add comment
          </button>

          {/* Sample comments */}
          <div className="mt-8 space-y-6 text-sm">
            <div className="pl-0">
              <div className="text-[#828282] text-xs mb-1">
                jsmith 1 hour ago
              </div>
              <p className="text-black">
                This is exactly the kind of vertical SaaS that does well. Weather 
                affects so many industries but the tooling is surprisingly primitive. 
                The aviation module sounds particularly useful—do you integrate with 
                existing flight planning software?
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>

            <div className="pl-8">
              <div className="text-[#828282] text-xs mb-1">
                lavandar 45 minutes ago
              </div>
              <p className="text-black">
                Yes, we're building integrations with ForeFlight and Garmin Pilot. 
                The API is already live for custom integrations. Most of our pilot 
                users want the data in their existing EFB rather than a separate app.
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>

            <div className="pl-0">
              <div className="text-[#828282] text-xs mb-1">
                weathernerd 52 minutes ago
              </div>
              <p className="text-black">
                What's your data source? NOAA APIs? Private weather stations? The 
                accuracy of these recommendations is only as good as the underlying 
                forecast data.
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>

            <div className="pl-8">
              <div className="text-[#828282] text-xs mb-1">
                lavandar 30 minutes ago
              </div>
              <p className="text-black">
                Multi-source aggregation: NOAA, ECMWF, and on-site sensors where 
                available. The insight isn't just in having better data—it's in 
                knowing which data matters for each specific decision. A construction 
                site cares about micro-climate. An airline cares about conditions 
                at both endpoints plus alternates.
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>

            <div className="pl-0">
              <div className="text-[#828282] text-xs mb-1">
                solo_founder 20 minutes ago
              </div>
              <p className="text-black">
                The Lovable angle is interesting. I've been skeptical of AI code 
                generation but this seems like a legitimate production app. How much 
                manual code did you end up writing?
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>

            <div className="pl-8">
              <div className="text-[#828282] text-xs mb-1">
                lavandar 15 minutes ago
              </div>
              <p className="text-black">
                Maybe 10-15% is hand-written, mostly for edge cases and 
                optimizations I wanted specific control over. The AI handles the 
                scaffolding and standard patterns. I focus on the parts that 
                require domain knowledge. It's not "no code"—it's "less code."
              </p>
              <div className="text-[#828282] text-xs mt-1">
                reply
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* HN-style footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-xs text-[#828282] border-t border-[#e0e0e0] mt-8">
        <p>
          Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact
        </p>
        <p className="mt-2">
          Search:
        </p>
      </footer>
    </div>
  );
};

export default HackerNewsPost;
