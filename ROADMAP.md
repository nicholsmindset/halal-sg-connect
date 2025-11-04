# Halal SG Connect - Product Roadmap 2025-2026

> **Mission**: Become Singapore's most trusted and engaging halal business discovery platform

---

## Executive Summary

This roadmap is organized into 4 phases over 18 months, focusing on three strategic pillars:
1. **User Engagement & Retention** - Make users visit daily
2. **Business Value** - Increase revenue per vendor
3. **Market Leadership** - Build defensible competitive advantages

### Current State
- ✅ Solid foundation: AI search, premium tiers, admin system
- ✅ 1,456 businesses, 1,234 users, 234 subscribers
- ✅ Modern tech stack with PostGIS and Supabase

### Target Metrics (18 months)
- **User Engagement**: 2x daily active users, 3x session length
- **Revenue**: 3x MRR ($37,350), 400+ premium subscribers
- **Retention**: 70% user retention, 85% vendor retention
- **NPS Score**: 60+

---

## Phase 1: Social Engagement & Trust (Months 1-3)
*Focus: Make users contribute content and return daily*

### 1.1 User Reviews & Ratings System ⭐ **HIGH PRIORITY**
**Problem**: Users have no way to share experiences or make informed decisions
**Solution**: Full-featured review platform

**Features:**
- Written reviews with 5-star ratings
- Photo uploads with reviews (up to 10 photos)
- Review helpful/unhelpful voting
- Business owner responses to reviews
- Review moderation queue
- Verified purchase badges (for integrated orders)
- Review highlights (AI-selected best reviews)

**Engagement Hooks:**
- Email notifications for business responses
- "First to review" badges
- Monthly "Top Reviewer" recognition
- Premium users get priority review placement

**Business Value:**
- Premium tier: Respond to reviews ($99/mo includes)
- Premium Plus: AI-generated response suggestions
- Review analytics dashboard (sentiment analysis)

