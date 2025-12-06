"""
Property Manager Data Scraper for iPropertyManagement.com
Scrapes property manager listings from various cities
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import json
from typing import List, Dict
from urllib.parse import urljoin

class PropertyManagerScraper:
    def __init__(self):
        self.base_url = "https://ipropertymanagement.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def get_city_urls(self, limit=None) -> List[Dict[str, str]]:
        """
        Scrape the main companies page to get all city URLs
        """
        print("Fetching city list from main page...")
        response = self.session.get(f"{self.base_url}/companies")
        soup = BeautifulSoup(response.content, 'html.parser')

        city_links = []

        # Find all city links - adjust selectors based on actual HTML structure
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            if '/companies/' in href and href.count('/') >= 3:  # e.g., /companies/arizona/phoenix
                city_links.append({
                    'city_name': link.text.strip(),
                    'url': urljoin(self.base_url, href)
                })

        # Remove duplicates
        city_links = [dict(t) for t in {tuple(d.items()) for d in city_links}]

        if limit:
            city_links = city_links[:limit]

        print(f"Found {len(city_links)} cities")
        return city_links

    def scrape_city_page(self, city_url: str) -> List[Dict]:
        """
        Scrape all property managers from a single city page
        """
        print(f"Scraping: {city_url}")

        try:
            response = self.session.get(city_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            companies = []

            # Find all <h2> tags with id attribute - these mark company sections
            company_headings = soup.find_all('h2', id=True)

            print(f"Found {len(company_headings)} company sections")

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

                    company_data = self.extract_company_data(company_elements)
                    if company_data and company_data.get('name'):  # Only add if we got a name
                        companies.append(company_data)
                        print(f"  - Extracted: {company_data.get('name', 'Unknown')}")
                except Exception as e:
                    print(f"  - Error extracting company {idx}: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    continue

            # Add small delay to be respectful
            time.sleep(1)

            return companies

        except Exception as e:
            print(f"Error scraping {city_url}: {str(e)}")
            return []

    def extract_company_data(self, elements: List) -> Dict:
        """
        Extract all data fields from a list of company elements
        Elements structure: [<h2>, <p>, <ul>, <p>, <p>]
        """
        import re

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
            'service_types': None,
            'years_in_business': None,
            'rentals_managed': None,
            'bbb_rating': None,
            'management_fee': None,
            'tenant_placement_fee': None,
            'lease_renewal_fee': None,
            'miscellaneous_fees': None,
        }

        # Extract company name from <h2> tag
        h2_tag = elements[0]
        data['name'] = h2_tag.get_text(strip=True)

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
                        elif 'phone' in key:
                            data['phone'] = value
                        elif 'service type' in key:
                            data['service_types'] = value
                        elif 'years in business' in key:
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
                        elif 'miscellaneous fee' in key or 'misc' in key:
                            data['miscellaneous_fees'] = value
                        elif 'email' in key:
                            data['email'] = value

        return data

    def scrape_multiple_cities(self, city_urls: List[str]) -> pd.DataFrame:
        """
        Scrape multiple cities and return as DataFrame
        """
        all_companies = []

        for city_url in city_urls:
            companies = self.scrape_city_page(city_url)

            # Add source URL to each company
            for company in companies:
                company['source_url'] = city_url

            all_companies.extend(companies)

            # Be respectful with delays
            time.sleep(2)

        return pd.DataFrame(all_companies)

    def save_to_csv(self, df: pd.DataFrame, filename: str):
        """Save DataFrame to CSV"""
        df.to_csv(filename, index=False)
        print(f"Data saved to {filename}")

    def save_to_json(self, df: pd.DataFrame, filename: str):
        """Save DataFrame to JSON"""
        df.to_json(filename, orient='records', indent=2)
        print(f"Data saved to {filename}")


def test_scraper():
    """Test the scraper with a couple of examples"""
    print("=== Property Manager Scraper Test ===\n")

    scraper = PropertyManagerScraper()

    # Test with specific cities first
    test_cities = [
        "https://ipropertymanagement.com/companies/arizona/phoenix",
        "https://ipropertymanagement.com/companies/texas/austin",
    ]

    print(f"Testing with {len(test_cities)} cities...\n")

    # Scrape the test cities
    df = scraper.scrape_multiple_cities(test_cities)

    print(f"\n=== Results ===")
    print(f"Total companies scraped: {len(df)}")

    if len(df) > 0:
        print(f"\nColumns: {list(df.columns)}")
        print(f"\nSample data (first 3 rows):")
        print(df.head(3).to_string())

        # Save results
        scraper.save_to_csv(df, 'property_managers_test.csv')
        scraper.save_to_json(df, 'property_managers_test.json')
    else:
        print("\nNo data scraped. The HTML selectors may need adjustment.")
        print("Let me fetch and analyze the page structure...")


if __name__ == "__main__":
    test_scraper()
