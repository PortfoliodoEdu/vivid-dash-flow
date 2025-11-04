import { Play, Pause, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TVSlide } from "@/components/TVSlide";
import { useAutoPlay } from "@/hooks/useAutoPlay";
import { tvSlides } from "@/data/tvSlides";
import logoGrupoFN from "@/assets/logo-grupofn.png";

export default function TVPresentation() {
  const { currentSlide, isPlaying, nextSlide, previousSlide, goToSlide, togglePlay } = useAutoPlay({
    totalSlides: tvSlides.length,
    interval: 12000, // 12 segundos por slide
  });

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Header com Logo */}
      <header className="bg-sidebar-background border-b border-sidebar-border px-8 py-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-4">
          <img src={logoGrupoFN} alt="Grupo FN" className="h-12" />
          <div className="border-l border-sidebar-border pl-4">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Dashboard Executivo</h2>
            <p className="text-sm text-sidebar-foreground/70">Apresentação Automática</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          <span className="text-sm text-sidebar-foreground">Modo TV</span>
        </div>
      </header>

      {/* Slides Container */}
      <main className="flex-1 relative overflow-hidden">
        {tvSlides.map((slide, index) => (
          <TVSlide
            key={slide.id}
            title={slide.title}
            subtitle={slide.subtitle}
            isActive={currentSlide === index}
          >
            {slide.content}
          </TVSlide>
        ))}
      </main>

      {/* Footer com Controles */}
      <footer className="bg-sidebar-background border-t border-sidebar-border px-8 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          {/* Indicadores de Slide */}
          <div className="flex items-center gap-2">
            {tvSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-sidebar-foreground/30 hover:bg-sidebar-foreground/50"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Controles de Navegação */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={previousSlide}
              className="bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="bg-primary hover:bg-primary/90 border-primary text-primary-foreground"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Info do Slide */}
          <div className="text-right">
            <p className="text-sm text-sidebar-foreground font-medium">
              Slide {currentSlide + 1} de {tvSlides.length}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {isPlaying ? "Rodando automaticamente" : "Pausado"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
