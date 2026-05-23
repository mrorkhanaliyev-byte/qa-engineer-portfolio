#!/usr/bin/env python3
"""
Run every .sql query against a fresh in-memory SQLite DB built
from schema/01_schema.sql + schema/02_seed_data.sql, and diff
the output against the corresponding .expected file.

Exits 0 if every query matches, 1 otherwise.

Usage:
    python scripts/run_all_queries.py
    python scripts/run_all_queries.py --regen     # rewrite .expected files
"""
from __future__ import annotations

import argparse
import difflib
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_FILES = [
    ROOT / 'schema' / '01_schema.sql',
    ROOT / 'schema' / '02_seed_data.sql',
]
QUERY_DIRS = [
    'basic-queries',
    'joins',
    'subqueries',
    'window-functions',
    'qa-validation-queries',
]


def build_db() -> sqlite3.Connection:
    conn = sqlite3.connect(':memory:')
    for f in SCHEMA_FILES:
        conn.executescript(f.read_text(encoding='utf-8'))
    return conn


def run_query(conn: sqlite3.Connection, sql: str) -> str:
    """Return the query result in pipe-separated form with a header row."""
    cur = conn.execute(sql)
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description] if cur.description else []
    out = ['|'.join(cols)] if cols else []
    for row in rows:
        out.append('|'.join('' if v is None else str(v) for v in row))
    return '\n'.join(out) + '\n'


def iter_sql_files() -> list[Path]:
    files: list[Path] = []
    for d in QUERY_DIRS:
        files.extend(sorted((ROOT / d).glob('*.sql')))
    return files


def main(regen: bool) -> int:
    conn = build_db()
    files = iter_sql_files()
    passed = 0
    failed: list[Path] = []
    missing_expected: list[Path] = []

    for sql_path in files:
        expected_path = sql_path.with_suffix('.expected')
        actual = run_query(conn, sql_path.read_text(encoding='utf-8'))

        rel = sql_path.relative_to(ROOT)

        if regen:
            expected_path.write_text(actual, encoding='utf-8', newline='\n')
            print(f'  WROTE  {rel}.expected')
            continue

        if not expected_path.exists():
            print(f'  MISS   {rel}  (no .expected — run with --regen)')
            missing_expected.append(sql_path)
            continue

        expected = expected_path.read_text(encoding='utf-8')
        if actual == expected:
            print(f'  PASS   {rel}')
            passed += 1
        else:
            print(f'  FAIL   {rel}')
            diff = difflib.unified_diff(
                expected.splitlines(keepends=True),
                actual.splitlines(keepends=True),
                fromfile='expected',
                tofile='actual',
                n=2,
            )
            for line in list(diff)[:40]:
                sys.stdout.write('         ' + line)
            failed.append(sql_path)

    print()
    print('=' * 56)
    if regen:
        print(f'  Regenerated {len(files)} .expected files')
        return 0
    print(f'  Passed:  {passed} / {len(files)}')
    print(f'  Failed:  {len(failed)}')
    if missing_expected:
        print(f'  Missing: {len(missing_expected)} .expected file(s)')
    print('=' * 56)

    return 0 if not failed and not missing_expected else 1


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        '--regen',
        action='store_true',
        help='Rewrite .expected files instead of asserting equality.',
    )
    args = p.parse_args()
    sys.exit(main(args.regen))
