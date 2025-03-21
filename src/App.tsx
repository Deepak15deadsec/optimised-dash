import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppInitializer } from "@/components/app/AppInitializer";
import { AppRouter } from "@/components/app/AppRouter";

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppInitializer>
        <Toaster />
        <Sonner />
        <AppRouter />
      </AppInitializer>
    </BrowserRouter>
  </AppProviders>
);

export default App;
