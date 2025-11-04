-- Reviews and Ratings System for Halal SG Connect
-- Migration: 002_reviews_ratings_system.sql
-- Implements comprehensive review and rating functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Rating and Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,

  -- Media
  photos TEXT[], -- Array of Supabase storage URLs

  -- Engagement Metrics
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Verification
  verified_purchase BOOLEAN DEFAULT false,
  visit_date DATE,

  -- Business Response
  business_response TEXT,
  business_response_at TIMESTAMP WITH TIME ZONE,
  business_responder_id UUID REFERENCES auth.users(id),

  -- Moderation
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged', 'hidden')),
  moderation_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  flag_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(business_id, user_id), -- One review per user per business
  CHECK (LENGTH(content) >= 10), -- Minimum review length
  CHECK (LENGTH(content) <= 5000) -- Maximum review length
);

-- Review Votes Table (for helpful/not helpful)
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One vote per user per review
  UNIQUE(review_id, user_id)
);

-- Review Flags/Reports Table
CREATE TABLE IF NOT EXISTS review_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'fake', 'offensive', 'misleading', 'other')),
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One flag per user per review per reason
  UNIQUE(review_id, user_id, reason)
);

-- Review Media Table (for detailed photo metadata)
CREATE TABLE IF NOT EXISTS review_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video')),
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review Statistics Table (aggregated stats per business)
CREATE TABLE IF NOT EXISTS review_statistics (
  business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  rating_5_count INTEGER DEFAULT 0,
  rating_4_count INTEGER DEFAULT 0,
  rating_3_count INTEGER DEFAULT 0,
  rating_2_count INTEGER DEFAULT 0,
  rating_1_count INTEGER DEFAULT 0,
  total_helpful_votes INTEGER DEFAULT 0,
  verified_reviews_count INTEGER DEFAULT 0,
  reviews_with_photos_count INTEGER DEFAULT 0,
  avg_response_time_hours DECIMAL(10,2),
  response_rate DECIMAL(5,2), -- Percentage
  last_review_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Review Statistics (gamification)
CREATE TABLE IF NOT EXISTS user_review_statistics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_reviews INTEGER DEFAULT 0,
  total_helpful_votes INTEGER DEFAULT 0,
  total_photos_uploaded INTEGER DEFAULT 0,
  average_rating_given DECIMAL(3,2) DEFAULT 0,
  review_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_review_date DATE,
  level VARCHAR(20) DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  badges TEXT[], -- Array of badge IDs earned
  points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_helpful_count ON reviews(helpful_count DESC);
CREATE INDEX idx_reviews_verified_purchase ON reviews(verified_purchase);

CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

CREATE INDEX idx_review_flags_review_id ON review_flags(review_id);
CREATE INDEX idx_review_flags_status ON review_flags(status);

CREATE INDEX idx_review_media_review_id ON review_media(review_id);

-- Full Text Search on Reviews
CREATE INDEX idx_reviews_search ON reviews USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))
);

-- Composite Index for Common Queries
CREATE INDEX idx_reviews_business_status_created ON reviews(business_id, status, created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_review_statistics ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can delete own pending reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- Business owners can respond to reviews for their businesses
-- Note: This requires a business_owners table or similar role check
-- For now, we'll handle this in application logic

-- Review Votes Policies
CREATE POLICY "Users can view all votes" ON review_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create votes" ON review_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON review_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON review_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Review Flags Policies
CREATE POLICY "Users can view own flags" ON review_flags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create flags" ON review_flags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Review Media Policies
CREATE POLICY "Public can view media for approved reviews" ON review_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_media.review_id
      AND reviews.status = 'approved'
    )
  );

CREATE POLICY "Users can manage media for own reviews" ON review_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_media.review_id
      AND reviews.user_id = auth.uid()
    )
  );

-- Review Statistics Policies
CREATE POLICY "Public can view review statistics" ON review_statistics
  FOR SELECT USING (true);

-- User Review Statistics Policies
CREATE POLICY "Public can view user statistics" ON user_review_statistics
  FOR SELECT USING (true);

CREATE POLICY "Users can view own statistics" ON user_review_statistics
  FOR SELECT USING (auth.uid() = user_id);

-- Functions

