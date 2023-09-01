import os

def replace_in_file(file_path, old_string, new_string):
    with open(file_path, 'r') as file:
        file_data = file.read()
    
    file_data = file_data.replace(old_string, new_string)
    
    with open(file_path, 'w') as file:
        file.write(file_data)

def replace_in_folder(folder_path, old_string, new_string):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, old_string, new_string)

if __name__ == "__main__":
    root_folder = ".."
    old_string = "explore.html"
    new_string = "../explore/explore.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "funds.html"
    new_string = "../funds/funds.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "index.html"
    new_string = "../index/index.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "investment.html"
    new_string = "../investment/investment.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "ipo.html"
    new_string = "../ipo/ipo.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "market.html"
    new_string = "../market/market.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "orders.html"
    new_string = "../orders/orders.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "portfolio.html"
    new_string = "../portfolio/portfolio.html"
    
    replace_in_folder(root_folder, old_string, new_string)

    old_string = "position.html"
    new_string = "../position/position.html"
    
    replace_in_folder(root_folder, old_string, new_string)
