import PyPDF2
import json

def extract_pdf_text_to_json(pdf_file_path, json_file_path):
    # Create a PDF file reader object
    with open(pdf_file_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        # Dictionary to hold page content
        pdf_content = {}
        
        # Iterate through each page and extract text
        for page_number in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_number]
            pdf_content[f'page{page_number + 1}'] = page.extract_text()

    # Write the extracted text to a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(pdf_content, json_file, indent=4)

# Example usage
pdf_file_path = 'path/to/your/file.pdf'
json_file_path = 'output.json'
extract_pdf_text_to_json(pdf_file_path, json_file_path)

print(f'Extracted text from {pdf_file_path} and saved to {json_file_path}')
