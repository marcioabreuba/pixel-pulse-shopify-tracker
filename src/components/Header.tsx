
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Braces, GaugeCircle, Settings, LineChart, Bell, Store, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Header = () => {
  const { isMobile } = useMobile();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { name: "Dashboard", path: "/dashboard", icon: <GaugeCircle className="h-5 w-5" /> },
    { name: "Analytics", path: "/analytics", icon: <LineChart className="h-5 w-5" /> },
    { name: "Events", path: "/events", icon: <Zap className="h-5 w-5" /> },
    { name: "Shopify", path: "/shopify", icon: <Store className="h-5 w-5" /> },
    { name: "Developer", path: "/developer", icon: <Braces className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const NavLinks = () => (
    <>
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          onClick={() => setIsOpen(false)}
          className={`${
            location.pathname === route.path
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          } flex items-center gap-2 px-3 py-2 rounded-md transition-colors`}
        >
          {route.icon}
          <span>{route.name}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="border-b fixed top-0 left-0 right-0 bg-background z-20 h-16">
      <div className="container flex items-center justify-between h-full">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <Zap className="h-6 w-6" />
            <span>PixelTracker</span>
          </Link>
          {!isMobile && (
            <nav className="flex items-center gap-1">
              <NavLinks />
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </Button>

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-2 mt-6">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
