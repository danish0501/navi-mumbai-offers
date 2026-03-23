import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface SpinWheelProps {
  outcomes: any[];
  onSpin: (result: any) => void;
  disabled?: boolean;
  previousResult?: any;
}

const COLORS = [
  'hsl(174, 72%, 40%)', 'hsl(270, 30%, 55%)', 'hsl(25, 95%, 55%)',
  'hsl(85, 50%, 50%)', 'hsl(174, 72%, 30%)', 'hsl(270, 30%, 45%)',
  'hsl(25, 95%, 45%)', 'hsl(85, 50%, 40%)',
];

export function SpinWheel({ outcomes, onSpin, disabled, previousResult }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(previousResult || null);
  const [rotation, setRotation] = useState(0);

  const segmentAngle = 360 / outcomes.length;

  const handleSpin = () => {
    if (spinning || disabled) return;

    // Pick weighted random outcome
    const totalProb = outcomes.reduce((s: number, o: any) => s + Number(o.probability), 0);
    let rand = Math.random() * totalProb;
    let selectedIdx = 0;
    for (let i = 0; i < outcomes.length; i++) {
      rand -= Number(outcomes[i].probability);
      if (rand <= 0) { selectedIdx = i; break; }
    }

    const selected = outcomes[selectedIdx];

    // Calculate final rotation to land on the selected segment
    const targetAngle = 360 - (selectedIdx * segmentAngle + segmentAngle / 2);
    const spins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + spins * 360 + targetAngle;

    setSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(selected);
      onSpin(selected);
    }, 4200);
  };

  if (previousResult) {
    return (
      <div className="text-center space-y-3 p-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${previousResult.is_winning ? 'bg-teal-light text-primary' : 'bg-muted text-muted-foreground'}`}>
          {previousResult.is_winning ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="font-semibold">{previousResult.label}</span>
        </div>
        <p className="text-xs text-muted-foreground">You already spun this offer</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wheel */}
      <div className="relative w-64 h-64">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-foreground" />
        </div>

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {outcomes.map((outcome: any, i: number) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            const x1 = 100 + 95 * Math.cos(startRad);
            const y1 = 100 + 95 * Math.sin(startRad);
            const x2 = 100 + 95 * Math.cos(endRad);
            const y2 = 100 + 95 * Math.sin(endRad);

            const largeArc = segmentAngle > 180 ? 1 : 0;

            const midAngle = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180;
            const textX = 100 + 60 * Math.cos(midAngle);
            const textY = 100 + 60 * Math.sin(midAngle);
            const textRotation = (startAngle + endAngle) / 2;

            return (
              <g key={i}>
                <path
                  d={`M100,100 L${x1},${y1} A95,95 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={COLORS[i % COLORS.length]}
                  stroke="white"
                  strokeWidth="1"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                >
                  {outcome.label.length > 12 ? outcome.label.slice(0, 12) + '…' : outcome.label}
                </text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="15" fill="white" />
          <circle cx="100" cy="100" r="12" fill="hsl(220, 25%, 10%)" />
        </svg>
      </div>

      {result && !spinning ? (
        <div className={`text-center space-y-2 animate-scratch-reveal`}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result.is_winning ? 'bg-teal-light text-primary' : 'bg-muted text-muted-foreground'}`}>
            {result.is_winning ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-semibold">{result.label}</span>
          </div>
          {result.value && <p className="text-sm font-medium">{result.value}</p>}
        </div>
      ) : (
        <Button
          onClick={handleSpin}
          disabled={spinning || disabled}
          size="lg"
          className="px-8 active:scale-[0.97]"
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </Button>
      )}
    </div>
  );
}
