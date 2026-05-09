import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ExamProvider } from "./contexts/ExamContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CBT from "./pages/CBT";
import Viva from "./pages/Viva";
import Practical from "./pages/Practical";
import Results from "./pages/Results";
import Drill from "./pages/Drill";
import Syllabus from "./pages/Syllabus";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-2xl font-bold">404 — Page Not Found</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}

function Router() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/cbt" component={CBT} />
          <Route path="/viva" component={Viva} />
          <Route path="/practical" component={Practical} />
          <Route path="/drill" component={Drill} />
          <Route path="/syllabus" component={Syllabus} />
          <Route path="/notes" component={Notes} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/results" component={Results} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ExamProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ExamProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
