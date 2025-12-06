"""
Advanced Property Manager Scraper using Selenium
Handles JavaScript-rendered content
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import pandas as pd
import time
import json

class SeleniumPropertyScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.driver = None

    def setup_driver(self):
        """Initialize Chrome driver with options"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)

    def close_driver(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()

    def get_city_links_from_main_page(self):
        """Navigate to main companies page and get city links"""
        print("Navigating to companies page...")
        self.driver.get("https://ipropertymanagement.com/companies")

        # Wait for page to load
        time.sleep(3)

        # Save page source for inspection
        with open('main_page_source.html', 'w', encoding='utf-8') as f:
            f.write(self.driver.page_source)

        # Find all links that match the pattern /companies/state/city
        links = self.driver.find_elements(By.TAG_NAME, 'a')
        city_urls = []

        for link in links:
            try:
                href = link.get_attribute('href')
                text = link.text.strip()

                if href and '/companies/' in href:
                    # Check if it's a city page (has at least 2 path segments after /companies/)
                    parts = href.replace('https://ipropertymanagement.com/companies/', '').split('/')
                    if len(parts) >= 2 and parts[0] and parts[1]:
                        city_urls.append({
                            'city': text if text else parts[1].replace('-', ' ').title(),
                            'state': parts[0].replace('-', ' ').title(),
                            'url': href
                        })
            except:
                continue

        # Remove duplicates
        seen = set()
        unique_cities = []
        for city in city_urls:
            key = city['url']
            if key not in seen:
                seen.add(key)
                unique_cities.append(city)

        print(f"Found {len(unique_cities)} unique cities")
        return unique_cities

    def scrape_city_page(self, url):
        """Scrape a single city page for property managers"""
        print(f"\nScraping: {url}")
        self.driver.get(url)

        # Wait for page to load and check if we're on the right page
        time.sleep(3)

        page_title = self.driver.title
        print(f"Page title: {page_title}")

        # Save page source
        with open(f'city_page_source.html', 'w', encoding='utf-8') as f:
            f.write(self.driver.page_source)

        companies = []

        # Try multiple possible selectors for company listings
        possible_selectors = [
            (By.CLASS_NAME, 'company-card'),
            (By.CLASS_NAME, 'property-manager'),
            (By.CLASS_NAME, 'listing'),
            (By.CLASS_NAME, 'company'),
            (By.CSS_SELECTOR, '[itemtype*="LocalBusiness"]'),
            (By.CSS_SELECTOR, 'article'),
            (By.CSS_SELECTOR, '.card'),
        ]

        company_elements = []
        for selector_type, selector_value in possible_selectors:
            try:
                elements = self.driver.find_elements(selector_type, selector_value)
                if elements and len(elements) > 1:  # Found multiple elements
                    print(f"Found {len(elements)} elements using {selector_value}")
                    company_elements = elements
                    break
            except:
                continue

        if not company_elements:
            print("No company elements found with standard selectors")
            # Try to find any structured data
            self.analyze_page_structure()
            return []

        for idx, element in enumerate(company_elements[:10]):  # Limit to first 10 for testing
            try:
                company_data = self.extract_company_from_element(element)
                if company_data.get('name'):
                    companies.append(company_data)
                    print(f"  {idx+1}. {company_data['name']}")
            except Exception as e:
                print(f"  Error extracting company {idx}: {str(e)}")

        return companies

    def extract_company_from_element(self, element):
        """Extract data from a company element"""
        data = {
            'name': None,
            'address': None,
            'phone': None,
            'email': None,
            'website': None,
            'description': None,
            'rating': None,
        }

        # Get all text from element
        text = element.text
        html = element.get_attribute('innerHTML')

        # Try to find company name (usually in heading tags)
        try:
            name_elem = element.find_element(By.CSS_SELECTOR, 'h1, h2, h3, h4, a[class*="name"], a[class*="title"]')
            data['name'] = name_elem.text.strip()
        except:
            pass

        # Try to find phone
        try:
            phone_elem = element.find_element(By.CSS_SELECTOR, 'a[href^="tel:"], [class*="phone"]')
            data['phone'] = phone_elem.text.strip()
        except:
            pass

        # Try to find email
        try:
            email_elem = element.find_element(By.CSS_SELECTOR, 'a[href^="mailto:"]')
            data['email'] = email_elem.get_attribute('href').replace('mailto:', '')
        except:
            pass

        # Try to find website
        try:
            website_elem = element.find_element(By.CSS_SELECTOR, 'a[class*="website"], a[class*="url"]')
            data['website'] = website_elem.get_attribute('href')
        except:
            pass

        # Get description from paragraph or div
        try:
            desc_elem = element.find_element(By.CSS_SELECTOR, 'p, div[class*="description"]')
            data['description'] = desc_elem.text.strip()
        except:
            pass

        return data

    def analyze_page_structure(self):
        """Analyze and print page structure"""
        print("\n=== Analyzing Page Structure ===")

        # Print all h1-h4 headings
        print("\nHeadings on page:")
        for tag in ['h1', 'h2', 'h3', 'h4']:
            elements = self.driver.find_elements(By.TAG_NAME, tag)
            for elem in elements[:5]:
                print(f"  {tag}: {elem.text[:100]}")

        # Print unique class names that might be relevant
        print("\nPotential company-related classes:")
        all_elements = self.driver.find_elements(By.CSS_SELECTOR, '[class]')
        classes = set()
        for elem in all_elements:
            class_attr = elem.get_attribute('class')
            if class_attr:
                for cls in class_attr.split():
                    if any(keyword in cls.lower() for keyword in ['company', 'property', 'manager', 'listing', 'card', 'business']):
                        classes.add(cls)

        for cls in sorted(list(classes))[:20]:
            print(f"  - {cls}")

        print("\n")

    def test_scrape(self):
        """Test scraping with a few examples"""
        try:
            self.setup_driver()

            # Get city links
            cities = self.get_city_links_from_main_page()

            print(f"\nSample cities found:")
            for city in cities[:5]:
                print(f"  - {city['city']}, {city['state']}: {city['url']}")

            # Test with first 2 cities
            test_cities = cities[:2] if len(cities) >= 2 else cities

            all_companies = []
            for city_info in test_cities:
                companies = self.scrape_city_page(city_info['url'])
                for company in companies:
                    company['source_city'] = city_info['city']
                    company['source_state'] = city_info['state']
                    company['source_url'] = city_info['url']
                all_companies.extend(companies)

            # Convert to DataFrame
            if all_companies:
                df = pd.DataFrame(all_companies)
                print(f"\n=== Results ===")
                print(f"Total companies: {len(df)}")
                print(f"\nColumns: {list(df.columns)}")
                print(f"\nSample data:")
                print(df.to_string())

                # Save
                df.to_csv('property_managers_selenium.csv', index=False)
                df.to_json('property_managers_selenium.json', orient='records', indent=2)
                print("\nData saved to property_managers_selenium.csv and .json")
            else:
                print("\n No companies extracted. Check the saved HTML files to adjust selectors.")

        finally:
            self.close_driver()


if __name__ == "__main__":
    scraper = SeleniumPropertyScraper(headless=False)  # Set False to see browser
    scraper.test_scrape()
