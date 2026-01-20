import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Github, Twitter, Linkedin, Globe, Mail, ArrowUpRight } from 'lucide-react';

interface ThermalFooterProps {
  variant?: 'light' | 'dark';
}

const ThermalFooter = ({ variant = 'dark' }: ThermalFooterProps) => {
  const currentYear = new Date().getFullYear();

  const mutedColor = variant === 'light' ? 'text-zinc-500' : 'text-white/30';
  const accentMuted = variant === 'light' ? 'text-zinc-400' : 'text-white/20';
  const hoverColor = variant === 'light' ? 'hover:text-zinc-700' : 'hover:text-white/60';
  const borderColor = variant === 'light' ? 'border-zinc-200' : 'border-white/[0.03]';

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Contact' },
  ];

  const footerLinks = [
    { label: 'THERMAL', path: '/thermal' },
    { label: 'SLASH', path: '/thermal-slash' },
    { label: 'VISUALIZER', path: '/thermal-visualizer' },
  ];

  return (
    <motion.footer 
      className={`relative py-12 px-6 sm:px-8 ${borderColor} border-t`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ 
        background: 'linear-gradient(180deg, transparent 0%, hsl(var(--kuma-glass-2)) 100%)',
      }}
    >
      {/* Kuma horizontal strata lines */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--kuma-slat)) 30%, hsl(var(--kuma-slat)) 70%, transparent 100%)',
          opacity: 0.2,
        }}
      />

      {/* Precision ruled surface pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: 'linear-gradient(135deg, transparent 49.5%, hsl(var(--precision-line)) 49.5%, hsl(var(--precision-line)) 50.5%, transparent 50.5%)',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Top section: Logo + Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Logo with geometric accent */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Precision geometric prefix */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-orange-500/30" />
              <motion.div 
                className="w-1.5 h-1.5 rotate-45 border border-orange-500/40"
                initial={{ scale: 0, rotate: 0 }}
                whileInView={{ scale: 1, rotate: 45 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              />
            </div>

            <Link to="/thermal" className="flex items-center gap-3 group">
              <Flame 
                className="w-5 h-5 transition-colors duration-300" 
                style={{ color: 'hsl(24 100% 50%)' }}
              />
              <div>
                <div className={`text-[10px] tracking-[0.3em] font-light ${mutedColor} group-hover:text-orange-400/60 transition-colors`}>
                  THERMAL RESONANCE
                </div>
                <div className={`text-[8px] tracking-[0.2em] ${accentMuted}`}>
                  PSYCHOACOUSTIC ENGINE
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Navigation links with Precision separators */}
          <motion.nav 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {footerLinks.map((link, index) => (
              <div key={link.path} className="flex items-center">
                {index > 0 && (
                  <div className="flex items-center gap-1 mx-2">
                    <div className="w-2 h-px bg-white/10" />
                    <div className="w-0.5 h-0.5 rotate-45 border border-white/10" />
                    <div className="w-2 h-px bg-white/10" />
                  </div>
                )}
                <Link
                  to={link.path}
                  className={`text-[9px] tracking-[0.2em] font-light ${mutedColor} ${hoverColor} transition-colors`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </motion.nav>
        </div>

        {/* Precision geometric separator line */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/5" />
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rotate-45 border border-white/10" />
            <div className="w-8 h-px bg-white/10" />
            <motion.div 
              className="w-2 h-2 rotate-45 border border-orange-500/30"
              animate={{ rotate: [45, 225, 45] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-8 h-px bg-white/10" />
            <div className="w-1 h-1 rotate-45 border border-white/10" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/5" />
        </motion.div>

        {/* Middle section: Description + Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          {/* Bose-inspired tagline */}
          <motion.div 
            className="max-w-md"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className={`text-[10px] leading-relaxed ${mutedColor} font-light`}>
              Translating psychoacoustic energy density and spectral flux into real-time 
              thermal visualizations. Experience music through the physics of heat—where 
              every frequency finds its temperature.
            </p>
          </motion.div>

          {/* Social links with Kuma glass treatment */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={`group relative w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Kuma glass background */}
                <div 
                  className="absolute inset-0 border border-white/[0.05] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ 
                    background: 'hsl(var(--kuma-glass-1))',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                <social.icon className={`w-4 h-4 relative z-10 ${mutedColor} group-hover:text-orange-400/80 transition-colors`} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom section: Copyright + Technical specs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.03]">
          {/* Copyright with geometric prefix */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="w-3 h-px bg-white/15" />
            <span className={`text-[8px] tracking-[0.2em] ${accentMuted} font-mono`}>
              © {currentYear} THERMAL RESONANCE
            </span>
          </motion.div>

          {/* Technical specifications */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className={`text-[7px] tracking-[0.15em] ${accentMuted} font-mono`}>
              44.1kHz • 24-BIT • STEREO
            </span>
            <div className="w-0.5 h-0.5 rounded-full bg-orange-500/40" />
            <span className={`text-[7px] tracking-[0.15em] ${accentMuted} font-mono`}>
              SPATIAL AUDIO ENGINE v2.0
            </span>
            <div className="w-3 h-px bg-white/15" />
          </motion.div>
        </div>
      </div>

      {/* Kuma bottom strata accent */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(24 100% 50% / 0.3) 50%, transparent 100%)',
        }}
      />
    </motion.footer>
  );
};

export default ThermalFooter;
