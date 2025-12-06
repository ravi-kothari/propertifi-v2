"""
Scrape specific states: California, Florida, and DC Metro Area (MD, VA, DC)
"""

from final_scraper import FinalPropertyManagerScraper
import time
from datetime import datetime

def main():
    print("="*70)
    print("TARGETED SCRAPE - CA, FL, DC")
    print("="*70)

    start_time = datetime.now()

    # Initialize scraper
    scraper = FinalPropertyManagerScraper()

    # Get all cities
    print("\nFetching list of all cities...")
    all_cities = scraper.get_all_city_urls()

    # Filter for target states: California, Florida, and DC
    target_states = ['CA', 'FL', 'DC']
    filtered_cities = [c for c in all_cities if c['state'] in target_states]

    print(f"\nFiltered cities by state:")
    for state in target_states:
        state_cities = [c for c in filtered_cities if c['state'] == state]
        print(f"  {state}: {len(state_cities)} cities")

    print(f"\nTotal cities to scrape: {len(filtered_cities)}")
    print(f"Estimated time: {len(filtered_cities) * 4 / 60:.1f} minutes")

    print(f"\nCities that will be scraped:")
    for city in filtered_cities:
        print(f"  - {city['city']}, {city['state']}")

    # Confirm
    response = input("\nContinue? (yes/no): ").strip().lower()
    if response != 'yes':
        print("Cancelled.")
        return

    print(f"\n{'='*70}")
    print("Starting scrape...")
    print(f"{'='*70}\n")

    # Scrape filtered cities
    df = scraper.scrape_multiple_cities(filtered_cities)

    # Calculate stats
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"\n{'='*70}")
    print("SCRAPING COMPLETE!")
    print(f"{'='*70}")
    print(f"Time taken: {duration/60:.1f} minutes")
    print(f"Total companies scraped: {len(df)}")

    # Show breakdown by state
    print(f"\nCompanies by state:")
    for state in target_states:
        state_count = len(df[df['state'] == state])
        print(f"  {state}: {state_count} companies")

    # Show breakdown by city
    print(f"\nTop 10 cities by company count:")
    city_counts = df.groupby(['city', 'state']).size().sort_values(ascending=False).head(10)
    for (city, state), count in city_counts.items():
        print(f"  {city}, {state}: {count} companies")

    # Data quality stats
    print(f"\nData Quality:")
    print(f"  Complete addresses: {df['address'].notna().sum()} ({df['address'].notna().sum()/len(df)*100:.1f}%)")
    print(f"  Phone numbers: {df['phone'].notna().sum()} ({df['phone'].notna().sum()/len(df)*100:.1f}%)")
    print(f"  BBB ratings: {df['bbb_rating'].notna().sum()} ({df['bbb_rating'].notna().sum()/len(df)*100:.1f}%)")

    # BBB rating distribution
    print(f"\nBBB Rating Distribution:")
    bbb_counts = df['bbb_rating'].value_counts().sort_index()
    for rating, count in bbb_counts.items():
        if pd.notna(rating):
            print(f"  {rating}: {count} companies")

    # Save files
    print(f"\n{'='*70}")
    print("Saving data...")
    print(f"{'='*70}")

    scraper.save_to_csv(df, 'property_managers_CA_FL_DC.csv')
    scraper.save_to_json(df, 'property_managers_CA_FL_DC.json')

    print(f"\n{'='*70}")
    print("SUCCESS!")
    print(f"{'='*70}")
    print("\nFiles created:")
    print("  • property_managers_CA_FL_DC.csv")
    print("  • property_managers_CA_FL_DC.json")
    print("\nNext steps:")
    print("  1. Review the CSV file to verify data quality")
    print("  2. Import into PostgreSQL using database_schema.sql")
    print("  3. Run full scrape for all states if satisfied")
    print("\n")


if __name__ == "__main__":
    # Import pandas here to avoid issues
    import pandas as pd
    main()
