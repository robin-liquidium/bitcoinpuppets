import { faq } from "../data";

export default function FaqSection() {
  return (
    <section className="pixel-border bg-white/90 p-6 text-black">
      <div className="window-titlebar mb-4 px-3 py-2 text-sm font-bold uppercase">
        FAQ
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faq.map((item) => (
          <div
            key={item.question}
            className="pixel-border bg-white px-4 py-3 text-black"
          >
            <h3 className="text-sm font-bold uppercase">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
