# game.src.html → index.html: 쓰는 글자만 남긴 갈무리11 글꼴을 base64로 넣는다
import base64, io, sys, string
from fontTools import subset
from fontTools.ttLib import TTFont
src = open('game.src.html', encoding='utf-8').read()
font = sys.argv[1]
chars = set(src) | set(string.printable) | set('₩●·…→←↑↓')
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
f = TTFont(font); sub = subset.Subsetter(opts); sub.populate(text=''.join(chars)); sub.subset(f)
buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
out = src.replace('__FONT__', base64.b64encode(buf.getvalue()).decode())
open('index.html', 'w', encoding='utf-8').write(out)
print('font', len(buf.getvalue()), 'bytes; index.html', len(out))
