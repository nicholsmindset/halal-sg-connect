import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Database, Users, Mail } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function Privacy() {
  useSEO({
    title: 'Privacy Policy - Halal SG Connect',
    description:
      'Learn how Halal SG Connect protects your privacy and handles your personal data. Read our comprehensive privacy policy.',
    keywords: 'privacy policy, data protection, user privacy, PDPA Singapore',
    canonical: '/privacy',
  });

  const lastUpdated = '21 October 2025';

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us when you:
• Create an account or update your profile
• List a business on our platform
• Leave reviews or ratings
• Contact our support team
• Subscribe to our newsletter

This may include your name, email address, phone number, business information, and user-generated content such as reviews and photos.`,
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
• Provide and improve our services
• Process your requests and transactions
• Send you updates about your account or our services
• Respond to your comments and questions
• Analyze usage patterns to enhance user experience
• Comply with legal obligations

We do not sell your personal information to third parties.`,
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your personal information:
• Encryption of sensitive data in transit and at rest
• Regular security audits and updates
• Secure authentication systems
• Access controls and monitoring
• Secure hosting infrastructure

While we strive to protect your data, no method of transmission over the internet is 100% secure.`,
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: `We may share your information with:
• Service providers who assist in operating our platform
• Business partners for specific features you use
• Law enforcement when required by law
• Other parties with your consent

We require all third parties to respect the security of your data and treat it in accordance with the law.`,
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: `Under Singapore's Personal Data Protection Act (PDPA), you have the right to:
• Access your personal data
• Correct inaccurate data
• Request deletion of your data
• Object to processing of your data
• Withdraw consent at any time
• Lodge a complaint with the PDPC

Contact us to exercise any of these rights.`,
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: `If you have questions about this Privacy Policy or our data practices:

Email: privacy@halalsgconnect.com
Address: Singapore

We will respond to your inquiries within 30 days.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="prose prose-slate max-w-none pt-6 dark:prose-invert">
            <p className="text-lg leading-relaxed">
              At Halal SG Connect, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              data when you use our platform.
            </p>
            <p>
              By using Halal SG Connect, you agree to the collection and use of
              information in accordance with this policy. If you do not agree with
              our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cookies Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to track activity on
              our platform and store certain information. Cookies are files with a
              small amount of data that are stored on your device.
            </p>
            <p>
              <strong>Types of cookies we use:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Required for the platform to
                function
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how users
                interact with our platform
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>
            <p>
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, some features may not function
              properly without cookies.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Our platform is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us so we can delete it.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page and
              updating the "Last updated" date.
            </p>
            <p className="mt-3">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they are
              posted on this page.
            </p>
          </CardContent>
        </Card>

        {/* PDPA Compliance */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  PDPA Compliance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Halal SG Connect is committed to complying with Singapore's
                  Personal Data Protection Act (PDPA) 2012. We ensure that all
                  personal data is collected, used, and disclosed in accordance
                  with the PDPA's requirements and best practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
