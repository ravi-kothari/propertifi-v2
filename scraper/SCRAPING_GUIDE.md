# Property Management Scraper - Complete Guide

## ✅ What's Been Fixed

All scrapers now include these improvements:

1. **Full Descriptions** - Captures both description paragraphs (1,000+ chars)
2. **Website URLs** - Extracts "Go to website" links correctly
3. **Clean Data** - Removes all HTML links from descriptions (no competitor links)
4. **Proper Spacing** - Maintains correct text formatting
5. **Lead Gen Ready** - All traffic stays on your platform

## 📁 Updated Files

- `final_scraper.py` - Core scraper with all fixes
- `scrape_select_states.py` - For CA, FL, DC only
- `scrape_all_cities.py` - For all other states (excludes CA, FL, DC)
- `property_manager_scraper.py` - Original fixed scraper

## 🚀 How to Run

### Step 1: Scrape CA, FL, DC

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi/scraper
source venv/bin/activate
python scrape_select_states.py
```

**Output:**
- `property_managers_CA_FL_DC.csv`
- `property_managers_CA_FL_DC.json`

**What it does:**
- Scrapes all cities in California, Florida, and DC
- Shows city count and estimated time
- Asks for confirmation before starting
- Displays progress for each city

### Step 2: Scrape All Other States

```bash
python scrape_all_cities.py
```

**Output:**
- `property_managers_ALL_OTHER_STATES.csv`
- `property_managers_ALL_OTHER_STATES.json`

**What it does:**
- Scrapes all remaining US states (excludes CA, FL, DC)
- Approximately 45 states
- Estimated 2,000-3,500 companies
- 20-30 minutes runtime

## 📊 Data Structure

Each company record includes:

### Contact Information
- `name` - Company name
- `address` - Full street address
- `city` - City name
- `state` - State abbreviation
- `zip_code` - ZIP code (extracted from address)
- `phone` - Phone number
- `email` - Email address (if available)
- `website` - Company website URL

### Business Details
- `description` - Full company description (cleaned, no HTML)
- `service_types` - Types of properties managed
- `years_in_business` - Years in operation
- `rentals_managed` - Number of properties managed
- `bbb_rating` - Better Business Bureau rating

### Pricing
- `management_fee` - Monthly management fee
- `tenant_placement_fee` - One-time placement fee
- `lease_renewal_fee` - Lease renewal fee
- `miscellaneous_fees` - Other fees

### Metadata
- `source_city` - City where listed
- `source_state` - State where listed
- `source_url` - Source page URL

## ✅ Data Quality Checks

The scrapers automatically:
- ✓ Remove all HTML tags from descriptions
- ✓ Remove competitor links (ipropertymanagement.com)
- ✓ Maintain proper text spacing
- ✓ Extract zip codes from addresses
- ✓ Skip non-company sections (FAQ, TOC, etc.)
- ✓ Handle missing data gracefully

## 📈 Expected Results

### CA, FL, DC (scrape_select_states.py)
- **California**: 50-80+ cities, 500-800 companies
- **Florida**: 40-60+ cities, 400-600 companies
- **DC**: 1 city, 20-40 companies
- **Total**: ~1,000-1,500 companies

### All Other States (scrape_all_cities.py)
- **~45 states**: 2,000-3,500 companies
- Major metros: 30-60 companies each
- Smaller cities: 5-20 companies each

## 🔧 Troubleshooting

### If scraper fails:
1. Check internet connection
2. Verify venv is activated: `source venv/bin/activate`
3. Check rate limiting (script includes 2-3 sec delays)
4. Review error messages for specific issues

### If data looks incomplete:
1. Check the HTML structure hasn't changed on source site
2. Review the `extract_company_from_section` method
3. Look for companies with missing `website` or `description`

## 📝 Next Steps

After scraping:

1. **Review Data Quality**
   ```bash
   # Check CSV files
   head property_managers_CA_FL_DC.csv
   wc -l property_managers_CA_FL_DC.csv
   ```

2. **Combine Datasets** (if needed)
   ```python
   import pandas as pd
   df1 = pd.read_csv('property_managers_CA_FL_DC.csv')
   df2 = pd.read_csv('property_managers_ALL_OTHER_STATES.csv')
   df_all = pd.concat([df1, df2], ignore_index=True)
   df_all.to_csv('property_managers_COMPLETE.csv', index=False)
   ```

3. **Import to Database**
   - Use the provided database schema
   - Import CSV files to PostgreSQL
   - Run data validation queries

4. **Deploy to Lead Gen Platform**
   - Clean data ready for use
   - No competitor links in descriptions
   - All website URLs captured for "Contact" buttons

## 🎯 Lead Generation Features

The scraped data is optimized for your platform:

- **No External Links in Descriptions** - Keep users on your site
- **Direct Website URLs** - For "Contact Property Manager" CTAs
- **Complete Contact Info** - Phone, address, email for leads
- **Detailed Descriptions** - Help users make informed decisions
- **Pricing Information** - Transparent fee structures
- **BBB Ratings** - Trust indicators

## 📧 Support

If you encounter issues:
1. Check the error messages in terminal
2. Review the HTML structure of problem pages
3. Test with a single city first using `final_scraper.py`
4. Check that `final_scraper.py` has the latest fixes
