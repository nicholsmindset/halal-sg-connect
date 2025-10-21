import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Users,
  MapPin,
  Award,
  Heart,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function About() {
  useSEO({
    title: 'About Us - Halal SG Connect | Singapore\'s Trusted Halal Directory',
    description:
      'Learn about Halal SG Connect, Singapore\'s most comprehensive halal business directory. Our mission is to connect the Muslim community with verified halal establishments.',
    keywords:
      'about halal sg connect, halal directory Singapore, MUIS certified directory, halal business platform',
    canonical: '/about',
  });

  const stats = [
    { label: 'Verified Businesses', value: '2,500+', icon: CheckCircle2 },
    { label: 'Happy Users', value: '50,000+', icon: Users },
    { label: 'Districts Covered', value: '55', icon: MapPin },
    { label: 'MUIS Certified', value: '95%', icon: Award },
  ];

  const values = [
    {
      title: 'Trust & Verification',
      description:
        'Every business is verified with MUIS certification to ensure authentic halal status.',
      icon: Shield,
    },
    {
      title: 'Community First',
      description:
        'Built by the Muslim community, for the Muslim community in Singapore.',
      icon: Heart,
    },
    {
      title: 'Comprehensive Coverage',
      description:
        'Covering all 55 planning areas and 28 property districts across Singapore.',
      icon: MapPin,
    },
    {
      title: 'Quality Experience',
      description:
        'Premium features, user reviews, and detailed business information at your fingertips.',
      icon: Sparkles,
    },
  ];

  const team = [
    {
      name: 'Mission',
      role: 'Our Purpose',
      description:
        'To make finding halal options in Singapore effortless and reliable for everyone.',
      icon: Target,
    },
    {
      name: 'Vision',
      role: 'Our Goal',
      description:
        'To be Singapore\'s most trusted and comprehensive halal business platform.',
      icon: Sparkles,
    },
    {
      name: 'Values',
      role: 'Our Principles',
      description:
        'Trust, community, excellence, and accessibility guide everything we do.',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Singapore's Most Trusted
              <br />
              <span className="text-primary">Halal Business Directory</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Connecting the Muslim community with verified halal establishments
              across all of Singapore. Find trusted, MUIS-certified businesses
              with confidence.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                      <div className="mb-1 text-3xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Halal SG Connect was born from a simple yet important need: making
                  it easier for Singapore's Muslim community to find trusted,
                  verified halal establishments across the island.
                </p>
                <p>
                  As Singapore's Muslim population grew and halal dining options
                  expanded, we noticed the challenges in finding comprehensive,
                  reliable information about halal businesses. Scattered
                  information, outdated listings, and uncertainty about
                  certifications made the search frustrating.
                </p>
                <p>
                  We built Halal SG Connect to solve this problem. Our platform
                  brings together verified MUIS-certified businesses, community
                  reviews, and detailed information all in one place. From the
                  bustling districts of Tampines to the business hub of Raffles
                  Place, we cover all 55 planning areas across Singapore.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 users and feature more
                  than 2,500 verified halal businesses. But we're just getting
                  started. Our mission is to continuously improve and expand,
                  making halal discovery in Singapore effortless for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              What Drives Us
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {team.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                      <CardTitle className="text-2xl">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{value.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-gradient-to-br from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Join Our Growing Community
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Whether you're looking for your next meal or want to list your
              business, we're here to help you connect with Singapore's halal
              community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/listings">Explore Businesses</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">List Your Business</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
