-- Setup Test Property Managers for Lead Assignment Testing
-- Run this in your MySQL database

-- Manager 1: Beverly Hills area - single_family, 1-5 units, 25 mile radius
-- Center: Beverly Hills (34.0736, -118.4004)
INSERT INTO users (name, email, password, type, status, created_at, updated_at)
VALUES ('Test Manager 1', 'manager1@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 1, NOW(), NOW());

SET @manager1_id = LAST_INSERT_ID();

INSERT INTO user_preferences (user_id, is_active, property_types, min_units, max_units, latitude, longitude, service_radius_miles, zip_codes, created_at, updated_at)
VALUES (@manager1_id, 1, '["single_family"]', 1, 5, 34.0736, -118.4004, 25, '["90210", "90211"]', NOW(), NOW());

-- Manager 2: Manhattan area - multi_family, 5-20 units, 10 mile radius
-- Center: Manhattan (40.7580, -73.9855)
INSERT INTO users (name, email, password, type, status, created_at, updated_at)
VALUES ('Test Manager 2', 'manager2@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 1, NOW(), NOW());

SET @manager2_id = LAST_INSERT_ID();

INSERT INTO user_preferences (user_id, is_active, property_types, min_units, max_units, latitude, longitude, service_radius_miles, zip_codes, created_at, updated_at)
VALUES (@manager2_id, 1, '["multi_family"]', 5, 20, 40.7580, -73.9855, 10, '["10001", "10002"]', NOW(), NOW());

-- Manager 3: LA Downtown - accepts all types, 50 mile radius (covers wide area)
-- Center: Downtown LA (34.0522, -118.2437)
INSERT INTO users (name, email, password, type, status, created_at, updated_at)
VALUES ('Test Manager 3', 'manager3@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 1, NOW(), NOW());

SET @manager3_id = LAST_INSERT_ID();

INSERT INTO user_preferences (user_id, is_active, property_types, min_units, max_units, latitude, longitude, service_radius_miles, zip_codes, created_at, updated_at)
VALUES (@manager3_id, 1, NULL, 1, 100, 34.0522, -118.2437, 50, NULL, NOW(), NOW());

-- Manager 4: Inactive (should NOT match)
INSERT INTO users (name, email, password, type, status, created_at, updated_at)
VALUES ('Inactive Manager', 'inactive@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 0, NOW(), NOW());

SET @manager4_id = LAST_INSERT_ID();

INSERT INTO user_preferences (user_id, is_active, property_types, min_units, max_units, latitude, longitude, service_radius_miles, zip_codes, created_at, updated_at)
VALUES (@manager4_id, 1, '["single_family"]', 1, 10, 34.0736, -118.4004, 25, '["90210"]', NOW(), NOW());

-- View created test managers
SELECT
    u.id,
    u.name,
    u.type,
    u.status AS user_status,
    up.is_active AS preferences_active,
    up.property_types,
    up.min_units,
    up.max_units,
    up.latitude,
    up.longitude,
    up.service_radius_miles,
    up.zip_codes
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
WHERE u.type = 'manager'
ORDER BY u.id DESC
LIMIT 10;

-- Expected Test Results (with distance-based matching):
-- Test 1: single_family, 2 units, Beverly Hills (90210)
--   → Should match Manager 1 (close distance) and Manager 3 (within 50mi radius)
--   → Manager 1 will have higher score due to closer distance
--
-- Test 2: multi_family, 10 units, Manhattan (10001)
--   → Should match Manager 2 only (Manager 3 is in LA, too far)
--
-- Test 3: multi_family, 50 units, Downtown LA (90001)
--   → Should match Manager 3 only (accepts all types, within radius)
--   → Manager 1 won't match (wrong property type)
--   → Manager 2 won't match (too far + wrong unit range)
