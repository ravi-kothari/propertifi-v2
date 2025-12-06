"""
Email Enrichment Scraper for Property Managers
Reads the existing JSON data and attempts to find email addresses from company websites
"""

import json
import requests
from bs4 import BeautifulSoup
import re
import time
from typing import Dict, Optional, List
from urllib.parse import urljoin, urlparse
import concurrent.futures
from tqdm import tqdm

class EmailEnrichmentScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.timeout = 10

        # Common contact page patterns
        self.contact_page_patterns = [
            '/contact', '/contact-us', '/contactus', '/contact.html',
            '/about', '/about-us', '/aboutus', '/about.html',
            '/get-in-touch', '/reach-us', '/connect'
        ]

    def extract_emails_from_text(self, text: str) -> List[str]:
        """
        Extract email addresses from text using regex
        """
        if not text:
            return []

        # Email regex pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)

        # Filter out common non-personal emails and email images
        filtered_emails = []
        exclude_patterns = [
            'example.com', 'yourdomain.com', 'yourcompany.com',
            'email.com', 'test.com', 'sample.com', '@sentry',
            '@example', '.png', '.jpg', '.jpeg', '.gif'
        ]

        for email in emails:
            email = email.lower()
            if not any(pattern in email for pattern in exclude_patterns):
                filtered_emails.append(email)

        return list(set(filtered_emails))  # Remove duplicates

    def find_emails_on_page(self, url: str) -> List[str]:
        """
        Find email addresses on a given page
        """
        try:
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Method 1: Look for mailto: links
            mailto_emails = []
            for link in soup.find_all('a', href=True):
                if link['href'].startswith('mailto:'):
                    email = link['href'].replace('mailto:', '').split('?')[0]
                    mailto_emails.append(email)

            # Method 2: Extract from visible text
            text = soup.get_text()
            text_emails = self.extract_emails_from_text(text)

            # Method 3: Look in meta tags
            meta_emails = []
            for meta in soup.find_all('meta'):
                content = meta.get('content', '')
                meta_emails.extend(self.extract_emails_from_text(content))

            # Combine all methods
            all_emails = mailto_emails + text_emails + meta_emails
            return list(set(all_emails))  # Remove duplicates

        except Exception as e:
            return []

    def find_contact_page_url(self, base_url: str) -> Optional[str]:
        """
        Try to find the contact page URL
        """
        try:
            # First try the homepage
            response = self.session.get(base_url, timeout=self.timeout)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # Look for contact links
            for link in soup.find_all('a', href=True):
                href = link['href'].lower()
                link_text = link.get_text().lower()

                # Check if it's a contact link
                if any(pattern in href for pattern in ['/contact', '/about']) or \
                   any(word in link_text for word in ['contact', 'about', 'get in touch']):
                    full_url = urljoin(base_url, link['href'])
                    return full_url

            # If no contact link found, try common patterns
            for pattern in self.contact_page_patterns:
                try:
                    contact_url = urljoin(base_url, pattern)
                    test_response = self.session.head(contact_url, timeout=5)
                    if test_response.status_code == 200:
                        return contact_url
                except:
                    continue

        except Exception as e:
            pass

        return None

    def scrape_email_for_company(self, company: Dict) -> Optional[str]:
        """
        Attempt to find email for a single company
        Returns the best email found or None
        """
        website = company.get('website')
        if not website:
            return None

        # Ensure URL has a scheme
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website

        all_emails = []

        try:
            # 1. Check the homepage
            homepage_emails = self.find_emails_on_page(website)
            all_emails.extend(homepage_emails)

            # 2. Check the contact page
            contact_url = self.find_contact_page_url(website)
            if contact_url and contact_url != website:
                time.sleep(0.5)  # Small delay between requests
                contact_emails = self.find_emails_on_page(contact_url)
                all_emails.extend(contact_emails)

            # Remove duplicates
            all_emails = list(set(all_emails))

            if all_emails:
                # Prioritize emails
                # 1. info@, contact@, hello@
                for email in all_emails:
                    if any(prefix in email for prefix in ['info@', 'contact@', 'hello@', 'admin@']):
                        return email

                # 2. Any email from the company domain
                domain = urlparse(website).netloc.replace('www.', '')
                for email in all_emails:
                    if domain in email:
                        return email

                # 3. Return the first one found
                return all_emails[0]

        except Exception as e:
            pass

        return None

    def enrich_json_with_emails(self, input_file: str, output_file: str, max_workers: int = 5):
        """
        Read JSON file, scrape emails, and save enriched data
        """
        print("Loading existing data...")
        with open(input_file, 'r') as f:
            companies = json.load(f)

        print(f"Found {len(companies)} companies")

        # Filter companies that don't have emails
        companies_without_email = [c for c in companies if not c.get('email')]
        print(f"{len(companies_without_email)} companies missing email addresses")

        # Create a mapping for quick lookup
        company_map = {i: c for i, c in enumerate(companies)}

        print(f"\nStarting email extraction (using {max_workers} threads)...")
        emails_found = 0

        # Use ThreadPoolExecutor for concurrent scraping
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_idx = {}
            for idx, company in enumerate(companies):
                if not company.get('email') and company.get('website'):
                    future = executor.submit(self.scrape_email_for_company, company)
                    future_to_idx[future] = idx

            # Process results as they complete with progress bar
            with tqdm(total=len(future_to_idx), desc="Scraping emails") as pbar:
                for future in concurrent.futures.as_completed(future_to_idx):
                    idx = future_to_idx[future]
                    try:
                        email = future.result()
                        if email:
                            companies[idx]['email'] = email
                            emails_found += 1
                            pbar.set_postfix({'found': emails_found})
                    except Exception as e:
                        pass
                    finally:
                        pbar.update(1)
                        time.sleep(0.1)  # Small delay to be respectful

        print(f"\nEmail extraction complete!")
        print(f"Emails found: {emails_found} out of {len(companies_without_email)} missing")
        print(f"Success rate: {(emails_found/len(companies_without_email)*100):.1f}%")

        # Save enriched data
        print(f"\nSaving enriched data to {output_file}...")
        with open(output_file, 'w') as f:
            json.dump(companies, f, indent=2)

        print("Done!")

        # Print summary
        total_with_email = sum(1 for c in companies if c.get('email'))
        print(f"\nFinal Summary:")
        print(f"Total companies: {len(companies)}")
        print(f"Companies with emails: {total_with_email} ({total_with_email/len(companies)*100:.1f}%)")
        print(f"Companies still missing emails: {len(companies) - total_with_email}")

        # Show sample of found emails
        print(f"\nSample of newly found emails:")
        sample_count = 0
        for company in companies:
            if company.get('email') and company['email'] in [companies[idx].get('email') for idx in future_to_idx.values()]:
                print(f"  - {company['name']}: {company['email']}")
                sample_count += 1
                if sample_count >= 10:
                    break


