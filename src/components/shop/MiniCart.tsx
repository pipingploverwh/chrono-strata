import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  priceLabel: string;
  image?: string;
}

interface MiniCartProps {
  isOpen: boolean;
  item: CartItem | null;
  onClose: () => void;
  onCheckout: () => void;
  autoDismissMs?: number;
}

export const MiniCart = ({
  isOpen,
  item,
  onClose,
  onCheckout,
  autoDismissMs = 3000,
}: MiniCartProps) => {
  // Auto-dismiss after specified time
  useEffect(() => {
    if (isOpen && autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoDismissMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Mini Cart Slide-in */}
          <motion.div
            className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Success header with animated progress bar */}
              <div className="relative bg-strata-lume/10 border-b border-strata-lume/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-strata-lume/20 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <Check className="w-4 h-4 text-strata-lume" />
                  </motion.div>
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">Added to Cart</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Presale allocation secured
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                {/* Auto-dismiss progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-strata-lume"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
                />
              </div>

              {/* Item preview */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-strata-orange uppercase tracking-wider mb-0.5">
                      {item.variant}
                    </p>
                    <p className="font-medium text-sm text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="font-mono text-sm text-muted-foreground mt-1">
                      {item.priceLabel}
                    </p>
                  </div>
                </div>

                {/* Presale notice */}
                <div className="mt-4 p-3 bg-strata-orange/5 border border-strata-orange/20 rounded-lg">
                  <p className="font-mono text-[10px] text-strata-orange uppercase tracking-wider mb-1">
                    Presale Allocation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your spot is reserved. Complete checkout to secure manufacturing slot.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 space-y-2">
                <motion.button
                  onClick={onCheckout}
                  className="w-full py-3 bg-strata-orange text-black font-mono font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 hover:bg-strata-orange/90 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Complete Checkout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MiniCart;
