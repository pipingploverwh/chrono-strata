import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, ArrowLeft, Shield, Lock, CheckCircle, 
  CreditCard, Package, Clock, FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AllocationCheckout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const allocationDetails = {
    tier: "Standard Allocation",
    price: "$250.00",
    priceId: "price_1Sr9DFPxsKYUGDko0Fzh40uO",
    features: [
      "Verified buyer status",
      "Serialized unit tracking",
      "Full audit trail",
      "Priority processing",
      "Secure payment processing",
    ],
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-allocation-checkout', {
        body: { allocationTier: 'standard' }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast.success("Checkout opened in new tab");
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs tracking-widest uppercase">Back</span>
          </button>
          <div className="font-medium text-sm tracking-[0.3em] uppercase text-foreground">
            Lavandar
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/10 border border-lavender/20 rounded-full mb-6">
            <Lock className="w-4 h-4 text-lavender" />
            <span className="text-xs tracking-widest uppercase text-lavender">Secure Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Complete Your Allocation</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Finalize your verified allocation with secure payment processing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-surface-1 border border-border rounded-md p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-lavender" />
              <h2 className="text-lg font-medium">Order Summary</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Allocation Tier</span>
                <span className="font-medium">{allocationDetails.tier}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Processing</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>24-48 hours</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-medium text-lavender">{allocationDetails.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              {allocationDetails.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-status-approved shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-surface-1 border border-border rounded-md p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-lavender" />
              <h2 className="text-lg font-medium">Payment</h2>
            </div>

            <div className="mb-8">
              <p className="text-muted-foreground text-sm mb-6">
                You'll be redirected to Stripe's secure checkout to complete your payment. 
                All transactions are encrypted and PCI compliant.
              </p>

              <div className="p-4 bg-surface-2 rounded-md border border-border mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <FileCheck className="w-5 h-5 text-lavender" />
                  <span className="font-medium text-sm">What happens next?</span>
                </div>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-lavender font-medium">1.</span>
                    Complete secure payment via Stripe
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender font-medium">2.</span>
                    Receive confirmation and allocation ID
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender font-medium">3.</span>
                    Unit serialized and assigned to your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender font-medium">4.</span>
                    Full audit trail generated
                  </li>
                </ol>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase py-6 rounded-none group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllocationCheckout;
