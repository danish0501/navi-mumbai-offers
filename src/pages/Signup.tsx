import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [errors, setErrors] = useState<{name?: string; mobile?: string; email?: string; password?: string; confirmPassword?: string}>({});
  const navigate = useNavigate();

  const isStep1Valid = 
    /^[A-Za-z\s]{2,50}$/.test(name) &&
    /^\\d{10}$/.test(mobile) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^(?=.*[A-Za-z])(?=.*\\d).{8,}$/.test(password) &&
    password === confirmPassword && password.length > 0;

  const isStep2Valid = emailOtp.length === 6 && mobileOtp.length === 6;

  const validateForm = () => {
    const newErrors: {name?: string; mobile?: string; email?: string; password?: string; confirmPassword?: string} = {};
    
    if (!/^[A-Za-z\s]{2,50}$/.test(name)) {
      newErrors.name = 'Name must be 2-50 characters, letters only.';
    }
    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      newErrors.password = 'At least 8 characters, 1 letter, and 1 number required.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Simulate sending OTPs
    toast.success('OTPs sent to your email and mobile number');
    setStep(2);
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length !== 6 || mobileOtp.length !== 6) {
      toast.error('Please enter valid 6-digit OTPs');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: 'user', phone: mobile } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Account verified and created! Welcome to Navi Mumbai Offers.');
    navigate('/');
  };

  return (
    <PublicLayout>
      <div className="container max-w-md py-12 max-[426px]:py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-3xl">Create Account</h1>
          <p className="text-base text-muted-foreground">Sign up to unlock scratch cards, spin wheels, and local coupons</p>
        </div>
        {step === 1 ? (
        <form onSubmit={handleInitialSubmit} className="space-y-4 bg-card p-6 rounded-2xl border" noValidate>
          <div className="flex bg-muted p-1 rounded-lg mb-6">
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium rounded-md transition-colors bg-background shadow-sm text-foreground"
            >
              Customer
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/owner-signup')}
            >
              Business Owner
            </button>
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors({...errors, name: undefined}); }} className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''} required />
            {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" type="tel" value={mobile} onChange={e => { setMobile(e.target.value.replace(/\\D/g, '')); if (errors.mobile) setErrors({...errors, mobile: undefined}); }} className={errors.mobile ? 'border-destructive focus-visible:ring-destructive' : ''} maxLength={10} required />
            {errors.mobile && <p className="text-xs text-destructive font-medium">{errors.mobile}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: undefined}); }} className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''} required />
            {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors({...errors, password: undefined}); }} className={errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'} required />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium">{errors.password}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined}); }} className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'} required />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive font-medium">{errors.confirmPassword}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={!isStep1Valid}>Continue to Verify</Button>
        </form>
        ) : (
        <form onSubmit={handleFinalSignup} className="space-y-6 bg-card p-6 rounded-2xl border">
          <div className="space-y-3">
            <Label>Email OTP</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-center text-muted-foreground">Sent to {email}</p>
          </div>
          
          <div className="space-y-3">
            <Label>Mobile OTP</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={mobileOtp} onChange={setMobileOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-center text-muted-foreground">Sent to +91 {mobile}</p>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" className="w-full" disabled={!isStep2Valid || loading}>{loading ? 'Verifying & Creating...' : 'Verify & Sign Up'}</Button>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={loading}>Back</Button>
          </div>
        </form>
        )}
        <div className="text-center text-base text-muted-foreground space-y-4 pt-4 border-t">
          <p>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></p>
          <div className="flex items-center justify-center gap-2">
            <span>Are you a business?</span>
            <Link to="/owner-signup" className="text-primary font-medium hover:underline">Owner Signup</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
