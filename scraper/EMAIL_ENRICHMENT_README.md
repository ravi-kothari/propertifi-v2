# Email Enrichment Scraper for Property Managers

## Overview

This tool automatically enriches your property manager dataset by finding email addresses from company websites. Since the initial scraping found **0% email coverage**, this tool visits each company's website and extracts email addresses from:

1. Homepage
2. Contact page
3. About page
4. mailto: links
5. Meta tags

## Features

- ✅ **Multi-threaded scraping** - Process multiple websites concurrently
- ✅ **Smart email detection** - Finds emails from multiple sources
- ✅ **Intelligent prioritization** - Prefers info@, contact@, hello@ addresses
- ✅ **Progress tracking** - Real-time progress bar with success rate
- ✅ **Respectful scraping** - Built-in delays to avoid overwhelming servers
- ✅ **Error handling** - Continues even if some websites fail
- ✅ **Domain validation** - Filters out example/test emails

## Installation

### 1. Navigate to the scraper directory
```bash
cd /Users/ravi/Documents/gemini_projects/propertifi/scraper
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `requests` - HTTP library
- `beautifulsoup4` - HTML parsing
- `tqdm` - Progress bars
- `pandas` - Data handling (already installed)
- `lxml` - XML/HTML parser

## Usage

### Basic Usage

```bash
python email_enrichment_scraper.py
```

The script will:
1. Load `property_managers_CA_FL_DC.json`
2. Identify companies missing emails (currently all 925)
3. Ask for confirmation
4. Start scraping with 5 concurrent threads (default)
5. Save results to `property_managers_CA_FL_DC_with_emails.json`

### Interactive Prompts

**Confirmation:**
```
Proceed with enrichment? (yes/no):
```
Type `yes` or `y` to continue.

**Thread Configuration:**
```
Number of concurrent threads (1-10, recommended: 5):
```
- Lower number (1-3): Slower but more respectful to servers
- Medium (5): Balanced (recommended)
- Higher (7-10): Faster but may trigger rate limits

### Expected Runtime

| Threads | Estimated Time | Notes |
|---------|---------------|-------|
| 1 thread | 2-3 hours | Safest, slowest |
| 5 threads | 30-60 minutes | Recommended |
| 10 threads | 20-40 minutes | Fastest, may hit rate limits |

**Factors affecting speed:**
- Website response times
- Network speed
- Number of pages checked per site (homepage + contact page)

## How It Works

### Email Extraction Strategy

For each company with a website:

1. **Visit Homepage**
   - Look for mailto: links
   - Extract emails from visible text
   - Check meta tags

2. **Find Contact Page**
   - Search for contact/about links
   - Try common URL patterns (/contact, /contact-us, /about)
   - Verify page exists before scraping

3. **Extract & Validate**
   - Find all email addresses
   - Filter out test/example emails
   - Remove duplicates

4. **Prioritize Best Email**
   - First priority: info@, contact@, hello@, admin@
   - Second priority: Emails matching company domain
   - Third priority: First valid email found

### Example Output

```
Loading existing data...
Found 925 companies
925 companies missing email addresses

Starting email extraction (using 5 threads)...
Scraping emails: 100%|████████████| 925/925 [45:23<00:00, found: 647]

Email extraction complete!
Emails found: 647 out of 925 missing
Success rate: 70.0%

Final Summary:
Total companies: 925
Companies with emails: 647 (70.0%)
Companies still missing emails: 278

Sample of newly found emails:
  - ABC Property Management: info@abcpm.com
  - XYZ Realty: contact@xyzrealty.com
  - Best PM Services: hello@bestpm.com
  ...
