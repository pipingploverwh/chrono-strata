import { useNavigate } from "react-router-dom";
import { XCircle, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AllocationCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Canceled Icon */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-10 h-10 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-medium mb-4">Payment Canceled</h1>
        <p className="text-muted-foreground mb-8">
          Your allocation payment was not completed. No charges have been made to your account.
        </p>

        <div className="bg-surface-1 border border-border rounded-md p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-lavender" />
            <h2 className="font-medium">What happened?</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            You may have closed the checkout window or clicked cancel. Your allocation application 
            is still on file and you can complete payment at any time.
          </p>
          <p className="text-sm text-muted-foreground">
            If you experienced technical issues, please try again or contact support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/allocation-checkout")}
            className="bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none group"
          >
            Try Again
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Return Home
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12">
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

export default AllocationCanceled;
