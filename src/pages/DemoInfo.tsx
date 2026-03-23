import { PublicLayout } from '@/components/PublicLayout';

export default function DemoInfoPage() {
  return (
    <PublicLayout>
      <div className="container py-16 max-w-2xl space-y-8">
        <h1 className="font-display font-bold text-2xl">Demo Credentials</h1>
        <p className="text-sm text-muted-foreground">Use these accounts to test the platform. All accounts use auto-confirmed email.</p>

        <div className="space-y-4">
          {[
            { role: 'Admin', email: 'admin@nmo-demo.com', password: 'demo1234', note: 'Full platform control' },
            { role: 'Shop Owner 1', email: 'owner1@nmo-demo.com', password: 'demo1234', note: 'Kalamboli Bite House owner' },
            { role: 'Shop Owner 2', email: 'owner2@nmo-demo.com', password: 'demo1234', note: 'Little Steps Preschool owner' },
            { role: 'User 1', email: 'user1@nmo-demo.com', password: 'demo1234', note: 'Regular user' },
            { role: 'User 2', email: 'user2@nmo-demo.com', password: 'demo1234', note: 'Regular user' },
          ].map((a) => (
            <div key={a.email} className="bg-card border rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{a.role}</span>
                <span className="text-xs text-muted-foreground">{a.note}</span>
              </div>
              <p className="text-sm font-mono">Email: {a.email}</p>
              <p className="text-sm font-mono">Password: {a.password}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-orange-light/30 border border-brand-orange/20 rounded-xl p-4">
          <p className="text-sm"><strong>Note:</strong> Demo accounts must be created by signing up with the emails above. The seed data references these accounts by email after they are created.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
