from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from Rag import get_ai_response
from qa import get_answer  # Import the get_answer function from qa.py

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (for development)

# Function to search for YouTube videos
def search_youtube_videos(query, max_results=3):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service('C:/chromedriver/chromedriver.exe')  # Adjust path to your chromedriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.get("https://www.youtube.com")

    search_box = driver.find_element(By.NAME, "search_query")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)

    time.sleep(2)  # Allow time for results to load

    videos = driver.find_elements(By.ID, "video-title")[:max_results]
    results = [(video.get_attribute("title"), video.get_attribute("href")) for video in videos]
    
    # Define the keyword for the YouTube video URL
    keyword = "https://www.youtube.com/watch?v="
    links = [video.get_attribute("href").split(keyword)[1] for video in videos]
    cleaned_links = [link.split("&pp")[0] for link in links]

    driver.quit()

    return [f'https://www.youtube.com/embed/{link}' for link in cleaned_links] if results else []

# Function to extract video links from a page using a keyword
def extract_video_links(keyword):
    page_url = f"https://elearn.tnschools.gov.in/etb/{keyword}"

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service('C:/chromedriver/chromedriver.exe')  # Adjust path to your chromedriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.get(page_url)

    # Find all video tags
    video_tags = driver.find_elements(By.TAG_NAME, 'video')
    video_links = [video.get_attribute('src') for video in video_tags]

    driver.quit()

    return list(set(video_links))  # Remove duplicate links


@app.route('/qa_chat', methods=['POST'])
def qa_chat():
    try:
        user_question = request.json['keyword']
        chat_history = request.json['chat_history']
        print(f"chat history \n {chat_history}")
        
        # Get response from qa.py
        book_response, page_no = get_answer(user_question)  # Unpack the response
        
        # Get response from get_ai_response
        ai_response = get_ai_response(user_question)
        
        if book_response:
            combined_response = (
                f"**Response from Book:**\n** According to PageNo {page_no}**\n{book_response}\n"
                f"**Response from AI:** \n{ai_response}"
            )
        else:
            combined_response = ai_response
        
        return jsonify({'answer': combined_response})
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/search-videos', methods=['POST'])
def search_videos():
    keyword = f"{request.json['keyword']} for Kids"
    results = search_youtube_videos(keyword)
    print(results)
    return jsonify({'youtube_link': results})


@app.route('/extract-videos', methods=['POST'])
def extract_videos():
    keyword = request.json['keyword']
    video_links = extract_video_links(keyword)
    
    if video_links:
        return jsonify({'video_links': video_links})
    else:
        return jsonify({'error': 'No video links found'}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
