import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // For demo purposes, show dashboard directly
  // In production, this would be handled by actual auth state
  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <AuthForm onSuccess={() => setIsAuthenticated(true)} />;
};

export default Index;
