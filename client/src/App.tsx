import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FileManager from "./pages/FileManager";
import PromptsLibraryV2 from "./pages/PromptsLibraryV2";
import GuideV2 from "./pages/GuideV2";
import Workspace from "./pages/Workspace";
import ResourceCenter from "./pages/ResourceCenter";
import Auth from "./pages/Auth";
import LockScreen from "./pages/LockScreen";
import AdminDashboard from "./pages/AdminDashboard";
import { useAppAuth } from "./hooks/useAppAuth";
import { useState, useEffect } from "react";
import IdeaCenter from "./pages/IdeaCenter";
import SideMenuDrawer from "./components/SideMenuDrawer";
import NotionTemplateView from "./pages/NotionTemplateView";
import PromptLibraryView from "./pages/PromptLibraryView";
import ResourcesView from "./pages/ResourcesView";

function Router() {
  const { isAuthenticated, isLoading } = useAppAuth();
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [lockScreenLoading, setLockScreenLoading] = useState(true);

  useEffect(() => {
    const savedCode = localStorage.getItem("app_activation_code");
    if (savedCode) {
      setIsAppUnlocked(true);
    }
    setLockScreenLoading(false);
  }, []);

  if (isLoading || lockScreenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAppUnlocked) {
    return <LockScreen onUnlock={() => setIsAppUnlocked(true)} />;
  }

  return (
    <>
      {isAuthenticated && <SideMenuDrawer />}
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" component={Home} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/files" component={FileManager} />
            <Route path="/prompts"
