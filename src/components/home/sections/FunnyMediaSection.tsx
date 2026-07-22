import { Doodle, SCRIBBLE_CIRCLE } from "@/components/MarginDoodles";

import FunnyMediaGallery from "../../FunnyMediaGallery";
import { funnyMedia } from "../data";

export default function FunnyMediaSection() {
  return (
    <section className="pixel-border taped rotate-[-0.4deg] bg-note-pink/95 p-6 text-black relative">
      <Doodle
        caption="certified fresh"
        path={SCRIBBLE_CIRCLE}
        viewBox="0 0 84 62"
        className="-right-32 top-4 rotate-3"
        captionClassName="-rotate-3"
        svgClassName="-scale-x-100"
      />
      <div className="window-titlebar mb-4 inline-block px-4 py-2">
        Funny Pictures and Videos
      </div>
      <p className="font-marker text-sm uppercase animate-wiggle inline-block">
        PUPPETIZE YOUR LIFE TODAY!!!!! PUPPETIZE YOUR LIFE TODAY!!!!! PUPPETIZE
        YOUR LIFE TODAY!!!!! PUPPETIZE YOUR LIFE TODAY!!!!!
      </p>
      <FunnyMediaGallery sources={funnyMedia} />
    </section>
  );
}
