import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="relative overflow-hidden bg-background/80 border border-border/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[32px] p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass shimmer accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lavender-100 via-lavender-600 to-lavender-100 animate-glass-shimmer bg-[length:200%_auto]" />

            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted/50 transition-colors ease-lavender-soft z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="relative z-10">
              {/* Badge */}
              <motion.span
                className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest uppercase bg-lavender-100 text-lavender-600 rounded-full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                New Acquisition
              </motion.span>

              {/* Title */}
              <motion.h2
                className="text-2xl font-light tracking-tight text-foreground mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Begin {productName}?
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-muted-foreground text-sm leading-relaxed mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Confirm your selection to initiate the fabrication protocol and biometric alignment.
              </motion.p>

              {/* Selection summary card */}
              <motion.div
                className="p-4 bg-muted/50 rounded-2xl border border-border/50 mb-8 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      {terrainName}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1 truncate">
                      {productName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getProductSubtitle()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {getPaymentLabel()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={onConfirm}
                  className="group relative flex items-center justify-center w-full py-4 bg-foreground text-background rounded-2xl font-medium transition-all ease-lavender-soft hover:opacity-90 active:scale-[0.98] overflow-hidden"
                >
                  <span className="relative z-10">Add to Ritual</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-lavender-soft" />
                </button>

                <button
                  onClick={onCancel}
                  className="w-full py-2 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors ease-lavender-soft"
                >
                  Return to Shop
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
