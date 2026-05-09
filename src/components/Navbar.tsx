import { Link, useLocation } from "wouter";
import { FlaskConical, LayoutDashboard, BookOpen, Mic, Beaker, BarChart3, Dumbbell, GraduationCap, BookMarked, TrendingUp } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cbt", label: "CBT", icon: BookOpen },
  { href: "/viva", label: "Viva", icon: Mic },
  { href: "/practical", label: "Practical", icon: Beaker },
  { href: "/drill", label: "Drill", icon: Dumbbell },
  { href: "/syllabus", label: "Syllabus", icon: GraduationCap },
  { href: "/notes", label: "Notes", icon: BookMarked },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/results", label: "Results", icon: BarChart3 },
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="navbar sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0 navbar-brand">
          <FlaskConical className="w-6 h-6" />
          <span className="hidden sm:inline">PRO EXAM 1</span>
        </Link>

        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto hide-scrollbar">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                location === href ? "nav-link-active" : ""
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
