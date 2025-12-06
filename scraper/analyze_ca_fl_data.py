"""
Comprehensive analysis of CA, FL, MD, VA property manager data
"""

import pandas as pd
import json
from collections import Counter

# Load the data
print("="*70)
print("DATA QUALITY ANALYSIS - CA, FL, MD, VA")
print("="*70)

try:
    df = pd.read_csv('property_managers_CA_FL_DC_METRO.csv')
except FileNotFoundError:
    print("\n❌ ERROR: File not found!")
    print("Please run 'python scrape_select_states.py' first")
    exit(1)

# Basic stats
print(f"\n📊 OVERVIEW")
print("="*70)
print(f"Total Companies: {len(df)}")
print(f"States: {df['state'].nunique()}")
print(f"Cities: {df['city'].nunique()}")

# By state
print(f"\n📍 COMPANIES BY STATE")
print("="*70)
state_counts = df['state'].value_counts().sort_index()
for state, count in state_counts.items():
    pct = (count / len(df)) * 100
    print(f"  {state}: {count:4d} companies ({pct:5.1f}%)")

# By city (top 20)
print(f"\n🏙️  TOP 20 CITIES")
print("="*70)
city_counts = df.groupby(['city', 'state']).size().sort_values(ascending=False).head(20)
for (city, state), count in city_counts.items():
    print(f"  {city:25s} {state:2s}: {count:3d} companies")

# Data completeness
print(f"\n✅ DATA COMPLETENESS")
print("="*70)
for col in df.columns:
    non_null = df[col].notna().sum()
    pct = (non_null / len(df)) * 100
    status = "✅" if pct >= 90 else "⚠️ " if pct >= 50 else "❌"
    print(f"{status} {col:30s}: {non_null:4d}/{len(df)} ({pct:5.1f}%)")

# BBB Ratings
print(f"\n⭐ BBB RATINGS DISTRIBUTION")
print("="*70)
bbb_counts = df['bbb_rating'].value_counts().sort_index()
total_rated = df['bbb_rating'].notna().sum()
for rating, count in bbb_counts.items():
    if pd.notna(rating):
        pct = (count / total_rated) * 100
        bar = "█" * int(pct / 2)
        print(f"  {rating:3s}: {count:4d} ({pct:5.1f}%) {bar}")

# A+ companies by state
print(f"\n🏆 A+ RATED COMPANIES BY STATE")
print("="*70)
a_plus = df[df['bbb_rating'] == 'A+']
for state in sorted(df['state'].unique()):
    state_a_plus = len(a_plus[a_plus['state'] == state])
    state_total = len(df[df['state'] == state])
    if state_total > 0:
        pct = (state_a_plus / state_total) * 100
        print(f"  {state}: {state_a_plus:3d}/{state_total:3d} ({pct:5.1f}%)")

# Fee analysis
print(f"\n💰 FEE STRUCTURE ANALYSIS")
print("="*70)

def extract_fee(fee_str):
    if pd.isna(fee_str):
        return None
    import re
    numbers = re.findall(r'\$?(\d+(?:,\d+)?(?:\.\d+)?)', str(fee_str))
    if numbers:
        return float(numbers[0].replace(',', ''))
    return None

df['fee_numeric'] = df['management_fee'].apply(extract_fee)
valid_fees = df[df['fee_numeric'].notna()]['fee_numeric']

if len(valid_fees) > 0:
    print(f"\nManagement Fee Statistics:")
    print(f"  Count:   {len(valid_fees)} companies with extractable fees")
    print(f"  Average: ${valid_fees.mean():.2f}")
    print(f"  Median:  ${valid_fees.median():.2f}")
    print(f"  Min:     ${valid_fees.min():.2f}")
    print(f"  Max:     ${valid_fees.max():.2f}")

    # Fee ranges
    print(f"\n  Fee Ranges:")
    print(f"    $0-50:    {len(valid_fees[valid_fees <= 50])} companies")
    print(f"    $51-100:  {len(valid_fees[(valid_fees > 50) & (valid_fees <= 100)])} companies")
    print(f"    $101-150: {len(valid_fees[(valid_fees > 100) & (valid_fees <= 150)])} companies")
    print(f"    $151+:    {len(valid_fees[valid_fees > 150])} companies")