```

## Success Rate Expectations

Based on typical scraping scenarios:

| Scenario | Expected Success Rate |
|----------|---------------------|
| **Best Case** | 70-80% |
| **Typical** | 50-70% |
| **Worst Case** | 30-50% |

**Factors affecting success:**
- ✅ Modern websites with contact forms often display emails
- ✅ Small companies more likely to show direct emails
- ❌ Large companies may hide behind contact forms
- ❌ Some sites use JavaScript to obfuscate emails
- ❌ Image-based emails won't be detected

## Output File

### File: `property_managers_CA_FL_DC_with_emails.json`

Same structure as input, but with `email` field populated:

```json
{
  "name": "ABC Property Management",
  "email": "info@abcpm.com",
  "phone": "(619) 555-0100",
  "website": "https://abcpm.com",
  ...
}
```

## Troubleshooting

### Error: "Could not find 'property_managers_CA_FL_DC.json'"

**Solution:** Make sure you're running the script from the `/scraper` directory and the JSON file exists:
```bash
ls -la property_managers_CA_FL_DC.json
```

### Error: "ModuleNotFoundError: No module named 'tqdm'"

**Solution:** Install missing dependencies:
```bash
pip install tqdm
```

### Very Low Success Rate (< 30%)

**Possible causes:**
1. Network issues - Check internet connection
2. Rate limiting - Reduce thread count to 1-3
3. Firewall/VPN blocking - Disable temporarily

### Script Hangs or Freezes

**Solution:** Ctrl+C to stop, then:
- Reduce thread count to 3 or lower
- Check if a specific website is hanging (you'll see which in progress bar)
- Restart with fewer threads

## Advanced Usage

### Test on Small Sample First

Before running on all 925 companies, test on a small sample:

```python
# Modify email_enrichment_scraper.py temporarily
def main():
    # ... existing code ...

    # Load only first 10 companies for testing
    with open(input_file, 'r') as f:
        companies = json.load(f)
    companies = companies[:10]  # Add this line

    # ... rest of code ...
```

### Custom Input/Output Files

Modify the `main()` function:

```python
input_file = 'your_custom_input.json'
output_file = 'your_custom_output.json'
```

### Adjust Timeout Settings

In the `EmailEnrichmentScraper.__init__()` method:

```python
self.timeout = 15  # Increase from 10 to 15 seconds for slow sites
```

## Data Quality Tips

After enrichment:

1. **Verify Email Format**
```python
import re
pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
# All emails should match this pattern
```

2. **Check for Generic Emails**
Look for and potentially flag:
- noreply@
- donotreply@
- info@ (often not monitored)

3. **Domain Validation**
Verify emails match company domains:
```python
from urllib.parse import urlparse
domain = urlparse(website).netloc.replace('www.', '')
# Check if email ends with @domain
```

## Integration with Database

After enrichment, import to Laravel:

```php
// artisan command
$json = json_decode(file_get_contents('property_managers_CA_FL_DC_with_emails.json'));

foreach ($json as $pm) {
    PropertyManager::create([
        'name' => $pm->name,
        'email' => $pm->email,  // Now populated!
        // ... other fields
    ]);
}
```

## Next Steps

1. ✅ **Run the enrichment** on the full dataset
2. ✅ **Review the results** - Check quality of found emails
3. ✅ **Manual enrichment** - For remaining companies without emails:
   - Visit websites manually
   - Check LinkedIn company pages
   - Use email finder tools (Hunter.io, etc.)
4. ✅ **Validate emails** - Use email validation service
5. ✅ **Import to database** - Use Laravel seeder

## Performance Optimization

### For Faster Scraping (at your own risk):

1. Increase threads to 10 (max)
2. Reduce delays:
```python
time.sleep(0.05)  # Instead of 0.1
```

3. Skip contact page lookup (only check homepage):
```python
# Comment out contact page code in scrape_email_for_company()
```

### For More Respectful Scraping:

1. Use 1-3 threads
2. Increase delays:
```python
time.sleep(1.0)  # Between requests
```

3. Add delays between companies:
```python
time.sleep(5.0)  # After each company
```

## Legal & Ethical Considerations

- ✅ **Public Information:** Email addresses found are publicly displayed on websites
- ✅ **Rate Limiting:** Script includes delays to be respectful
- ✅ **Terms of Service:** Review website ToS before large-scale scraping
- ✅ **GDPR/Privacy:** Email addresses are for B2B contact only
- ❌ **Don't:** Use for spam, sell data, or violate CAN-SPAM Act

## Support

For issues or questions:
1. Check this README
2. Review error messages carefully
3. Test with small sample first
4. Reduce thread count if experiencing issues

---

**Created:** November 28, 2025
**Version:** 1.0
**Author:** Claude Code
**Status:** Ready for Production Use
