"use client";
import { Twitter, Github, MessageCircle, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
export function Footer() {
    const { theme, setTheme } = useTheme();
    const footerLinks = {
    protocol: [
      { label: 'Markets', href: '#markets' },
      { label: 'Analytics', href: '#analytics' },
      { label: 'Governance', href: '#governance' },
      { label: 'Security', href: '#security' }
    ],
    developers: [
      { label: 'Documentation', href: '#docs' },
      { label: 'GitHub', href: '#github' },
      { label: 'Bug Bounty', href: '#bounty' },
      { label: 'Audits', href: '#audits' }
    ],
    community: [
      { label: 'Discord', href: '#discord' },
      { label: 'Twitter', href: '#twitter' },
      { label: 'Forum', href: '#forum' },
      { label: 'Blog', href: '#blog' }
    ]
  };

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#twitter', label: 'Twitter' },
    { icon: <Github className="h-5 w-5" />, href: '#github', label: 'GitHub' },
    { icon: <MessageCircle className="h-5 w-5" />, href: '#discord', label: 'Discord' },
    { icon: <BookOpen className="h-5 w-5" />, href: '#docs', label: 'Documentation' }
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
                {theme === 'light' ? (
                    <Image 
                        src="/AegisLogo.png"
                        alt="Aegis Logo"
                        width={98}
                        height={98}
                        priority
                    />) : (
                    <Image 
                        src="/AegisDarkV1.png"
                        alt="Aegis Logo"
                        width={98}
                        height={98}
                        priority
                    />
                )}
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  AEGIS
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Protocol</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Decentralized lending and borrowing protocol built for the future of DeFi. 
              Secure, efficient, and community-driven.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <h3 className="font-semibold mb-4">Protocol</h3>
            <ul className="space-y-3">
              {footerLinks.protocol.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers Links */}
          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-3">
              {footerLinks.developers.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 AEGIS Protocol. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#risk" className="text-muted-foreground hover:text-foreground transition-colors">
              Risk Disclosure
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}