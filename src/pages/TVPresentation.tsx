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
      <main className="flex-1 relative overflow-hidden mb-28">
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

      {/* Footer com Controles - Fixo na parte inferior */}
      <footer className="fixed bottom-0 left-0 right-0 bg-sidebar-background/95 backdrop-blur-sm border-t border-sidebar-border px-8 py-5 shadow-hover z-50">
        <div className="flex items-center justify-between gap-8">
          {/* Nome da Página Atual - DESTAQUE */}
          <div className="flex items-center gap-4 min-w-[300px]">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <div>
              <p className="text-lg font-bold text-primary">
                {tvSlides[currentSlide].title}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                {tvSlides[currentSlide].subtitle}
              </p>
            </div>
          </div>

          {/* Indicadores de Slide */}
          <div className="flex items-center gap-2">
            {tvSlides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-12 bg-primary shadow-hover"
                    : "w-2 bg-sidebar-foreground/30 hover:bg-sidebar-foreground/50"
                }`}
                aria-label={`Ir para ${slide.title}`}
                title={slide.title}
              />
            ))}
          </div>

          {/* Controles de Navegação */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={previousSlide}
              className="bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-foreground h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="bg-primary hover:bg-primary/90 border-primary text-primary-foreground h-10 w-10 shadow-medium"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-foreground h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Info do Slide */}
          <div className="text-right min-w-[150px]">
            <p className="text-sm text-sidebar-foreground font-medium">
              {currentSlide + 1} / {tvSlides.length}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {isPlaying ? "⏵ Automático" : "⏸ Pausado"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
