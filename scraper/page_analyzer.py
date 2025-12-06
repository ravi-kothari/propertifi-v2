"""
Analyze the HTML structure of property management pages
to determine the correct selectors for scraping
"""

import requests
from bs4 import BeautifulSoup
import json

def analyze_page_structure(url):
    """Analyze and print the structure of a page"""
    print(f"\n{'='*60}")
    print(f"Analyzing: {url}")
    print(f"{'='*60}\n")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Print page title
    print(f"Page Title: {soup.title.string if soup.title else 'No title'}\n")

    # Look for common class patterns
    print("=== Common Class Patterns ===")
    all_classes = set()
    for element in soup.find_all(class_=True):
        if isinstance(element.get('class'), list):
            all_classes.update(element['class'])

    # Filter for likely company/listing related classes
    relevant_classes = [c for c in all_classes if any(keyword in c.lower() for keyword in
                       ['company', 'listing', 'card', 'property', 'manager', 'business', 'item'])]

    print("Relevant classes found:")
    for cls in sorted(relevant_classes)[:20]:
        print(f"  - {cls}")

    # Look for structured data
    print("\n=== Structured Data (Schema.org) ===")
    structured = soup.find_all(['div', 'article', 'section'], {'itemtype': True})
    for item in structured[:5]:
        print(f"  - {item.get('itemtype')}")

    # Look for main content areas
    print("\n=== Main Content Areas ===")
    main_sections = soup.find_all(['main', 'article', 'section'], class_=True)
    for section in main_sections[:10]:
        classes = ' '.join(section.get('class', []))
        print(f"  - <{section.name}> class='{classes}'")

    # Sample a few potential company cards
    print("\n=== Sample Company Elements ===")

    # Try different selectors
    selectors = [
        'div[class*="company"]',
        'article[class*="listing"]',
        'div[class*="card"]',
        '[itemtype*="LocalBusiness"]',
        'div[class*="property"]',
    ]

    for selector in selectors:
        elements = soup.select(selector)
        if elements:
            print(f"\nSelector: {selector} (found {len(elements)} elements)")
            if elements:
                first = elements[0]
                # Print a snippet of the HTML
                print(f"Sample HTML (first 500 chars):")
                print(str(first)[:500] + "...")

                # Try to find text that looks like company names
                headers = first.find_all(['h1', 'h2', 'h3', 'h4', 'a'])
                if headers:
                    print("Potential company names:")
                    for h in headers[:3]:
                        text = h.get_text(strip=True)
                        if text and len(text) > 3:
                            print(f"  - {text[:100]}")
            break  # Found something, stop looking

    # Save full HTML for manual inspection
    print("\n=== Saving Full HTML ===")
    filename = 'page_sample.html'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(soup.prettify())
    print(f"Full HTML saved to: {filename}")

    # Save text content
    print("\n=== Sample Text Content ===")
    # Get all text, look for patterns
    text = soup.get_text(separator='\n', strip=True)
    lines = [line for line in text.split('\n') if line.strip()]

    # Look for lines that might be company names (often in title case, reasonable length)
    potential_names = []
    for line in lines[:200]:  # Check first 200 lines
        if (10 < len(line) < 100 and
            sum(1 for c in line if c.isupper()) >= 2 and
            not line.isupper() and
            any(c.isalpha() for c in line)):
            potential_names.append(line)

    print("Potential company names from text:")
    for name in potential_names[:10]:
        print(f"  - {name}")


if __name__ == "__main__":
    # Test URLs
    test_urls = [
        "https://ipropertymanagement.com/companies/arizona/phoenix",
        "https://ipropertymanagement.com/companies/texas/austin",
    ]

    for url in test_urls:
        analyze_page_structure(url)
        print("\n" + "="*60 + "\n")
