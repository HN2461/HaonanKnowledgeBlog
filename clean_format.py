import re

# 读取文件
with open('public/notes/面试/html+css面试.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 清理所有 font 标签，保留内部文本
content = re.sub(r'\*\*<font[^>]*>(.*?)</font>\*\*', r'**\1**', content)
content = re.sub(r'<font[^>]*>(.*?)</font>', r'\1', content)

# 规范化标题编号（去掉冒号，改为点号）
content = re.sub(r'^## (\d+):', r'## \1.', content, flags=re.MULTILINE)

# 保存文件
with open('public/notes/面试/html+css面试.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("格式清理完成！")
