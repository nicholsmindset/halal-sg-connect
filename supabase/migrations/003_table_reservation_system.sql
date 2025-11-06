-- Table Reservation System for Halal SG Connect
-- Migration: 003_table_reservation_system.sql
-- Implements comprehensive reservation and booking functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reservation Settings Table (Business Configuration)
CREATE TABLE IF NOT EXISTS reservation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Availability Settings
  is_enabled BOOLEAN DEFAULT false,
  require_approval BOOLEAN DEFAULT false, -- Auto-accept or manual approval
  advance_booking_days INTEGER DEFAULT 30, -- How far in advance can book
  min_advance_hours INTEGER DEFAULT 2, -- Minimum hours before reservation
  max_party_size INTEGER DEFAULT 20,
  min_party_size INTEGER DEFAULT 1,

  -- Table Inventory
  total_tables INTEGER DEFAULT 10,
  table_config JSONB, -- {table_2: 5, table_4: 8, table_6: 3} etc

  -- Time Slot Configuration
  slot_duration_minutes INTEGER DEFAULT 90, -- Default dining duration
  slots_per_table INTEGER DEFAULT 1, -- How many times can a table be used per day
  buffer_time_minutes INTEGER DEFAULT 15, -- Cleaning time between reservations

  -- Operating Hours (overrides business hours for reservations)
  reservation_hours JSONB, -- {monday: [{start: "11:00", end: "22:00"}], ...}

  -- Special Settings
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2),
  deposit_percentage DECIMAL(5,2), -- Alternative: percentage of estimated bill
  cancellation_hours INTEGER DEFAULT 24, -- Free cancellation window
  no_show_penalty DECIMAL(10,2),

  -- Pricing & Fees
  booking_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0.50, -- Fee paid to platform per booking

  -- Special Dates (holidays, events)
  blocked_dates DATE[],
  special_hours JSONB, -- {date: "2024-12-25", hours: [{start: "12:00", end: "20:00"}]}

  -- Notifications
  notify_new_reservation BOOLEAN DEFAULT true,
  notify_cancellation BOOLEAN DEFAULT true,
  notification_email VARCHAR(255),
  notification_phone VARCHAR(20),

  -- Metadata
  special_instructions TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One settings per business
  UNIQUE(business_id)
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Reservation Details
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 90,

  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,

  -- Special Requests
  special_requests TEXT,
  dietary_restrictions TEXT,
  occasion VARCHAR(50), -- birthday, anniversary, business, casual
  seating_preference VARCHAR(50), -- indoor, outdoor, window, private

  -- Status Management
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')
  ),
  confirmation_code VARCHAR(10) UNIQUE,

  -- Payment & Fees
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  deposit_paid BOOLEAN DEFAULT false,
  deposit_paid_at TIMESTAMP WITH TIME ZONE,
  booking_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),

  -- Business Actions
  confirmed_by UUID REFERENCES auth.users(id),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES auth.users(id),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,

  -- Tracking
  checked_in_at TIMESTAMP WITH TIME ZONE,
  seated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Reminders
  reminder_sent_24h BOOLEAN DEFAULT false,
  reminder_sent_2h BOOLEAN DEFAULT false,

  -- Notes
  business_notes TEXT,
  admin_notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CHECK (party_size > 0),
  CHECK (duration_minutes > 0)
);

-- Reservation Time Slots Table (For efficient availability checking)
CREATE TABLE IF NOT EXISTS reservation_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  available_capacity INTEGER NOT NULL DEFAULT 0,
  total_capacity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  price_modifier DECIMAL(5,2) DEFAULT 1.0, -- For peak hour pricing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One slot per date/time per business
  UNIQUE(business_id, slot_date, slot_time)
);

-- Reservation Notifications Table
CREATE TABLE IF NOT EXISTS reservation_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (
    notification_type IN (
      'confirmation', 'reminder_24h', 'reminder_2h',
      'cancellation', 'modification', 'no_show_warning'
    )
  ),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'failed', 'bounced')
  ),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservation Reviews Junction (Link reservations to reviews for verification)
CREATE TABLE IF NOT EXISTS reservation_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(reservation_id, review_id)
);

