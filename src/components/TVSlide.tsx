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
      <div className="h-full flex flex-col px-8 pt-5 bg-background">
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
          {subtitle && <p className="text-base text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex-1 overflow-hidden pb-28">
          {children}
        </div>
      </div>
    </div>
  );
};
