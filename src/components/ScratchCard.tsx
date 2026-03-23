import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ScratchCardProps {
  offer: any;
  onReveal: () => void;
  disabled?: boolean;
  alreadyRevealed?: boolean;
}

export function ScratchCard({ offer, onReveal, disabled, alreadyRevealed }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(alreadyRevealed || false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Create scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    gradient.addColorStop(0, 'hsl(220, 20%, 30%)');
    gradient.addColorStop(1, 'hsl(220, 25%, 20%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Add text
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
    ctx.font = '500 14px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here to reveal', canvas.offsetWidth / 2, canvas.offsetHeight / 2 + 5);
  }, []);

  useEffect(() => {
    if (!disabled && !alreadyRevealed) {
      initCanvas();
    }
  }, [initCanvas, disabled, alreadyRevealed]);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const pct = (transparent / (imageData.data.length / 4)) * 100;
    setScratchPercent(pct);

    if (pct > 50 && !revealed) {
      setRevealed(true);
      onReveal();
    }
  };

  if (alreadyRevealed) {
    return (
      <div className="rounded-xl bg-teal-light p-6 text-center space-y-2 animate-scratch-reveal">
        <Check className="w-8 h-8 text-primary mx-auto" />
        <p className="font-display font-bold text-lg text-primary">{offer.discount_text || 'Offer Revealed!'}</p>
        {offer.coupon_code && <p className="font-mono text-sm bg-card px-3 py-1 rounded inline-block">{offer.coupon_code}</p>}
        <p className="text-xs text-muted-foreground">Already claimed</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ touchAction: 'none' }}>
      {/* Reward underneath */}
      <div className="bg-teal-light p-6 text-center space-y-2">
        <p className="font-display font-bold text-lg text-primary">{offer.discount_text || 'Special Offer!'}</p>
        {offer.coupon_code && <p className="font-mono text-sm bg-card px-3 py-1 rounded inline-block">{offer.coupon_code}</p>}
        {offer.redemption_instructions && <p className="text-xs text-muted-foreground">{offer.redemption_instructions}</p>}
      </div>

      {/* Scratch layer */}
      {!revealed && !disabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer"
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={(e) => isScratching && scratch(e)}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={(e) => scratch(e)}
        />
      )}
    </div>
  );
}
