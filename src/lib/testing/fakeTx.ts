import type { Tx, ZeroAuthData } from "$lib/zero/mutators/shared";

// In-memory fake of the Zero `Transaction<Schema>` subset the mutators use:
//   - tx.location            ("client" | "server") — drives assertOwner
//   - tx.mutate.<table>.insert/upsert/update/delete
//   - tx.run(zqlQuery)       — equality where (single, or chained `.where().where()`)
//                              + limit (introspects the AST)
//
// The AST shape (verified against @rocicorp/zero@1.7.0, which is pinned):
//   simple:  { type:"simple", left:{type:"column",name}, right:{type:"literal",value}, op:"=" }
//   chained: { type:"and", conditions: [simple, simple, ...] }
//   query.ast = { table, where?: simple | chained, limit? }
// If a mutator ever uses a richer query, extend `run` here — one file to update.
//
// Lives under src/lib so tests import it via `$lib/testing/fakeTx` (resolves in
// both svelte-check and Vitest). It imports no test framework, so it is inert in
// the app bundle (nothing in the app imports it).

export type Row = Record<string, unknown>;
export type SeedStore = Record<string, Row[]>;

function matchesKey(row: Row, key: Row): boolean {
  return Object.keys(key).every((k) => row[k] === key[k]);
}

interface WhereAst {
  type: string;
  op?: string;
  left?: { type?: string; name?: string };
  right?: { type?: string; value?: unknown };
  conditions?: WhereAst[];
}

interface QueryAst {
  table: string;
  where?: WhereAst;
  limit?: number;
}

// A plain `column = literal` condition; anything else is unsupported.
function isSimpleEq(w: WhereAst): boolean {
  return (
    w.type === "simple" &&
    w.op === "=" &&
    !!w.left?.name &&
    (w.right?.type === undefined || w.right.type === "literal")
  );
}

export interface FakeTx {
  tx: Tx;
  /** The live in-memory store — assert against it after running a mutator. */
  store: SeedStore;
  /** Convenience: rows currently in a table (empty array if none). */
  rows: (table: string) => Row[];
}

export function createFakeTx(
  seed: SeedStore = {},
  location: "client" | "server" = "client",
): FakeTx {
  const store: SeedStore = {};
  for (const [table, rows] of Object.entries(seed)) {
    store[table] = rows.map((r) => ({ ...r }));
  }

  const table = (name: string): Row[] => (store[name] ??= []);

  const makeTable = (name: string) => ({
    insert: async (row: Row) => {
      table(name).push({ ...row });
    },
    upsert: async (row: Row) => {
      const rows = table(name);
      const i = rows.findIndex((r) => r.id === row.id);
      if (i >= 0) rows[i] = { ...rows[i], ...row };
      else rows.push({ ...row });
    },
    update: async (partial: Row) => {
      const rows = table(name);
      const i = rows.findIndex((r) => r.id === partial.id);
      if (i >= 0) rows[i] = { ...rows[i], ...partial };
    },
    delete: async (key: Row) => {
      store[name] = table(name).filter((r) => !matchesKey(r, key));
    },
  });

  const mutate = new Proxy(
    {},
    { get: (_t, name: string) => makeTable(name) },
  );

  const run = async (query: unknown): Promise<Row[]> => {
    const ast = (query as { ast: QueryAst }).ast;
    let rows = [...table(ast.table)];
    if (ast.where) {
      const w = ast.where;
      const conds: WhereAst[] | undefined = isSimpleEq(w)
        ? [w]
        : w.type === "and" &&
            Array.isArray(w.conditions) &&
            w.conditions.length > 0 &&
            w.conditions.every(isSimpleEq)
          ? w.conditions
          : undefined;
      if (conds) {
        rows = rows.filter((r) =>
          conds.every((c) => r[c.left!.name!] === c.right?.value),
        );
      } else {
        throw new Error(
          `fakeTx.run: unsupported where clause: ${JSON.stringify(w)}`,
        );
      }
    }
    if (typeof ast.limit === "number") rows = rows.slice(0, ast.limit);
    return rows;
  };

  const tx = { location, mutate, run } as unknown as Tx;
  return { tx, store, rows: (t) => store[t] ?? [] };
}

// A mutator is defined via `m(fn)` which yields `{ fn, validator, "~" }`.
// This invokes the underlying implementation with a transaction + args + ctx.
export function runMutator<A>(
  def: unknown,
  arg: { tx: Tx; args: A; ctx?: ZeroAuthData },
): Promise<void> {
  const fn = (def as { fn: (a: unknown) => Promise<void> }).fn;
  return fn(arg);
}
