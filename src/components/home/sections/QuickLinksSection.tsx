import { Link } from "@tanstack/react-router";
import { links } from "../data";

export default function QuickLinksSection() {
  return (
    <div className="pixel-border bg-white/90 p-6 text-black">
      <div className="window-titlebar mb-4 px-3 py-2 text-sm font-bold uppercase">
        Quick Links.lnk
      </div>
      <div className="grid gap-3">
        {links.map((link) => {
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

          const className =
            "pixel-border bg-white px-4 py-3 text-sm font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition flex items-center gap-4";

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
