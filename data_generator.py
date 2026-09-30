import random
from datetime import datetime

# Open a local text file to write the mock data
with open("mock_data.txt", "w") as file:
    for i in range(3, 10003): # Generate 10,000 records
        account_num = f"10000{i:05d}" # 10 chars
        name = f"TEST USER {i}".ljust(24) # 24 chars, right-padded with spaces
        balance = f"{random.randint(1000, 999999):09d}" # 9 chars, zero-padded
        date = datetime.now().strftime("%Y%m%d") # 8 chars
        
        # 5% of accounts are FROZEN (F), the rest ACTIVE (A)
        status = "F" if random.random() < 0.05 else "A" 
        padding = "." * 22 # 22 chars of filler
        
        # Concatenate the exact fixed-width string
        record = f"{account_num}{name}{balance}{date}{status}{padding}\n"
        file.write(record)

print("Generated 10,000 mainframe records successfully!")