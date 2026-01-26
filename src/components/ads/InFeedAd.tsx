import GoogleAdSense from "./GoogleAdSense";

interface InFeedAdProps {
  adSlot: string;
  className?: string;
}

const InFeedAd = ({ adSlot, className = "" }: InFeedAdProps) => {
  return (
    <div className={`my-6 ${className}`}>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 text-center">
        Sponsored
      </div>
      <GoogleAdSense
        adSlot={adSlot}
        adFormat="fluid"
        className="bg-surface-2/50 rounded-lg border border-border/50 overflow-hidden"
        style={{ minHeight: "250px" }}
      />
    </div>
  );
};

export default InFeedAd;
