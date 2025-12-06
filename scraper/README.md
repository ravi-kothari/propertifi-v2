
# Property Management Company Scraper

Scrapes property management company data from iPropertyManagement.com for use in the Propertifi database.

## Overview

This scraper extracts detailed information about property management companies across 149 US cities, including:

- Company name and contact information (address, phone, email)
- Service details (types, fees, specializations)
- Business metrics (BBB rating, years in business, properties managed)
- Comprehensive descriptions

## Files

### Core Scraper
- `final_scraper.py` - **Main production scraper** - Use this one!
- `database_schema.sql` - PostgreSQL database schema for storing the data
- `requirements.txt` - Python dependencies

### Supporting Files
- `site_explorer.py` - Analyzes the main companies page structure
- `inspect_page.py` - Inspects individual city pages
- `page_analyzer.py` - General HTML structure analyzer

### Test Files
- `property_manager_scraper.py` - Initial scraper prototype
- `advanced_scraper.py` - Selenium-based scraper (not needed)
- `working_scraper.py` - Intermediate version

## Quick Start

### 1. Setup

```bash
# Navigate to scraper directory
cd /Users/ravi/Documents/gemini_projects/propertifi/scraper

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Test Run (2 cities)

```bash
# Run the scraper with 2 test cities
python final_scraper.py
```

This will scrape Phoenix, AZ and Birmingham, AL and create:
- `property_managers_final.csv`
- `property_managers_final.json`

## Data Fields Extracted

| Field | Description | Example |
|-------|-------------|---------|
| name | Company name | "Ziprent" |
| address | Full street address | "4600 E Washington St suite 300, Phoenix, AZ 85034" |
| city | City name | "Phoenix" |
| state | State abbreviation | "AZ" |
| zip_code | ZIP code | "85034" |
| phone | Phone number | "(480) 764-3762" |
| email | Email address | Usually not available on source site |
| website | Company website | Extracted from links when available |
| description | Detailed description | Full service description |
| service_types | Types of properties managed | "Residential Single Family Homes, Multi-Family" |
| years_in_business | Years of operation | "6+ years" |
| rentals_managed | Number of properties | "4,000+" |
| bbb_rating | Better Business Bureau rating | "A+" |
| management_fee | Monthly management fee | "$150 per month (Flat Fee)" |
| tenant_placement_fee | One-time placement fee | "$1,250 paid after tenant is placed" |
| lease_renewal_fee | Renewal processing fee | "$250" |
| miscellaneous_fees | Other fees | "$250 photography fee" |
| source_city | City where data was scraped from | "Phoenix" |
| source_state | State where data was scraped from | "AZ" |
| source_url | Source page URL | Full URL to source page |

## Test Results

**Test run (2 cities):**
- Cities scraped: Phoenix, AZ + Birmingham, AL
- Companies found: **71 total**
  - Phoenix: 42 companies
  - Birmingham: 29 companies
- Data completeness:
  - Core fields (name, address, phone): 97% filled
  - BBB ratings: 97% filled
  - Management fees: 97% filled
  - Optional fields (placement fees, renewal fees): 20-37% filled

## Scraping All Cities

### Option 1: Modify the Script

Edit `final_scraper.py`, around line 247, change:

```python
# FROM (test mode):
test_cities = [
    [c for c in all_cities if 'phoenix' in c['slug']][0],
    all_cities[0],
]

# TO (production mode - ALL cities):
test_cities = all_cities  # Scrape all 149 cities
```

### Option 2: Create a Full Scrape Script

```python
# save as scrape_all.py
from final_scraper import FinalPropertyManagerScraper

scraper = FinalPropertyManagerScraper()
all_cities = scraper.get_all_city_urls()

print(f"Scraping all {len(all_cities)} cities...")
print("This will take approximately 15-20 minutes...")

df = scraper.scrape_multiple_cities(all_cities)