def main():
    """
    Main function to enrich the existing JSON file with emails
    """
    print("="*70)
    print("Property Manager Email Enrichment Tool")
    print("="*70)
    print("\nThis tool will:")
    print("1. Read your existing property manager data")
    print("2. Visit each company's website")
    print("3. Look for email addresses on homepage and contact pages")
    print("4. Save enriched data with emails")
    print("\nThis may take 30-60 minutes for 925 companies.")
    print("="*70)

    input_file = 'property_managers_CA_FL_DC.json'
    output_file = 'property_managers_CA_FL_DC_with_emails.json'

    # Ask for confirmation
    response = input(f"\nProceed with enrichment? (yes/no): ")
    if response.lower() not in ['yes', 'y']:
        print("Cancelled.")
        return

    # Optional: ask for number of threads
    threads_response = input("\nNumber of concurrent threads (1-10, recommended: 5): ")
    try:
        max_workers = int(threads_response)
        max_workers = max(1, min(10, max_workers))
    except:
        max_workers = 5

    print(f"\nUsing {max_workers} threads for scraping...")

    scraper = EmailEnrichmentScraper()

    try:
        scraper.enrich_json_with_emails(input_file, output_file, max_workers=max_workers)
    except FileNotFoundError:
        print(f"\nError: Could not find '{input_file}'")
        print("Please make sure the file is in the same directory as this script.")
    except Exception as e:
        print(f"\nError: {str(e)}")


if __name__ == "__main__":
    main()
