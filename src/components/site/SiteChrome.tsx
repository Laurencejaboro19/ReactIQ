import { Link } from "@tanstack/react-router";
import { FlaskConical, Home, Menu, Tag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "How it works", to: "/", hash: "how" },
  { label: "Reactions", to: "/reactions" },
  { label: "Pricing", to: "/pricing" },
  { label: "Demo", to: "/reactions/sn2" },
] as const;

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {links.map((l) =>
        l.to === "/reactions/sn2" ? (
          <Link key={l.label} to="/reactions/$slug" params={{ slug: "sn2" }} onClick={onClick} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {l.label}
          </Link>
        ) : (
          <Link key={l.label} to={l.to} {...("hash" in l ? { hash: l.hash } : {})} {...(onClick ? { onClick } : {})} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {l.label}
          </Link>
        ),
      )}
    </>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Main">
        <Link to="/" aria-label="ReactIQ home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden shadow-glow sm:inline-flex">
            <Link to="/reactions">Get started free</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6 bg-surface pt-12">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <div className="flex flex-col gap-5 text-lg">
                <NavLinks />
              </div>
              <Button asChild>
                <Link to="/reactions">Get started free</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">Reaction mechanism, simplified.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <NavLinks />
        </div>
        <p className="text-sm text-muted-foreground">© 2026 ReactIQ</p>
      </div>
    </footer>
  );
}

export function MobileTabBar() {
  const cls = "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground";
  const active = { className: "text-primary" };
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur-xl md:hidden" aria-label="App">
      <div className="flex pb-[env(safe-area-inset-bottom)]">
        <Link to="/reactions" className={cls} activeProps={active} activeOptions={{ exact: true }}>
          <FlaskConical className="h-5 w-5" aria-hidden /> Reactions
        </Link>
        <Link to="/" className={cls} activeProps={active} activeOptions={{ exact: true }}>
          <Home className="h-5 w-5" aria-hidden /> Home
        </Link>
        <Link to="/pricing" className={cls} activeProps={active}>
          <Tag className="h-5 w-5" aria-hidden /> Pricing
        </Link>
      </div>
    </nav>
  );
}
