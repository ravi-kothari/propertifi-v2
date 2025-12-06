"""
Final Property Manager Scraper - Based on actual HTML structure
Extracts data from company sections starting with H2 tags
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
from typing import List, Dict

class FinalPropertyManagerScraper:
    def __init__(self):
        self.base_url = "https://ipropertymanagement.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def get_all_city_urls(self) -> List[Dict[str, str]]:
        """Get all city URLs from the main companies page"""
        print("Fetching list of all cities...")
        response = self.session.get(f"{self.base_url}/companies")
        soup = BeautifulSoup(response.content, 'html.parser')

        cities = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/companies/' in href and href.count('/') == 4:
                city_slug = href.split('/')[-1]
                if city_slug and '-' in city_slug:
                    parts = city_slug.rsplit('-', 1)
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
        unique_cities = []
        seen = set()
        for city in cities:
            if city['slug'] not in seen:
                seen.add(city['slug'])
                unique_cities.append(city)

        print(f"Found {len(unique_cities)} cities")
        return unique_cities

    def scrape_city_page(self, city_url: str, city_name: str, state: str) -> List[Dict]:
        """
        Scrape all property managers from a single city page
        The structure is:
        - Each company has an H2 heading with id attribute
        - Followed by paragraphs, UL lists, and more paragraphs
        - Ends with <hr/> tag
        """
        print(f"\nScraping: {city_name}, {state}")
        print(f"URL: {city_url}")

        try:
            response = self.session.get(city_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            companies = []

            # Find all <h2> tags with id attribute - these mark company sections
            company_headings = soup.find_all('h2', id=True)

            print(f"  Found {len(company_headings)} company sections")

            for idx, heading in enumerate(company_headings):
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

                    company_data = self.extract_company_from_section(company_elements, city_name, state, city_url)

                    if company_data and company_data.get('name'):
                        companies.append(company_data)
                        print(f"  {len(companies)}. {company_data['name']}")
                except Exception as e:
                    print(f"  Error extracting company {idx}: {str(e)}")
                    continue

            # Be respectful with delays
            time.sleep(2)

            return companies

        except Exception as e:
            print(f"Error scraping {city_url}: {str(e)}")
            return []

    def extract_company_from_section(self, elements: List, city_name: str, state: str, url: str) -> Dict:
        """
        Extract company data from a list of company elements
        Elements structure: [<h2>, <p>, <ul>, <p>, <p>]
        """
        data = {
            'name': None,
            'address': None,
            'city': city_name,
            'state': state,
            'zip_code': None,
            'phone': None,
            'email': None,
            'website': None,
            'description': None,
            'service_types': None,
            'years_in_business': None,
            'rentals_managed': None,
            'bbb_rating': None,
            'management_fee': None,
            'tenant_placement_fee': None,
            'lease_renewal_fee': None,
            'miscellaneous_fees': None,
            'source_city': city_name,
            'source_state': state,
            'source_url': url,
        }

        # Extract company name from <h2> tag
        h2_tag = elements[0]
        data['name'] = h2_tag.get_text(strip=True)

        # If name is generic or too short, skip
        if not data['name'] or len(data['name']) < 3:
            return None

        # Skip if the H2 is not a company name (e.g., "Table of Contents", "FAQ", etc.)
        skip_keywords = ['table of contents', 'faq', 'conclusion', 'summary', 'introduction', 'overview']
        if any(keyword in data['name'].lower() for keyword in skip_keywords):
            return None

        # Find all <p> and <ul> tags
        p_tags = [elem for elem in elements if elem.name == 'p']
        ul_tags = [elem for elem in elements if elem.name == 'ul']

        # Extract description from all <p> tags (excluding the one with the website link)
        description_parts = []
        for p in p_tags:
            # Check if this <p> contains the "Go to website" link
            link = p.find('a', string=re.compile(r'Go to website', re.IGNORECASE))
            if link:
                # This is the website link
                data['website'] = link.get('href')
            else:
                # This is part of the description
                # Remove all <a> tags but keep their text content with proper spacing
                # This prevents any competitor links from being included
                for a_tag in p.find_all('a'):
                    a_tag.unwrap()  # Replace <a> with its text content

                # Use separator=' ' to ensure spaces between inline elements
                text = p.get_text(separator=' ', strip=True)
                # Clean up any extra whitespace
                text = re.sub(r'\s+', ' ', text)
                if text:
                    description_parts.append(text)

        data['description'] = ' '.join(description_parts) if description_parts else None

        # Extract details from <ul> tags
        if ul_tags:
            for ul in ul_tags:
                li_tags = ul.find_all('li')
                for li in li_tags:
                    text = li.get_text(strip=True)

                    # Parse key-value pairs
                    if ':' in text:
                        key, value = text.split(':', 1)
                        key = key.strip().lower()
                        value = value.strip()

                        if 'address' in key:
                            data['address'] = value
                            # Extract zip code
                            zip_match = re.search(r'\b(\d{5}(?:-\d{4})?)\b', value)
                            if zip_match:
                                data['zip_code'] = zip_match.group(1)
                        elif 'phone' in key:
                            data['phone'] = value
                        elif 'service type' in key:
                            data['service_types'] = value
                        elif 'years in business' in key or 'years experience' in key:
                            data['years_in_business'] = value
                        elif 'rentals managed' in key or 'properties managed' in key:
                            data['rentals_managed'] = value
                        elif 'better business bureau' in key or 'bbb' in key:
                            data['bbb_rating'] = value
                        elif 'management fee' in key:
                            data['management_fee'] = value
                        elif 'tenant placement fee' in key or 'placement fee' in key:
                            data['tenant_placement_fee'] = value
                        elif 'lease renewal fee' in key or 'renewal fee' in key:
                            data['lease_renewal_fee'] = value
                        elif 'miscellaneous fee' in key or 'misc' in key or 'other fee' in key:
                            data['miscellaneous_fees'] = value
                        elif 'email' in key:
                            data['email'] = value

        return data

    def scrape_multiple_cities(self, city_list: List[Dict]) -> pd.DataFrame:
        """Scrape multiple cities"""
        all_companies = []

        for city_info in city_list:
            companies = self.scrape_city_page(
                city_info['url'],
                city_info['city'],
                city_info['state']
            )
            all_companies.extend(companies)
            time.sleep(3)  # Be respectful

        return pd.DataFrame(all_companies)

    def save_to_csv(self, df: pd.DataFrame, filename: str):
        """Save to CSV"""
        df.to_csv(filename, index=False, encoding='utf-8')
        print(f"\nData saved to {filename}")

    def save_to_json(self, df: pd.DataFrame, filename: str):
        """Save to JSON"""
        df.to_json(filename, orient='records', indent=2)
        print(f"Data saved to {filename}")


def main():
    """Test the scraper with 2 cities"""
    print("="*70)
    print("Property Manager Scraper - Final Version")
    print("="*70)

    scraper = FinalPropertyManagerScraper()

    # Get all cities
    all_cities = scraper.get_all_city_urls()

    print(f"\nSample cities:")
    for city in all_cities[:10]:
        print(f"  - {city['city']}, {city['state']}")

    # Test with Phoenix and one other city
    test_cities = [
        [c for c in all_cities if 'phoenix' in c['slug']][0],
        all_cities[0],  # First city (probably Birmingham, AL)
    ]

    print(f"\n Testing with:")
    for city in test_cities:
        print(f"  - {city['city']}, {city['state']}")

    # Scrape
    df = scraper.scrape_multiple_cities(test_cities)

    print(f"\n{'='*70}")
    print("Results Summary")
    print(f"{'='*70}")
    print(f"Total companies scraped: {len(df)}")

    if len(df) > 0:
        print(f"\nColumns:")
        for col in df.columns:
            non_null = df[col].notna().sum()
            print(f"  - {col}: {non_null}/{len(df)} filled")

        print(f"\nSample data (first 5 companies):")
        print("-" * 70)
        for idx, row in df.head(5).iterrows():
            print(f"\n#{idx+1}: {row['name']}")
            print(f"  Address: {row['address']}")
            print(f"  Phone: {row['phone']}")
            print(f"  BBB Rating: {row['bbb_rating']}")
            print(f"  Management Fee: {row['management_fee']}")
            print(f"  Website: {row['website']}")

        # Save
        scraper.save_to_csv(df, 'property_managers_final.csv')
        scraper.save_to_json(df, 'property_managers_final.json')

        print(f"\n{'='*70}")
        print("Success! Data is ready for database import.")
        print(f"{'='*70}")

    else:
        print("\nNo data scraped. Please check the page structure.")


if __name__ == "__main__":
    main()
