import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerSignup from "./pages/OwnerSignup";
import Offers from "./pages/Offers";
import Shops from "./pages/Shops";
import NodePage from "./pages/NodePage";
import CategoryPage from "./pages/CategoryPage";
import ShopDetail from "./pages/ShopDetail";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import DemoInfo from "./pages/DemoInfo";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/owner-signup" element={<OwnerSignup />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/node/:slug" element={<NodePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/shop/:slug" element={<ShopDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo-info" element={<DemoInfo />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
