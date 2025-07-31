import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { HelmetProvider } from "react-helmet-async";

// Import error handler to initialize global handlers
import "@/lib/errorHandler";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Listings = lazy(() => import("./pages/Listings"));
const ListingDetails = lazy(() => import("./pages/ListingDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminBusinesses = lazy(() => import("./pages/admin/AdminBusinesses"));
const AdminSubscriptions = lazy(() => import("./pages/admin/AdminSubscriptions"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminModeration = lazy(() => import("./pages/admin/AdminModeration"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));
const AdminPremium = lazy(() => import("./pages/admin/AdminPremium"));
const AdminSystem = lazy(() => import("./pages/admin/AdminSystem"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminImport = lazy(() => import("./pages/admin/AdminImport"));
const Auth = lazy(() => import("./pages/Auth"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const DashboardAnalytics = lazy(() => import("./pages/DashboardAnalytics"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const SEOPage = lazy(() => import("./pages/SEOPage"));
const Districts = lazy(() => import("./pages/Districts"));
const PropertyZones = lazy(() => import("./pages/PropertyZones"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="p-6">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span>Loading...</span>
      </div>
    </Card>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listing/:slug" element={<ListingDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/listings/new" element={<CreateListing />} />
                <Route path="/dashboard/listings/edit/:id" element={<EditListing />} />
                <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
                <Route path="/dashboard/settings" element={<DashboardSettings />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/businesses" element={<AdminBusinesses />} />
                <Route path="/admin/import" element={<AdminImport />} />
                <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/moderation" element={<AdminModeration />} />
                <Route path="/admin/revenue" element={<AdminRevenue />} />
                <Route path="/admin/premium" element={<AdminPremium />} />
                <Route path="/admin/system" element={<AdminSystem />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                
                {/* Static Pages */}
                <Route path="/districts" element={<Districts />} />
                <Route path="/property-zones" element={<PropertyZones />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* SEO Routes - Dynamic programmatic pages */}
                <Route path="/seo/*" element={<SEOPage />} />
                <Route path="/category/*" element={<SEOPage />} />
                <Route path="/features/*" element={<SEOPage />} />
                <Route path="/price/*" element={<SEOPage />} />
                <Route path="/district/*" element={<SEOPage />} />
                <Route path="/property-zone/*" element={<SEOPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
