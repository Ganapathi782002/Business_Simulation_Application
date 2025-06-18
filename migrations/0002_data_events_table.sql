-- Migration number: 0002 	 2025-06-18T06:18:39.966Z
PRAGMA foreign_keys=ON;

CREATE TABLE master_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    impact_area TEXT NOT NULL,
    impact_strength REAL NOT NULL
);

-- Populate the table with all possible events
INSERT INTO master_events (name, description, type, impact_area, impact_strength) VALUES
('Economic Boom', 'A strong economic growth period has begun, increasing consumer spending.', 'economic', 'market_size', 0.15),
('Economic Recession', 'An economic downturn has begun, reducing consumer spending.', 'economic', 'market_size', -0.10),
('Interest Rate Hike', 'Central bank has increased interest rates, affecting borrowing costs.', 'economic', 'finance', 0.02),
('Technological Breakthrough', 'A major technological breakthrough has occurred, creating new opportunities.', 'technological', 'innovation', 0.2),
('Manufacturing Innovation', 'New manufacturing techniques can reduce production costs.', 'technological', 'production_cost', -0.1),
('Environmental Regulations', 'New environmental regulations require changes to production processes.', 'regulatory', 'sustainability', 0.25),
('Tax Policy Change', 'Changes in tax policy are affecting corporate profits.', 'regulatory', 'finance', -0.05),
('New Market Entrant', 'A new aggressive competitor has entered the market.', 'competitive', 'market_share', -0.05),
('Competitor Price War', 'A major competitor has significantly reduced prices.', 'competitive', 'pricing', -0.1),
('Shifting Consumer Preferences', 'Consumers are showing stronger preference for sustainable products.', 'consumer', 'consumer_preferences', 0.2),
('Quality Expectations Increase', 'Consumers are demanding higher quality products across all segments.', 'consumer', 'quality', 0.15),
('Brand Loyalty Shift', 'Consumers are becoming less brand loyal and more value-focused.', 'consumer', 'marketing', -0.1);