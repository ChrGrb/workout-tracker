-- Auxiliary databases used by zero-cache for its own bookkeeping.
-- These are independent of the application (upstream) database and hold
-- the Client View Records (CVR) and the change/replication log.
CREATE DATABASE zero_cvr;
CREATE DATABASE zero_change;
