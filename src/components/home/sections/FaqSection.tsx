import { ARROW_CURVE, Doodle } from "@/components/MarginDoodles";
import { faq } from "../data";

export default function FaqSection() {
  return (
    <section className="pixel-border-alt rotate-[0.5deg] bg-white/95 p-6 text-black relative">
      <Doodle
        caption="good lore down there"
        path={ARROW_CURVE}
        viewBox="0 0 100 70"
        className="-left-32 -bottom-20"
        captionClassName="rotate-[-4deg]"
        svgClassName="rotate-[120deg]"
      />
      <div className="window-titlebar mb-4 inline-block px-4 py-2">
        FAQ (frequently avoided questions)
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faq.map((item, i) => (
          <div
            key={item.question}
            className={`pixel-border-dash bg-note-yellow/80 px-4 py-3 text-black ${
              i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.7deg]"
            }`}
          >
            <h3 className="text-sm font-bold uppercase">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
