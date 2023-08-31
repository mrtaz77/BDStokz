import random

# Open the file for writing
with open('./SQL Dump/PopulateTableUtil/USER_CONTACT/user_contact31.sql', 'w') as f:
    # Generate and write the SQL statements
    for num1 in range(46080, 46121, 20):
        num2_count = random.randint(1, 2)
        
        for _ in range(num2_count):
            num2 = ''.join(random.choices('0123456789', k=random.randint(10, 12)))
            num2 = f'{num2[:3]}-{num2[3:6]}-{num2[6:10]}'
            
            sql_statement = f"insert into USER_CONTACT (USER_ID, CONTACT) values ({num1}, '{num2}');\n"
            f.write(sql_statement)
            
print('File generated successfully.')
