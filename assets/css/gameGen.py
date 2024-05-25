#encoding=utf8
#!/bin/bash

widthLi = []
widthLi.append([0, 265])
widthLi.append([266, 347])
widthLi.append([348, 429])
widthLi.append([430, 511])
widthLi.append([512, 593])
widthLi.append([594, 675])
widthLi.append([676, 757])
widthLi.append([758, 839])
widthLi.append([840, 921])
widthLi.append([922, 1003])
widthLi.append([1004, 1085])
widthLi.append([1086, 1167])
widthLi.append([1168, 1249])
widthLi.append([1250,3000])

heightLi = []
heightLi.append([0, 265])
heightLi.append([266, 347])
heightLi.append([348, 429])
heightLi.append([430, 511])
heightLi.append([512, 593])
heightLi.append([594, 675])
heightLi.append([676, 757])
heightLi.append([758, 839])
heightLi.append([840, 921])
heightLi.append([922, 1003])
heightLi.append([1004, 1085])
heightLi.append([1086, 1167])
heightLi.append([1168, 1249])
heightLi.append([1250,3000])

template = '''@media screen {widthText} {heightText} {
            .cardLayout {
                grid-template-columns: repeat({cardLayoutColumns}, 66px);
            }
            .cardIframeWrapper {
                grid-template-columns: repeat({columns}, 66px);
                grid-row: span {rowsLarge};
                grid-column: span {columns};
            }
            .cardIframe {
                grid-row: span {rows};
                grid-column: span {columns};
            }
            .cardIframeAds {
                grid-row: span 4;
                grid-column: span {columns};
            }
        }'''
widthTemplate = '''and (min-width:{minWidth}px) and (max-width:{maxWidth}px)'''
heightTemplate = '''and (min-height:{minHeight}px) and (max-height:{maxHeight}px)'''


resultLi = []

for i in range(len(widthLi)):
    for j in range(len(heightLi)):
        widthText = widthTemplate
        widthText = widthText.replace('{minWidth}', str(widthLi[i][0]))
        widthText = widthText.replace('{maxWidth}', str(widthLi[i][1]))
        heightText = heightTemplate
        heightText = heightText.replace('{minHeight}', str(heightLi[j][0]))
        heightText = heightText.replace('{maxHeight}', str(heightLi[j][1]))
        text = template
        text = text.replace('{widthText}', widthText)
        text = text.replace('{heightText}', heightText)
        text = text.replace('{rows}', str(2 + j))
        text = text.replace('{rowsLarge}', str(2 + j + 4))
        columns = 2 + i
        if widthLi[i][0] >= 758 and widthLi[i][0] < 1004:
            columns = 9
        elif widthLi[i][0] >= 1004:
            columns = 10
        text = text.replace('{columns}', str(columns))
        text = text.replace('{cardLayoutColumns}', str(2 + i))
        resultLi.append(text)

#print('\n'.join(resultLi))

fOut = open('game.css', 'w')
fOut.write('\n'.join(resultLi))
fOut.close()
