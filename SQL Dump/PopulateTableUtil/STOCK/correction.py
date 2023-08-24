# Initialize an array to store pairs of numbers
number_pairs = []

# Open the input and output files
with open('.\SQL Dump\PopulateTableUtil\STOCK\stock1001format.sql', 'r') as input_file, open('.\SQL Dump\PopulateTableUtil\STOCK\stockCorrect.sql', 'w') as output_file:
    # Read lines one by one from the input file
    for line in input_file:
        # Check if the line starts with "insert into STOCK"
        if line.startswith("insert into STOCK"):
            # Extract values from the line
            start_index = line.find("ues (") + 5
            end_index = line.find("', ")
            values_str = line[start_index:end_index]
            

            # Extract the values from the list
            
            symbol = (values_str)

            # Check if the pair is not already present in the array
            if (symbol) not in number_pairs:
                number_pairs.append(symbol)
                output_file.write(line)

# Print the number of unique pairs written to the output file
print("Number of unique pairs written:", len(number_pairs))
