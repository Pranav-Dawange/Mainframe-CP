import os
import json
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

CAT_SYSTEM_PROMPT = """
You are NekoVault (or LifeVault Cat Bot), an adorable, witty, and super helpful feline AI assistant for LifeVault.
You help users manage their important documents, track warranties, check upcoming bills, verify expiry dates, and answer queries.
Personalized touches:
- Speak intelligently and directly answer the question, but with a cute, playful cat personality (e.g. occasional 'meow', 'purr', 'paw-some', or cat emojis 🐱🐾).
- Keep formatting clean with bullet points and bold highlights.
- If the user provides document context, use it accurately to tell them exact amounts, dates, and warranty statuses.
- You can express cute emotions: Happy, Curious, Proud, Sleepy, or Celebrating!
"""

def query_gemini(prompt: str, context_docs: str = "", api_key: Optional[str] = None) -> Optional[str]:
    """Query Google Gemini API"""
    key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        
        full_prompt = f"{CAT_SYSTEM_PROMPT}\n\nUSER'S VAULT DOCUMENTS CONTEXT:\n{context_docs}\n\nUSER QUERY:\n{prompt}"
        
        # Try gemini-1.5-flash or gemini-pro
        for model_name in ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro"]:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(full_prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as model_err:
                print(f"[Gemini] Model {model_name} failed: {model_err}")
                continue
    except Exception as e:
        print(f"[Gemini API Error] {e}")
    return None


def query_groq(prompt: str, context_docs: str = "", api_key: Optional[str] = None) -> Optional[str]:
    """Query Groq API (ultra-fast backup)"""
    key = api_key or os.getenv("GROQ_API_KEY")
    if not key:
        return None
    try:
        from groq import Groq
        client = Groq(api_key=key)
        
        messages = [
            {"role": "system", "content": CAT_SYSTEM_PROMPT},
            {"role": "user", "content": f"USER'S VAULT DOCUMENTS CONTEXT:\n{context_docs}\n\nUSER QUERY:\n{prompt}"}
        ]
        
        for model_name in ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]:
            try:
                chat_completion = client.chat.completions.create(
                    messages=messages,
                    model=model_name,
                    temperature=0.7,
                    max_tokens=1024,
                )
                if chat_completion.choices and chat_completion.choices[0].message.content:
                    return chat_completion.choices[0].message.content.strip()
            except Exception as model_err:
                print(f"[Groq] Model {model_name} failed: {model_err}")
                continue
    except Exception as e:
        print(f"[Groq API Error] {e}")
    return None


