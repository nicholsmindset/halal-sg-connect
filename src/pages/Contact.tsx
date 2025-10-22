import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  Building2,
  Users,
  Zap,
  Send,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // SEO configuration
  useSEO({
    title: 'Contact Us - Halal SG Connect | Get Support & Sales Information',
    description:
      'Contact our team for support, sales inquiries, or partnership opportunities. Get help with your halal business listing and premium features.',
    keywords: [
      'contact halal directory',
      'Singapore business support',
      'halal certification help',
      'premium features support',
    ],
    canonical: '/contact',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@halalsg-connect.com',
      hours: '24/7 Response',
      type: 'email',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: '+65 6XXX XXXX',
      hours: 'Mon-Fri 9AM-6PM SGT',
      type: 'phone',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us instantly',
      contact: 'Available on website',
      hours: 'Mon-Fri 9AM-9PM SGT',
      type: 'chat',
    },
    {
      icon: MapPin,
      title: 'Office Location',
      description: 'Visit our office',
      contact: 'Singapore Business District',
      hours: 'By appointment only',
      type: 'location',
    },
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'sales', label: 'Sales & Pricing', icon: Building2 },
    { value: 'support', label: 'Technical Support', icon: Headphones },
    { value: 'partnership', label: 'Partnership', icon: Users },
    { value: 'enterprise', label: 'Enterprise Solutions', icon: Zap },
  ];

  const teamMembers = [
    {
      name: 'Ahmad Rahman',
      role: 'Customer Success Manager',
      specialty: 'Business Onboarding & Support',
      email: 'ahmad@halalsg-connect.com',
    },
    {
      name: 'Sarah Lim',
      role: 'Sales Director',
      specialty: 'Premium Plans & Enterprise Solutions',
      email: 'sarah@halalsg-connect.com',
    },
    {
      name: 'Mohamed Ali',
      role: 'Technical Support Lead',
      specialty: 'Platform Issues & Integration',
      email: 'mohamed@halalsg-connect.com',
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">
              Message Sent Successfully!
            </h1>
            <p className="mb-6 text-muted-foreground">
              Thank you for contacting us. We'll get back to you within 24
              hours.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Contact Our Team</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Have questions about our platform? Need help with your business
            listing? Want to discuss enterprise solutions? We're here to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="mb-3 block text-sm font-medium">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {inquiryTypes.map(type => {
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                inquiryType: type.value,
                              }))
                            }
                            className={`rounded-lg border p-3 text-left transition-colors ${
                              formData.inquiryType === type.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {type.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                      >
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone and Company */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+65 XXXX XXXX"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-sm font-medium"
                      >
                        Company/Business Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your business name"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="mb-1 text-sm text-muted-foreground">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium">{method.contact}</p>
                        <p className="text-xs text-muted-foreground">
                          {method.hours}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="border-t pt-2">
                    <Badge variant="secondary" className="text-xs">
                      Singapore Time (SGT)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mb-1 text-xs text-muted-foreground">
                      {member.specialty}
                    </p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Common Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to frequently asked questions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">
                  How quickly will I get a response?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all inquiries within 24 hours during business
                  days. Urgent technical issues are prioritized and handled
                  within 4 hours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">
                  Do you offer phone consultations?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer free 30-minute consultations for businesses
                  interested in Premium or Enterprise plans. Schedule via our
                  contact form.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">
                  Can you help with business setup?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. Our team can assist with business listing
                  optimization, photo guidelines, and best practices for maximum
                  visibility.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">
                  What about technical integration?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise customers receive dedicated technical support for
                  API integrations, custom implementations, and advanced
                  features.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
