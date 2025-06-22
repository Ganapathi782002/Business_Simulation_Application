-- Migration number: 0003 	 2025-06-22T09:52:23.139Z
-- Add new columns to track detailed HR and cost data historically
ALTER TABLE performance_results ADD COLUMN salary_cost REAL;
ALTER TABLE performance_results ADD COLUMN marketing_cost REAL;
ALTER TABLE performance_results ADD COLUMN rd_cost REAL;
ALTER TABLE performance_results ADD COLUMN avg_salary REAL;
ALTER TABLE performance_results ADD COLUMN training_budget REAL;