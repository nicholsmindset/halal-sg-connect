import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function Terms() {
  useSEO({
    title: 'Terms of Service - Halal SG Connect',
    description:
      'Read the Terms of Service for Halal SG Connect. Understand your rights and obligations when using our halal business directory platform.',
    keywords: 'terms of service, user agreement, terms and conditions, platform rules',
    canonical: '/terms',
  });

  const lastUpdated = '21 October 2025';

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
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="prose prose-slate max-w-none pt-6 dark:prose-invert">
            <p className="text-lg leading-relaxed">
              Welcome to Halal SG Connect. These Terms of Service ("Terms")
              govern your access to and use of our platform, website, and services.
              By accessing or using our platform, you agree to be bound by these
              Terms.
            </p>
            <p>
              Please read these Terms carefully before using our services. If you
              do not agree to these Terms, you may not access or use our platform.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              By creating an account, accessing, or using Halal SG Connect, you
              acknowledge that you have read, understood, and agree to be bound by
              these Terms and our Privacy Policy.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Your
              continued use of the platform after changes are posted constitutes
              your acceptance of the modified Terms.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
              <li>Not share your account with others</li>
            </ul>
            <p>
              You must be at least 13 years old to create an account. We reserve
              the right to refuse service or terminate accounts at our discretion.
            </p>
          </CardContent>
        </Card>

        {/* Business Listings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Business Listings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>If you list a business on our platform, you represent and warrant that:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>You have the legal right to represent the business</li>
              <li>All information provided is accurate and up-to-date</li>
              <li>Your business complies with all applicable laws and regulations</li>
              <li>Your halal certification claims are legitimate and verifiable</li>
              <li>You will update your listing if information changes</li>
            </ul>
            <p className="font-medium text-foreground">
              False or misleading halal certification claims are strictly prohibited
              and may result in immediate account termination and legal action.
            </p>
          </CardContent>
        </Card>

        {/* User Conduct */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>4. Acceptable Use</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>You agree to use our platform only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Submit spam or unauthorized advertising</li>
              <li>Use automated systems to scrape or collect data</li>
              <li>Interfere with the platform's operation or security</li>
              <li>Impersonate others or misrepresent your affiliation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle>5. Prohibited Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>The following types of content are strictly prohibited:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Offensive, obscene, or inappropriate material</li>
              <li>Hate speech or discriminatory content</li>
              <li>Content that incites violence or illegal activity</li>
              <li>Sexually explicit material</li>
              <li>Content that violates privacy rights</li>
              <li>Malware, viruses, or harmful code</li>
            </ul>
            <p>
              We reserve the right to remove any content that violates these Terms
              or that we deem inappropriate.
            </p>
          </CardContent>
        </Card>

        {/* Reviews and Ratings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Reviews and Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>When posting reviews or ratings:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Reviews must be based on genuine experiences</li>
              <li>Do not post fake or incentivized reviews</li>
              <li>Be honest, fair, and constructive</li>
              <li>Respect business owners and other users</li>
              <li>Do not include personal attacks or offensive language</li>
            </ul>
            <p>
              By posting a review, you grant us a perpetual, non-exclusive license
              to use, modify, and display your content on our platform.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              All content on Halal SG Connect, including text, graphics, logos,
              images, and software, is the property of Halal SG Connect or its
              licensors and is protected by intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, or create derivative works
              without our express written permission.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle>8. Disclaimer of Warranties</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="uppercase font-medium">
              Our platform is provided "as is" and "as available" without warranties
              of any kind, either express or implied.
            </p>
            <p>
              We do not guarantee the accuracy, completeness, or reliability of any
              content on our platform, including business information, reviews, or
              halal certification status. Users should verify information
              independently.
            </p>
            <p>
              We are not responsible for the quality, safety, or legality of
              businesses listed on our platform.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="uppercase font-medium">
              To the maximum extent permitted by law, Halal SG Connect shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages.
            </p>
            <p>
              Our total liability to you for any claim arising out of or relating
              to these Terms or your use of the platform shall not exceed the
              amount you paid us in the past 12 months, if any.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We reserve the right to suspend or terminate your account and access
              to our platform at any time, with or without notice, for any reason,
              including violation of these Terms.
            </p>
            <p>
              You may terminate your account at any time by contacting us. Upon
              termination, your right to use the platform will immediately cease.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              These Terms are governed by and construed in accordance with the laws
              of Singapore. Any disputes arising from these Terms shall be subject
              to the exclusive jurisdiction of the courts of Singapore.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>12. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have questions about these Terms of Service, please contact us
              at:
            </p>
            <p className="mt-3">
              Email: legal@halalsgconnect.com
              <br />
              Address: Singapore
            </p>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Acknowledgment
                </h3>
                <p className="text-sm text-muted-foreground">
                  By using Halal SG Connect, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service. If
                  you do not agree to these Terms, please do not use our platform.
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
