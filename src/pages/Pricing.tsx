import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Check,
  Star,
  Zap,
  Crown,
  Building2,
  Camera,
  BarChart3,
  Users,
  Globe,
  Megaphone,
  Shield,
  Headphones,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const Pricing = () => {
  // SEO configuration
  useSEO({
    title: 'Pricing Plans - Halal SG Connect | Grow Your Halal Business',
    description:
      'Choose the perfect plan to showcase your halal business. From free basic listings to enterprise solutions with AI-powered features and premium placement.',
    keywords:
      'halal business pricing, Singapore restaurant marketing, premium listing, business directory plans, halal certification',
    canonical: '/pricing',
  });

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '',
      description: 'Perfect for new businesses getting started',
      icon: Building2,
      popular: false,
      features: [
        'Simple business listing',
        'Basic contact information',
        'Up to 3 photos',
        'Standard search visibility',
        'Business hours display',
        'Location on map',
        'Basic halal certification display',
      ],
      limitations: [
        'Limited photo uploads',
        'Basic search ranking',
        'No social media integration',
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Premium',
      price: '$99',
      period: '/month',
      description: 'Most popular choice for growing businesses',
      icon: Star,
      popular: true,
      features: [
        'Everything in Basic',
        'Priority search ranking',
        'Unlimited photos & videos',
        'Social media integration',
        'Basic analytics dashboard',
        'AI-generated business description',
        'Customer review management',
        'Email notification system',
        'Featured in category searches',
      ],
      limitations: [],
      buttonText: 'Start Premium Trial',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Premium Plus',
      price: '$199',
      period: '/month',
      description: 'Advanced features for established businesses',
      icon: Zap,
      popular: false,
      features: [
        'Everything in Premium',
        'Homepage featured placement',
        'Advanced AI analytics',
        'Professional photo shoot (quarterly)',
        'Event promotion tools',
        'Social media auto-posting',
        'SEO optimization tools',
        'Priority customer support',
        'Custom business page themes',
      ],
      limitations: [],
      buttonText: 'Upgrade to Plus',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Enterprise',
      price: '$399',
      period: '/month',
      description: 'Complete solution for multi-location businesses',
      icon: Crown,
      popular: false,
      features: [
        'Everything in Premium Plus',
        'Multi-location management',
        'Dedicated account manager',
        'Custom API access',
        'White-label solutions',
        'Advanced reporting suite',
        'Staff training sessions',
        'Priority phone support',
        'Custom integrations',
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
    },
  ];

  const features = [
    {
      category: 'Visibility & Discovery',
      icon: Globe,
      items: [
        {
          name: 'Search Engine Optimization',
          basic: true,
          premium: true,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Social Media Integration',
          basic: false,
          premium: true,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Homepage Featured Placement',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Priority Search Ranking',
          basic: false,
          premium: true,
          plus: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Content & Media',
      icon: Camera,
      items: [
        {
          name: 'Photo Uploads',
          basic: '3 photos',
          premium: 'Unlimited',
          plus: 'Unlimited',
          enterprise: 'Unlimited',
        },
        {
          name: 'Video Uploads',
          basic: false,
          premium: true,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Professional Photo Shoot',
          basic: false,
          premium: false,
          plus: 'Quarterly',
          enterprise: 'Monthly',
        },
        {
          name: 'AI-Generated Descriptions',
          basic: false,
          premium: true,
          plus: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Analytics & Insights',
      icon: BarChart3,
      items: [
        {
          name: 'Basic Analytics',
          basic: false,
          premium: true,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Advanced AI Analytics',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Custom Reports',
          basic: false,
          premium: false,
          plus: false,
          enterprise: true,
        },
        {
          name: 'Performance Insights',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Marketing Tools',
      icon: Megaphone,
      items: [
        {
          name: 'Event Promotion',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Social Media Auto-posting',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Email Marketing Tools',
          basic: false,
          premium: false,
          plus: false,
          enterprise: true,
        },
        {
          name: 'Customer Loyalty Programs',
          basic: false,
          premium: false,
          plus: false,
          enterprise: true,
        },
      ],
    },
    {
      category: 'Support & Management',
      icon: Headphones,
      items: [
        {
          name: 'Email Support',
          basic: true,
          premium: true,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Priority Support',
          basic: false,
          premium: false,
          plus: true,
          enterprise: true,
        },
        {
          name: 'Dedicated Account Manager',
          basic: false,
          premium: false,
          plus: false,
          enterprise: true,
        },
        {
          name: 'Phone Support',
          basic: false,
          premium: false,
          plus: false,
          enterprise: true,
        },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Is there a free trial for premium plans?',
      answer:
        'Yes! We offer a 14-day free trial for all premium plans. No credit card required to start.',
    },
    {
      question: 'Can I change my plan at any time?',
      answer:
        "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer:
        'Your data is never deleted. If you downgrade, some premium features may become unavailable, but all your business information remains intact.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer:
        'Yes! Save 20% when you choose annual billing for any premium plan. The discount is applied automatically at checkout.',
    },
    {
      question: 'Is there setup assistance for Enterprise plans?',
      answer:
        'Enterprise customers receive dedicated onboarding with a personal account manager and technical setup assistance.',
    },
    {
      question: 'Can I manage multiple locations with one account?',
      answer:
        'Multiple locations are available starting with Premium Plus plans. Enterprise plans include advanced multi-location management tools.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            💰 Special Launch Pricing - 50% Off First 3 Months
          </Badge>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Unlock powerful AI features to grow your halal business and reach
            more customers across Singapore
          </p>

          {/* Plan Toggle */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="text-sm">Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="h-6 w-12 cursor-pointer rounded-full bg-muted"></div>
            </div>
            <span className="text-sm">Annual</span>
            <Badge variant="secondary" className="text-xs">
              Save 20%
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map(plan => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative ${plan.popular ? 'scale-105 border-primary shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="pb-4 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <Button
                      className="mb-6 w-full"
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link
                        to={
                          plan.name === 'Enterprise' ? '/contact' : '/register'
                        }
                      >
                        {plan.buttonText}
                      </Link>
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Compare All Features</h2>
            <p className="text-lg text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="space-y-12">
            {features.map(category => {
              const IconComponent = category.icon;
              return (
                <div key={category.category}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {category.category}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">Feature</th>
                          <th className="px-4 py-3 text-center">Basic</th>
                          <th className="px-4 py-3 text-center">Premium</th>
                          <th className="px-4 py-3 text-center">Plus</th>
                          <th className="px-4 py-3 text-center">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-3 font-medium">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {typeof item.basic === 'boolean' ? (
                                item.basic ? (
                                  <Check className="mx-auto h-4 w-4 text-green-500" />
                                ) : (
                                  '—'
                                )
                              ) : (
                                item.basic
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {typeof item.premium === 'boolean' ? (
                                item.premium ? (
                                  <Check className="mx-auto h-4 w-4 text-green-500" />
                                ) : (
                                  '—'
                                )
                              ) : (
                                item.premium
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {typeof item.plus === 'boolean' ? (
                                item.plus ? (
                                  <Check className="mx-auto h-4 w-4 text-green-500" />
                                ) : (
                                  '—'
                                )
                              ) : (
                                item.plus
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {typeof item.enterprise === 'boolean' ? (
                                item.enterprise ? (
                                  <Check className="mx-auto h-4 w-4 text-green-500" />
                                ) : (
                                  '—'
                                )
                              ) : (
                                item.enterprise
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We have answers
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-3 font-semibold">{faq.question}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Grow Your Business?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of halal businesses already growing with our
            platform. Start your free trial today and see the difference premium
            features can make.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
