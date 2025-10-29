import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Prediction {
  id: string;
  date: string;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);

  const generatePrediction = () => {
    setIsStreaming(true);
    setCurrentPrediction(null);

    setTimeout(() => {
      const prediction: Prediction = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ru-RU'),
        years: Math.floor(Math.random() * 60),
        months: Math.floor(Math.random() * 12),
        days: Math.floor(Math.random() * 30),
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 60),
      };

      setCurrentPrediction(prediction);
      setPredictions(prev => [prediction, ...prev]);
      setIsStreaming(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgMCwgMCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10">
        <header className="pt-12 pb-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Icon name="Skull" className="w-12 h-12 text-primary animate-pulse-glow" />
            <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-wider">
              MEMENTO MORI
            </h1>
            <Icon name="Skull" className="w-12 h-12 text-primary animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg md:text-xl italic">
            Помни о смерти... Твой час приближается
          </p>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-6 animate-fade-in">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 p-8 hover:border-primary/60 transition-all duration-300">
                <div className="text-center space-y-6">
                  <Icon name="Hourglass" className="w-20 h-20 mx-auto text-primary animate-pulse-glow" />
                  
                  <h2 className="text-3xl font-bold text-primary">
                    УЗНАЙ СВОЮ СУДЬБУ
                  </h2>

                  <p className="text-muted-foreground italic">
                    Посмей взглянуть в глаза вечности...
                  </p>

                  <Button
                    onClick={generatePrediction}
                    disabled={isStreaming}
                    className="w-full py-6 text-xl font-bold bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary/50 shadow-lg shadow-primary/50 transition-all duration-300 hover:shadow-primary/80"
                  >
                    {isStreaming ? (
                      <span className="flex items-center gap-2">
                        <Icon name="Loader2" className="animate-spin" />
                        ПРЕДСКАЗЫВАЮ...
                      </span>
                    ) : (
                      'УЗНАТЬ ДАТУ СВОЕЙ СМЕРТИ'
                    )}
                  </Button>

                  {currentPrediction && (
                    <div className="mt-8 p-6 bg-secondary/50 border-2 border-primary rounded-lg animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-4">
                        Предсказано: {currentPrediction.date}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.years}
                          </div>
                          <div className="text-xs text-muted-foreground">ЛЕТ</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.months}
                          </div>
                          <div className="text-xs text-muted-foreground">МЕСЯЦЕВ</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.days}
                          </div>
                          <div className="text-xs text-muted-foreground">ДНЕЙ</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.hours}
                          </div>
                          <div className="text-xs text-muted-foreground">ЧАСОВ</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.minutes}
                          </div>
                          <div className="text-xs text-muted-foreground">МИНУТ</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-bold text-primary">
                            {currentPrediction.seconds}
                          </div>
                          <div className="text-xs text-muted-foreground">СЕКУНД</div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm italic text-primary">
                        До твоей встречи с вечностью...
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            <section className="space-y-6 animate-fade-in">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="Scroll" className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-primary">АРХИВ СУДЕБ</h2>
                </div>

                {predictions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground italic">
                    <Icon name="Ghost" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Здесь будут записаны все предсказания...</p>
                    <p className="text-sm mt-2">Пока пусто и тихо, как в могиле</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {predictions.map((pred, index) => (
                      <div
                        key={pred.id}
                        className="p-4 bg-secondary/30 border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon name="Flame" className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-2">
                              {pred.date}
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                              <div>
                                <span className="font-bold text-primary">{pred.years}</span>
                                <span className="text-xs text-muted-foreground ml-1">л</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary">{pred.months}</span>
                                <span className="text-xs text-muted-foreground ml-1">м</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary">{pred.days}</span>
                                <span className="text-xs text-muted-foreground ml-1">д</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary">{pred.hours}</span>
                                <span className="text-xs text-muted-foreground ml-1">ч</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary">{pred.minutes}</span>
                                <span className="text-xs text-muted-foreground ml-1">мин</span>
                              </div>
                              <div>
                                <span className="font-bold text-primary">{pred.seconds}</span>
                                <span className="text-xs text-muted-foreground ml-1">сек</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </div>

          <footer className="text-center mt-16 text-muted-foreground italic">
            <p className="flex items-center justify-center gap-2">
              <Icon name="BookOpen" className="w-5 h-5" />
              Судьба неизбежна. Время неумолимо. Смерть терпелива.
              <Icon name="BookOpen" className="w-5 h-5" />
            </p>
          </footer>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 0, 0, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Index;
