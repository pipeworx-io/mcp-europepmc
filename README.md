# mcp-europepmc

Europe PubMed Central — biomedical literature search and full text

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Europe PMC search (lucene-style query). Returns metadata for matching articles. |
| `get_article` | Full record for one article by (source, id). Source: MED (Medline), PMC, PPR (preprints), CTX (clinicaltrials). |
| `abstract` | Just the title + abstract for one article (faster than get_article). |
| `references` | List of references cited by one article. |
| `citations` | List of articles citing one article. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "europepmc": {
      "url": "https://gateway.pipeworx.io/europepmc/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Europepmc data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
