import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Navbar, Footer, MobileTabBar } from "../components/site/SiteChrome";
import { Toaster } from "../components/ui/sonner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// Classic-script (ES5) watchdog: if the app fails to start on an old or unusual
// phone browser, show the real error instead of a silently dead page.
const WATCHDOG = `(function(){var w=window;var shown=false;function show(msg){if(shown)return;shown=true;var d=document.createElement('div');d.setAttribute('role','alert');d.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#ff6405;color:#111;font:14px/1.4 system-ui,sans-serif;padding:12px 16px;text-align:center';d.innerHTML='ReactIQ could not start in this browser. <b>Tap to reload</b>, or open the link in Chrome or Safari.<br><span style="opacity:.75;font-size:12px">'+String(msg).replace(/</g,'&lt;').slice(0,160)+'</span>';d.onclick=function(){location.reload()};(document.body||document.documentElement).appendChild(d)}w.addEventListener('error',function(e){if(!w.__riqReady){show(e.message||'script error')}});w.addEventListener('unhandledrejection',function(e){if(!w.__riqReady){show((e.reason&&e.reason.message)||'load error')}});setTimeout(function(){if(!w.__riqReady){show('the app did not start within 15 seconds (slow network or unsupported browser)')}},15000)})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "ReactIQ — Reaction mechanism, simplified." },
      { name: "description", content: "Learn reaction mechanisms in 2D, 3D and with an AI tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:site_name", content: "ReactIQ" },
      { name: "theme-color", content: "#111214" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
    scripts: [{ children: WATCHDOG }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        <noscript>
          <div style={{ background: "#ff6405", color: "#111", padding: "10px 16px", fontSize: 14, textAlign: "center" }}>
            ReactIQ needs JavaScript for the animations and the tutor. Please enable it, or open this page in Chrome or Safari.
          </div>
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    (window as Window & { __riqReady?: boolean }).__riqReady = true;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
