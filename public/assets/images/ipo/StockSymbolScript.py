import csv

input_file = "Corp.csv"
output_file = "stock_symbols.csv"

def generate_stock_symbol(name):
    words = name.split()
    if len(words[0]) >= 3:
        stock_symbol = words[0][:5].upper()
    elif len(words) > 1 and len(words[1]) >= 3:
        stock_symbol = words[1][:5].upper()
    else:
        stock_symbol = "".join(word[:1].upper() for word in words)[:5]
    return stock_symbol

with open(input_file, "r") as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)  # Skip header
    data = [row for row in csvreader]

with open(output_file, "w", newline="") as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(["USER_ID", "NAME", "STOCK_SYMBOL"])
    for entry in data:
        user_id, name, *_ = entry  # Unpack the first two values and ignore the rest
        stock_symbol = generate_stock_symbol(name)
        csvwriter.writerow([user_id, name, stock_symbol])

print(f"Stock symbols have been saved to {output_file}")