def fallback_cat_agent(prompt: str, context_docs_list: List[Dict[str, Any]]) -> str:
    """
    Intelligent local fallback if neither Gemini nor Groq API keys are provided.
    Parses user question against actual vault records with cat persona.
    """
    q = prompt.lower()
    
    # 1. Warranty question
    if "warranty" in q or "guarantee" in q or "expire" in q or "expiry" in q:
        warranties = [d for d in context_docs_list if d.get("warranty_end_date")]
        if not warranties:
            return "Purr~ 🐾 I checked your vault and you don't have any active warranties registered yet! Meow, upload a receipt or warranty card so I can keep my paws on it for you! ✨"
        
        reply = "Meow! Here is what my whiskers found in your warranty tracker: 🐾\n\n"
        for w in warranties:
            w_date = w.get("warranty_end_date")
            dt_str = w_date.strftime("%d %b %Y") if hasattr(w_date, "strftime") else str(w_date)
            reply += f"• **{w.get('name')}**: Warranty valid until **{dt_str}** ({w.get('status', 'Active')})\n"
        reply += "\nI'll make sure you get reminded before any of these expire! Purrr~ 🐱"
        return reply

    # 2. Spend / Bill / Amount question
    if any(k in q for k in ["how much", "spend", "spent", "total", "bill", "invoice", "cost", "money", "rupee", "amount"]):
        docs_with_amount = [d for d in context_docs_list if d.get("amount")]
        if not docs_with_amount:
            return "Nya~ 🐱 I looked through all your documents, but none have amount records yet. Upload an invoice or utility bill and my OCR scanners will read every rupee! 📄🔍"
        
        total = sum(float(d.get("amount", 0)) for d in docs_with_amount)
        reply = f"Paw-some question! 🐾 Based on your scanned bills and invoices, here is your spending summary:\n\n"
        reply += f"💰 **Total Recorded Amount:** **₹{total:,.2f}** across {len(docs_with_amount)} document(s).\n\n"
        reply += "**Recent Bills & Purchases:**\n"
        for d in docs_with_amount[:5]:
            amt = d.get('amount')
            reply += f"• **{d.get('name')}**: ₹{amt:,.2f} ({d.get('type')})\n"
        reply += "\nNeed me to check details on any specific bill? Just ask! Purrr~ 😺"
        return reply

    # 3. List documents
    if any(k in q for k in ["what documents", "show documents", "all documents", "list", "my docs"]):
        if not context_docs_list:
            return "Meow! Your vault is completely empty right now. Head over to the Upload tab to feed me some documents! 🐟"
        reply = f"Purr! 🐾 You have **{len(context_docs_list)} document(s)** safely guarded in LifeVault:\n\n"
        for d in context_docs_list[:8]:
            doc_type = d.get('type', 'Document')
            reply += f"• **{d.get('name')}** — *{doc_type}* (Status: {d.get('status')})\n"
        return reply

    # 4. Default friendly cat response
    return (
        "Meow there! 🐱 I'm your **NekoVault AI Assistant**! 🐾\n\n"
        "I can help you with:\n"
        "• Tracking your **warranties & expiry dates** 🛡️\n"
        "• Calculating total **spendings, bills & invoices** 💰\n"
        "• Finding specific documents or policy details 🔍\n"
        "• Checking auto-reversal status or Zowe logs ⚡\n\n"
        "What can this cute kitty look up for you today? Purrrr~ ✨"
    )


def ask_cat_assistant(query: str, user_docs: List[Any], user_api_key_gemini: Optional[str] = None, user_api_key_groq: Optional[str] = None) -> Dict[str, Any]:
    """
    Dual-API orchestrator:
    1. Try Gemini
    2. Fallback to Groq
    3. Fallback to high-accuracy local Cat rule engine
    """
    # Build text representation of user's vault documents
    docs_summary_list = []
    text_context = ""
    for d in user_docs:
        doc_info = {
            "name": getattr(d, "name", ""),
            "type": getattr(d, "type", ""),
            "amount": getattr(d, "amount", None),
            "invoice_number": getattr(d, "invoice_number", None),
            "purchase_date": getattr(d, "purchase_date", None),
            "expiry_date": getattr(d, "expiry_date", None),
            "warranty_end_date": getattr(d, "warranty_end_date", None),
            "status": getattr(d, "status", "Active"),
        }
        docs_summary_list.append(doc_info)
        text_context += f"- Document: {doc_info['name']} | Type: {doc_info['type']} | Amount: {doc_info['amount']} | Warranty Expires: {doc_info['warranty_end_date']} | Expiry: {doc_info['expiry_date']}\n"

    # 1. Try Gemini
    gemini_resp = query_gemini(query, text_context, api_key=user_api_key_gemini)
    if gemini_resp:
        return {"answer": gemini_resp, "engine": "gemini", "emotion": "happy"}

    # 2. Try Groq (Backup)
    groq_resp = query_groq(query, text_context, api_key=user_api_key_groq)
    if groq_resp:
        return {"answer": groq_resp, "engine": "groq", "emotion": "curious"}

    # 3. Local Cat Assistant Fallback
    local_resp = fallback_cat_agent(query, docs_summary_list)
    return {"answer": local_resp, "engine": "local_cat", "emotion": "celebrating"}
