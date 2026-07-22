export default function CommunityChecklist() {
  const items = [
    "1. Say bj when you arrive.",
    "2. Post art, memes, and offbeat ideas.",
    "3. Protect the culture.",
    "4. Send it to zero.",
    "5. World peace above all. 🌍☮️",
  ];

  return (
    <div className="pixel-border rotate-[-1deg] bg-note-green/95 p-6 text-black">
      <div className="window-titlebar mb-4 inline-block px-4 py-2">
        Community Checklist.doc
      </div>
      <ul className="grid gap-3 text-sm font-bold uppercase">
        {items.map((item, i) => (
          <li
            key={item}
            className={`pixel-border-dash bg-white/90 px-4 py-3 text-black transition hover:rotate-0 ${
              i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1.1deg]"
            }`}
          >
            <span className="highlighter">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
