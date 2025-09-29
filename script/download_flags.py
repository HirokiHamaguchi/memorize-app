import io
import os
import shutil
import zipfile

import requests

# 出力先ディレクトリ
output_dir = "data/flags"
os.makedirs(output_dir, exist_ok=True)

# GitHub の zip URL（master ブランチ最新版）
url = "https://github.com/hampusborgos/country-flags/archive/refs/heads/master.zip"

print("Downloading repository zip...")
response = requests.get(url, stream=True)
response.raise_for_status()

# zip をメモリに展開
with zipfile.ZipFile(io.BytesIO(response.content)) as z:
    for member in z.namelist():
        if member.endswith(".svg") and "/svg/" in member:
            filename = os.path.basename(member)
            if filename:  # ディレクトリはスキップ
                dest_path = os.path.join(output_dir, filename)
                with z.open(member) as source, open(dest_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                print(f"Saved: {dest_path}")

print("All SVG flags copied to data/flags/")
