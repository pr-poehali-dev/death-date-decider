import { useState, useEffect, useRef } from 'react';
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
  timestamp: number;
}

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<{years: number, months: number, days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!currentPrediction) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = currentPrediction.timestamp - now;

      if (remaining <= 0) {
        setCountdown({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);
      const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
      const months = Math.floor((totalSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
      const days = Math.floor((totalSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({ years, months, days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPrediction]);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playDramaticSequence = () => {
    playSound(65.41, 0.3, 'sawtooth');
    setTimeout(() => playSound(73.42, 0.3, 'sawtooth'), 200);
    setTimeout(() => playSound(82.41, 0.3, 'sawtooth'), 400);
    setTimeout(() => playSound(98, 0.5, 'sawtooth'), 600);
  };

  const playRevealSound = () => {
    playSound(196, 0.1, 'triangle');
    setTimeout(() => playSound(220, 0.1, 'triangle'), 100);
    setTimeout(() => playSound(246.94, 0.1, 'triangle'), 200);
    setTimeout(() => playSound(293.66, 0.8, 'sine'), 300);
  };

  const downloadPredictionImage = (prediction: Prediction) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1200;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 80px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEMENTO MORI', canvas.width / 2, 150);

    ctx.fillStyle = '#666666';
    ctx.font = 'italic 36px Crimson Text, serif';
    ctx.fillText('Твоя судьба предрешена', canvas.width / 2, 220);

    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 300, canvas.width - 200, 600);

    ctx.fillStyle = 'rgba(139, 0, 0, 0.1)';
    ctx.fillRect(100, 300, canvas.width - 200, 600);

    const timeData = [
      { value: prediction.years, label: 'ЛЕТ' },
      { value: prediction.months, label: 'МЕСЯЦЕВ' },
      { value: prediction.days, label: 'ДНЕЙ' },
      { value: prediction.hours, label: 'ЧАСОВ' },
      { value: prediction.minutes, label: 'МИНУТ' },
      { value: prediction.seconds, label: 'СЕКУНД' },
    ];

    let yPos = 420;
    timeData.forEach((item, index) => {
      if (index % 2 === 0 && index > 0) yPos += 180;
      const xPos = index % 2 === 0 ? 350 : 850;

      ctx.fillStyle = '#8B0000';
      ctx.font = 'bold 100px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), xPos, yPos);

      ctx.fillStyle = '#666666';
      ctx.font = '32px Crimson Text, serif';
      ctx.fillText(item.label, xPos, yPos + 50);
    });

    ctx.fillStyle = '#8B0000';
    ctx.font = 'italic 32px Crimson Text, serif';
    ctx.textAlign = 'center';
    ctx.fillText('До твоей встречи с вечностью...', canvas.width / 2, 980);

    ctx.fillStyle = '#666666';
    ctx.font = '24px Crimson Text, serif';
    ctx.fillText(prediction.date, canvas.width / 2, 1050);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memento-mori-${prediction.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const generatePrediction = () => {
    setIsStreaming(true);
    setCurrentPrediction(null);
    
    playDramaticSequence();
    
    setTimeout(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }, 1500);
    
    setTimeout(() => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);
    }, 2000);

    setTimeout(() => {
      const totalSeconds = Math.floor(Math.random() * 60 * 365 * 24 * 60 * 60) + 365 * 24 * 60 * 60;
      const endTime = Date.now() + totalSeconds * 1000;
      
      const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
      const months = Math.floor((totalSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
      const days = Math.floor((totalSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      const prediction: Prediction = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ru-RU'),
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        timestamp: endTime,
      };

      playRevealSound();
      setCurrentPrediction(prediction);
      setPredictions(prev => [prediction, ...prev]);
      setIsStreaming(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-foreground relative overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
      {isFlashing && (
        <div className="fixed inset-0 bg-primary/40 z-50 animate-flash pointer-events-none" />
      )}
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

                  {currentPrediction && countdown && (
                    <div className="mt-8 p-6 bg-secondary/50 border-2 border-primary rounded-lg animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-4">
                        Предсказано: {currentPrediction.date}
                      </p>
                      <div className="mb-6">
                        <p className="text-xs text-muted-foreground mb-2 text-center">
                          ⏳ Обратный отсчёт до встречи с вечностью
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-center p-4 bg-black/30 rounded border border-primary/20">
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.years}
                            </div>
                            <div className="text-xs text-muted-foreground">ЛЕТ</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.months}
                            </div>
                            <div className="text-xs text-muted-foreground">МЕС</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.days}
                            </div>
                            <div className="text-xs text-muted-foreground">ДНЕЙ</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.hours}
                            </div>
                            <div className="text-xs text-muted-foreground">ЧАС</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.minutes}
                            </div>
                            <div className="text-xs text-muted-foreground">МИН</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-primary tabular-nums animate-pulse">
                              {countdown.seconds}
                            </div>
                            <div className="text-xs text-muted-foreground">СЕК</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm italic text-primary text-center">
                        До твоей встречи с вечностью...
                      </p>
                      <Button
                        onClick={() => downloadPredictionImage(currentPrediction)}
                        variant="outline"
                        className="w-full mt-4 border-primary/50 hover:bg-primary/10"
                      >
                        <Icon name="Download" className="w-4 h-4 mr-2" />
                        Скачать предсказание
                      </Button>
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
                          <div className="flex-1 min-w-0 flex-grow">
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
                          <Button
                            onClick={() => downloadPredictionImage(pred)}
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 hover:bg-primary/10"
                          >
                            <Icon name="Download" className="w-4 h-4" />
                          </Button>
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