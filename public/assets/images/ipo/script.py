import os
import requests
from bs4 import BeautifulSoup
import csv

# Create a directory to store the logos
if not os.path.exists("logos"):
    os.makedirs("logos")

# Read the list of corporations from the CSV file
with open("Corp.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        name = row["NAME"]
        search_url = f"https://www.google.com/search?q={name}+logo&tbm=isch"

        response = requests.get(search_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            img_tags = soup.find_all("img")
            if img_tags:
                img_url = img_tags[0]["src"]
                img_extension = os.path.splitext(img_url)[1]
                logo_filename = os.path.join("logos", f"{name}{img_extension}")

                img_response = requests.get(img_url)
                if img_response.status_code == 200:
                    with open(logo_filename, "wb") as f:
                        f.write(img_response.content)
                    print(f"Downloaded logo for {name}")
                else:
                    print(f"Failed to download logo for {name}")
            else:
                print(f"No logo found for {name}")
        else:
            print(f"Failed to fetch search results for {name}")