**Database Schema:**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses,
  user_id UUID REFERENCES auth.users,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  photos TEXT[], -- Array of Supabase storage URLs
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  business_response TEXT,
  business_response_at TIMESTAMP,
  status review_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE review_votes (
  user_id UUID REFERENCES auth.users,
  review_id UUID REFERENCES reviews,
  vote_type vote_type, -- 'helpful' or 'not_helpful'
  PRIMARY KEY (user_id, review_id)
);
```

**Success Metrics:**
- 40% of users leave at least one review in first 3 months
- Average 3+ reviews per business
- 80% of reviews include photos

---

### 1.2 User Profiles & Social Features 👥
**Problem**: Users are anonymous, no sense of community
**Solution**: Rich user profiles with social elements

**Features:**
- Public user profiles with:
  - Profile photo and bio
  - Review history and stats
  - Favorite businesses (public or private)
  - Collections/Lists (e.g., "Best Birthday Spots", "Budget Eats")
  - Badges and achievements
  - Following/Followers system
- Activity feed (user's recent reviews, check-ins)
- User leaderboards (monthly, all-time)
- Share profile via social media

**Gamification System:**
- **Badges**: First Review, Photo Master (50+ photos), Local Guide (100+ reviews), Early Adopter, etc.
- **Levels**: Bronze → Silver → Gold → Platinum (based on contributions)
- **Perks**: Gold+ users get special premium trial, priority support

**Success Metrics:**
- 50% of users complete profile setup
- 30% create at least one collection
- 20% follow other users

---

### 1.3 Check-Ins & Loyalty Rewards 🎁
**Problem**: No reason to visit app while at business location
**Solution**: Check-in system with rewards

**Features:**
- Location-based check-ins at businesses
- Check-in photos (automatically tagged to business)
- Streak tracking (consecutive days/visits)
- Business-specific stamps (10 visits = reward)
- Platform-wide points system:
  - 10 points per check-in
  - 50 points per review
  - 25 points per photo uploaded
  - 100 points per referral
- Points redemption:
  - Discount vouchers from participating businesses
  - Premium feature trials
  - Merchandise (Halal SG Connect swag)

**Business Integration:**
- Businesses can create custom loyalty programs
- QR code at business location for easy check-in
- Businesses see check-in analytics
- Premium businesses can offer exclusive rewards

**Monetization:**
- Free tier: Basic check-ins
- Premium ($99): Custom loyalty program + analytics
- Premium Plus ($199): Advanced rewards + automated campaigns

**Success Metrics:**
- 25% of users check in at least once
- 10% of users maintain 7-day streak
- 40 participating businesses with rewards programs

---

## Phase 2: Enhanced Discovery & Content (Months 4-6)
*Focus: Help users find exactly what they need*

### 2.1 Advanced Search & Filters 🔍
**Problem**: Current search is basic, users struggle to find specific needs
**Solution**: Sophisticated filtering with saved searches

**Features:**
- **Cuisine-specific search** (40+ cuisines):
  - Malay, Indonesian, Indian, Chinese, Middle Eastern, Western, Japanese, Korean, Thai, Vietnamese, etc.
- **Dietary filters**:
  - Vegetarian options available
  - Seafood-free
  - Nut-free
  - Gluten-free options
- **Occasion-based filters**:
  - Romantic date
  - Family-friendly
  - Business meetings
  - Large groups (20+)
  - Kids party venue
- **Amenity filters**:
  - Private dining rooms
  - Outdoor seating
  - Prayer room nearby
  - Waterfront view
  - Live entertainment
- **Time-based search**:
  - Open now
  - Open at specific time
  - 24-hour establishments
- **Delivery platform integration**:
  - Available on Grab, Foodpanda, Deliveroo
- **Price + distance combination**:
  - "Cheap eats within 2km"
- **Saved searches with alerts**:
  - Get notified when new businesses match
- **Search history** (logged-in users)

**AI Enhancements:**
- Natural language: "cheap indian food near bugis open now"
- Smart suggestions: "People also searched for..."
- "Similar to X business" search

**Success Metrics:**
- 60% of searches use 2+ filters
- 15% of users save at least one search
- 30% improvement in search-to-click rate

---

### 2.2 Menu Management System 📋
**Problem**: Users want to see menus before visiting
**Solution**: Full menu management with photos and prices

**Features:**
- **Menu builder for businesses**:
  - Multiple menus (Dine-in, Delivery, Catering, Ramadan Special)
  - Categories (Appetizers, Mains, Desserts, Drinks)
  - Item details: name, description, price, photo
  - Dietary tags per item (vegetarian, spicy level, allergens)
  - Popular/signature dish badges
  - Availability status (sold out, seasonal)
- **User-facing menu display**:
  - Searchable menu items
  - Filter by dietary requirements
  - Sort by price/popularity
  - Photo gallery view
  - PDF menu download
- **Menu search across platform**:
  - "Show me all restaurants with Nasi Briyani under $15"
  - "Gluten-free desserts near me"

**Business Value:**
- Free: 10 menu items
- Premium: Unlimited items + photos
- Premium Plus: AI-generated descriptions + SEO optimization
- Upsell: Professional food photography service ($299 one-time)

**Database Schema:**
```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses,
  name TEXT, -- e.g., "Lunch Menu", "Ramadan Special"
  description TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  menu_id UUID REFERENCES menus,
  category TEXT,
  name TEXT,
  description TEXT,
  price DECIMAL(10,2),
  photo_url TEXT,
  dietary_tags TEXT[], -- ['vegetarian', 'halal', 'nut-free']
  spice_level INTEGER, -- 0-5
  is_signature BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER
);
```

**Success Metrics:**
- 50% of premium businesses upload menus
- 70% of users view menus before visiting
- 25% increase in "view details" clicks

---

### 2.3 Events & Promotions Calendar 📅
**Problem**: Users miss special events and promotions
**Solution**: Centralized events platform

**Features:**
- **Event types**:
  - Special menus (Ramadan buffets, Hari Raya feasts)
  - Live entertainment (nasheed performances, cultural shows)
  - Workshops (cooking classes, halal food prep)
  - Pop-up events
  - Grand openings
  - Limited-time promotions
- **Event pages with**:
  - Date, time, location
  - Ticketing/RSVP
  - Photo/video preview
  - Attendee count
  - Reminders (push/email)
- **Calendar view**:
  - Filter by event type, date, location
  - "Events near me this weekend"
  - Subscribe to specific business events
- **Personalized event feed**:
  - Based on cuisine preferences
  - Based on followed businesses
  - Trending events

**Business Features:**
- Create unlimited events
- Event analytics (views, RSVPs, attendance)
- Automated reminder emails to attendees
- Event promotion tools (featured placement)

**Monetization:**
- Free: 1 event per month
- Premium: Unlimited events + basic promotion
- Premium Plus: Featured event placement + social media sync
- Paid event tickets: Platform takes 10% commission

**Success Metrics:**
- 200+ events created in first 3 months
- 40% of users attend at least one event
- 15% of users subscribe to event updates

---

### 2.4 Video Content & Virtual Tours 🎥
**Problem**: Static photos don't capture ambiance
**Solution**: Rich multimedia content

**Features:**
- **Business video uploads**:
  - Ambiance walkthrough (max 2 min)
  - Chef introducing dishes
  - Customer testimonials
  - Kitchen transparency videos
- **360° virtual tours** (Premium Plus feature):
  - Interactive panoramic views
  - Room-by-room navigation
- **User-generated video reviews**:
  - Short clips (30 sec) with food/experience
  - Video review gallery
- **Instagram/TikTok integration**:
  - Auto-import business's social videos
  - Display latest reels/TikToks on listing
- **Live streaming** (Future):
  - Special events
  - Cooking demonstrations
  - Behind-the-scenes

**Storage & Performance:**
- Videos stored in Supabase Storage
- Cloudflare Stream integration for delivery
- Automatic transcoding to multiple resolutions
- Thumbnail generation

**Success Metrics:**
- 30% of premium businesses upload at least one video
- 2x engagement on listings with videos
- 50% increase in time-on-page

---

## Phase 3: Transactions & Integration (Months 7-12)
*Focus: Become a transaction platform, not just discovery*

### 3.1 Table Reservation System 🪑 **HIGH PRIORITY**
**Problem**: Users leave app to make reservations elsewhere
**Solution**: Built-in reservation management

**Features:**
- **Customer booking flow**:
  - Select date, time, party size
  - View real-time availability
  - Special requests (dietary, occasion, seating preference)
  - Instant confirmation or pending approval
  - Email & push notifications
  - Add to calendar
  - Reminder 24 hours before
  - Easy cancellation/modification
- **Business management dashboard**:
  - Table inventory management
  - Booking calendar view
  - Auto-accept or manual approval
  - Booking analytics (no-show rate, peak times)
  - Customer notes and history
  - Waitlist management
  - Block dates for private events
- **Smart features**:
  - Peak hour warnings
  - Deposit for large groups (optional)
  - Loyalty points for keeping reservations
  - Penalty for no-shows (after warnings)

**Integration:**
- API for existing POS systems
- Google Calendar sync
- SMS notifications (via Twilio)

**Monetization:**
- Platform fee: $0.50 per completed reservation
- Or subscription model:
  - Premium: 50 reservations/month included
  - Premium Plus: Unlimited reservations
  - Enterprise: Multi-location reservation management

**Success Metrics:**
- 100 businesses enable reservations in first quarter
- 5,000 reservations per month by month 12
- 85% booking completion rate (low no-show)
- Generate $30,000+ annual revenue from fees

---

### 3.2 Online Ordering & Delivery Integration 🛵
**Problem**: Users go to multiple apps for ordering
**Solution**: Unified ordering experience

**Options:**
- **Option A: Deep integration with existing platforms**
  - Partner with Grab, Foodpanda, Deliveroo
  - Order button redirects with business context
  - Track commission/referrals
  - Display live menu pricing from platforms

- **Option B: Native ordering (more complex)**
  - Full ordering system built-in
  - Shopping cart and checkout
  - Payment processing (Stripe)
  - Order management for businesses
  - Driver integration or self-delivery

**Recommended: Hybrid Approach**
- Phase 1: Deep links to delivery platforms (quick win)
- Phase 2: Native ordering for premium businesses
  - Lower commission (12% vs 30% of others)
  - Better data and customer relationships
  - Integrated with reservation system

**Native Ordering Features:**
- Real-time menu sync
- Customization options (no onions, extra spicy)
- Scheduled orders (order now, deliver tomorrow)
- Group ordering (split bills)
- Reorder favorites
- Order tracking
- In-app customer support chat

**Business Dashboard:**
- Order alerts (sound + push)
- Accept/reject orders
- Prep time estimation
- Delivery tracking
- Analytics: popular items, average order value

**Monetization:**
- Commission: 12-15% per order (vs competitors' 25-35%)
- Delivery fee sharing
- Subscription discount: Premium Plus gets 10% commission instead of 15%

**Success Metrics:**
- 1,000 orders per month by month 12
- $100,000 GMV (Gross Merchandise Value)
- $12,000-15,000 commission revenue

---

### 3.3 Vouchers & Gift Cards 🎫
**Problem**: No way to drive sales or gift experiences
**Solution**: Digital voucher marketplace

**Features:**
- **Voucher types**:
  - Dollar value ($10, $25, $50, $100)
  - Percentage discount (10%, 20%)
  - Specific items (Free appetizer, 2-for-1 mains)
  - Experience packages (Date night for 2, Family feast)
- **Gifting features**:
  - Send via email/SMS
  - Custom gift message
  - Schedule delivery
  - Gift wrapping animation
- **Usage**:
  - QR code redemption at business
  - Unique voucher codes
  - Expiration date management
  - Partial redemption tracking
- **Business creation tools**:
  - Create campaigns
  - Set limits (max redemptions, per customer)
  - Track performance
  - ROI analytics

**Platform Features:**
- Voucher marketplace (browse by occasion/value)
- Trending vouchers
- Last-minute deals
- Bundle deals (multiple businesses)
- Corporate bulk purchases

**Monetization:**
- Platform fee: 8-10% of voucher value
- Featured voucher placement: $50/week
- Premium businesses: Unlimited active vouchers
- Free businesses: Max 1 active voucher

**Success Metrics:**
- $50,000 voucher sales in first 6 months
- 300+ active voucher campaigns
- 40% repeat voucher purchasers
- $4,000-5,000 monthly commission revenue

---

### 3.4 Business Advertising Platform 📢
**Problem**: No monetization from high-traffic pages
**Solution**: Self-serve ad platform

**Ad Formats:**
1. **Sponsored Listings**:
   - Appear at top of search results
   - "Sponsored" badge
   - CPC (Cost Per Click) model
   - $0.50 - $2.00 per click

2. **Featured Business Carousel**:
   - Homepage premium placement
   - Category pages top carousel
   - CPM (Cost Per 1000 Impressions)
   - $50 - $200 CPM depending on placement

3. **District Takeover**:
   - Exclusive visibility in a district
   - Fixed weekly rate: $500 - $1,500
   - Includes featured placement + newsletter mention

4. **Banner Ads**:
   - Listing detail pages
   - Non-intrusive, contextual
   - $100 - $300/week

5. **Newsletter Sponsorship**:
   - Featured in weekly email (10,000+ subscribers)
   - $500 per newsletter

**Self-Serve Ad Manager:**
- Campaign creation wizard
- Budget setting (daily/total)
- Audience targeting:
  - Geography (district)
  - Cuisine interests
  - Search keywords
  - User demographics
- A/B testing tools
- Real-time analytics dashboard:
  - Impressions, clicks, CTR
  - Cost per acquisition
  - Conversion tracking
  - ROI calculator
- Automated bidding strategies

**Quality Controls:**
- Ad approval queue
- Quality score system
- Ad relevance requirements
- Landing page quality checks

**Monetization:**
- Self-serve platform (credit card)
- Minimum spend: $100
- Managed campaigns (Enterprise tier): 20% service fee

**Success Metrics:**
- 50 businesses running ads by month 12
- $10,000+ monthly ad revenue
- Average $500/month spend per advertiser
- 85% advertiser satisfaction

---

## Phase 4: Mobile & Advanced Features (Months 13-18)
*Focus: Mobile-first experience and cutting-edge features*

### 4.1 Native Mobile Apps (iOS & Android) 📱 **HIGH PRIORITY**
**Problem**: PWA limitations, can't compete with native apps
**Solution**: React Native mobile apps

**Core Features (Parity with Web):**
- All existing functionality
- Optimized mobile UI/UX
- Offline-first architecture
- Push notifications (rich notifications with images)
- Biometric login (Face ID, fingerprint)
- Deep linking (open specific business from anywhere)

**Mobile-Exclusive Features:**
- **Camera integration**:
  - Scan QR codes for check-ins
  - Visual search (take photo, find similar businesses)
  - AR menu preview (Future: AR food models)
- **Location services**:
  - Background location for smart suggestions
  - Geofencing (get notified near favorite businesses)
  - Turn-by-turn navigation to business
  - "Explore nearby" map view
- **Siri/Google Assistant integration**:
  - "Find halal restaurants near me"
  - "Make reservation at [business name]"
- **Apple Wallet/Google Pay integration**:
  - Store vouchers in digital wallet
  - Loyalty cards
- **Shake to send feedback**
- **Widget support**:
  - "Business of the day"
  - Upcoming reservations
  - Latest reviews from friends

**Performance:**
- 60 FPS animations
- < 3 second app startup
- Aggressive caching
- Image optimization

**Monetization:**
- In-app purchases for vouchers
- Ad-free experience (Premium users)
- App Store Optimization (ASO) for organic downloads

**Launch Strategy:**
- Soft launch (beta testers)
- App Store featuring (pitch to Apple/Google)
- Referral program: Install app → get bonus points
- Push notification opt-in incentives

**Success Metrics:**
- 10,000 downloads in first 3 months
- 40% web users migrate to mobile
- 4.5+ star rating on app stores
- 50% monthly active users
- 3x daily active usage vs web

---

### 4.2 AI-Powered Personalization Engine 🤖
**Problem**: Generic experience for all users
**Solution**: Deep personalization using machine learning

**Personalization Vectors:**
1. **Search & Browse History**:
   - Cuisine preferences
   - Price sensitivity
   - Location patterns
   - Time of day patterns

2. **Interaction Data**:
   - Businesses viewed, clicked, saved
   - Time spent on listings
   - Reviews read and written
   - Check-in history

3. **Explicit Preferences**:
   - Dietary restrictions
   - Favorite cuisines
   - Distance tolerance
   - Ambiance preferences (casual, fine dining, etc.)

4. **Social Graph**:
   - Friends' favorites and reviews
   - Similar users (collaborative filtering)

**Personalized Features:**
- **Smart Home Feed**:
  - Personalized business recommendations
  - "You might like..." (90%+ accuracy)
  - "Based on your recent visit to X"
  - "People with similar tastes also loved..."

- **Predictive Search**:
  - Pre-populate filters based on context
  - "It's Friday night - looking for dinner?"
  - Weather-aware (hot day = suggest ice cream, cafes)

- **Smart Notifications**:
  - "Your favorite restaurant has a new menu"
  - "Get 20% off at businesses you love this weekend"
  - "3 new halal restaurants opened near your home"
  - Avoid notification fatigue (ML-optimized timing)

- **Dynamic Pricing Suggestions for Businesses**:
  - AI suggests optimal voucher discounts
  - Predict busy times for dynamic pricing
  - Identify underperforming listings (suggest improvements)

**Technical Implementation:**
- TensorFlow.js for client-side ML
- Backend Python ML service (FastAPI)
- Feature store (Redis)
- A/B testing framework
- Real-time model updates

**Privacy:**
- Transparent data usage
- Easy opt-out
- GDPR/PDPA compliant
- On-device processing where possible

**Success Metrics:**
- 35% increase in click-through rate
- 50% increase in session length
- 40% increase in conversion to action (reservation, order)
- 25% improvement in user retention

---

### 4.3 Social Sharing & Viral Growth 🚀
**Problem**: Organic growth is slow
**Solution**: Built-in viral mechanics

**Sharing Features:**
- **Beautiful Share Cards**:
  - Auto-generated for businesses, reviews, collections
  - Optimized for Instagram Stories, Facebook, WhatsApp
  - Branded but subtle
  - Include QR code for easy app download

- **Referral Program**:
  - Users: Refer friend → both get $10 voucher credit
  - Businesses: Refer business → get 1 month premium free
  - Trackable referral links
  - Leaderboard for top referrers

- **Collection Sharing**:
  - Share curated lists publicly
  - Embeddable widgets for blogs/websites
  - Collaborative lists (friends can add to your list)

- **Review Sharing**:
  - Auto-post to Instagram/Facebook (with permission)
  - "Share your review" prompts with incentives
  - Tag businesses (they get notified)

**Viral Mechanics:**
- **Challenges & Contests**:
  - "Visit 10 different districts - win prize"
  - "Photo contest: Best food photography"
  - "Review-a-thon: Most reviews in a month"

- **Group Features**:
  - Create food groups (friends, family, colleagues)
  - Group voting on restaurants
  - Shared favorites and recommendations

- **Influencer Program**:
  - Identify power users (many followers, quality reviews)
  - Invite to ambassador program
  - Provide exclusive perks, early access
  - Commission on referrals

- **Business Incentives to Share**:
  - "Share your listing" button
  - Pre-written social media posts
  - Track social media ROI
  - Businesses that share get visibility boost

**Growth Hacks:**
- QR codes on physical menus (partner with businesses)
- Stickers: "Proud Halal SG Connect Partner"
- SMS invites (with permission)
- Email signature templates
- WhatsApp message templates

**Success Metrics:**
- Viral coefficient: 1.2+ (each user brings 1.2 new users)
- 30% of new users from referrals by month 18
- 5,000+ pieces of shared content per month
- 25% of users share at least once

---

### 4.4 Advanced Business Intelligence 📊
**Problem**: Businesses don't have data to make smart decisions
**Solution**: Enterprise-grade analytics and insights

**Analytics Dashboards:**
1. **Traffic Analytics**:
   - Real-time visitors
   - Traffic sources (Google, social, direct, Halal SG)
   - Device breakdown (mobile vs desktop)
   - Geographic heatmap of visitors
   - Time-series trends (daily, weekly, monthly, yearly)

2. **Customer Insights**:
   - Demographics (age, gender, location)
   - Cuisine preferences
   - Spending behavior (based on reviews/orders)
   - Visit frequency patterns
   - Customer segments (regulars, one-timers, high-value)

3. **Competitive Analysis**:
   - Compare to similar businesses in area
   - Category benchmarks (ratings, reviews, views)
   - Competitor pricing analysis
   - Share of voice in searches
   - Gap analysis (what competitors do better)

4. **Performance Metrics**:
   - View-to-action conversion funnel
   - Reservation completion rate
   - Order abandonment analysis
   - Review response time and sentiment
   - ROI on ads and promotions

5. **Predictive Analytics** (Premium Plus/Enterprise):
   - Demand forecasting (predict busy days)
   - Churn prediction (customers likely to leave)
   - Optimal pricing recommendations
   - Best times to run promotions
   - Inventory suggestions (based on order patterns)

**AI-Generated Insights:**
- Plain English summaries: "Your traffic is up 23% this week, driven by..."
- Actionable recommendations: "Your competitors respond to reviews 2x faster. Consider..."
- Anomaly detection: "Unusual spike in cancellations on Fridays - investigate?"
- Trend identification: "Biryani dishes are trending in your area"

**Reporting:**
- Scheduled email reports (weekly, monthly)
- Custom report builder
- Export to PDF/Excel/CSV
- White-label reports for enterprise
- API access for custom integrations

**Competitive Intelligence Platform:**
- Track any business (competitor or inspiration)
- Alerts on competitor changes (price, menu, promotions)
- Industry reports (market trends, consumer behavior)
- Quarterly market reports

**Monetization:**
- Free: Basic traffic stats
- Premium: Full analytics dashboard
- Premium Plus: Competitive analysis + AI insights
- Enterprise: Custom reports + API access + dedicated analyst

**Success Metrics:**
- 80% of premium businesses use analytics weekly
- 50% of businesses make data-driven changes
- Analytics becomes top reason for premium upgrades
- Net Promoter Score (NPS) 70+ for analytics feature

---

## Phase 5: Community & Ecosystem (Ongoing)

### 5.1 Halal Certification Verification System 🛡️
**Problem**: Trust and transparency around halal certification
**Solution**: Blockchain-backed verification

**Features:**
- Verification badges (tiers):
  - ✓ Self-declared halal
  - ✓✓ MUIS certified (Singapore)
  - ✓✓✓ Blockchain-verified certificate
- Certificate database integration
- Real-time cert status (check expiration)
- Report non-compliant businesses
- Audit trail on blockchain (immutable record)
- Prayer time integration for each listing

**Success Metrics:**
- 95% of listings have verification status
- Zero fake certification incidents
- Trust score: 90%+ users trust the platform

---

### 5.2 B2B Marketplace 🏢
**Problem**: Halal businesses struggle to find suppliers
**Solution**: B2B ingredient and equipment marketplace

**Features:**
- Supplier directory (halal meat, ingredients, equipment)
- Bulk ordering portal
- Quotation requests
- Verified halal supplier badges
- Reviews from other businesses
- Integration with inventory systems

**Monetization:**
- Supplier listings (freemium)
- Transaction fees (5%)
- Lead generation fees

**Success Metrics:**
- 200 suppliers onboarded
- $500,000 GMV in first year

---

### 5.3 Educational Content Hub 📚
**Problem**: Users want to learn about halal lifestyle
**Solution**: Content platform

**Features:**
- Blog with recipes, guides, culture
- Video tutorials (cooking, business tips)
- Podcast: Halal entrepreneur stories
- Ramadan guides and calendars
- Halal travel guides (Singapore & beyond)
- Community forums

**Monetization:**
- Sponsored content
- Affiliate links
- Premium content tier

**Success Metrics:**
- 50,000 monthly content readers
- 20% of content readers convert to app users

---

### 5.4 API & Developer Platform 👨‍�💻
**Problem**: Can't integrate with other platforms
**Solution**: Public API for ecosystem growth

**Features:**
- RESTful API documentation
- GraphQL endpoint
- Webhooks for events
- SDKs (JavaScript, Python, Ruby)
- Developer portal with analytics
- Sandbox environment
- Example integrations:
  - Hotel booking sites
  - Travel apps
  - Food bloggers' websites
  - Corporate intranets

**Monetization:**
- Free tier: 1,000 requests/month
- Paid tiers: $49, $199, $499/month
- Enterprise: Custom pricing

**Success Metrics:**
- 100 developers signed up
- 20 active integrations
- $5,000 monthly API revenue

---

## Priority Matrix

### Must-Have (Build First)
1. ✅ User Reviews & Ratings (Phase 1.1)
2. ✅ Table Reservation System (Phase 3.1)
3. ✅ Mobile Apps (Phase 4.1)
4. ✅ Advanced Search & Filters (Phase 2.1)
5. ✅ Menu Management (Phase 2.2)

### High-Value (Build Next)
6. User Profiles & Social (Phase 1.2)
7. Check-ins & Loyalty (Phase 1.3)
8. Online Ordering (Phase 3.2)
9. Events Calendar (Phase 2.3)
10. AI Personalization (Phase 4.2)

### Growth Drivers
11. Vouchers & Gift Cards (Phase 3.3)
12. Social Sharing & Viral Growth (Phase 4.3)
13. Business Advertising (Phase 3.4)
14. Video Content (Phase 2.4)

### Long-Term Moats
15. Advanced Business Intelligence (Phase 4.4)
16. Halal Verification System (Phase 5.1)
17. B2B Marketplace (Phase 5.2)
18. API Platform (Phase 5.4)

---

## Technical Implementation Priorities

### Infrastructure Upgrades
1. **Scalability**:
   - Redis caching layer
   - CDN for images/videos (Cloudflare)
   - Database read replicas
   - Horizontal scaling for Supabase functions

2. **Real-Time Features**:
   - WebSocket server for live updates
   - Real-time reservation availability
   - Live order tracking
   - Chat support system

3. **ML Infrastructure**:
   - Python ML service (FastAPI)
   - Model serving (TensorFlow Serving)
   - Feature store (Feast or Redis)
   - A/B testing framework (Optimizely or custom)

4. **Payment Processing**:
   - Stripe integration (orders, vouchers, subscriptions)
   - Payment reconciliation system
   - Refund management
   - Multi-currency support (future: regional expansion)

5. **Notification System**:
   - Push notifications (OneSignal or Firebase)
   - Email service (SendGrid or AWS SES)
   - SMS gateway (Twilio)
   - In-app notification center

6. **Security & Compliance**:
   - PDPA compliance (Singapore Personal Data Protection Act)
   - GDPR readiness (for tourists)
   - SOC 2 certification (for enterprise clients)
   - Regular security audits
   - Data encryption at rest and in transit

---

## Revenue Projections (18 Months)

### Current State (Month 0)
- Subscribers: 234
- MRR: $12,450
- Annual Run Rate: $149,400

### Month 6 Projections
- Subscribers: 350 (+49%)
- MRR: $19,500 (+57%)
- New Revenue Streams:
  - Reservations: $1,500/mo ($0.50 × 3,000 bookings)
  - Vouchers: $3,000/mo (10% × $30,000 sales)
  - Ads: $5,000/mo (20 advertisers × $250 avg)
- Total MRR: $29,000
- Annual Run Rate: $348,000

### Month 12 Projections
- Subscribers: 500 (+114%)
- MRR: $28,500 (+129%)
- New Revenue Streams:
  - Reservations: $2,500/mo (5,000 bookings)
  - Online Orders: $12,000/mo (12% × $100,000 GMV)
  - Vouchers: $4,500/mo ($50,000 sales)
  - Ads: $10,000/mo (40 advertisers)
  - Mobile App (in-app): $1,500/mo
- Total MRR: $59,000
- Annual Run Rate: $708,000

### Month 18 Projections (Target)
- Subscribers: 650 (+178%)
- MRR: $37,350 (+200%)
- New Revenue Streams:
  - Reservations: $4,000/mo (8,000 bookings)
  - Online Orders: $18,000/mo ($150,000 GMV)
  - Vouchers: $6,000/mo ($75,000 sales)
  - Ads: $15,000/mo (60 advertisers)
  - Mobile App: $3,000/mo
  - API Access: $2,000/mo
  - B2B Marketplace: $3,000/mo
- **Total MRR: $88,350**
- **Annual Run Rate: $1,060,200** 💰

---

## Key Metrics Dashboard

Track these metrics religiously:

### User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)
- Session length (target: 8+ minutes)
- Sessions per user (target: 15/month)
- Retention: Day 1, Day 7, Day 30

### Business Metrics
- Total businesses: 1,456 → 2,500
- Active businesses (logged in last 30 days)
- Premium conversion rate (target: 25%)
- Business churn rate (target: <5%/mo)
- Average revenue per business (ARPB)

### Content & Trust
- Total reviews (target: 10,000)
- Reviews per business (target: 7+)
- Average rating (target: 4.2+)
- Photos uploaded per month
- Verified businesses (target: 90%)

### Transactions
- Monthly reservations
- Order volume and GMV
- Voucher sales
- Average order value
- Transaction completion rate

### Growth
- Monthly new user signups
- Organic vs paid traffic split
- Viral coefficient
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: 3:1)

### Product Health
- Net Promoter Score (NPS) - target: 60+
- Customer Satisfaction (CSAT) - target: 4.5/5
- Feature adoption rates
- Bug report volume
- App store ratings

---

## Competitive Differentiation

### Why Halal SG Connect Will Win

1. **Hyper-Local Focus**: Only Singapore halal businesses
   - Deep expertise in local market
   - Stronger brand identity
   - Better data quality

2. **Trust & Verification**: Blockchain-backed halal certification
   - No competitor offers this
   - Critical for Muslim community

3. **Full Transaction Platform**: Not just discovery
   - Reservations + Orders + Vouchers
   - Higher revenue per user
   - More data for personalization

4. **AI-First Approach**: Best-in-class personalization
   - Smarter search than competitors
   - Better recommendations
   - Continuous improvement

5. **Community-Driven**: Social features create network effects
   - Reviews, collections, following
   - Viral growth loops
   - Harder to replicate

6. **Business Success Platform**: Not just a directory
   - Analytics and insights
   - Marketing tools
   - B2B marketplace
   - Vested interest in business growth

---

## Risk Mitigation

### Identified Risks & Solutions

**Risk 1: Low business adoption of paid tiers**
- Solution: Freemium hooks (show value), free trials, money-back guarantee
- Mitigation: Start with high-value features (reservations, menus)

**Risk 2: User review spam or fake reviews**
- Solution: Verification systems, ML fraud detection, manual moderation
- Mitigation: Verified purchase badges, reputation system

**Risk 3: Competition from global platforms (Google, TripAdvisor)**
- Solution: Hyper-specialization, halal verification, community
- Mitigation: Build moats (data, network effects, integrations)

**Risk 4: Technical scalability issues**
- Solution: Incremental infrastructure upgrades, monitoring
- Mitigation: Load testing, performance budgets, caching

**Risk 5: Regulatory changes (data privacy, halal certification)**
- Solution: Legal review, compliance-first approach
- Mitigation: Regular audits, flexible architecture

**Risk 6: User acquisition costs too high**
- Solution: Focus on viral growth, SEO, partnerships
- Mitigation: Track CAC closely, optimize funnels

---

## Success Criteria (18 Months)

### User Metrics ✅
- [ ] 50,000+ registered users
- [ ] 15,000+ monthly active users
- [ ] 60% monthly retention rate
- [ ] 8+ minute average session
- [ ] NPS score 60+

### Business Metrics ✅
- [ ] 2,500+ total businesses
- [ ] 650+ paying subscribers
- [ ] $88,000+ MRR
- [ ] 25% free-to-paid conversion
- [ ] <5% monthly churn

### Engagement Metrics ✅
- [ ] 10,000+ user reviews
- [ ] 5,000+ monthly reservations
- [ ] $150,000+ monthly order GMV
- [ ] 40% of users contribute content
- [ ] 30% of users share content

### Product Metrics ✅
- [ ] Mobile app: 10,000+ downloads
- [ ] 4.5+ star app rating
- [ ] 80% feature adoption (core features)
- [ ] <2% error rate
- [ ] 95% uptime

---

## Next Steps

### Immediate Actions (Week 1)
1. ✅ Share this roadmap with stakeholders
2. ✅ Prioritize Phase 1 features
3. ✅ Create detailed specs for Reviews system
4. ✅ Design database schema for reviews/ratings
5. ✅ Set up project tracking (Jira/Linear/GitHub Projects)
6. ✅ Conduct user research interviews (10 users, 10 businesses)
7. ✅ Create design mockups for top 3 features

### Month 1 Execution
- Build and launch User Reviews & Ratings (Phase 1.1)
- Start design work for User Profiles (Phase 1.2)
- Begin marketing campaign for review collection
- Set up analytics tracking for new features
- Plan beta launch strategy

### Quarterly Reviews
- Review metrics against targets
- Adjust roadmap based on learnings
- Celebrate wins with team
- User feedback sessions
- Competitive analysis updates

---

## Appendix: Feature Ideas Parking Lot

Ideas that didn't make the 18-month roadmap but could be valuable:

- **Halal Food Delivery Subscription**: Monthly box of halal products
- **Prayer Times & Qibla Direction**: Integrated utility
- **Halal Travel Booking**: Flights, hotels with halal food
- **Recipe Sharing Platform**: Community recipes
- **Cooking Class Marketplace**: Book classes with chefs
- **Private Dining Events**: Host events at restaurants
- **Food Waste Reduction**: Last-minute deals on excess inventory
- **Charity Integration**: Donate meals to those in need
- **Kids Menu Focus**: Family-friendly features
- **Dietary Tracking**: Log meals, track nutrition
- **Restaurant Booking for Large Groups**: Specialized wedding/event booking
- **White-Label Platform**: License to other countries
- **Franchise Opportunities**: Help businesses expand
- **Supply Chain Finance**: Loans for halal businesses
- **Insurance Products**: Tailored for F&B businesses

---

**Document Version**: 1.0
**Last Updated**: November 4, 2025
**Owner**: Product Team
**Review Cycle**: Monthly

---

*"Building the future of halal food discovery in Singapore"* 🇸🇬 🍽️
