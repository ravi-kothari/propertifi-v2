# Quick Start: Email Enrichment in 5 Minutes

## TL;DR

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi/scraper
pip install tqdm
python email_enrichment_scraper.py
# Type "yes" when prompted
# Type "5" for thread count (recommended)
# Wait 30-60 minutes
# Done! Check property_managers_CA_FL_DC_with_emails.json
```

---

## What This Does

- 📧 Finds email addresses for 925 property managers
- 🌐 Visits each company website automatically
- 💾 Saves enriched data to new JSON file
- ⏱️ Takes ~30-60 minutes with default settings

## Prerequisites

✅ You already have:
- Python 3.x
- requests, beautifulsoup4, pandas (from existing scraper)

❌ You need to install:
- tqdm (progress bar library)

## Step-by-Step

### 1. Install tqdm
```bash
pip install tqdm
```

### 2. Navigate to scraper directory
```bash
cd /Users/ravi/Documents/gemini_projects/propertifi/scraper
```

### 3. Run the script
```bash
python email_enrichment_scraper.py
```

### 4. Answer prompts
```
Proceed with enrichment? (yes/no): yes
Number of concurrent threads (1-10, recommended: 5): 5
```

### 5. Wait for completion
You'll see:
```
Scraping emails: 45%|████████          | 417/925 [23:45<26:18, found: 289]
```

### 6. Check results
```bash
ls -lh property_managers_CA_FL_DC_with_emails.json
```

## Expected Results

### Current Data
```
Email Coverage: 0% (0 out of 925)
```

### After Enrichment
```
Email Coverage: 50-70% (460-650 out of 925)
```

That's **460-650 new email addresses!**

## What Happens Next?

The script will:
1. Load your existing `property_managers_CA_FL_DC.json`
2. For each company with a website:
   - Visit their homepage
   - Look for contact page
   - Extract email addresses
3. Save to `property_managers_CA_FL_DC_with_emails.json`

## Sample Output

```json
{
  "name": "ABC Property Management",
  "email": "info@abcpm.com",  // ← NEW!
  "phone": "(619) 555-0100",
  "website": "https://abcpm.com",
  "city": "San Diego",
  "state": "CA"
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Script hangs | Ctrl+C, reduce threads to 3 |
| ModuleNotFoundError | `pip install tqdm` |
| Low success rate | Normal! 50-70% is expected |
| File not found | Make sure you're in `/scraper` directory |

## Performance Tips

**Faster (30 min):**
```
Number of concurrent threads: 10
```

**Slower but safer (90 min):**
```
Number of concurrent threads: 3
```

**Recommended (45 min):**
```
Number of concurrent threads: 5
```

## After Completion

### 1. Check the data quality
```bash
# Count emails found
grep -o '"email":' property_managers_CA_FL_DC_with_emails.json | wc -l
```

### 2. View sample
```bash
head -50 property_managers_CA_FL_DC_with_emails.json
```

### 3. Import to database
Use the enriched JSON file in your Laravel import script.

## Need More Emails?

For companies still missing emails:
1. **Manual lookup** - Visit websites yourself
2. **LinkedIn** - Check company pages
3. **Email finders** - Tools like Hunter.io
4. **Contact forms** - Use website contact forms

---

**Ready to start?**

```bash
python email_enrichment_scraper.py
```

**Questions?** Check `EMAIL_ENRICHMENT_README.md` for detailed docs.
