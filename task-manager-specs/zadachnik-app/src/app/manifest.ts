import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Задачник",
    short_name: "Задачник",
    description: "Личный задачник, который помогает задачам не теряться.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#1f4f46",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
