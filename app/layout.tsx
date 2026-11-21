import "nextra-theme-docs/style.css";
import "./docs.css";
import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { DocsSearch } from "../components/search";
import { searchIndex } from "../components/search-index";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.keycat.net"),
  title: { default: "Keycat Docs", template: "%s · Keycat Docs" },
  description: "Accept card and stablecoin payments, settled in USDC on Base to an account only you control.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const logo = (
  <span className="docs-logo">
    <img src="/icon.svg" alt="" width={22} height={22} />
    <b>Keycat</b>
    <span>Docs</span>
  </span>
);

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {/* systemBlue (#007AFF), the accent every Keycat surface uses. */}
      <Head color={{ hue: 211, saturation: 100, lightness: { light: 50, dark: 58 } }} />
      <body>
        <Layout
          navbar={<Navbar logo={logo} logoLink="/">
            <a className="docs-navlink" href="https://app.keycat.net">Dashboard</a>
          </Navbar>}
          footer={<Footer><span>{`© ${new Date().getFullYear()} Keycat · `}<a href="https://keycat.net">keycat.net</a></span></Footer>}
          pageMap={await getPageMap()}
          search={<DocsSearch index={await searchIndex()} />}
          // The public repository is a published copy of these pages, not where
          // they are edited, so an edit link would invite changes nobody merges.
          editLink={null}
          feedback={{ content: null }}
          docsRepositoryBase="https://github.com/keycatnet/docs"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
          copyPageButton={false}
          // A first visit is light, as on every other Keycat site; a saved choice wins.
          nextThemes={{ defaultTheme: "light" }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
