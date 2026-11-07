import os
import re
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from PIL import Image
import pytesseract
import pdfplumber
import pypdf

# Configure Tesseract OCR binary path for Windows
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESSERACT_CMD):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

def extract_raw_text(file_path: str) -> str:
    """
    Extract raw text from PDF or Image file using native PDF extraction and OCR fallback.
    """
    text_content = ""
    lower_path = file_path.lower()

    if lower_path.endswith(".pdf"):
        # 1. Try pdfplumber first
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content += page_text + "\n"
        except Exception as e:
            print(f"[OCR] pdfplumber error on {file_path}: {e}")

        # 2. If text is empty or too short, fallback to pypdf
        if len(text_content.strip()) < 20:
            try:
                reader = pypdf.PdfReader(file_path)
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text_content += t + "\n"
            except Exception as e:
                print(f"[OCR] pypdf error on {file_path}: {e}")

        # 3. If still empty (scanned image PDF), render pages and run tesseract
        if len(text_content.strip()) < 20:
            try:
                with pdfplumber.open(file_path) as pdf:
                    for i, page in enumerate(pdf.pages[:5]): # OCR first 5 pages max
                        pil_img = page.to_image(resolution=200).original
                        ocr_text = pytesseract.image_to_string(pil_img)
                        if ocr_text:
                            text_content += ocr_text + "\n"
            except Exception as e:
                print(f"[OCR] PDF raster OCR error: {e}")

    else:
        # Image file (PNG, JPG, JPEG, WEBP, TIFF, BMP)
        try:
            with Image.open(file_path) as img:
                text_content = pytesseract.image_to_string(img)
        except Exception as e:
            print(f"[OCR] Image OCR error on {file_path}: {e}")

    return text_content.strip()


