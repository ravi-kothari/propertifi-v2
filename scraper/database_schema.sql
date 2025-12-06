-- Database Schema for Property Management Companies
-- For use with Propertifi project

CREATE TABLE IF NOT EXISTS property_managers (
    id SERIAL PRIMARY KEY,

    -- Company Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,

    -- Contact Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(500),

    -- Business Details
    description TEXT,
    services TEXT,
    management_fee VARCHAR(100),
    bbb_rating VARCHAR(10),
    rating DECIMAL(3,2),
    review_count INTEGER,
    years_experience INTEGER,
    properties_managed INTEGER,

    -- Additional Fields
    property_types TEXT,  -- JSON array: ['residential', 'commercial', 'multi-family']
    service_areas TEXT,   -- JSON array of cities/regions served
    specializations TEXT, -- JSON array of special services

    -- Metadata
    source_url TEXT,
    source_city VARCHAR(100),
    source_state VARCHAR(2),
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,

    -- Indexes for faster queries
    CONSTRAINT phone_format CHECK (phone ~ '^[0-9\-\(\) ]+$' OR phone IS NULL)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pm_city_state ON property_managers(city, state);
CREATE INDEX IF NOT EXISTS idx_pm_state ON property_managers(state);
CREATE INDEX IF NOT EXISTS idx_pm_name ON property_managers(name);
CREATE INDEX IF NOT EXISTS idx_pm_zip ON property_managers(zip_code);
CREATE INDEX IF NOT EXISTS idx_pm_active ON property_managers(active);

-- Full text search index for company names and descriptions
CREATE INDEX IF NOT EXISTS idx_pm_name_search ON property_managers USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_pm_description_search ON property_managers USING gin(to_tsvector('english', COALESCE(description, '')));

-- Table for tracking scraping jobs
CREATE TABLE IF NOT EXISTS scrape_jobs (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    state VARCHAR(2),
    url TEXT,
    status VARCHAR(50),  -- 'pending', 'in_progress', 'completed', 'failed'
    companies_found INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,

    CONSTRAINT unique_city_state UNIQUE(city, state)
);

-- Table for property manager reviews/ratings (if we scrape reviews later)
CREATE TABLE IF NOT EXISTS property_manager_reviews (
    id SERIAL PRIMARY KEY,
    property_manager_id INTEGER REFERENCES property_managers(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    reviewer_name VARCHAR(255),
    review_date DATE,
    source VARCHAR(100),  -- 'google', 'bbb', 'yelp', etc.
    source_url TEXT,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_pm_id ON property_manager_reviews(property_manager_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON property_manager_reviews(rating);

-- Comments on tables
COMMENT ON TABLE property_managers IS 'Property management companies scraped from various sources';
COMMENT ON TABLE scrape_jobs IS 'Tracking table for scraping operations';
COMMENT ON TABLE property_manager_reviews IS 'Customer reviews and ratings for property managers';

-- Example queries:

-- Find all property managers in a specific city
-- SELECT * FROM property_managers WHERE city = 'Phoenix' AND state = 'AZ' AND active = TRUE;

-- Find property managers with high BBB ratings
-- SELECT name, city, state, bbb_rating, phone FROM property_managers WHERE bbb_rating LIKE 'A%' ORDER BY bbb_rating DESC;

-- Search for property managers by name
-- SELECT * FROM property_managers WHERE name ILIKE '%caldwell%';

-- Get scraping statistics
-- SELECT state, COUNT(*) as company_count FROM property_managers GROUP BY state ORDER BY company_count DESC;
