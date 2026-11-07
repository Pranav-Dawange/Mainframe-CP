import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from datetime import datetime

EXCEL_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "employee_expenses.xlsx")

HEADERS = [
    "Expense ID",
    "Employee / User",
    "Role",
    "Upload Date",
    "Expense / Document Name",
    "Category / Type",
    "Invoice / Bill No.",
    "Purchase / Bill Date",
    "Amount (INR)",
    "Warranty End Date",
    "Expiry / Due Date",
    "Status",
    "Mainframe Job ID",
    "Mainframe Status"
]

def _get_or_create_workbook():
    if os.path.exists(EXCEL_FILE_PATH):
        wb = openpyxl.load_workbook(EXCEL_FILE_PATH)
        ws = wb.active
        return wb, ws

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Employee Expenses"
    ws.views.sheetView[0].showGridLines = True

    # Styling for header
    header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Navy blue
    center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='medium', color='1E3A8A')
    )

    ws.append(HEADERS)
    ws.row_dimensions[1].height = 28

    for col_idx in range(1, len(HEADERS) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = thin_border

    wb.save(EXCEL_FILE_PATH)
    return wb, ws

def append_expense_to_excel(doc, username: str, user_role: str = "Employee"):
    """
    Appends a new document/expense record to employee_expenses.xlsx.
    """
    try:
        wb, ws = _get_or_create_workbook()

        row_idx = ws.max_row + 1
        regular_font = Font(name="Segoe UI", size=10, color="0F172A")
        border = Border(
            left=Side(style='thin', color='E2E8F0'),
            right=Side(style='thin', color='E2E8F0'),
            top=Side(style='thin', color='E2E8F0'),
            bottom=Side(style='thin', color='E2E8F0')
        )
        
        # Subtle zebra striping
        zebra_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid") if row_idx % 2 == 0 else PatternFill(fill_type=None)

        upload_date_str = doc.upload_date.strftime("%Y-%m-%d %H:%M") if hasattr(doc, 'upload_date') and doc.upload_date else datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        purchase_date_str = doc.purchase_date.strftime("%Y-%m-%d") if getattr(doc, 'purchase_date', None) else "N/A"
        warranty_str = doc.warranty_end_date.strftime("%Y-%m-%d") if getattr(doc, 'warranty_end_date', None) else "N/A"
        expiry_str = doc.expiry_date.strftime("%Y-%m-%d") if getattr(doc, 'expiry_date', None) else "N/A"

        row_data = [
            getattr(doc, 'id', None) or (row_idx - 1),
            username,
            user_role.capitalize(),
            upload_date_str,
            getattr(doc, 'name', '') or "Unnamed Document",
            getattr(doc, 'type', '') or "Other",
            getattr(doc, 'invoice_number', '') or "N/A",
            purchase_date_str,
            float(getattr(doc, 'amount', 0) or 0),
            warranty_str,
            expiry_str,
            getattr(doc, 'status', 'Active') or "Active",
            getattr(doc, 'mainframe_job_id', '') or "N/A",
            getattr(doc, 'mainframe_status', '') or "Local Vault"
        ]

        ws.append(row_data)
        ws.row_dimensions[row_idx].height = 22

        for col_idx in range(1, len(row_data) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = regular_font
            cell.border = border
            if zebra_fill.fill_type:
                cell.fill = zebra_fill

            # Alignments & Formats
            if col_idx in [1, 4, 8, 10, 11]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx == 9: # Amount
                cell.alignment = Alignment(horizontal="right", vertical="center")
                cell.number_format = '₹#,##0.00'
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

        # Auto-fit column widths
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val_str = str(cell.value or '')
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

        wb.save(EXCEL_FILE_PATH)
        print(f"[EXCEL] Successfully recorded expense for document #{getattr(doc, 'id', '')} in employee_expenses.xlsx")
        return True
    except Exception as e:
        print(f"[EXCEL ERROR] Failed to record in Excel: {e}")
        return False

def sync_all_documents_to_excel(documents, get_user_fn=None):
    """
    Overwrites/rebuilds employee_expenses.xlsx with all documents in database.
    """
    try:
        if os.path.exists(EXCEL_FILE_PATH):
            try:
                os.remove(EXCEL_FILE_PATH)
            except Exception:
                pass
        
        wb, ws = _get_or_create_workbook()
        for doc in documents:
            username = "admin"
            user_role = "user"
            if get_user_fn and getattr(doc, 'user_id', None):
                user = get_user_fn(doc.user_id)
                if user:
                    username = user.username
                    user_role = user.role
            append_expense_to_excel(doc, username, user_role)
        return True
    except Exception as e:
        print(f"[EXCEL SYNC ERROR] {e}")
        return False
