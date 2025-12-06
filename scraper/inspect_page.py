"""
Fetch and save HTML from a city page for inspection
"""

import requests
from bs4 import BeautifulSoup

url = "https://ipropertymanagement.com/companies/phoenix-az"
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print(f"Fetching: {url}\n")
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')

# Save full HTML
with open('phoenix_page.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())

print(f"Page title: {soup.title.string if soup.title else 'No title'}")
print(f"HTML saved to: phoenix_page.html")
print(f"HTML length: {len(str(soup))} characters\n")

# Look for common patterns
print("Searching for company-related content...\n")

# Try to find headings that might be company names
print("=== H2 Headings (potential company names) ===")
for h2 in soup.find_all('h2')[:10]:
    print(f"  - {h2.get_text(strip=True)}")

print("\n=== H3 Headings ===")
for h3 in soup.find_all('h3')[:10]:
    print(f"  - {h3.get_text(strip=True)}")

# Look for phone numbers
print("\n=== Phone Numbers (tel: links) ===")
for link in soup.find_all('a', href=lambda x: x and 'tel:' in x)[:10]:
    print(f"  - {link.get_text(strip=True)}: {link['href']}")

# Look for addresses
print("\n=== Address Elements ===")
for addr in soup.find_all('address')[:5]:
    print(f"  - {addr.get_text(strip=True)}")

# Look for common class names
print("\n=== Div Elements with 'company' or 'card' in class name ===")
for div in soup.find_all('div', class_=True):
    classes = div.get('class', [])
    for cls in classes:
        if 'company' in cls.lower() or 'card' in cls.lower() or 'list' in cls.lower():
            print(f"  - Class: {cls}")
            # Show a snippet
            text = div.get_text(strip=True)[:100]
            print(f"    Content: {text}...")
            break

# Look for the main content area
print("\n=== Main Content Area ===")
main = soup.find('main') or soup.find(id='content') or soup.find(class_='content')
if main:
    # Get first 1000 chars
    print(str(main)[:1000])
else:
    print("No main content area found")

print("\n\nInspect the saved HTML file to understand the structure better.")
