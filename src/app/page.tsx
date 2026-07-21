import type { Metadata } from "next";
import DoodleHomepage from "./components/home/DoodleHomepage";

export const metadata: Metadata = {
  title: "Community Hub",
  description:
    "A community-led hub for the Bitcoin Puppets Ordinals collection. Good vibes, world peace, and pure chaos.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <DoodleHomepage />;
}
