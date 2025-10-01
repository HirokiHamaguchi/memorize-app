import glob
import json
import os
import re
import time

import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}


def process_html_file(html_path):
    """HTMLファイルを処理してJSONデータを生成"""
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()


html_path = "src/data/raw/wiki_iso.html"
assert os.path.exists(html_path), f"{html_path} が存在しません。"
basename = os.path.basename(html_path)
process_html_file(html_path)
