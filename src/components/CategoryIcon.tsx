import { UtensilsCrossed, Scissors, Dumbbell, GraduationCap, Shirt, Smartphone, HeartPulse, ShoppingCart, Wrench, Gamepad2, Sparkles, Store } from 'lucide-react';

const iconMap: Record<string, any> = {
  UtensilsCrossed, Scissors, Dumbbell, GraduationCap, Shirt, Smartphone,
  HeartPulse, ShoppingCart, Wrench, Gamepad2, Sparkles, Store,
};

export function CategoryIcon({ name, className = 'w-5 h-5' }: { name: string | null; className?: string }) {
  const Icon = iconMap[name || ''] || Store;
  return <Icon className={className} />;
}
