from fastmcp import FastMCP
import requests

mcp = FastMCP("Jupiter Solana MCP")

@mcp.tool
def queryPrices(tokenIds: list[str]) -> dict:
    """
    Fetches the latest token prices from the Jupiter Aggregator API on Solana.
    Args:
        tokenIds (list[str]): A list of token mint addresses (as strings).
    Returns:
        dict: A dictionary containing price data for the requested tokens,
              as provided by Jupiter's public price API.
    """
    ids_str = ",".join(tokenIds)
    url = f"https://lite-api.jup.ag/price/v3?ids={ids_str}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    mcp.run()
