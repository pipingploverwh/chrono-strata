import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EventCommandOverlay from "@/components/strata/EventCommandOverlay";

type EventType = "club" | "product" | "protocol";

const EventPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  // Determine initial event from URL params
  const getInitialEvent = (): EventType => {
    const id = searchParams.get("id");
    if (id?.includes("club") || id?.includes("tokyo")) return "club";
    if (id?.includes("shell") || id?.includes("product")) return "product";
    if (id?.includes("protocol") || id?.includes("century") || id?.includes("bond")) return "protocol";
    
    const type = searchParams.get("type");
    if (type === "club" || type === "product" || type === "protocol") return type;
    
    return "club"; // Default to club launch
  };

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back or to home after a brief delay
    setTimeout(() => navigate("/"), 300);
  };

  return (
    <div className="min-h-screen bg-strata-black">
      <EventCommandOverlay 
        isOpen={isOpen} 
        onClose={handleClose}
        initialEvent={getInitialEvent()}
      />
    </div>
  );
};

export default EventPage;