# Fee type availability
print(f"\n  Fee Type Availability:")
print(f"    Management Fee:       {df['management_fee'].notna().sum():4d} ({df['management_fee'].notna().sum()/len(df)*100:5.1f}%)")
print(f"    Tenant Placement:     {df['tenant_placement_fee'].notna().sum():4d} ({df['tenant_placement_fee'].notna().sum()/len(df)*100:5.1f}%)")
print(f"    Lease Renewal:        {df['lease_renewal_fee'].notna().sum():4d} ({df['lease_renewal_fee'].notna().sum()/len(df)*100:5.1f}%)")
print(f"    Miscellaneous:        {df['miscellaneous_fees'].notna().sum():4d} ({df['miscellaneous_fees'].notna().sum()/len(df)*100:5.1f}%)")

# Service types
print(f"\n🏢 SERVICE TYPES")
print("="*70)
service_keywords = {
    'Residential': 'residential',
    'Commercial': 'commercial',
    'Multi-Family': 'multi-family',
    'Single Family': 'single family',
    'HOA': 'hoa',
    'Vacation Rental': 'vacation'
}

for keyword_label, keyword in service_keywords.items():
    count = df['service_types'].str.lower().str.contains(keyword, na=False).sum()
    if count > 0:
        pct = (count / len(df)) * 100
        print(f"  {keyword_label:20s}: {count:4d} companies ({pct:5.1f}%)")

# Experience analysis
print(f"\n📅 EXPERIENCE LEVELS")
print("="*70)

def extract_years(year_str):
    if pd.isna(year_str):
        return None
    import re
    numbers = re.findall(r'(\d+)', str(year_str))
    if numbers:
        return int(numbers[0])
    return None

df['years_numeric'] = df['years_in_business'].apply(extract_years)
valid_years = df[df['years_numeric'].notna()]['years_numeric']

if len(valid_years) > 0:
    print(f"\nYears in Business:")
    print(f"  Average: {valid_years.mean():.1f} years")
    print(f"  Median:  {valid_years.median():.1f} years")
    print(f"  Min:     {valid_years.min():.0f} years")
    print(f"  Max:     {valid_years.max():.0f} years")

    # Experience groups
    print(f"\n  Experience Distribution:")
    new = len(valid_years[valid_years <= 5])
    established = len(valid_years[(valid_years > 5) & (valid_years <= 15)])
    veteran = len(valid_years[valid_years > 15])

    print(f"    New (0-5 years):         {new:4d} ({new/len(valid_years)*100:5.1f}%)")
    print(f"    Established (6-15 years): {established:4d} ({established/len(valid_years)*100:5.1f}%)")
    print(f"    Veteran (15+ years):      {veteran:4d} ({veteran/len(valid_years)*100:5.1f}%)")

# Portfolio sizes
print(f"\n🏘️  PORTFOLIO SIZES")
print("="*70)

def extract_portfolio(portfolio_str):
    if pd.isna(portfolio_str):
        return None
    import re
    # Remove commas and extract numbers
    clean = str(portfolio_str).replace(',', '')
    numbers = re.findall(r'(\d+)', clean)
    if numbers:
        return int(numbers[0])
    return None

df['portfolio_numeric'] = df['rentals_managed'].apply(extract_portfolio)
valid_portfolio = df[df['portfolio_numeric'].notna()]['portfolio_numeric']

if len(valid_portfolio) > 0:
    print(f"\nProperties Managed:")
    print(f"  Companies reporting: {len(valid_portfolio)}")
    print(f"  Average: {valid_portfolio.mean():.0f} properties")
    print(f"  Median:  {valid_portfolio.median():.0f} properties")
    print(f"  Min:     {valid_portfolio.min():.0f} properties")
    print(f"  Max:     {valid_portfolio.max():.0f} properties")

    # Size categories
    print(f"\n  Portfolio Size Distribution:")
    boutique = len(valid_portfolio[valid_portfolio < 100])
    small = len(valid_portfolio[(valid_portfolio >= 100) & (valid_portfolio < 500)])
    medium = len(valid_portfolio[(valid_portfolio >= 500) & (valid_portfolio < 2000)])
    large = len(valid_portfolio[valid_portfolio >= 2000])

    print(f"    Boutique (<100):      {boutique:4d} ({boutique/len(valid_portfolio)*100:5.1f}%)")
    print(f"    Small (100-499):      {small:4d} ({small/len(valid_portfolio)*100:5.1f}%)")
    print(f"    Medium (500-1,999):   {medium:4d} ({medium/len(valid_portfolio)*100:5.1f}%)")
    print(f"    Large (2,000+):       {large:4d} ({large/len(valid_portfolio)*100:5.1f}%)")

