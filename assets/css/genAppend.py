#encoding=utf8
#!/bin/bash

li = []
text = 'widthLi.append([{begin}, {end}])'
begin = 281
step = 30
while begin <= 1280:
    end = begin + step
    line = text
    line = line.replace('{begin}', str(begin - 1 + 0.001))
    line = line.replace('{end}', str(end))
    li.append(line)
    begin = end + 1

fOut = open('gen.txt', 'w')
fOut.write('\n'.join(li))
fOut.close()
