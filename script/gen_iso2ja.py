import json
import os

input_path = "data/flags/_iso_raw.json"
output_path = "data/flags/_iso2ja.json"

with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)


svg_dir = "data/flags"
svg_files = [f for f in os.listdir(svg_dir) if f.endswith(".svg")]

result = dict()

for svg_file in svg_files:
    alpha2 = svg_file[:-4]
    match = next(
        (item for item in data if item.get("alpha2", "").lower() == alpha2),
        None,
    )
    if match:
        result[alpha2] = match.get("name_ja")
        result[alpha2] += " (" + match.get("region_ja") + ")"
    else:
        if alpha2 == "eu":
            result[alpha2] = "欧州連合"
        elif alpha2 == "gb-eng":
            result[alpha2] = "イングランド (イギリス)"
        elif alpha2 == "gb-nir":
            result[alpha2] = "北アイルランド (イギリス)"
        elif alpha2 == "gb-sct":
            result[alpha2] = "スコットランド (イギリス)"
        elif alpha2 == "gb-wls":
            result[alpha2] = "ウェールズ (イギリス)"
        elif alpha2 == "xk":
            result[alpha2] = "コソボ (ヨーロッパ)"
        else:
            raise ValueError(f"No matching entry found for {alpha2}")


# 結果をJSONとして保存
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
