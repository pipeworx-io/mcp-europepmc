interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Europe PMC MCP — biomedical literature.
 *
 * Auth: none. Docs: https://europepmc.org/RestfulWebService
 */


const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest';
const UA = 'pipeworx-mcp-europepmc/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Europe PMC search (lucene-style query). Returns metadata for matching articles.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'e.g. "CRISPR OR Cas9", "AUTH:Doudna AND ABSTRACT:editing"' },
        page: { type: 'number', description: '1-based page (default 1)' },
        pageSize: { type: 'number', description: '1-100 (default 25)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_article',
    description: 'Full record for one article by (source, id). Source: MED (Medline), PMC, PPR (preprints), CTX (clinicaltrials).',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string', description: 'e.g. "MED", "PMC", "PPR"' },
        id: { type: 'string', description: 'PMID for MED, PMCID for PMC, etc.' },
      },
      required: ['source', 'id'],
    },
  },
  {
    name: 'abstract',
    description: 'Just the title + abstract for one article (faster than get_article).',
    inputSchema: {
      type: 'object',
      properties: { source: { type: 'string' }, id: { type: 'string' } },
      required: ['source', 'id'],
    },
  },
  {
    name: 'references',
    description: 'List of references cited by one article.',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string' },
        id: { type: 'string' },
        pageSize: { type: 'number', description: '1-1000 (default 25)' },
      },
      required: ['source', 'id'],
    },
  },
  {
    name: 'citations',
    description: 'List of articles citing one article.',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string' },
        id: { type: 'string' },
        pageSize: { type: 'number', description: '1-1000 (default 25)' },
      },
      required: ['source', 'id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        query: reqStr(args, 'query', '"CRISPR"'),
        format: 'json',
        resultType: 'core',
        page: String(Math.max(1, (args.page as number) ?? 1)),
        pageSize: String(Math.min(100, Math.max(1, (args.pageSize as number) ?? 25))),
      });
      return epmcGet(`/search?${params}`);
    }
    case 'get_article': {
      const { source, id } = reqSrcId(args);
      const params = new URLSearchParams({ resultType: 'core', format: 'json' });
      return epmcGet(`/${source}/${id}?${params}`);
    }
    case 'abstract': {
      const { source, id } = reqSrcId(args);
      const params = new URLSearchParams({ resultType: 'lite', format: 'json' });
      return epmcGet(`/${source}/${id}?${params}`);
    }
    case 'references': {
      const { source, id } = reqSrcId(args);
      const params = new URLSearchParams({
        format: 'json',
        page: '1',
        pageSize: String(Math.min(1000, Math.max(1, (args.pageSize as number) ?? 25))),
      });
      return epmcGet(`/${source}/${id}/references?${params}`);
    }
    case 'citations': {
      const { source, id } = reqSrcId(args);
      const params = new URLSearchParams({
        format: 'json',
        page: '1',
        pageSize: String(Math.min(1000, Math.max(1, (args.pageSize as number) ?? 25))),
      });
      return epmcGet(`/${source}/${id}/citations?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqSrcId(args: Record<string, unknown>): { source: string; id: string } {
  const source = reqStr(args, 'source', '"MED"').toUpperCase();
  const id = reqStr(args, 'id', '"22034434"');
  if (!/^[A-Z]{2,4}$/.test(source)) throw new Error(`Invalid source "${source}". Expected MED, PMC, PPR, CTX, etc.`);
  return { source, id };
}

async function epmcGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Europe PMC: not found');
  if (!res.ok) throw new Error(`Europe PMC: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
