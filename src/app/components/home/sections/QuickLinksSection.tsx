import Image from "next/image";
import Link from "next/link";
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
          const LinkComponent = isInternal ? Link : "a";
          const externalProps = isInternal
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" };

          return (
            <LinkComponent
              key={link.href}
              href={link.href}
              {...externalProps}
              className="pixel-border bg-white px-4 py-3 text-sm font-bold uppercase text-black hover:-translate-y-0.5 hover:shadow-press transition flex items-center gap-4"
            >
              {link.iconUrl && (
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src={link.iconUrl}
                    alt={`${link.label} icon`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized
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
            </LinkComponent>
          );
        })}
      </div>
    </div>
  );
}
