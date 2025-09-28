# api key wq2tZaXeXmwykHWcf1izG7oMMkbdpG6TXNdyWPaYduYqZ3mm

from fastmcp import FastMCP
import requests

mcp = FastMCP("Vybe Solana MCP")

@mcp.tool
def getPriceHistory(tokenId: str) -> dict:
    """
    Fetches the trading data pricing history graph of a given token's mint address.
    Args:
        tokenId (str): A token mint addresses
    Returns:
    {
        "data": "An array of objects representing historical trading data.",
        "data[].time": "Unix timestamp (seconds) representing the start of the time interval.",
        "data[].open": "The opening price at the start of the interval.",
        "data[].high": "The highest price reached during the interval.",
        "data[].low": "The lowest price reached during the interval.",
        "data[].close": "The closing price at the end of the interval.",
        "data[].volume": "The trading volume over the interval, measured in token units.",
        "data[].volumeUsd": "The trading volume over the interval, measured in USD.",
        "data[].count": "The number of trades that occurred during the interval."
    }
    """

    url = f"https://api.vybenetwork.xyz/price/{tokenId}/token-ohlcv?resolution=1d"
    headers = {
        "accept": "application/json",
        "X-API-KEY": "wq2tZaXeXmwykHWcf1izG7oMMkbdpG6TXNdyWPaYduYqZ3mm"
    }

    response = requests.get(url, headers=headers)

    return response.json()

@mcp.tool
def getTokenDetails(tokenId: str) -> dict:
    """
    Fetches the details of a given token's mint address
    Args:
        tokenId (str): A token mint addresses
    Returns:
        dict: A dictionary containing information surrounding the token
        {
            "symbol": "The shorthand ticker symbol for the token.",
            "name": "The full name of the token.",
            "mintAddress": "The unique Solana mint address identifying the token.",
            "price": "The current token price in USD.",
            "price1d": "The token price 24 hours ago, in USD.",
            "price7d": "The token price 7 days ago, in USD.",
            "decimal": "The number of decimal places used by the token.",
            "logoUrl": "A URL to the token's official logo image.",
            "category": "The token main category.",
            "subcategory": "The token subcategory, if applicable.",
            "verified": "Boolean flag indicating whether the token is verified.",
            "updateTime": "The Unix timestamp (seconds) when this data was last updated.",
            "currentSupply": "The total circulating supply of the token.",
            "marketCap": "The market capitalization of the token, in USD.",
            "tokenAmountVolume24h": "The trading volume of the token over the past 24 hours, measured in token units.",
            "usdValueVolume24h": "The trading volume of the token over the past 24 hours, measured in USD."
            "holderDetails": "information related to holders for a day, possible to produce charts through it"
        }
    """

    headers = {
        "accept": "application/json",
        "X-API-KEY": "wq2tZaXeXmwykHWcf1izG7oMMkbdpG6TXNdyWPaYduYqZ3mm"
    }
    
    url = f"https://api.vybenetwork.xyz/token/{tokenId}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    details = response.json()
    url = f"https://api.vybenetwork.xyz/token/{tokenId}/holders-ts?interval=day"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    details["holderDetails"] = response.json()
    return details

if __name__ == "__main__":
    mcp.run()
