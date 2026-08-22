import pdfplumber
import io

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF binary bytes using pdfplumber."""
    text_content = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content.append(extracted)
    except Exception as e:
        print(f"[PDF Parser Error] {e}")
        # Fallback text decoding if pdfplumber fails
        try:
            return pdf_bytes.decode("utf-8", errors="ignore")
        except Exception:
            return ""
            
    full_text = "\n".join(text_content).strip()
    return full_text
