import { useTheme, ThemeName } from "../contexts/ThemeContext";

const themes: { name: ThemeName; label: string; swatch: string }[] = [
  { name: "brown", label: "Warm Brown", swatch: "bg-amber-800" },
  { name: "lavender", label: "Lavender", swatch: "bg-purple-400" },
  { name: "sage", label: "Sage Green", swatch: "bg-emerald-600" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          title={t.label}
          className={`w-6 h-6 rounded-full border-2 transition-all ${t.swatch} ${
            theme === t.name ? "border-white scale-125 shadow-md" : "border-transparent opacity-70"
          }`}
        />
      ))}
    </div>
  );
}
