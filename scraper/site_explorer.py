"""
Site Explorer - Find the correct URLs for property management companies
"""

import requests
from bs4 import BeautifulSoup
import json

def explore_main_page():
    """Manually explore the main companies page"""
    url = "https://ipropertymanagement.com/companies"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    print(f"Fetching: {url}\n")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    print(f"Page Title: {soup.title.string if soup.title else 'No title'}\n")

    # Save the HTML
    with open('companies_main_page.html', 'w', encoding='utf-8') as f:
        f.write(soup.prettify())

    # Get all links
    all_links = soup.find_all('a', href=True)

    print(f"Total links found: {len(all_links)}\n")

    # Filter for company-related links
    company_links = {}
    for link in all_links:
        href = link['href']
        text = link.get_text(strip=True)

        # Look for various patterns
        if '/companies/' in href and href.count('/') >= 3:
            company_links[href] = text

    print("=" * 60)
    print("Links with /companies/ pattern:")
    print("=" * 60)
    for href, text in list(company_links.items())[:20]:
        print(f"{text[:50]:50} -> {href}")

    # Let's also search for common property management company names in the text
    print("\n" + "=" * 60)
    print("Searching for potential company names in page text...")
    print("=" * 60)

    # Common patterns in property management company names
    text_content = soup.get_text()
    lines = [line.strip() for line in text_content.split('\n') if line.strip()]

    # Look for lines that might be company names
    potential_companies = []
    keywords = ['property management', 'realty', 'properties', 'estates', 'real estate']

    for line in lines:
        if any(keyword in line.lower() for keyword in keywords):
            if 10 < len(line) < 100:
                potential_companies.append(line)

    print("\nPotential company-related text (first 20):")
    for company in potential_companies[:20]:
        print(f"  - {company}")

    # Check for specific structure - maybe it's a table or list
    print("\n" + "=" * 60)
    print("Looking for structured data...")
    print("=" * 60)

    # Check for tables
    tables = soup.find_all('table')
    print(f"Tables found: {len(tables)}")

    # Check for list items
    lists = soup.find_all(['ul', 'ol'])
    print(f"Lists found: {len(lists)}")

    # Check for divs with specific classes
    for class_pattern in ['company', 'listing', 'directory', 'card']:
        elements = soup.find_all(class_=lambda x: x and class_pattern in x.lower())
        if elements:
            print(f"Elements with '{class_pattern}' in class: {len(elements)}")

    print("\n" + "=" * 60)
    print("Sample HTML content structure:")
    print("=" * 60)

    # Get main content area
    main_content = soup.find('main') or soup.find('article') or soup.find(id='content')
    if main_content:
        print(str(main_content)[:1000])
    else:
        print("No main content area found")

    print("\n\nFull page saved to: companies_main_page.html")
    print("Please inspect the file to understand the structure.")


if __name__ == "__main__":
    explore_main_page()
