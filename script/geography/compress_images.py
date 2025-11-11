from pathlib import Path

from PIL import Image


def compress_png_files():
    input_dir = Path("public/geography")

    if not input_dir.exists():
        print(f"エラー: ディレクトリが見つかりません: {input_dir}")
        return

    total_original_size = 0
    total_compressed_size = 0
    processed_count = 0

    print(f"PNG圧縮を開始します: {input_dir.absolute()}")
    print("-" * 50)

    # ディレクトリを再帰的に探索してPNGファイルを処理
    for png_file in input_dir.rglob("*.png"):
        try:
            original_size = png_file.stat().st_size

            temp_file = png_file.with_suffix(".png.tmp")

            with Image.open(png_file) as img:
                # アルファチャンネルを削除してRGBに変換
                if img.mode == "RGBA":
                    background = Image.new("RGB", img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1])
                    img = background
                img.save(temp_file, "PNG", optimize=True, compress_level=9)

            compressed_size = temp_file.stat().st_size

            if compressed_size < original_size:
                temp_file.replace(png_file)
                compression_ratio = (1 - compressed_size / original_size) * 100
                print(f"圧縮: {png_file.name} - {compression_ratio:.1f}%削減")
                total_compressed_size += compressed_size
            else:
                temp_file.unlink()  # 一時ファイルを削除
                print(f"維持: {png_file.name} - 圧縮効果なし")
                total_compressed_size += original_size

            total_original_size += original_size
            processed_count += 1

        except Exception as e:
            print(f"エラー: {png_file.name} - {e}")

    # 結果表示
    if total_original_size > 0:
        overall_compression = (1 - total_compressed_size / total_original_size) * 100
        print("\n" + "=" * 50)
        print("圧縮結果")
        print("=" * 50)
        print(f"処理ファイル数: {processed_count}")
        print(f"元のサイズ: {total_original_size / 1024 / 1024:.2f} MB")
        print(f"圧縮後サイズ: {total_compressed_size / 1024 / 1024:.2f} MB")
        print(f"全体の圧縮率: {overall_compression:.1f}%")
        print(
            f"削減サイズ: {(total_original_size - total_compressed_size) / 1024 / 1024:.2f} MB"
        )


if __name__ == "__main__":
    compress_png_files()
