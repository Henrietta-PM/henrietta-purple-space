import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  { value: "3+", label: "MVPs Launched" },
  { value: "85%", label: "Dev Time Saved" },
  { value: "$600K", label: "IP Value" }
];

const ImpactMetrics = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  
  return (
    <section 
      ref={ref}
      className="py-16 md:py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`glass border border-white/10 dark:border-white/10 rounded-2xl p-8 md:p-10 text-center transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-5xl md:text-6xl font-handwritten text-glow mb-4" style={{ color: 'hsl(var(--primary-visible))' }}>
                {metric.value}
              </div>
              <p className="text-foreground/80 dark:text-white/80 text-sm md:text-base font-medium">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
