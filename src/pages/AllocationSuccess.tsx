import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Package, Shield, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const AllocationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [allocationId] = useState(() => 
    `LAV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  useEffect(() => {
    // Log successful allocation for tracking
    if (sessionId) {
      console.log('[ALLOCATION] Payment successful', { sessionId, allocationId });
    }
  }, [sessionId, allocationId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-surface-1 border border-status-approved/30 rounded-md p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-status-approved/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-status-approved" />
          </div>

          <h1 className="text-3xl md:text-4xl font-medium mb-4">Allocation Secured</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your payment has been processed and your allocation is now confirmed. 
            A serialized unit has been assigned to your account.
          </p>

          {/* Allocation Details */}
          <div className="bg-surface-2 rounded-md border border-border p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-lavender" />
              <h2 className="font-medium">Allocation Details</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Allocation ID</span>
                <span className="font-mono text-sm text-lavender">{allocationId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm text-status-approved font-medium">Secured</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Tier</span>
                <span className="text-sm">Standard Allocation</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-medium">$250.00</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-surface-2 rounded-md border border-border">
              <Shield className="w-5 h-5 text-lavender mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">Verified</div>
              <div className="text-sm font-medium">Buyer Status</div>
            </div>
            <div className="p-4 bg-surface-2 rounded-md border border-border">
              <FileText className="w-5 h-5 text-lavender mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">Generated</div>
              <div className="text-sm font-medium">Audit Trail</div>
            </div>
            <div className="p-4 bg-surface-2 rounded-md border border-border">
              <Clock className="w-5 h-5 text-lavender mx-auto mb-2" />
              <div className="text-xs text-muted-foreground">Processing</div>
              <div className="text-sm font-medium">24-48 Hours</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent with your allocation details and next steps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none group"
            >
              Return Home
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/portfolio")}
              className="border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none"
            >
              View Portfolio
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="font-medium text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Lavandar
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Secure Allocation Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllocationSuccess;