# Top companies by portfolio size
print(f"\n🌟 TOP 10 COMPANIES BY PORTFOLIO SIZE")
print("="*70)
top_companies = df[df['portfolio_numeric'].notna()].nlargest(10, 'portfolio_numeric')
for idx, row in top_companies.iterrows():
    print(f"  {row['name'][:40]:40s} {row['city']:15s} {row['state']}: {row['portfolio_numeric']:>6,.0f} properties")

# Missing data analysis
print(f"\n⚠️  MISSING DATA ANALYSIS")
print("="*70)
print(f"\nFields with <90% completion:")
for col in df.columns:
    pct = (df[col].notna().sum() / len(df)) * 100
    if pct < 90:
        missing = len(df) - df[col].notna().sum()
        print(f"  {col:30s}: {missing:4d} missing ({100-pct:5.1f}%)")

# Sample companies from each state
print(f"\n📋 SAMPLE COMPANIES (1 per state)")
print("="*70)
for state in sorted(df['state'].unique()):
    sample = df[df['state'] == state].iloc[0]
    print(f"\n{state} - {sample['name']}")
    print(f"  Address: {sample['address']}")
    print(f"  Phone: {sample['phone']}")
    print(f"  BBB: {sample['bbb_rating']} | Experience: {sample['years_in_business']}")
    print(f"  Fee: {sample['management_fee']}")

# Summary scores
print(f"\n{'='*70}")
print("📊 DATA QUALITY SCORES")
print("="*70)

# Calculate scores
core_fields = ['name', 'address', 'phone', 'city', 'state', 'zip_code']
core_score = sum(df[col].notna().sum() for col in core_fields) / (len(df) * len(core_fields)) * 100

business_fields = ['bbb_rating', 'years_in_business', 'rentals_managed', 'service_types']
business_score = sum(df[col].notna().sum() for col in business_fields) / (len(df) * len(business_fields)) * 100

pricing_fields = ['management_fee']
pricing_score = df['management_fee'].notna().sum() / len(df) * 100

description_score = df['description'].notna().sum() / len(df) * 100

overall_score = (core_score + business_score + pricing_score + description_score) / 4

print(f"\n  Core Contact Info:     {core_score:5.1f}%  {'✅' if core_score >= 95 else '⚠️'}")
print(f"  Business Information:  {business_score:5.1f}%  {'✅' if business_score >= 90 else '⚠️'}")
print(f"  Pricing Information:   {pricing_score:5.1f}%  {'✅' if pricing_score >= 90 else '⚠️'}")
print(f"  Descriptions:          {description_score:5.1f}%  {'✅' if description_score >= 90 else '⚠️'}")
print(f"  " + "-"*50)
print(f"  OVERALL QUALITY:       {overall_score:5.1f}%  {'✅' if overall_score >= 90 else '⚠️'}")

# Recommendations
print(f"\n{'='*70}")
print("💡 RECOMMENDATIONS")
print("="*70)

if overall_score >= 95:
    print("  ✅ Excellent data quality - ready for production use!")
elif overall_score >= 90:
    print("  ✅ Very good data quality - minor improvements possible")
else:
    print("  ⚠️  Good data quality - consider enrichment")

print(f"\n  Next Steps:")
print(f"  1. Review sample companies above")
print(f"  2. Import to database using database_schema.sql")
print(f"  3. Consider enrichment for missing emails/websites")
print(f"  4. Run remaining states scraper when ready")

print("\n" + "="*70 + "\n")
