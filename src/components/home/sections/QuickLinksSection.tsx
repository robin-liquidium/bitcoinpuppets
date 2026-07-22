import { Link } from "@tanstack/react-router";
import { links } from "../data";

export default function QuickLinksSection() {
  return (
    <div className="pixel-border rotate-[-0.6deg] bg-white/95 p-6 text-black">
      <div className="window-titlebar mb-4 inline-block px-4 py-2">
        Quick Links.lnk
      </div>
      <div className="grid gap-3">
        {links.map((link, i) => {
          const isInternal = link.href.startsWith("/");
          const content = (
            <>
              {link.iconUrl && (
                <div className="relative h-10 w-10 shrink-0">
                  <img
                    src={link.iconUrl}
                    alt={`${link.label} icon`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="text-base leading-tight mb-0.5">
                  {link.label}
                </div>
                <div className="text-xs font-normal normal-case leading-tight text-gray-600">
                  {link.note}
                </div>
              </div>
            </>
          );

          const className = `pixel-border-dash bg-white px-4 py-3 text-sm font-bold uppercase text-black hover:-translate-y-0.5 hover:rotate-0 transition flex items-center gap-4 ${
            i % 2 === 0 ? "rotate-[-0.7deg]" : "rotate-[0.8deg]"
          }`;

          return isInternal ? (
            <Link key={link.href} to={link.href} className={className}>
              {content}
            </Link>
          ) : (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}
