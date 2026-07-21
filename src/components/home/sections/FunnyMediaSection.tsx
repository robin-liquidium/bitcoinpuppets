import FunnyMediaGallery from "../../FunnyMediaGallery";
import { funnyMedia } from "../data";

export default function FunnyMediaSection() {
  return (
    <section className="pixel-border bg-white/95 p-6 text-black">
      <div className="window-titlebar mb-4 px-3 py-2 text-sm font-bold uppercase">
        Funny Pictures and Videos
      </div>
      <p className="text-sm font-bold uppercase">
        PUPPETIZE YOUR LIFE TODAY!!!!! PUPPETIZE YOUR LIFE TODAY!!!!! PUPPETIZE
        YOUR LIFE TODAY!!!!! PUPPETIZE YOUR LIFE TODAY!!!!!
      </p>
      <FunnyMediaGallery sources={funnyMedia} />
    </section>
  );
}
