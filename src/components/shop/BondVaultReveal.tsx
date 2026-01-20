import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Shield, Fingerprint } from "lucide-react";
import { useState, useEffect } from "react";

interface BondVaultRevealProps {
  isHovered: boolean;
  isSelected: boolean;
  price: number;
}

/**
 * Cinematic "vault unlocking" effect for the STRATA Bond selection.
 * Creates a security clearance animation with dramatic price reveal.
 */
export const BondVaultReveal = ({ isHovered, isSelected, price }: BondVaultRevealProps) => {
  const [unlockPhase, setUnlockPhase] = useState<'locked' | 'scanning' | 'unlocking' | 'unlocked'>('locked');
  const [priceDigits, setPriceDigits] = useState<string[]>([]);

  useEffect(() => {
    if (isHovered || isSelected) {
      // Start unlock sequence
      setUnlockPhase('scanning');
      const timer1 = setTimeout(() => setUnlockPhase('unlocking'), 300);
      const timer2 = setTimeout(() => setUnlockPhase('unlocked'), 600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setUnlockPhase('locked');
    }
  }, [isHovered, isSelected]);

  // Scramble price digits effect
  useEffect(() => {
    const priceStr = price.toLocaleString();
    const targetDigits = priceStr.split('');
    
    if (unlockPhase === 'unlocking' || unlockPhase === 'unlocked') {
      // Slot machine effect for digits
      let iteration = 0;
      const interval = setInterval(() => {
        setPriceDigits(
          targetDigits.map((char, index) => {
            if (index < iteration || char === ',' || char === '$') {
              return char;
            }
            return Math.floor(Math.random() * 10).toString();
          })
        );
        iteration += 0.5;
        if (iteration >= targetDigits.length) {
          clearInterval(interval);
          setPriceDigits(targetDigits);
        }
      }, 40);
      return () => clearInterval(interval);
    } else {
      setPriceDigits(targetDigits.map((c, i) => c === ',' ? ',' : '▓'));
    }
  }, [unlockPhase, price]);

  return (
    <div className="relative">
      {/* Security clearance scanning effect */}
      <AnimatePresence>
        {unlockPhase === 'scanning' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scanning line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-strata-lume to-transparent"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
            {/* Grid pattern flash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '8px 8px',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock icon transition */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full pr-3">
        <AnimatePresence mode="wait">
          {unlockPhase === 'locked' && (
            <motion.div
              key="locked"
              initial={{ scale: 1 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="w-4 h-4 text-strata-silver/40" />
            </motion.div>
          )}
          {unlockPhase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Fingerprint className="w-4 h-4 text-strata-lume animate-pulse" />
            </motion.div>
          )}
          {(unlockPhase === 'unlocking' || unlockPhase === 'unlocked') && (
            <motion.div
              key="unlocked"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Unlock className="w-4 h-4 text-strata-lume" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price display with scramble effect */}
      <div className="relative overflow-hidden">
        <motion.div
          className="font-mono text-3xl"
          animate={{
            color: unlockPhase === 'unlocked' ? 'hsl(var(--strata-white))' : 'hsl(var(--strata-silver))',
          }}
        >
          <span className="text-strata-lume">$</span>
          {priceDigits.map((digit, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{
                y: unlockPhase === 'unlocking' ? [0, -2, 2, 0] : 0,
                opacity: 1,
              }}
              transition={{ duration: 0.1, delay: i * 0.02 }}
              className={digit === '▓' ? 'text-strata-silver/30' : ''}
            >
              {digit}
            </motion.span>
          ))}
        </motion.div>

        {/* Vault door reveal effect */}
        <AnimatePresence>
          {unlockPhase === 'unlocking' && (
            <>
              <motion.div
                className="absolute top-0 left-0 right-1/2 bottom-0 bg-strata-graphite"
                initial={{ x: 0 }}
                animate={{ x: '-100%' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-0 left-1/2 right-0 bottom-0 bg-strata-graphite"
                initial={{ x: 0 }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Security clearance badge */}
      <AnimatePresence>
        {unlockPhase === 'unlocked' && (
          <motion.div
            className="flex items-center gap-1.5 mt-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-3 h-3 text-strata-lume" />
            <span className="font-mono text-[9px] text-strata-lume uppercase tracking-widest">
              CLEARANCE GRANTED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BondVaultReveal;
