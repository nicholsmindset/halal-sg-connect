import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-accent">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="text-xl font-bold text-primary">HalalHub SG</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  to="/listings"
                  className="px-4 py-2 font-medium text-foreground hover:text-primary"
                >
                  Directory
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/listings?category=restaurants"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          🍽️ Restaurants
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Halal dining experiences
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/listings?category=cafes"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          ☕ Cafes & Bakeries
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Coffee and pastries
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/pricing"
                  className="px-4 py-2 font-medium text-foreground hover:text-primary"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 font-medium text-foreground hover:text-primary"
                >
                  For Vendors
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar - Hidden on mobile */}
          <div className="mx-4 hidden max-w-md flex-1 items-center space-x-2 lg:flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input placeholder="Search businesses..." className="pl-10" />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">Sign Up</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col space-y-4">
                  <Link
                    to="/listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Directory
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/districts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Districts
                  </Link>
                  <Link
                    to="/property-zones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Property Zones
                  </Link>
                  <Link
                    to="/best"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Best Of Lists
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    For Vendors
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                  <div className="border-t pt-4">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Login / Sign Up</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input placeholder="Search businesses..." className="pl-10" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
