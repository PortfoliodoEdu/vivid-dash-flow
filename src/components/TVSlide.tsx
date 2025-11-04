import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface TVSlideProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isActive: boolean;
}

export const TVSlide = ({ title, subtitle, children, isActive }: TVSlideProps) => {
  return (
    <div
      className={`w-full h-full transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
      }`}
    >
      <div className="h-full flex flex-col p-8 bg-background">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-foreground mb-2">{title}</h1>
          {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
