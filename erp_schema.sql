-- NFC ⇄ ERP Integration Schema
-- Description: Landing tables for real-time NFC terminal events
-- Author: DC
-- Version: 1.0 (2026-06-25)

-- 1. Worker Attendance Table
CREATE TABLE IF NOT EXISTS nxm_worker_attendance (
    event_id TEXT PRIMARY KEY,
    worker_code VARCHAR(32) NOT NULL,
    worker_name VARCHAR(128),
    direction VARCHAR(4) NOT NULL CHECK (direction IN ('in', 'out')),
    terminal_id VARCHAR(32) NOT NULL,
    line VARCHAR(16),
    event_time TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bundle Transaction Table
CREATE TABLE IF NOT EXISTS nxm_bundle_transaction (
    event_id TEXT PRIMARY KEY,
    bundle_code VARCHAR(48) NOT NULL,
    style VARCHAR(64),
    direction VARCHAR(4) NOT NULL CHECK (direction IN ('in', 'out')),
    worker_code VARCHAR(32),
    worker_name VARCHAR(128),
    terminal_id VARCHAR(32) NOT NULL,
    line VARCHAR(16),
    event_time TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Raw Event Table (Audit/Catch-all)
CREATE TABLE IF NOT EXISTS nxm_event_raw (
    event_id TEXT PRIMARY KEY,
    event_type VARCHAR(32) NOT NULL,
    payload JSONB NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Terminal Status Table
CREATE TABLE IF NOT EXISTS nxm_terminal_status (
    terminal_id VARCHAR(32) PRIMARY KEY,
    line VARCHAR(16),
    online BOOLEAN NOT NULL,
    fw VARCHAR(16),
    last_seen_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Helper Views
-- View for Worker Sessions (IN/OUT pairs)
CREATE OR REPLACE VIEW nxm_v_worker_sessions AS
WITH taps AS (
    SELECT 
        worker_code,
        worker_name,
        direction,
        event_time,
        terminal_id,
        line,
        LEAD(event_time) OVER (PARTITION BY worker_code ORDER BY event_time) AS next_time,
        LEAD(direction) OVER (PARTITION BY worker_code ORDER BY event_time) AS next_direction
    FROM nxm_worker_attendance
)
SELECT 
    worker_code,
    worker_name,
    terminal_id,
    line,
    event_time AS clock_in_time,
    next_time AS clock_out_time,
    EXTRACT(EPOCH FROM (next_time - event_time)) / 3600.0 AS worked_hours
FROM taps
WHERE direction = 'in' AND next_direction = 'out';

-- View for Bundle Count (bundles handled per worker per day)
CREATE OR REPLACE VIEW nxm_v_worker_bundle_count AS
SELECT 
    worker_code,
    worker_name,
    DATE(event_time AT TIME ZONE 'UTC') AS work_date,
    COUNT(bundle_code) AS bundles_handled
FROM nxm_bundle_transaction
WHERE direction = 'in' AND worker_code IS NOT NULL
GROUP BY worker_code, worker_name, DATE(event_time AT TIME ZONE 'UTC');
