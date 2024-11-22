import ollama

# Initialize an empty list to store chat history temporarily
chat_history = []

def get_ai_response(user_message, chat_history):
    """Generate a response from the AI based on user input and chat history."""
    # global chat_history
    
    # Limit chat history to the last 3 interactions
    # last_chat_history = chat_history[-1:] if len(chat_history) > 1 else chat_history
    
    prompt = (
        f"Here's the previous chat history:\n{chat_history}\n"
        f"You are an AI TUTOR for Kids teaching kids interactively. Please respond to user message: \n{user_message}\n"
        f"Generate output in simple  key points."
    )

    # Call the Ollama model with the formatted prompt
    stream = ollama.chat(
        model='llama3.2:1b',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
    )

    response = ""
    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)
        response += chunk['message']['content']
    
    # Add AI's response to chat history
    chat_history.append({'user': user_message, 'AI Tutor': response})
    return response