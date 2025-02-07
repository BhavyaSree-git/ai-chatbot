from transformers import pipeline

# Load Open-Source LLM
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_data(data):
    text = " ".join([str(d) for d in data])
    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]['summary_text']
