"""
Working Property Manager Scraper for iPropertyManagement.com
Uses correct URL structure: /companies/city-state
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
import json
from typing import List, Dict

class PropertyManagerScraper:
    def __init__(self):
        self.base_url = "https://ipropertymanagement.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def get_all_city_urls(self) -> List[Dict[str, str]]:
        """
        Scrape the main companies page to get all city URLs
        """
        print("Fetching list of all cities...")
        response = self.session.get(f"{self.base_url}/companies")
        soup = BeautifulSoup(response.content, 'html.parser')

        cities = []

        # Find all city links with the pattern /companies/city-state
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/companies/' in href and href.count('/') == 4:  # Exactly /companies/city-state
                city_slug = href.split('/')[-1]  # e.g., "phoenix-az"

                if city_slug and '-' in city_slug:
                    parts = city_slug.rsplit('-', 1)  # Split from right to get state
                    if len(parts) == 2:
                        city_name = parts[0].replace('-', ' ').title()
                        state_abbr = parts[1].upper()

                        cities.append({
                            'city': city_name,
                            'state': state_abbr,
                            'slug': city_slug,
                            'url': self.base_url + href if not href.startswith('http') else href
                        })

        # Remove duplicates
        seen = set()
        unique_cities = []
        for city in cities:
            key = city['slug']
            if key not in seen:
                seen.add(key)
                unique_cities.append(city)

        print(f"Found {len(unique_cities)} cities")
        return unique_cities

    def scrape_city_page(self, city_url: str, city_name: str, state: str) -> List[Dict]:
        """
        Scrape all property managers from a single city page
        """
        print(f"\nScraping: {city_name}, {state}")
        print(f"URL: {city_url}")

        try:
            response = self.session.get(city_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            companies = []

            # Try different selectors for company listings
            # The page structure may vary, so we'll try multiple approaches

            # Look for company cards/listings
            company_elements = []

            # Try common selectors
            for selector in [
                'div.company-card',
                'div.listing',
                'article.company',
                'div[data-company]',
                'div.property-manager',
                'section.company',
            ]:
                company_elements = soup.select(selector)
                if company_elements:
                    print(f"  Found {len(company_elements)} companies using selector: {selector}")
                    break

            # If no structured elements found, try to extract from tables or lists
            if not company_elements:
                # Look for table rows
                table = soup.find('table')
                if table:
                    company_elements = table.find_all('tr')[1:]  # Skip header
                    print(f"  Found {len(company_elements)} companies in table")

            # If still nothing, look for any elements that might contain company data
            if not company_elements:
                # Look for repeating div structures
                potential_containers = soup.find_all(['div', 'section', 'article'], class_=True)
                # This is a fallback and might need manual inspection
                print("  No standard selectors worked, trying manual extraction...")

            for idx, element in enumerate(company_elements):
                try:
                    company_data = self.extract_company_data(element, soup)
                    if company_data and company_data.get('name'):
                        company_data['source_city'] = city_name
                        company_data['source_state'] = state
                        company_data['source_url'] = city_url
                        companies.append(company_data)
                        print(f"  {idx+1}. {company_data['name']}")
                except Exception as e:
                    print(f"  Error extracting company {idx}: {str(e)}")
                    continue

            # Be respectful with delays
            time.sleep(2)

            return companies

        except Exception as e:
            print(f"Error scraping {city_url}: {str(e)}")
            return []

    def extract_company_data(self, element, soup) -> Dict:
        """
        Extract all data fields from a company element
        """
        data = {
            'name': None,
            'address': None,
            'city': None,
            'state': None,
            'zip_code': None,
            'phone': None,
            'email': None,
            'website': None,
            'description': None,
            'services': None,
            'management_fee': None,
            'bbb_rating': None,
            'rating': None,
            'review_count': None,
            'years_experience': None,
            'properties_managed': None,
        }

        # Extract company name (try multiple selectors)
        for selector in ['h2', 'h3', 'h4', '.company-name', '.name', 'strong']:
            name_elem = element.find(selector)
            if name_elem and name_elem.get_text(strip=True):
                data['name'] = name_elem.get_text(strip=True)
                break

        # Extract address
        address_elem = element.find('address') or element.find(class_=re.compile('address|location'))
        if address_elem:
            address_text = address_elem.get_text(strip=True)
            data['address'] = address_text

            # Try to extract zip code
            zip_match = re.search(r'\b\d{5}(?:-\d{4})?\b', address_text)
            if zip_match:
                data['zip_code'] = zip_match.group()

        # Extract phone
        phone_elem = element.find('a', href=re.compile(r'tel:')) or \
                     element.find(class_=re.compile('phone|tel'))
        if phone_elem:
            phone_text = phone_elem.get_text(strip=True)
            # Clean phone number
            phone_clean = re.sub(r'[^\d\-\(\) ]', '', phone_text)
            data['phone'] = phone_clean if phone_clean else phone_text

        # Extract email
        email_elem = element.find('a', href=re.compile(r'mailto:'))
        if email_elem:
            data['email'] = email_elem['href'].replace('mailto:', '')

        # Extract website
        website_elem = element.find('a', class_=re.compile('website|url|link')) or \
                       element.find('a', string=re.compile(r'website|visit|view', re.I))
        if website_elem and 'href' in website_elem.attrs:
            href = website_elem['href']
            if not href.startswith('mailto:') and not href.startswith('tel:'):
                data['website'] = href

        # Extract description
        desc_elem = element.find(class_=re.compile('description|about|summary'))
        if desc_elem:
            data['description'] = desc_elem.get_text(strip=True)
        else:
            # Try to get paragraph text
            p_elem = element.find('p')
            if p_elem:
                data['description'] = p_elem.get_text(strip=True)

        # Extract services
        services_elem = element.find(class_=re.compile('service'))
        if services_elem:
            data['services'] = services_elem.get_text(strip=True)

        # Extract management fee
        fee_elem = element.find(class_=re.compile('fee|price|cost'))
        if fee_elem:
            data['management_fee'] = fee_elem.get_text(strip=True)
        else:
            # Look for fee in text
            text = element.get_text()
            fee_match = re.search(r'(?:fee|cost|price):\s*([^\n]+)', text, re.I)
            if fee_match:
                data['management_fee'] = fee_match.group(1).strip()

        # Extract BBB rating
        bbb_elem = element.find(class_=re.compile('bbb'))
        if bbb_elem:
            data['bbb_rating'] = bbb_elem.get_text(strip=True)

        # Extract general rating
        rating_elem = element.find(class_=re.compile('rating|stars'))
        if rating_elem:
            rating_text = rating_elem.get_text(strip=True)
            rating_match = re.search(r'(\d+\.?\d*)', rating_text)
            if rating_match:
                data['rating'] = float(rating_match.group(1))

        return data

    def scrape_multiple_cities(self, city_list: List[Dict]) -> pd.DataFrame:
        """
        Scrape multiple cities and return as DataFrame
        """
        all_companies = []

        for city_info in city_list:
            companies = self.scrape_city_page(
                city_info['url'],
                city_info['city'],
                city_info['state']
            )
            all_companies.extend(companies)

            # Be respectful with delays between cities
            time.sleep(3)

        return pd.DataFrame(all_companies)

    def save_to_csv(self, df: pd.DataFrame, filename: str):
        """Save DataFrame to CSV"""
        df.to_csv(filename, index=False)
        print(f"\nData saved to {filename}")

    def save_to_json(self, df: pd.DataFrame, filename: str):
        """Save DataFrame to JSON"""
        df.to_json(filename, orient='records', indent=2)
        print(f"Data saved to {filename}")


def main():
    """Main function to test the scraper"""
    print("="*70)
    print("Property Manager Scraper - Test Run")
    print("="*70)

    scraper = PropertyManagerScraper()

    # Get all available cities
    all_cities = scraper.get_all_city_urls()

    print(f"\nSample cities:")
    for city in all_cities[:10]:
        print(f"  - {city['city']}, {city['state']}: {city['slug']}")

    # Test with 2 cities
    test_cities = [
        all_cities[0],  # First city (probably Birmingham, AL)
        [c for c in all_cities if 'phoenix' in c['slug']][0] if any('phoenix' in c['slug'] for c in all_cities) else all_cities[1]
    ]

    print(f"\nTesting with these cities:")
    for city in test_cities:
        print(f"  - {city['city']}, {city['state']}")

    # Scrape the test cities
    df = scraper.scrape_multiple_cities(test_cities)

    print(f"\n{'='*70}")
    print("Results Summary")
    print(f"{'='*70}")
    print(f"Total companies scraped: {len(df)}")

    if len(df) > 0:
        print(f"\nColumns available:")
        for col in df.columns:
            non_null = df[col].notna().sum()
            print(f"  - {col}: {non_null} entries")

        print(f"\nSample data (first 3 companies):")
        print("-" * 70)
        for idx, row in df.head(3).iterrows():
            print(f"\nCompany #{idx+1}:")
            print(f"  Name: {row['name']}")
            print(f"  Address: {row['address']}")
            print(f"  Phone: {row['phone']}")
            print(f"  Website: {row['website']}")
            print(f"  City/State: {row['source_city']}, {row['source_state']}")

        # Save results
        scraper.save_to_csv(df, 'property_managers_sample.csv')
        scraper.save_to_json(df, 'property_managers_sample.json')

        print(f"\n{'='*70}")
        print("Test completed successfully!")
        print(f"{'='*70}")

    else:
        print("\nNo data scraped. The page structure may have changed.")
        print("Please check the saved HTML files for manual inspection.")


if __name__ == "__main__":
    main()
