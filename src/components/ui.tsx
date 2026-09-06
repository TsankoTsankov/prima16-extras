import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "stamp" | "quiet";
}) {
  const styles = {
    primary:
      "bg-forest text-forest-ink hover:opacity-90 disabled:opacity-50 px-4 py-2.5 rounded-[10px] font-medium",
    ghost:
      "border border-line bg-card text-ink hover:bg-paper-2 px-4 py-2.5 rounded-[10px] font-medium",
    stamp: "bg-stamp text-paper hover:opacity-90 px-4 py-2.5 rounded-[10px] font-medium",
    quiet: "text-ink-soft hover:text-ink px-2 py-2 font-medium",
  }[variant];
  return <button className={`min-h-11 text-sm transition-opacity ${styles} ${className}`} {...props} />;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}

const fieldClass =
  "w-full min-h-11 rounded-[10px] border border-line bg-card px-3 text-ink outline-none focus:border-forest";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClass} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} min-h-24 py-2`} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />;
}
