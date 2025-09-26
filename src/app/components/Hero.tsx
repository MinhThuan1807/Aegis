import { Button } from "./ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export function Hero() {
  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Secure & Audited",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      text: "Competitive APY",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: "Instant Liquidity",
    },
  ];

  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Decentralized
            <span className="block text-primary">Lending & Borrowing</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Earn yield on your crypto assets or access instant liquidity with
            AEGIS Protocol. Secure, efficient, and community-driven DeFi lending
            platform.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-muted-foreground"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Start Lending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Explore Markets
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$2.5B+</div>
              <div className="text-muted-foreground">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15.2%</div>
              <div className="text-muted-foreground">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