-- Function to update review statistics when review changes
CREATE OR REPLACE FUNCTION update_review_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update business review statistics
  INSERT INTO review_statistics (business_id)
  VALUES (NEW.business_id)
  ON CONFLICT (business_id) DO NOTHING;

  UPDATE review_statistics
  SET
    total_reviews = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    ),
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    ),
    rating_5_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND rating = 5
    ),
    rating_4_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND rating = 4
    ),
    rating_3_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND rating = 3
    ),
    rating_2_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND rating = 2
    ),
    rating_1_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND rating = 1
    ),
    verified_reviews_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND verified_purchase = true
    ),
    reviews_with_photos_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved' AND array_length(photos, 1) > 0
    ),
    last_review_date = (
      SELECT MAX(created_at) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    ),
    updated_at = NOW()
  WHERE business_id = NEW.business_id;

  -- Update user review statistics
  INSERT INTO user_review_statistics (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE user_review_statistics
  SET
    total_reviews = (
      SELECT COUNT(*) FROM reviews
      WHERE user_id = NEW.user_id AND status = 'approved'
    ),
    total_photos_uploaded = (
      SELECT COALESCE(SUM(array_length(photos, 1)), 0) FROM reviews
      WHERE user_id = NEW.user_id AND status = 'approved'
    ),
    average_rating_given = (
      SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
      WHERE user_id = NEW.user_id AND status = 'approved'
    ),
    last_review_date = (
      SELECT MAX(created_at::date) FROM reviews
      WHERE user_id = NEW.user_id AND status = 'approved'
    ),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- Update business rating and review_count columns
  UPDATE businesses
  SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*) FROM reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    )
  WHERE id = NEW.business_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    ELSIF NEW.vote_type = 'not_helpful' THEN
      UPDATE reviews SET not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
    ELSIF OLD.vote_type = 'not_helpful' THEN
      UPDATE reviews SET not_helpful_count = not_helpful_count - 1 WHERE id = OLD.review_id;
    END IF;

    IF NEW.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    ELSIF NEW.vote_type = 'not_helpful' THEN
      UPDATE reviews SET not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
    ELSIF OLD.vote_type = 'not_helpful' THEN
      UPDATE reviews SET not_helpful_count = not_helpful_count - 1 WHERE id = OLD.review_id;
    END IF;
  END IF;

  -- Update user statistics for helpful votes received
  UPDATE user_review_statistics
  SET
    total_helpful_votes = (
      SELECT COALESCE(SUM(r.helpful_count), 0)
      FROM reviews r
      WHERE r.user_id = (SELECT user_id FROM reviews WHERE id = COALESCE(NEW.review_id, OLD.review_id))
      AND r.status = 'approved'
    ),
    updated_at = NOW()
  WHERE user_id = (SELECT user_id FROM reviews WHERE id = COALESCE(NEW.review_id, OLD.review_id));

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update flag count
CREATE OR REPLACE FUNCTION update_flag_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reviews
  SET flag_count = (
    SELECT COUNT(*) FROM review_flags
    WHERE review_id = NEW.review_id AND status = 'pending'
  )
  WHERE id = NEW.review_id;

  -- Auto-hide reviews with 5+ flags
  UPDATE reviews
  SET status = 'flagged'
  WHERE id = NEW.review_id AND flag_count >= 5 AND status = 'approved';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_review_statistics
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION update_review_statistics();

CREATE TRIGGER trigger_update_review_statistics_on_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  WHEN (OLD.status = 'approved')
  EXECUTE FUNCTION update_review_statistics();

CREATE TRIGGER trigger_update_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_counts();

CREATE TRIGGER trigger_update_flag_count
  AFTER INSERT OR UPDATE ON review_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_flag_count();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_statistics_updated_at
  BEFORE UPDATE ON review_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_review_statistics_updated_at
  BEFORE UPDATE ON user_review_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views for Common Queries

-- Recent Reviews View
CREATE VIEW recent_reviews AS
SELECT
  r.*,
  b.name as business_name,
  b.slug as business_slug
FROM reviews r
JOIN businesses b ON r.business_id = b.id
WHERE r.status = 'approved'
ORDER BY r.created_at DESC;

-- Top Reviewers View
CREATE VIEW top_reviewers AS
SELECT
  urs.*,
  DENSE_RANK() OVER (ORDER BY urs.total_helpful_votes DESC) as rank
FROM user_review_statistics urs
WHERE urs.total_reviews >= 5
ORDER BY urs.total_helpful_votes DESC, urs.total_reviews DESC;

-- Helpful Reviews View
CREATE VIEW helpful_reviews AS
SELECT
  r.*,
  b.name as business_name,
  b.slug as business_slug,
  (r.helpful_count::float / NULLIF(r.helpful_count + r.not_helpful_count, 0)) as helpfulness_ratio
FROM reviews r
JOIN businesses b ON r.business_id = b.id
WHERE r.status = 'approved' AND r.helpful_count > 0
ORDER BY r.helpful_count DESC, r.created_at DESC;

-- Comments
COMMENT ON TABLE reviews IS 'User reviews and ratings for businesses';
COMMENT ON TABLE review_votes IS 'Helpful/not helpful votes on reviews';
COMMENT ON TABLE review_flags IS 'User reports of inappropriate reviews';
COMMENT ON TABLE review_media IS 'Photos and videos attached to reviews';
COMMENT ON TABLE review_statistics IS 'Aggregated review statistics per business';
COMMENT ON TABLE user_review_statistics IS 'User contribution statistics for gamification';

-- Initial Data: Create statistics entries for existing businesses
INSERT INTO review_statistics (business_id)
SELECT id FROM businesses
ON CONFLICT (business_id) DO NOTHING;
