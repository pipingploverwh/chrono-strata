import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Swords, Target, Shield, Zap, ChevronDown, ChevronUp,
  Building2, Bot, Users, Wifi, Globe, ArrowRight,
  MessageSquare, Brain, Network, Radio, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BattlePoint {
  trap: string;
  pivot: string;
  killShots: { title: string; content: string }[];
}

interface BattleCard {
  id: string;
  company: string;
  narrative: string;
  color: string;
  borderColor: string;
  icon: typeof Building2;
  battles: {
    opponent: string;
    opponentType: string;
    points: BattlePoint;
  }[];
}

const battleCards: BattleCard[] = [
  {
    id: "elise",
    company: "EliseAI",
    narrative: "We are not a chatbot. We are an Agentic Platform that runs the entire resident lifecycle.",
    color: "from-purple-500 to-indigo-600",
    borderColor: "border-purple-500/30",
    icon: Brain,
    battles: [
      {
        opponent: "Legacy PMS AI",
        opponentType: "Yardi Chat IQ, RealPage, RentCafe",
        points: {
          trap: "We already get AI included with Yardi/RealPage. Why pay extra for you?",
          pivot: "Bundled AI is just a rule-based answering machine. It waits for input. EliseAI acts.",
          killShots: [
            {
              title: "Integration Agnostic",
              content: "If you ever change your PMS or acquire a building on a different system, their AI breaks. EliseAI sits above the PMS, unifying your data regardless of the backend."
            },
            {
              title: "Depth",
              content: "Can their AI negotiate a lease renewal, audit a ledger for errors, and schedule maintenance all in the same conversation? We do."
            }
          ]
        }
      },
      {
        opponent: "Point Solutions",
        opponentType: "LeaseHawk, BetterBot",
        points: {
          trap: "BetterBot is cheaper for just handling leasing inquiries.",
          pivot: "You're solving a 2020 problem (leasing volume) while ignoring the 2026 problem (operational efficiency).",
          killShots: [
            {
              title: "The 'Messy Middle'",
              content: "Cheaper bots disappear once the lease is signed. We handle the 12 months after move-in: delinquency reminders, maintenance coordination, and renewals. That's where your real labor costs are."
            },
            {
              title: "Memory",
              content: "Point solutions don't remember context. If a resident calls about a leak, Elise knows they also haven't paid rent yet and handles both."
            }
          ]
        }
      },
      {
        opponent: "Human Touch Purists",
        opponentType: "Traditional Property Management",
        points: {
          trap: "Our brand is high-touch. We don't want robots talking to residents.",
          pivot: "Your humans are burning out answering the same 5 questions. Real 'high touch' is instant answers at 2 AM.",
          killShots: [
            {
              title: "Omnichannel Consistency",
              content: "Elise answers consistently across text, email, and voice. No human agent can be in three places at once with perfect recall."
            },
            {
              title: "Social Proof",
              content: "GoldOller calls Elise an 'employee nurturing tool' because it frees staff to actually focus on the residents, rather than data entry."
            }
          ]
        }
      }
    ]
  },
  {
    id: "monogoto",
    company: "Monogoto",
    narrative: "Connectivity should be software-defined, not a contract-defined hassle.",
    color: "from-cyan-500 to-teal-600",
    borderColor: "border-cyan-500/30",
    icon: Network,
    battles: [
      {
        opponent: "Traditional Telcos",
        opponentType: "AT&T, Verizon, Vodafone",
        points: {
          trap: "We have a global roaming contract with Vodafone. It's fine.",
          pivot: "Is it 'fine' when you need to debug a connection in a warehouse in Brazil on a Saturday?",
          killShots: [
            {
              title: "Visibility",
              content: "Telcos give you a SIM card and a bill. We give you a dashboard. You can see network events in real-time and debug via API."
            },
            {
              title: "Agility",
              content: "We are software-defined. You can spin up a private LTE network or change connectivity rules instantly without calling a rep."
            }
          ]
        }
      },
      {
        opponent: "Generic IoT SIM Resellers",
        opponentType: "Twilio, 1NCE",
        points: {
          trap: "Twilio is easy and I already use them for SMS.",
          pivot: "Great for SMS, but do they give you control over the network infrastructure?",
          killShots: [
            {
              title: "Deep Tech/Edge Cases",
              content: "For complex logistics (like Bekonix), you need deep control over latency and switching logic. We allow you to build 'smarter' logistics that standard aggregators can't support."
            },
            {
              title: "Show Don't Tell",
              content: "We don't just resell data; we provide the toolkit to troubleshoot connectivity issues yourself."
            }
          ]
        }
      }
    ]
  }
];

