/** Always read latest CMS data (Netlify Blobs) — not build-time services.json. */
export const dynamic = "force-dynamic";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
