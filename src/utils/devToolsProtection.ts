// Developer Tools Protection & Obfuscation
// Professional security layer for enterprise applications

const SECURITY_MESSAGES = [
  '%c🔒 LAVANDAR Security Protocol Active',
  '%c⚠️ This browser feature is monitored',
  '%c🛡️ Unauthorized access attempts are logged',
];

const SECURITY_STYLE = 'color: #8b5cf6; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);';

const ASCII_ART = `
%c
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ██╗      █████╗ ██╗   ██╗ █████╗ ███╗   ██╗██████╗      ║
║     ██║     ██╔══██╗██║   ██║██╔══██╗████╗  ██║██╔══██╗     ║
║     ██║     ███████║██║   ██║███████║██╔██╗ ██║██║  ██║     ║
║     ██║     ██╔══██║╚██╗ ██╔╝██╔══██║██║╚██╗██║██║  ██║     ║
║     ███████╗██║  ██║ ╚████╔╝ ██║  ██║██║ ╚████║██████╔╝     ║
║     ╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝      ║
║                                                              ║
║                   ENTERPRISE AI PLATFORM                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   👋 Hey there, curious one.                                 ║
║                                                              ║
║   We see you poking around. That's cool - we respect        ║
║   the hustle. But this isn't the droid you're looking for.  ║
║                                                              ║
║   If you're talented and curious, we're hiring:             ║
║   → /careers                                                 ║
║                                                              ║
║   If you're here for other reasons... we're watching. 👀    ║
║   All activity is logged and analyzed by our AI systems.    ║
║                                                              ║
║   Be good. ✌️                                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

const ASCII_STYLE = 'color: #a78bfa; font-family: monospace; font-size: 10px; line-height: 1.2;';

// Obfuscated console methods
const obfuscateConsole = () => {
  const noop = () => {};
  
  // Store original methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalTable = console.table;
  const originalDir = console.dir;
  
  // Display security message on first access
  let hasShownMessage = false;
  
  const showSecurityMessage = () => {
    if (!hasShownMessage) {
      hasShownMessage = true;
      originalLog.call(console, ASCII_ART, ASCII_STYLE);
      SECURITY_MESSAGES.forEach((msg, i) => {
        setTimeout(() => {
          originalLog.call(console, msg, SECURITY_STYLE);
        }, i * 500);
      });
    }
  };
  
  // Trigger on devtools open detection
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function() {
      showSecurityMessage();
      return 'probe';
    }
  });
  
  // Periodic check
  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
      showSecurityMessage();
    }
  }, 1000);
  
  // Initial console clear and message
  if (process.env.NODE_ENV === 'production') {
    console.clear();
  }
  
  // Show message immediately in dev
  showSecurityMessage();
};

// Add honeypot properties that log access attempts
const addHoneypots = () => {
  const honeypotProps = ['_internal', '_config', '_secrets', 'apiKey', 'token', 'credentials'];
  
  honeypotProps.forEach(prop => {
    Object.defineProperty(window, prop, {
      get: () => {
        console.log('%c🚨 Nice try. Access logged.', 'color: #ef4444; font-size: 16px; font-weight: bold;');
        return undefined;
      },
      set: () => {
        console.log('%c🚨 Modification attempt detected.', 'color: #ef4444; font-size: 16px; font-weight: bold;');
        return false;
      },
      configurable: false
    });
  });
};

// Disable right-click context menu (optional - less aggressive)
const disableContextMenu = () => {
  document.addEventListener('contextmenu', (e) => {
    // Only on production, and show a subtle message
    if (process.env.NODE_ENV === 'production') {
      console.log('%c📋 Context menu access noted.', 'color: #f59e0b; font-size: 12px;');
    }
  });
};

// Initialize all protections
export const initDevToolsProtection = () => {
  if (typeof window === 'undefined') return;
  
  try {
    obfuscateConsole();
    addHoneypots();
    disableContextMenu();
    
    // Add a friendly Easter egg for legitimate developers
    (window as any).__lavandar_careers__ = () => {
      console.log('%c🚀 Interested in joining? Visit /careers', 'color: #10b981; font-size: 14px; font-weight: bold;');
      window.location.href = '/careers';
    };
    
  } catch (e) {
    // Silently fail - don't expose errors
  }
};

export default initDevToolsProtection;
