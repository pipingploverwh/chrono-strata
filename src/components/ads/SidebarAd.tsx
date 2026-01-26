import GoogleAdSense from "./GoogleAdSense";

interface SidebarAdProps {
  adSlot: string;
  className?: string;
}

const SidebarAd = ({ adSlot, className = "" }: SidebarAdProps) => {
  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-4">
        <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2">
          Advertisement
        </div>
        <GoogleAdSense
          adSlot={adSlot}
          adFormat="vertical"
          className="bg-surface-2/30 rounded-lg border border-border/30 overflow-hidden"
          style={{ minHeight: "600px", width: "300px" }}
        />
      </div>
    </div>
  );
};

export default SidebarAd;
