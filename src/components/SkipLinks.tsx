interface SkipLinksProps {
  links?: { id: string; label: string }[];
}

const SkipLinks = ({ 
  links = [
    { id: "main-content", label: "Skip to main content" },
    { id: "main-navigation", label: "Skip to navigation" },
  ]
}: SkipLinksProps) => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Skip links" className="fixed top-0 left-0 z-[100] p-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="block px-4 py-2 bg-strata-orange text-strata-black font-semibold rounded focus:outline-none focus:ring-2 focus:ring-strata-lume mb-1"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SkipLinks;
