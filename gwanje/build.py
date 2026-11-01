# 원본(기본 game.src.html) → 결과(기본 index.html): 쓰는 글자만 남긴 갈무리11 글꼴을 base64로 넣는다
import base64, io, sys, string
from fontTools import subset
from fontTools.ttLib import TTFont
font = sys.argv[1]
src_path = sys.argv[2] if len(sys.argv) > 2 else 'game.src.html'
out_path = sys.argv[3] if len(sys.argv) > 3 else 'index.html'
src = open(src_path, encoding='utf-8').read()
chars = set(src) | set(string.printable) | set('₩●·…→←↑↓')
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
f = TTFont(font); sub = subset.Subsetter(opts); sub.populate(text=''.join(chars)); sub.subset(f)
buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
out = src.replace('__FONT__', base64.b64encode(buf.getvalue()).decode())
open(out_path, 'w', encoding='utf-8').write(out)
print('font', len(buf.getvalue()), 'bytes;', out_path, len(out))
