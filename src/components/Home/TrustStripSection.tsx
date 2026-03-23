import { Shield, MapPin, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Businesses",
    description: "Every store manually vetted for authenticity.",
    stats: "500+ Stores",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "18 Local Nodes",
    description: "Full coverage across every major zone.",
    stats: "Vashi to Panvel",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Direct Redemption",
    description: "Instant activation with zero platform fees.",
    stats: "Direct to Store",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function TrustStripSection() {
  return (
    <section className="relative py-12 bg-background/50 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-400/10 rounded-full blur-[80px] -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px] -z-10 animate-pulse [animation-delay:1s]" />

      <div className="container px-4">
        {/* Floating Glassmorphic Container */}
        <div className="relative p-8 md:p-10 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">

          {/* Subtle inner gloss highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative z-10">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group flex flex-col sm:flex-row md:flex-col lg:flex-row items-center sm:items-start text-center sm:text-left gap-5"
              >
                {/* Advanced Interactive Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-sm border border-white/50`}>
                    <div className={item.color}>
                      {item.icon}
                    </div>
                  </div>
                  {/* Subtle icon shadow/glow */}
                  <div className={`absolute inset-0 rounded-2xl ${item.bgColor} blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`} />
                </div>

                {/* Content with elegant spacing */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold text-muted-foreground uppercase tracking-widest max-[426px]:tracking-wide bg-muted/30 w-fit px-2 py-0.5 rounded-md max-[426px]:mx-auto">
                      <CheckCircle2 className={`w-4 h-4 ${item.color}`} />
                      {item.stats}
                    </div>
                  </div>

                  <p className="text-base text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