const BattleCardComponent = ({ card }: { card: BattleCard }) => {
  const [expandedBattle, setExpandedBattle] = useState<number | null>(0);
  const Icon = card.icon;

  return (
    <Card className={`bg-strata-charcoal/50 ${card.borderColor} border-2`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-instrument text-2xl text-strata-white">
              {card.company}
            </CardTitle>
            <p className="text-sm text-strata-silver/70 mt-1 italic">
              "{card.narrative}"
            </p>
          </div>
          <Swords className="w-6 h-6 text-strata-silver/30" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {card.battles.map((battle, index) => (
          <div 
            key={index}
            className={`rounded-lg border transition-all duration-300 ${
              expandedBattle === index 
                ? `${card.borderColor} bg-strata-charcoal/30` 
                : "border-strata-steel/20 bg-strata-charcoal/20"
            }`}
          >
            <button
              onClick={() => setExpandedBattle(expandedBattle === index ? null : index)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${expandedBattle === index ? 'bg-strata-lume' : 'bg-strata-steel/40'}`} />
                <div>
                  <span className="font-medium text-strata-white">vs. {battle.opponent}</span>
                  <span className="text-xs text-strata-silver/50 ml-2">({battle.opponentType})</span>
                </div>
              </div>
              {expandedBattle === index ? (
                <ChevronUp className="w-5 h-5 text-strata-silver/50" />
              ) : (
                <ChevronDown className="w-5 h-5 text-strata-silver/50" />
              )}
            </button>
            
            {expandedBattle === index && (
              <div className="px-4 pb-4 space-y-4">
                {/* The Trap */}
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">The Trap</span>
                  </div>
                  <p className="text-sm text-strata-silver/80 italic">
                    "{battle.points.trap}"
                  </p>
                </div>

                {/* The Pivot */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">The Pivot</span>
                  </div>
                  <p className="text-sm text-strata-white font-medium">
                    "{battle.points.pivot}"
                  </p>
                </div>

                {/* Kill Shots */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-strata-lume" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-strata-lume">Kill Shots</span>
                  </div>
                  {battle.points.killShots.map((shot, shotIndex) => (
                    <div 
                      key={shotIndex}
                      className="p-3 rounded-lg bg-strata-lume/5 border border-strata-lume/20"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-strata-lume mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-strata-lume">{shot.title}:</span>
                          <p className="text-sm text-strata-silver/80 mt-1">{shot.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const BattleCards = () => {
  return (
    <div className="min-h-screen bg-strata-black">
      {/* Header */}
      <header className="border-b border-strata-steel/20 bg-strata-charcoal/30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-instrument text-2xl text-strata-white tracking-wide">
                  Competitive Battle Cards
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-strata-silver/50">
                  Sales Intelligence • Objection Handling • Win Strategies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-strata-steel/30 text-strata-silver/60">
                Q1 2026
              </Badge>
              <Link to="/shareable-links">
                <Button variant="outline" size="sm" className="border-strata-steel/30 text-strata-silver/70 hover:text-strata-white">
                  All Links
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Reference */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Brain className="w-10 h-10 text-purple-400" />
              <div>
                <h3 className="font-medium text-strata-white">EliseAI</h3>
                <p className="text-xs text-strata-silver/60">Agentic Property Management Platform</p>
              </div>
              <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30">
                3 Battles
              </Badge>
            </CardContent>
          </Card>
          <Card className="bg-cyan-500/10 border-cyan-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Network className="w-10 h-10 text-cyan-400" />
              <div>
                <h3 className="font-medium text-strata-white">Monogoto</h3>
                <p className="text-xs text-strata-silver/60">Software-Defined IoT Connectivity</p>
              </div>
              <Badge className="ml-auto bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                2 Battles
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Battle Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {battleCards.map((card) => (
            <BattleCardComponent key={card.id} card={card} />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-strata-steel/20 pt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/ceo-letter">
            <Button variant="outline" className="gap-2 border-strata-steel/30 text-strata-silver/70 hover:text-strata-white">
              CEO Philosophy
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/hn">
            <Button variant="outline" className="gap-2 border-strata-steel/30 text-strata-silver/70 hover:text-strata-white">
              HN Essay
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/executive-summary">
            <Button className="gap-2 bg-strata-lume/20 text-strata-lume border border-strata-lume/30 hover:bg-strata-lume/30">
              Executive Summary
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BattleCards;
