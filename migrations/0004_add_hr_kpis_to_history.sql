-- Migration number: 0004 	 2025-06-22T10:32:57.814Z
-- Add new columns to track detailed HR data historically
ALTER TABLE performance_results ADD COLUMN total_employees INTEGER;
ALTER TABLE performance_results ADD COLUMN productivity REAL;
ALTER TABLE performance_results ADD COLUMN turnover_rate REAL;