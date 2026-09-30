import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.5"],
  // Vecchi URL del sito (template studio legale) reindirizzati alle nuove pagine
  async redirects() {
    return [
      { source: "/aree-di-attivita", destination: "/servizi", permanent: true },
      { source: "/casi-di-successo", destination: "/servizi", permanent: true },
      { source: "/team", destination: "/professionisti", permanent: true },
      { source: "/team/:slug", destination: "/professionisti/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
