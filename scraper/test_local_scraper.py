"""
Test the scraper with the local phoenix_page.html file
"""

from bs4 import BeautifulSoup
import json
import pandas as pd
from property_manager_scraper import PropertyManagerScraper

def test_with_local_file():
    """Test scraper with local HTML file"""
    print("=== Testing Scraper with Local HTML File ===\n")

    # Read the local HTML file
    with open('phoenix_page.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Create scraper instance
    scraper = PropertyManagerScraper()

    # Find all <h2> tags with id attribute - these mark company sections
    company_headings = soup.find_all('h2', id=True)

    print(f"Found {len(company_headings)} company sections\n")

    companies = []

    for idx, heading in enumerate(company_headings[:5]):  # Test first 5 companies
        try:
            # Extract all siblings until <hr/> tag
            company_elements = [heading]
            current = heading.next_sibling

            while current:
                if current.name == 'hr':
                    break
                if current.name:  # Only add tag elements, skip text nodes
                    company_elements.append(current)
                current = current.next_sibling

            company_data = scraper.extract_company_data(company_elements)
            if company_data and company_data.get('name'):
                companies.append(company_data)
                print(f"✓ Extracted: {company_data.get('name', 'Unknown')}")

                # Print details for first company to verify
                if idx == 0:
                    print("\n=== First Company Details (Ziprent) ===")
                    for key, value in company_data.items():
                        if value:
                            if key == 'description':
                                print(f"{key}: {value[:100]}... (length: {len(value)} chars)")
                            else:
                                print(f"{key}: {value}")
                    print()
        except Exception as e:
            print(f"✗ Error extracting company {idx}: {str(e)}")
            import traceback
            traceback.print_exc()
            continue

    # Create DataFrame
    df = pd.DataFrame(companies)

    print(f"\n=== Results Summary ===")
    print(f"Total companies extracted: {len(df)}")
    print(f"\nColumns: {list(df.columns)}")

    # Check how many have full data
    print(f"\nData completeness:")
    print(f"  - With website: {df['website'].notna().sum()}/{len(df)}")
    print(f"  - With description: {df['description'].notna().sum()}/{len(df)}")
    print(f"  - With address: {df['address'].notna().sum()}/{len(df)}")
    print(f"  - With phone: {df['phone'].notna().sum()}/{len(df)}")

    # Show description lengths
    if not df['description'].isna().all():
        desc_lengths = df[df['description'].notna()]['description'].str.len()
        print(f"\nDescription lengths:")
        print(f"  - Min: {desc_lengths.min()} chars")
        print(f"  - Max: {desc_lengths.max()} chars")
        print(f"  - Average: {desc_lengths.mean():.0f} chars")

    # Save results
    df.to_csv('test_results.csv', index=False)
    df.to_json('test_results.json', orient='records', indent=2)
    print(f"\n✓ Results saved to test_results.csv and test_results.json")

    # Print sample of first 3 companies
    print(f"\n=== First 3 Companies ===")
    for idx, row in df.head(3).iterrows():
        print(f"\n{idx + 1}. {row['name']}")
        print(f"   Website: {row['website']}")
        print(f"   Description length: {len(row['description']) if row['description'] else 0} chars")

if __name__ == "__main__":
    test_with_local_file()
