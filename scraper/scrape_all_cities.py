"""
Scrape ALL OTHER cities from iPropertyManagement.com (excluding CA, FL, DC)
Run this after scraping CA, FL, DC separately
Estimated time: 20-30 minutes for remaining ~45 states
"""

from final_scraper import FinalPropertyManagerScraper
import time
from datetime import datetime

def main():
    print("="*70)
    print("FULL SCRAPE - All Cities")
    print("="*70)

    start_time = datetime.now()

    # Initialize scraper
    scraper = FinalPropertyManagerScraper()

    # Get all cities
    print("\nFetching list of all cities...")
    all_cities = scraper.get_all_city_urls()

    # Exclude CA, FL, DC (already scraped separately)
    excluded_states = ['CA', 'FL', 'DC']
    print(f"\nExcluding states: {', '.join(excluded_states)} (scrape separately)")
    all_cities = [c for c in all_cities if c['state'] not in excluded_states]

    print(f"\n{len(all_cities)} cities found (after excluding CA, FL, DC)")
    print(f"Estimated time: {len(all_cities) * 4 / 60:.1f} minutes")
    print("\nThis will scrape:")
    print(f"  - {len(all_cities)} cities across remaining US states")
    print(f"  - Estimated 2,000-3,500 property management companies")
    print(f"  - Files will be saved as:")
    print(f"    • property_managers_ALL_OTHER_STATES.csv")
    print(f"    • property_managers_ALL_OTHER_STATES.json")

    # Confirm
    response = input("\nContinue? (yes/no): ").strip().lower()
    if response != 'yes':
        print("Cancelled.")
        return

    print(f"\n{'='*70}")
    print("Starting scrape...")
    print(f"{'='*70}\n")

    # Scrape all cities
    df = scraper.scrape_multiple_cities(all_cities)

    # Calculate stats
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"\n{'='*70}")
    print("SCRAPING COMPLETE!")
    print(f"{'='*70}")
    print(f"Time taken: {duration/60:.1f} minutes")
    print(f"Total companies scraped: {len(df)}")
    print(f"Average per city: {len(df)/len(all_cities):.1f}")

    # Show breakdown by state
    print(f"\nTop 10 states by company count:")
    state_counts = df['state'].value_counts().head(10)
    for state, count in state_counts.items():
        print(f"  {state}: {count} companies")

    # Data quality stats
    print(f"\nData Quality:")
    print(f"  Complete addresses: {df['address'].notna().sum()} ({df['address'].notna().sum()/len(df)*100:.1f}%)")
    print(f"  Phone numbers: {df['phone'].notna().sum()} ({df['phone'].notna().sum()/len(df)*100:.1f}%)")
    print(f"  BBB ratings: {df['bbb_rating'].notna().sum()} ({df['bbb_rating'].notna().sum()/len(df)*100:.1f}%)")

    # Save files
    print(f"\n{'='*70}")
    print("Saving data...")
    print(f"{'='*70}")

    scraper.save_to_csv(df, 'property_managers_ALL_OTHER_STATES.csv')
    scraper.save_to_json(df, 'property_managers_ALL_OTHER_STATES.json')

    print(f"\n{'='*70}")
    print("SUCCESS!")
    print(f"{'='*70}")
    print("\nNext steps:")
    print("  1. Review the CSV file to verify data quality")
    print("  2. Import into PostgreSQL using database_schema.sql")
    print("  3. Run data validation and deduplication")
    print("\n")


if __name__ == "__main__":
    main()
