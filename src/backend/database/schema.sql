PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    court TEXT NOT NULL,
    min_rate INTEGER NOT NULL CHECK (min_rate > 0),
    max_rate INTEGER NOT NULL CHECK (max_rate >= min_rate),
    image TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE TABLE IF NOT EXISTS booking_requests (
    id INTEGER PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
    phone TEXT NOT NULL,
    email TEXT,
    sport_id TEXT NOT NULL REFERENCES sports(id),
    preferred_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration BETWEEN 1 AND 4),
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
) STRICT;

CREATE INDEX IF NOT EXISTS bookings_schedule ON booking_requests(sport_id, preferred_date, status);

CREATE TABLE IF NOT EXISTS request_limits (
    session_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS request_limits_window ON request_limits(session_hash, created_at);
