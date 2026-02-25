export const metadata = {
  title: "印刷用 | ふたりナビ",
};

export default function PrintLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white print:bg-white">{children}</main>
  );
}
