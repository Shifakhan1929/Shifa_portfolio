import { createFileRoute } from "@tanstack/react-router";
import { ShifaOS } from "@/components/os/ShifaOS";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shifa OS — Flutter & Web Developer Portfolio" },
      { name: "description", content: "Interactive desktop-style portfolio of Shifa, a Software Engineering student building Flutter and web apps." },
      { property: "og:title", content: "Shifa OS — Flutter & Web Developer Portfolio" },
      { property: "og:description", content: "Explore Shifa's projects, skills and journal in a retro-modern desktop workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShifaOS,
});
