import { FileText, ExternalLink, Building2, Scale, Globe, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FederalResearchContext = () => {
  const federalSources = [
    {
      category: "Executive Orders",
      icon: Scale,
      sources: [
        {
          name: "EO 13817",
          title: "A Federal Strategy to Ensure Secure and Reliable Supplies of Critical Minerals",
          date: "Dec 2017",
          url: "https://www.federalregister.gov/d/2017-28156",
          relevance: "Establishes critical minerals as national security priority",
        },
        {
          name: "EO 14017",
          title: "America's Supply Chains",
          date: "Feb 2021",
          url: "https://www.whitehouse.gov/briefing-room/presidential-actions/2021/02/24/executive-order-on-americas-supply-chains/",
          relevance: "100-day review of critical supply chain vulnerabilities",
        },
      ],
    },
    {
      category: "USGS Research",
      icon: Building2,
      sources: [
        {
          name: "Critical Minerals List 2022",
          title: "Final List of Critical Minerals",
          date: "Feb 2022",
          url: "https://www.usgs.gov/news/national-news-release/us-geological-survey-releases-2022-list-critical-minerals",
          relevance: "50 minerals designated critical to US economy/security",
        },
        {
          name: "USGS Seabed Assessment",
          title: "Marine Mineral Resources of the US EEZ",
          date: "2023",
          url: "https://www.usgs.gov/",
          relevance: "Mapping of polymetallic nodule deposits in Pacific",
        },
      ],
    },
    {
      category: "DOE & IEA Reports",
      icon: DollarSign,
      sources: [
        {
          name: "IEA Critical Minerals 2023",
          title: "Critical Minerals Market Review",
          date: "Jul 2023",
          url: "https://www.iea.org/reports/critical-minerals-market-review-2023",
          relevance: "Global supply chain analysis for clean energy transition",
        },
        {
          name: "DOE Supply Chain Blueprint",
          title: "National Blueprint for Lithium Batteries",
          date: "Jun 2021",
          url: "https://www.energy.gov/",
          relevance: "Battery supply chain independence strategy",
        },
      ],
    },
    {
      category: "International Treaties",
      icon: Globe,
      sources: [
        {
          name: "UNCLOS Part XI",
          title: "UN Convention on the Law of the Sea - Deep Seabed Mining",
          date: "1982/1994",
          url: "https://www.un.org/depts/los/convention_agreements/texts/unclos/unclos_e.pdf",
          relevance: "International framework for seabed exploitation",
        },
        {
          name: "ISA Mining Code",
          title: "International Seabed Authority Regulations",
          date: "Ongoing",
          url: "https://www.isa.org.jm/",
          relevance: "Exploitation regulations under development",
        },
      ],
    },
    {
      category: "Congressional & Budget",
      icon: Building2,
      sources: [
        {
          name: "NOAA FY2026 Budget",
          title: "NOAA Budget Request Analysis",
          date: "2025",
          url: "https://www.noaa.gov/",
          relevance: "Biological monitoring program defunding allocation",
        },
        {
          name: "Project 2025",
          title: "Mandate for Leadership - NOAA Chapter",
          date: "2023",
          url: "https://2025.gov/",
          relevance: "Proposed restructuring of NOAA climate/bio programs",
        },
      ],
    },
  ];

  const keyStatistics = [
    { label: "Critical Minerals Designated", value: "50", source: "USGS 2022" },
    { label: "Cobalt Import Dependency", value: "76%", source: "DOE 2023" },
    { label: "Rare Earth Import Dependency", value: "100%", source: "USGS 2023" },
    { label: "Pacific Nodule Deposits", value: "$16T", source: "ISA Estimate" },
    { label: "EEZ Mining Potential", value: "3.4M km²", source: "NOAA" },
    { label: "Jobs at Risk (Bio Programs)", value: "2,400", source: "NOAA FY26" },
  ];

  return (
    <div className="bg-surface-1 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-lavender/10 to-surface-1 border-b border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-lavender" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-lavender">
            Federal Research Context
          </span>
        </div>
        <h3 className="text-sm font-medium text-foreground">
          Federally Funded Data Sources & Policy Framework
        </h3>
      </div>

      {/* Key Statistics Grid */}
      <div className="p-4 border-b border-border">
        <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Key Federal Statistics
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {keyStatistics.map((stat, i) => (
            <div key={i} className="bg-surface-2 border border-border rounded p-2">
              <div className="text-lg font-mono font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-[9px] text-muted-foreground">{stat.label}</div>
              <div className="text-[8px] font-mono text-lavender mt-1">{stat.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Categories */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {federalSources.map((category, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              <category.icon className="w-3 h-3" />
              {category.category}
            </div>
            <div className="space-y-2">
              {category.sources.map((source, j) => (
                <a
                  key={j}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-surface-2 border border-border rounded hover:border-lavender/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[8px] font-mono shrink-0">
                          {source.name}
                        </Badge>
                        <span className="text-[8px] text-muted-foreground">{source.date}</span>
                      </div>
                      <div className="text-xs text-foreground truncate">{source.title}</div>
                      <div className="text-[9px] text-muted-foreground mt-1">
                        {source.relevance}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FederalResearchContext;
