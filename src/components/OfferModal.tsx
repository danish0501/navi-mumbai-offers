import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScratchCard } from '@/components/ScratchCard';
import { SpinWheel } from '@/components/SpinWheel';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { useSpinOutcomes, useOfferInteractions } from '@/hooks/use-offers';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface OfferModalProps {
  offer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfferModal({ offer, open, onOpenChange }: OfferModalProps) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: spinOutcomes } = useSpinOutcomes(offer?.id);
  const { data: interactions } = useOfferInteractions(user?.id);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  const existingInteraction = interactions?.find(
    (i: any) => i.offer_id === offer?.id
  );

  const hasInteracted = !!existingInteraction;

  const recordInteraction = async (type: string, result: any = {}) => {
    if (!user || !offer) return;
    await supabase.from('offer_interactions').insert({
      user_id: user.id,
      offer_id: offer.id,
      shop_id: offer.shop_id,
      interaction_type: type as any,
      result,
    });
    qc.invalidateQueries({ queryKey: ['offer-interactions'] });
  };

  const handleScratchReveal = async () => {
    if (hasInteracted && !offer.allow_repeat) return;
    await recordInteraction('scratch', { revealed: true, discount: offer.discount_text });
    await recordInteraction('claim', { discount: offer.discount_text, code: offer.coupon_code });
    setClaimed(true);
    toast.success('Offer revealed and claimed!');
  };

  const handleSpinResult = async (result: any) => {
    if (hasInteracted && !offer.allow_repeat) return;
    await recordInteraction('spin', { outcome: result.label, is_winning: result.is_winning });
    if (result.is_winning) {
      await recordInteraction('claim', { outcome: result.label, value: result.value });
      setClaimed(true);
      toast.success('You won! Offer claimed!');
    } else {
      toast('Better luck next time!');
    }
  };

  const handleDirectClaim = async () => {
    if (hasInteracted && !offer.allow_repeat) return;
    await recordInteraction('unlock', { code: offer.coupon_code });
    await recordInteraction('claim', { code: offer.coupon_code, discount: offer.discount_text });
    setClaimed(true);
    toast.success('Offer unlocked!');
  };

  const copyCode = () => {
    if (offer?.coupon_code) {
      navigator.clipboard.writeText(offer.coupon_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!offer) return null;

  const spinPrevResult = existingInteraction?.interaction_type === 'spin' ? existingInteraction.result : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{offer.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {offer.description && (
            <p className="text-sm text-muted-foreground">{offer.description}</p>
          )}

          {/* Scratch Card */}
          {offer.offer_type === 'scratch' && (
            <ScratchCard
              offer={offer}
              onReveal={handleScratchReveal}
              disabled={hasInteracted && !offer.allow_repeat}
              alreadyRevealed={hasInteracted}
            />
          )}

          {/* Spin Wheel */}
          {offer.offer_type === 'spin' && spinOutcomes && spinOutcomes.length > 0 && (
            <SpinWheel
              outcomes={spinOutcomes}
              onSpin={handleSpinResult}
              disabled={hasInteracted && !offer.allow_repeat}
              previousResult={spinPrevResult ? (spinPrevResult as any) : undefined}
            />
          )}

          {/* Direct Coupon */}
          {offer.offer_type === 'direct' && (
            <div className="space-y-3">
              {hasInteracted || claimed ? (
                <div className="bg-teal-light rounded-xl p-6 text-center space-y-3 animate-scratch-reveal">
                  <Check className="w-8 h-8 text-primary mx-auto" />
                  <p className="font-display font-bold text-lg text-primary">{offer.discount_text}</p>
                  {offer.coupon_code && (
                    <button
                      onClick={copyCode}
                      className="inline-flex items-center gap-2 font-mono text-sm bg-card px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {offer.coupon_code}
                      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                  {offer.redemption_instructions && (
                    <p className="text-xs text-muted-foreground">{offer.redemption_instructions}</p>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-teal-light mx-auto flex items-center justify-center">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold">{offer.discount_text}</p>
                  <Button onClick={handleDirectClaim} className="w-full active:scale-[0.97]">
                    Unlock This Offer
                  </Button>
                </div>
              )}
            </div>
          )}

          {offer.terms && (
            <div className="text-xs text-muted-foreground border-t pt-3">
              <p className="font-medium mb-1">Terms & Conditions</p>
              <p>{offer.terms}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
