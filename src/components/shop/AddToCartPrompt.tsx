import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AddToCartPromptProps {
  isOpen: boolean;
  productName: string;
  terrainName: string;
  paymentMode: 'annual' | 'bond' | 'tactical';
  price: number;
  depositPrice?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AddToCartPrompt = ({
  isOpen,
  productName,
  terrainName,
  paymentMode,
  price,
  depositPrice,
  onConfirm,
  onCancel,
}: AddToCartPromptProps) => {
  const { t } = useLanguage();

  const getPaymentLabel = () => {
    switch (paymentMode) {
      case 'tactical':
        return `$${depositPrice?.toLocaleString()} deposit • $${price.toLocaleString()} total`;
      case 'bond':
        return `$${price.toLocaleString()} one-time`;
      default:
        return `$${price}/year`;
    }
  };

  const getProductSubtitle = () => {
    switch (paymentMode) {
      case 'tactical':
        return 'Physical Shell — Manufacturing Allocation';
      case 'bond':
        return 'Generational Prepaid Access — 100 Years';
      default:
        return 'Century Protocol — Annual Ownership';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-strata-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal content */}
          <motion.div
            className="relative bg-background rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-8">
              {/* Icon */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 bg-lavender-100 rounded-full mx-auto flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 15 }}
                >
                  <ShoppingBag className="w-8 h-8 text-lavender-600" />
                </motion.div>
              </div>

              {/* Title */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-xl font-semibold text-foreground">
                  Add to Collection?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ready to begin the fabrication protocol for your STRATA Shell?
                </p>
              </motion.div>

              {/* Selection summary */}
              <motion.div
                className="mt-6 p-4 bg-muted rounded-xl border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {terrainName}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {productName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getProductSubtitle()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {getPaymentLabel()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <button
                  onClick={onConfirm}
                  className="w-full bg-strata-black text-strata-white py-4 rounded-xl font-medium hover:bg-strata-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-strata-cyan focus:ring-offset-2"
                >
                  Secure & Proceed
                </button>
                <button
                  onClick={onCancel}
                  className="w-full text-muted-foreground py-2 text-sm hover:text-foreground transition-colors"
                >
                  Keep Browsing
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartPrompt;
