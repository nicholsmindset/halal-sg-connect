import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles, Zap } from 'lucide-react';

interface SubscriptionManagerProps {
  currentTier: 'free' | 'premium' | 'premium_plus' | 'enterprise';
}

const SubscriptionManager = ({ currentTier }: SubscriptionManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Basic',
      price: 'Free',
      features: [
        'Simple business listing',
        'Basic contact info',
        '3 photos max',
        'Standard search visibility',
      ],
      icon: <Check className="h-4 w-4" />,
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99 SGD/month',
      features: [
        'Priority search ranking',
        'Unlimited photos & videos',
        'Social media integration',
        'Basic analytics',
        'AI-generated description',
      ],
      icon: <Crown className="h-4 w-4" />,
      popular: true,
    },
    {
      id: 'premium_plus',
      name: 'Premium Plus',
      price: '$199 SGD/month',
      features: [
        'Everything in Premium',
        'Homepage featured placement',
        'Advanced AI analytics',
        'Professional photo shoot',
        'Event promotion tools',
      ],
      icon: <Sparkles className="h-4 w-4" />,
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$399 SGD/month',
      features: [
        'Everything in Premium Plus',
        'Multi-location management',
        'Dedicated account manager',
        'Custom AI recommendations',
        'Priority support',
      ],
      icon: <Zap className="h-4 w-4" />,
      popular: false,
    },
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // In real app, redirect to Stripe checkout
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock powerful AI features to grow your business
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? 'border-primary' : ''} ${currentTier === plan.id ? 'ring-2 ring-primary' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
                Most Popular
              </Badge>
            )}
            {currentTier === plan.id && (
              <Badge variant="secondary" className="absolute -top-2 right-4">
                Current Plan
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className="mb-2 flex justify-center">{plan.icon}</div>
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-2xl font-bold">{plan.price}</div>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={currentTier === plan.id ? 'outline' : 'default'}
                disabled={currentTier === plan.id || isLoading}
                onClick={() => handleUpgrade()}
              >
                {currentTier === plan.id
                  ? 'Current Plan'
                  : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManager;
