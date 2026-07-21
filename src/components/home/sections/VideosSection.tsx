export function OpiumOrigins() {
  return (
    <div className="pixel-border bg-white/90 p-4 text-black">
      <div className="window-titlebar mb-3 px-3 py-2 text-sm font-bold uppercase">
        Opium Origins.mp4
      </div>
      <video
        className="pixel-border w-full bg-black relative z-[60]"
        src="/videos/opiumorigins.mp4"
        controls
        playsInline
        preload="metadata"
      />
    </div>
  );
}

export function PuppetInterview() {
  return (
    <div className="pixel-border bg-white/90 p-4 text-black">
      <div className="window-titlebar mb-3 px-3 py-2 text-sm font-bold uppercase">
        Puppet Interview.mp4
      </div>
      <video
        className="pixel-border w-full bg-black relative z-[60]"
        src="/videos/interview.mp4"
        controls
        playsInline
        preload="metadata"
      />
    </div>
  );
}

export default function VideosSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2 items-start -mt-6">
      <OpiumOrigins />
      <PuppetInterview />
    </section>
  );
}