-- Reservation Statistics Table
CREATE TABLE IF NOT EXISTS reservation_statistics (
  business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  total_reservations INTEGER DEFAULT 0,
  confirmed_reservations INTEGER DEFAULT 0,
  completed_reservations INTEGER DEFAULT 0,
  cancelled_reservations INTEGER DEFAULT 0,
  no_show_count INTEGER DEFAULT 0,

  -- Rates
  confirmation_rate DECIMAL(5,2) DEFAULT 0, -- % of pending that get confirmed
  completion_rate DECIMAL(5,2) DEFAULT 0, -- % of confirmed that complete
  no_show_rate DECIMAL(5,2) DEFAULT 0, -- % of confirmed that no-show
  cancellation_rate DECIMAL(5,2) DEFAULT 0,

  -- Timing
  avg_party_size DECIMAL(5,2) DEFAULT 0,
  avg_advance_booking_days DECIMAL(5,2) DEFAULT 0,

  -- Revenue
  total_revenue DECIMAL(10,2) DEFAULT 0, -- Total from booking fees
  total_deposits DECIMAL(10,2) DEFAULT 0,

  -- Peak Times
  busiest_day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
  busiest_time_slot TIME,

  -- Recent Activity
  last_reservation_date TIMESTAMP WITH TIME ZONE,
  reservations_this_month INTEGER DEFAULT 0,
  reservations_last_month INTEGER DEFAULT 0,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_reservations_business_id ON reservations(business_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_confirmation_code ON reservations(confirmation_code);
CREATE INDEX idx_reservations_business_date ON reservations(business_id, reservation_date);
CREATE INDEX idx_reservations_business_status ON reservations(business_id, status);

CREATE INDEX idx_time_slots_business_date ON reservation_time_slots(business_id, slot_date);
CREATE INDEX idx_time_slots_availability ON reservation_time_slots(business_id, slot_date, is_available);

CREATE INDEX idx_notifications_reservation_id ON reservation_notifications(reservation_id);
CREATE INDEX idx_notifications_status ON reservation_notifications(status);

-- Row Level Security (RLS) Policies
ALTER TABLE reservation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_statistics ENABLE ROW LEVEL SECURITY;

-- Reservation Settings Policies
CREATE POLICY "Public can view enabled reservation settings" ON reservation_settings
  FOR SELECT USING (is_enabled = true);

-- Reservations Policies
CREATE POLICY "Users can view own reservations" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own pending/confirmed reservations" ON reservations
  FOR UPDATE USING (
    auth.uid() = user_id
    AND status IN ('pending', 'confirmed')
  );

-- Time Slots Policies
CREATE POLICY "Public can view available time slots" ON reservation_time_slots
  FOR SELECT USING (is_available = true AND slot_date >= CURRENT_DATE);

-- Statistics Policies
CREATE POLICY "Public can view reservation statistics" ON reservation_statistics
  FOR SELECT USING (true);

-- Functions

-- Generate confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate confirmation code on reservation insert
CREATE OR REPLACE FUNCTION set_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := generate_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_confirmation_code
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_confirmation_code();

-- Update time slot availability
CREATE OR REPLACE FUNCTION update_time_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status IN ('confirmed', 'pending')) THEN
    -- Decrease available capacity
    UPDATE reservation_time_slots
    SET
      available_capacity = available_capacity - NEW.party_size,
      is_available = (available_capacity - NEW.party_size) > 0
    WHERE
      business_id = NEW.business_id
      AND slot_date = NEW.reservation_date
      AND slot_time = NEW.reservation_time;

  ELSIF TG_OP = 'UPDATE' AND NEW.status IN ('cancelled', 'no_show') AND OLD.status IN ('confirmed', 'pending') THEN
    -- Increase available capacity
    UPDATE reservation_time_slots
    SET
      available_capacity = available_capacity + OLD.party_size,
      is_available = true
    WHERE
      business_id = OLD.business_id
      AND slot_date = OLD.reservation_date
      AND slot_time = OLD.reservation_time;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_time_slot_availability
  AFTER INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_time_slot_availability();

-- Update reservation statistics
CREATE OR REPLACE FUNCTION update_reservation_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reservation_statistics (business_id)
  VALUES (NEW.business_id)
  ON CONFLICT (business_id) DO NOTHING;

  UPDATE reservation_statistics
  SET
    total_reservations = (
      SELECT COUNT(*) FROM reservations WHERE business_id = NEW.business_id
    ),
    confirmed_reservations = (
      SELECT COUNT(*) FROM reservations
      WHERE business_id = NEW.business_id AND status = 'confirmed'
    ),
    completed_reservations = (
      SELECT COUNT(*) FROM reservations
      WHERE business_id = NEW.business_id AND status = 'completed'
    ),
    cancelled_reservations = (
      SELECT COUNT(*) FROM reservations
      WHERE business_id = NEW.business_id AND status = 'cancelled'
    ),
    no_show_count = (
      SELECT COUNT(*) FROM reservations
      WHERE business_id = NEW.business_id AND status = 'no_show'
    ),
    avg_party_size = (
      SELECT ROUND(AVG(party_size)::numeric, 2) FROM reservations
      WHERE business_id = NEW.business_id AND status IN ('confirmed', 'completed')
    ),
    total_revenue = (
      SELECT COALESCE(SUM(booking_fee), 0) FROM reservations
      WHERE business_id = NEW.business_id AND status = 'completed'
    ),
    last_reservation_date = NOW(),
    updated_at = NOW()
  WHERE business_id = NEW.business_id;

  -- Calculate rates
  UPDATE reservation_statistics
  SET
    confirmation_rate = CASE
      WHEN total_reservations > 0
      THEN ROUND((confirmed_reservations::numeric / total_reservations * 100), 2)
      ELSE 0
    END,
    completion_rate = CASE
      WHEN confirmed_reservations > 0
      THEN ROUND((completed_reservations::numeric / confirmed_reservations * 100), 2)
      ELSE 0
    END,
    no_show_rate = CASE
      WHEN confirmed_reservations > 0
      THEN ROUND((no_show_count::numeric / confirmed_reservations * 100), 2)
      ELSE 0
    END,
    cancellation_rate = CASE
      WHEN total_reservations > 0
      THEN ROUND((cancelled_reservations::numeric / total_reservations * 100), 2)
      ELSE 0
    END
  WHERE business_id = NEW.business_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reservation_statistics
  AFTER INSERT OR UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_reservation_statistics();

-- Auto-create time slots for enabled businesses (run daily)
CREATE OR REPLACE FUNCTION generate_time_slots_for_business(
  p_business_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_settings RECORD;
  v_current_date DATE;
  v_current_time TIME;
  v_slots_created INTEGER := 0;
BEGIN
  -- Get business settings
  SELECT * INTO v_settings
  FROM reservation_settings
  WHERE business_id = p_business_id AND is_enabled = true;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Loop through dates
  v_current_date := p_start_date;
  WHILE v_current_date <= p_end_date LOOP
    -- Check if date is blocked
    IF v_current_date = ANY(v_settings.blocked_dates) THEN
      v_current_date := v_current_date + 1;
      CONTINUE;
    END IF;

    -- Generate time slots for this date
    -- Simplified: Create slots from 11:00 to 22:00 every 30 minutes
    v_current_time := '11:00:00'::TIME;
    WHILE v_current_time <= '22:00:00'::TIME LOOP
      INSERT INTO reservation_time_slots (
        business_id,
        slot_date,
        slot_time,
        available_capacity,
        total_capacity
      )
      VALUES (
        p_business_id,
        v_current_date,
        v_current_time,
        v_settings.total_tables * v_settings.max_party_size,
        v_settings.total_tables * v_settings.max_party_size
      )
      ON CONFLICT (business_id, slot_date, slot_time) DO NOTHING;

      v_slots_created := v_slots_created + 1;
      v_current_time := v_current_time + (30 || ' minutes')::INTERVAL;
    END LOOP;

    v_current_date := v_current_date + 1;
  END LOOP;

  RETURN v_slots_created;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_reservation_settings_updated_at
  BEFORE UPDATE ON reservation_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
  BEFORE UPDATE ON reservation_time_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views

-- Available Time Slots View (for customer booking)
CREATE VIEW available_time_slots AS
SELECT
  rts.id,
  rts.business_id,
  b.name as business_name,
  b.slug as business_slug,
  rts.slot_date,
  rts.slot_time,
  rts.available_capacity,
  rts.total_capacity,
  rts.price_modifier,
  rs.min_party_size,
  rs.max_party_size,
  rs.slot_duration_minutes,
  rs.deposit_required,
  rs.deposit_amount
FROM reservation_time_slots rts
JOIN businesses b ON rts.business_id = b.id
JOIN reservation_settings rs ON rts.business_id = rs.business_id
WHERE
  rts.is_available = true
  AND rts.slot_date >= CURRENT_DATE
  AND rs.is_enabled = true
ORDER BY rts.slot_date, rts.slot_time;

-- Upcoming Reservations View
CREATE VIEW upcoming_reservations AS
SELECT
  r.*,
  b.name as business_name,
  b.slug as business_slug,
  b.address as business_address,
  b.phone as business_phone
FROM reservations r
JOIN businesses b ON r.business_id = b.id
WHERE
  r.status IN ('pending', 'confirmed')
  AND r.reservation_date >= CURRENT_DATE
ORDER BY r.reservation_date, r.reservation_time;

-- Comments
COMMENT ON TABLE reservation_settings IS 'Business reservation configuration and settings';
COMMENT ON TABLE reservations IS 'Customer table reservations and bookings';
COMMENT ON TABLE reservation_time_slots IS 'Available time slots for efficient booking';
COMMENT ON TABLE reservation_notifications IS 'Notification log for reservations';
COMMENT ON TABLE reservation_statistics IS 'Aggregated reservation stats per business';

-- Initial Data: Create statistics entries for existing businesses
INSERT INTO reservation_statistics (business_id)
SELECT id FROM businesses
ON CONFLICT (business_id) DO NOTHING;
