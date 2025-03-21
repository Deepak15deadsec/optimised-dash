import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import { Navigate } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  }
  // Add more dashboard routes here
]; 