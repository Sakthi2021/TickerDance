import yfinance as yf

df = yf.download("AAPL", start="2024-06-01", end="2024-06-30", progress=False, auto_adjust=True)
print("Shape:", df.shape)
print(df.head())