print(f"\nTotal companies scraped: {len(df)}")
scraper.save_to_csv(df, 'property_managers_ALL_CITIES.csv')
scraper.save_to_json(df, 'property_managers_ALL_CITIES.json')
print("Done!")
```

Then run:
```bash
python scrape_all.py
```

**Estimated time:** 15-20 minutes for all 149 cities
**Expected results:** 2,000-4,000 companies

### Important Notes for Full Scrape

1. **Rate Limiting:** The scraper includes 2-3 second delays between requests to be respectful
2. **Error Handling:** If a city fails, the scraper continues with the next one
3. **Progress Tracking:** Watch console output to monitor progress
4. **File Size:** Expect ~5-10MB CSV and ~10-15MB JSON for all cities

## Database Import

### 1. Create the Database Schema

```bash
# Connect to your PostgreSQL database
psql -U your_username -d propertifi

# Run the schema
\i database_schema.sql
```

### 2. Import CSV Data

```sql
-- Import from CSV
COPY property_managers (
    name, address, city, state, zip_code, phone, email, website,
    description, service_types, years_in_business, rentals_managed,
    bbb_rating, management_fee, tenant_placement_fee, lease_renewal_fee,
    miscellaneous_fees, source_city, source_state, source_url
)
FROM '/path/to/property_managers_final.csv'
CSV HEADER;
```

### 3. Verify Import

```sql
-- Count total records
SELECT COUNT(*) FROM property_managers;

-- Companies by state
SELECT state, COUNT(*) as count
FROM property_managers
GROUP BY state
ORDER BY count DESC
LIMIT 10;

-- Companies with A+ BBB rating
SELECT name, city, state, phone
FROM property_managers
WHERE bbb_rating = 'A+'
LIMIT 10;
```

## Database Schema

The database schema includes:

### Tables
- **property_managers** - Main company data
- **scrape_jobs** - Track scraping operations
- **property_manager_reviews** - For future review scraping

### Key Features
- Full-text search on names and descriptions
- Indexes on city, state, ZIP for fast queries
- Foreign key relationships for reviews
- Metadata tracking (scraped_at, updated_at)

## Customization

### Add More Fields

Edit the `extract_company_from_section()` method in `final_scraper.py`:

```python
# Add new field extraction
elif 'your_new_field' in key:
    data['your_new_field'] = value
```

### Filter by State

```python
# Only scrape California cities
ca_cities = [c for c in all_cities if c['state'] == 'CA']
df = scraper.scrape_multiple_cities(ca_cities)
```

### Adjust Rate Limiting

```python
# In scrape_city_page(), change:
time.sleep(2)  # Change to desired delay in seconds
```

## Troubleshooting

### Issue: No data extracted
**Solution:** The page structure may have changed. Run `inspect_page.py` to analyze current structure.

### Issue: Connection errors
**Solution:** Check internet connection, or website may be blocking requests. Add longer delays.

### Issue: Partial data
**Solution:** Some cities may have different page layouts. This is normal - the scraper extracts what's available.

### Issue: Encoding errors in CSV
**Solution:** Files are saved with UTF-8 encoding. Open with UTF-8 support.

## Next Steps

1. ✅ Test scraper with 2 cities (Phoenix + Birmingham) - **DONE**
2. 🔄 Run full scrape for all 149 cities
3. 📊 Import data into PostgreSQL database
4. 🔍 Add data validation and deduplication
5. 🔄 Set up periodic re-scraping for updates
6. 📧 Enrich data with website scraping for emails/additional info
7. ⭐ Add review scraping functionality

## Data Quality Notes

- **Coverage:** 97% of companies have complete core data (name, address, phone, BBB rating)
- **Accuracy:** Data is scraped directly from source - as accurate as iPropertyManagement.com
- **Freshness:** Run scraper regularly to keep data current
- **Completeness:** Not all companies list all fee types - this is expected

## Ethical Considerations

- ✅ Respects robots.txt
- ✅ Includes delays between requests (2-3 seconds)
- ✅ Uses proper User-Agent header
- ✅ Does not overload servers
- ✅ Data is publicly available business directory information
- ✅ For legitimate business use (Propertifi platform)

## Support

For questions or issues:
1. Check the console output for error messages
2. Review the saved HTML files (`phoenix_page.html`, etc.)
3. Verify the source website hasn't changed structure
4. Adjust selectors in `extract_company_from_section()` if needed

## License

For internal use in the Propertifi project.

---

**Version:** 1.0
**Last Updated:** November 14, 2025
**Cities Available:** 149
**Expected Total Companies:** ~2,000-4,000
