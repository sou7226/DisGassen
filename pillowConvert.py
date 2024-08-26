from PIL import Image

# 開くWEBP画像
img = Image.open('C:/Users/it0_s/Downloads/a.webp')
# JPG形式で保存
img.convert('RGB').save('entrance.jpg', 'JPEG')
