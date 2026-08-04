# @pipeworx/europepmc

Europe PubMed Central MCP — biomedical/life-science literature search + abstracts + full text (open-access only). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, page?, pageSize?)` — Europe PMC search (lucene-style query)
- `get_article(source, id)` — single-article record by source (`MED`, `PMC`, `PPR`, …) + id
- `abstract(source, id)` — title + structured abstract
- `references(source, id, pageSize?)` — list of cited references
- `citations(source, id, pageSize?)` — list of citing articles

## Data source

`https://www.ebi.ac.uk/europepmc/webservices/rest/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
