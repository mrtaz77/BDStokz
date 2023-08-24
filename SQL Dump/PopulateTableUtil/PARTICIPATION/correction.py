# Initialize an array to store pairs of numbers
number_pairs = []

# Open the input and output files
with open('.\SQL Dump\PopulateTableUtil\PARTICIPATION\participation10001.sql', 'r') as input_file, open('.\SQL Dump\PopulateTableUtil\PARTICIPATION\participationCorrect.sql', 'w') as output_file:
    # Read lines one by one from the input file
    for line in input_file:
        # Check if the line starts with "insert into PARTICIPATION"
        if line.startswith("insert into PARTICIPATION"):
            # Extract values from the line
            start_index = line.find("ues (") + 5
            end_index = line.find(", '")
            values_str = line[start_index:end_index]
            values_list = values_str.split(', ')

            # Extract the values from the list
            activity_id = int(values_list[0])
            user_id = int(values_list[1])

            # Check if the pair is not already present in the array
            if (activity_id, user_id) not in number_pairs:
                number_pairs.append((activity_id, user_id))
                output_file.write(line)

# Print the number of unique pairs written to the output file
print("Number of unique pairs written:", len(number_pairs))