def parse_document_intelligence(filename: str, raw_text: str) -> Dict[str, Any]:
    """
    Real intelligence parser that extracts:
    - Document Name / Title
    - Document Type (Invoice, Bill, Warranty, Insurance, Certificate, Receipt, Other)
    - Bill / Invoice Number
    - Total Amount / Currency
    - Purchase Date / Billing Date
    - Expiry / Due Date
    - Warranty End Date
    - Status
    """
    text_lower = raw_text.lower()
    fn_lower = filename.lower()
    combined = fn_lower + " " + text_lower

    # 1. Document Type Detection
    doc_type = "Other"
    if any(k in combined for k in ["invoice", "tax invoice", "gstin", "inv-", "inv#", "bill to", "seller"]):
        doc_type = "Invoice"
    elif any(k in combined for k in ["electricity bill", "water bill", "utility bill", "gas bill", "broadband bill", "recharge", "bill payment", "bill amount"]):
        doc_type = "Bill"
    elif any(k in combined for k in ["warranty", "guarantee", "warranty card", "warranty period", "limited warranty"]):
        doc_type = "Warranty"
    elif any(k in combined for k in ["insurance", "policy", "premium", "insure", "sum assured", "motor insurance", "health insurance"]):
        doc_type = "Insurance"
    elif any(k in combined for k in ["certificate", "certification", "completion", "degree", "diploma", "accredited"]):
        doc_type = "Certificate"
    elif any(k in combined for k in ["receipt", "cash receipt", "payment receipt", "slip", "store receipt"]):
        doc_type = "Bill"

    # 2. Meaningful Display Name
    # Try finding company or product name from first non-empty lines
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    doc_name = filename
    title_candidate = ""
    for line in lines[:6]:
        cleaned = re.sub(r'[^a-zA-Z0-9\s\-\.]', '', line).strip()
        if len(cleaned) > 3 and not any(skip in cleaned.lower() for skip in ["tax invoice", "invoice", "receipt", "page 1", "date", "bill"]):
            title_candidate = cleaned[:45]
            break
            
    if title_candidate:
        if doc_type in ["Invoice", "Bill"]:
            doc_name = f"{title_candidate} ({doc_type})"
        else:
            doc_name = f"{title_candidate}"
    else:
        # fallback clean filename without extension
        base_fn = os.path.splitext(filename)[0]
        base_fn = base_fn.replace("_", " ").replace("-", " ").title()
        doc_name = base_fn if base_fn else filename

    # 3. Invoice / Bill / Reference Number Extraction
    invoice_number = None
    inv_patterns = [
        r'(?:invoice|bill|receipt|ref|policy|order|inv)\s*(?:no|num|number|#)?\s*[:\-\.]?\s*([A-Za-z0-9\/\-_]{4,25})',
        r'#\s*([A-Za-z0-9\/\-_]{4,20})',
        r'gstin\s*[:\-\.]?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})'
    ]
    for pat in inv_patterns:
        match = re.search(pat, raw_text, re.IGNORECASE)
        if match:
            candidate = match.group(1).strip()
            # eliminate dates or pure common words
            if not re.match(r'^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$', candidate):
                invoice_number = candidate
                break

    # 4. Amount Extraction (₹, Rs, INR, $, Total, Grand Total, Net Amount)
    amount = None
    amount_patterns = [
        # Explicit total labels
        r'(?:grand\s+total|total\s+amount|net\s+payable|amount\s+due|total\s+due|final\s+total|balance\s+due|total)\s*[:\-\.]?\s*(?:₹|rs\.?|inr|\$)?\s*([\d,]+\.?\d{0,2})',
        # Currency prefix with digits
        r'(?:₹|rs\.?|inr|\$)\s*([\d,]+\.?\d{0,2})',
        # General subtotal or amount
        r'(?:subtotal|amount|charge)\s*[:\-\.]?\s*(?:₹|rs\.?|inr|\$)?\s*([\d,]+\.?\d{0,2})'
    ]
    for pat in amount_patterns:
        matches = re.findall(pat, raw_text, re.IGNORECASE)
        if matches:
            candidates = []
            for m in matches:
                clean_m = m.replace(',', '').strip()
                try:
                    val = float(clean_m)
                    if 1.0 <= val <= 10000000.0: # realistic range
                        candidates.append(val)
                except ValueError:
                    continue
            if candidates:
                # usually grand total is the maximum or primary total listed
                amount = max(candidates)
                break

    # 5. Dates Extraction (Purchase Date, Expiry Date, Warranty End Date)
    dates_found = []
    # e.g., 2026-10-12, 12/10/2026, 12-Oct-2026, 12 October 2026
    date_regex = r'\b(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}|\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{2,4})\b'
    date_matches = re.findall(date_regex, raw_text, re.IGNORECASE)

    for ds in date_matches:
        parsed_dt = _try_parse_date(ds)
        if parsed_dt:
            dates_found.append(parsed_dt)

    now = datetime.utcnow()
    purchase_date = dates_found[0] if dates_found else now

    # Search for expiry keywords
    expiry_date = None
    expiry_match = re.search(r'(?:expiry|valid\s+upto|valid\s+through|valid\s+till|due\s+date|expire[s]?\s+on)\s*[:\-\.]?\s*([0-9A-Za-z\s,\/\-\.]{6,20})', raw_text, re.IGNORECASE)
    if expiry_match:
        dt = _try_parse_date(expiry_match.group(1).strip())
        if dt:
            expiry_date = dt
    
    if not expiry_date and doc_type == "Insurance":
        expiry_date = purchase_date + timedelta(days=365)
    elif not expiry_date and doc_type == "Bill":
        expiry_date = purchase_date + timedelta(days=15) # Bill due date

    # Warranty Detection
    warranty_end_date = None
    warranty_match = re.search(r'(\d+)\s*(?:year|yr|month|mth)s?\s*(?:warranty|guarantee)', raw_text, re.IGNORECASE)
    if warranty_match:
        num = int(warranty_match.group(1))
        if "month" in warranty_match.group(0).lower():
            warranty_end_date = purchase_date + timedelta(days=num * 30)
        else:
            warranty_end_date = purchase_date + timedelta(days=num * 365)
    elif doc_type == "Warranty":
        warranty_end_date = purchase_date + timedelta(days=365)
    elif doc_type == "Invoice" and any(k in text_lower for k in ["warranty", "guarantee"]):
        warranty_end_date = purchase_date + timedelta(days=365 * 2)

    return {
        "doc_name": doc_name,
        "doc_type": doc_type,
        "amount": amount,
        "invoice_number": invoice_number,
        "purchase_date": purchase_date,
        "expiry_date": expiry_date,
        "warranty_end_date": warranty_end_date,
        "raw_text": raw_text[:2000] # store snippet
    }

def _try_parse_date(date_str: str) -> Optional[datetime]:
    date_str = date_str.strip()
    formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y",
        "%Y-%m-%d", "%Y/%m/%d",
        "%d/%m/%y", "%d-%m-%y",
        "%d %b %Y", "%d %B %Y",
        "%b %d, %Y", "%B %d, %Y", "%b %d %Y"
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            pass
    return None
