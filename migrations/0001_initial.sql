PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS simulations;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS decisions;
DROP TABLE IF EXISTS market_conditions;
DROP TABLE IF EXISTS performance_results;
DROP TABLE IF EXISTS product_performance;
DROP TABLE IF EXISTS events;

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Simulations table
CREATE TABLE simulations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config TEXT NOT NULL,
  current_period INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Companies table
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cash_balance REAL NOT NULL DEFAULT 0,
  total_assets REAL NOT NULL DEFAULT 0,
  total_liabilities REAL NOT NULL DEFAULT 0,
  credit_rating TEXT NOT NULL DEFAULT 'C',
  brand_value REAL NOT NULL DEFAULT 50,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  quality_rating REAL NOT NULL DEFAULT 5,
  innovation_rating REAL NOT NULL DEFAULT 5,
  sustainability_rating REAL NOT NULL DEFAULT 5,
  production_cost REAL NOT NULL DEFAULT 0,
  selling_price REAL NOT NULL DEFAULT 0,
  inventory_level INTEGER NOT NULL DEFAULT 0,
  production_capacity INTEGER NOT NULL DEFAULT 0,
  development_cost REAL NOT NULL DEFAULT 0,
  marketing_budget REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'development',
  launch_period INTEGER,
  discontinue_period INTEGER,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Decisions table
CREATE TABLE decisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  type TEXT NOT NULL,
  data TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  processed INTEGER NOT NULL DEFAULT 0,
  processed_at TEXT
);

-- Market conditions table
CREATE TABLE market_conditions (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  total_market_size REAL NOT NULL,
  segment_distribution TEXT NOT NULL,
  economic_indicators TEXT NOT NULL,
  consumer_preferences TEXT NOT NULL,
  technology_trends TEXT NOT NULL,
  sustainability_importance REAL NOT NULL DEFAULT 0.5,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE (simulation_id, period)
);

-- Performance results table
CREATE TABLE performance_results (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  revenue REAL NOT NULL DEFAULT 0,
  costs REAL NOT NULL DEFAULT 0,
  profit REAL NOT NULL DEFAULT 0,
  market_share REAL NOT NULL DEFAULT 0,
  cash_flow REAL NOT NULL DEFAULT 0,
  roi REAL NOT NULL DEFAULT 0,
  customer_satisfaction REAL NOT NULL DEFAULT 0,
  employee_satisfaction REAL NOT NULL DEFAULT 0,
  sustainability_score REAL NOT NULL DEFAULT 0,
  innovation_score REAL NOT NULL DEFAULT 0,
  brand_value_change REAL NOT NULL DEFAULT 0,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE (company_id, period)
);

-- Product performance table
CREATE TABLE product_performance (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  sales_volume INTEGER NOT NULL DEFAULT 0,
  revenue REAL NOT NULL DEFAULT 0,
  costs REAL NOT NULL DEFAULT 0,
  profit REAL NOT NULL DEFAULT 0,
  market_share REAL NOT NULL DEFAULT 0,
  customer_satisfaction REAL NOT NULL DEFAULT 0,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE (product_id, period)
);

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_area TEXT NOT NULL,
  impact_strength REAL NOT NULL,
  affected_companies TEXT,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_companies_simulation_id ON companies(simulation_id);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_decisions_company_id ON decisions(company_id);
CREATE INDEX idx_decisions_period ON decisions(period);
CREATE INDEX idx_market_conditions_simulation_id ON market_conditions(simulation_id);
CREATE INDEX idx_performance_results_company_id ON performance_results(company_id);
CREATE INDEX idx_product_performance_product_id ON product_performance(product_id);
CREATE INDEX idx_events_simulation_id ON events(simulation_id);
CREATE INDEX idx_events_period ON events(period);

-- Insert demo user
INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES (
  'user_demo',
  'Demo User',
  'demo@example.com',
  '$2a$10$demopasswordhashvalue',
  'user',
  datetime('now'),
  datetime('now')
);
