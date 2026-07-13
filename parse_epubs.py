#!/usr/bin/env python3
"""Parse the 3 EPUBs and dump chapter inventory + topic summaries."""
import os
import re
from ebooklib import epub, ITEM_DOCUMENT
from bs4 import BeautifulSoup

BOOKS = {
    'python_101': '/home/z/my-project/upload/python_101.epub',
    'python201':  '/home/z/my-project/upload/python201.epub',
    'PythonAwesomeJob': '/home/z/my-project/upload/PythonAwesomeJob.epub',
}

def clean(text):
    text = re.sub(r'\s+', ' ', text or '').strip()
    return text

def get_title(soup):
    if soup.title and soup.title.string:
        return clean(soup.title.string)
    for tag in ['h1', 'h2']:
        el = soup.find(tag)
        if el:
            return clean(el.get_text())
    return '(no title)'

def get_summary(soup, max_words=25):
    body = soup.find('body')
    if not body:
        return ''
    for nav in body.find_all('nav'):
        nav.decompose()
    for p in body.find_all(['p', 'li']):
        t = clean(p.get_text())
        if len(t) > 30:
            words = t.split()
            return ' '.join(words[:max_words]) + ('...' if len(words) > max_words else '')
    return ''

def get_subheadings(soup, limit=6):
    body = soup.find('body')
    if not body:
        return []
    subs = []
    for h in body.find_all(['h2', 'h3']):
        t = clean(h.get_text())
        if t and not t.lower().startswith('chapter ') and len(t) > 3:
            subs.append(t)
        if len(subs) >= limit:
            break
    return subs

for name, path in BOOKS.items():
    print(f"\n{'='*80}")
    print(f"BOOK: {name}")
    print('='*80)
    book = epub.read_epub(path)
    spine_ids = [itemref[0] for itemref in book.spine]
    items_by_id = {item.get_id(): item for item in book.get_items_of_type(ITEM_DOCUMENT)}
    chap_num = 0
    for sid in spine_ids:
        item = items_by_id.get(sid)
        if item is None:
            continue
        href = item.get_name()
        base = os.path.basename(href).lower()
        if base in ('toc.xhtml', 'title_page.xhtml', 'verso_page.xhtml', 'copyright.xhtml'):
            continue
        content = item.get_content()
        soup = BeautifulSoup(content, 'lxml')
        title = get_title(soup)
        if title.lower() in ('title page', 'copyright', 'table of contents'):
            continue
        body = soup.find('body')
        body_text = clean(body.get_text()) if body else ''
        if len(body_text) < 60:
            print(f"\n--- PART DIVIDER: {title}  (file: {base})")
            continue
        chap_num += 1
        summary = get_summary(soup)
        subs = get_subheadings(soup)
        print(f"\n[Ch {chap_num:02d}] file={base}")
        print(f"  TITLE: {title}")
        print(f"  SUMMARY: {summary}")
        if subs:
            print(f"  SUBHEADS: {' | '.join(subs)}")
