#!/bin/bash

# Test Lead Assignment Logic
# This script tests the matching logic by submitting leads with different criteria

echo "🧪 Testing Lead Assignment Logic (Distance-Based)"
echo "=================================================="

BACKEND_URL="http://localhost:8000"

# Test 1: Single family home in Beverly Hills
echo ""
echo "Test 1: Single family, 2 units, Beverly Hills (90210)"
echo "Expected: Manager 1 (close) and Manager 3 (within 50mi)"
echo "---"
curl -s -X POST "${BACKEND_URL}/api/leads" \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name": "Test User 1",
    "email": "test1@example.com",
    "phone": "555-111-1111",
    "street_address": "123 Rodeo Drive",
    "city": "Beverly Hills",
    "state": "CA",
    "zip_code": "90210",
    "property_type": "single_family",
    "number_of_units": 2,
    "square_footage": 2000,
    "preferred_contact": "email"
  }' | jq '{
    matched_count: .data.matched_managers_count,
    assignments: [.data.assignments[] | {
      manager: .manager_name,
      distance_miles: .distance_miles,
      match_score: .match_score
    }]
  }'

# Test 2: Multi-family in Manhattan
echo ""
echo "Test 2: Multi-family, 10 units, Manhattan (10001)"
echo "Expected: Manager 2 only (LA managers too far)"
echo "---"
curl -s -X POST "${BACKEND_URL}/api/leads" \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name": "Test User 2",
    "email": "test2@example.com",
    "phone": "555-222-2222",
    "street_address": "350 Fifth Avenue",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "property_type": "multi_family",
    "number_of_units": 10,
    "square_footage": 5000,
    "preferred_contact": "phone"
  }' | jq '{
    matched_count: .data.matched_managers_count,
    assignments: [.data.assignments[] | {
      manager: .manager_name,
      distance_miles: .distance_miles,
      match_score: .match_score
    }]
  }'

# Test 3: Large multi-family in Downtown LA
echo ""
echo "Test 3: Multi-family, 50 units, Downtown LA (90001)"
echo "Expected: Manager 3 only (accepts all types, large units)"
echo "---"
curl -s -X POST "${BACKEND_URL}/api/leads" \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name": "Test User 3",
    "email": "test3@example.com",
    "phone": "555-333-3333",
    "street_address": "200 S Spring St",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90001",
    "property_type": "multi_family",
    "number_of_units": 50,
    "square_footage": 20000,
    "preferred_contact": "email"
  }' | jq '{
    matched_count: .data.matched_managers_count,
    assignments: [.data.assignments[] | {
      manager: .manager_name,
      distance_miles: .distance_miles,
      match_score: .match_score
    }]
  }'

echo ""
echo "=================================================="
echo "✅ Test complete!"
echo ""
echo "📊 View lead assignments in database:"
echo "  docker-compose exec mysql mysql -u root -proot propertifi_db -e \\"
echo "  \"SELECT la.id, l.name as lead_name, u.name as manager_name, la.distance_miles, la.match_score, la.status"
echo "   FROM lead_assignments la"
echo "   JOIN leads l ON la.lead_id = l.id"
echo "   JOIN users u ON la.manager_id = u.id"
echo "   ORDER BY la.created_at DESC LIMIT 10;\""
echo ""
echo "🔑 Note: Make sure GOOGLE_MAPS_API_KEY is set in .env for geocoding"
