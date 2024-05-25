#encoding=utf8
#!/bin/bash

widthLi = []
widthLi.append([0, 280])
widthLi.append([280.001, 311])
widthLi.append([311.001, 342])
widthLi.append([342.001, 373])
widthLi.append([373.001, 404])
widthLi.append([404.001, 435])
widthLi.append([435.001, 466])
widthLi.append([466.001, 497])
widthLi.append([497.001, 528])
widthLi.append([528.001, 559])
widthLi.append([559.001, 590])
widthLi.append([590.001, 621])
widthLi.append([621.001, 652])
widthLi.append([652.001, 683])
widthLi.append([683.001, 714])
widthLi.append([714.001, 745])
widthLi.append([745.001, 776])
widthLi.append([776.001, 807])
widthLi.append([807.001, 838])
widthLi.append([838.001, 869])
widthLi.append([869.001, 900])
widthLi.append([900.001, 931])
widthLi.append([931.001, 962])
widthLi.append([962.001, 993])
widthLi.append([993.001, 1024])
widthLi.append([1024.001, 1055])
widthLi.append([1055.001, 1086])
widthLi.append([1086.001, 1117])
widthLi.append([1117.001, 1148])
widthLi.append([1148.001, 1179])
widthLi.append([1179.001, 1210])
widthLi.append([1210.001, 1241])
widthLi.append([1241.001, 1272])
widthLi.append([1272.001, 1303])
widthLi.append([1303.001, 3000])

heightLi = []
heightLi.append([0, 280])
heightLi.append([280.001, 311])
heightLi.append([311.001, 342])
heightLi.append([342.001, 373])
heightLi.append([373.001, 404])
heightLi.append([404.001, 435])
heightLi.append([435.001, 466])
heightLi.append([466.001, 497])
heightLi.append([497.001, 528])
heightLi.append([528.001, 559])
heightLi.append([559.001, 590])
heightLi.append([590.001, 621])
heightLi.append([621.001, 652])
heightLi.append([652.001, 683])
heightLi.append([683.001, 714])
heightLi.append([714.001, 745])
heightLi.append([745.001, 776])
heightLi.append([776.001, 807])
heightLi.append([807.001, 838])
heightLi.append([838.001, 869])
heightLi.append([869.001, 900])
heightLi.append([900.001, 931])
heightLi.append([931.001, 962])
heightLi.append([962.001, 993])
heightLi.append([993.001, 1024])
heightLi.append([1024.001, 1055])
heightLi.append([1055.001, 1086])
heightLi.append([1086.001, 1117])
heightLi.append([1117.001, 1148])
heightLi.append([1148.001, 1179])
heightLi.append([1179.001, 1210])
heightLi.append([1210.001, 1241])
heightLi.append([1241.001, 1272])
heightLi.append([1272.001, 1303])
heightLi.append([1303.001, 3000])


template = '''@media screen {widthText} {heightText} {
.cardLayout {
 grid-template-columns: repeat({cardLayoutColumns}, 11.3px);
}
.cardIframeWrapper {
 margin-left: {commonMarginLeft}px;
 grid-template-columns: repeat({columns}, 11.3px);
 grid-row: span {rowsLarge};
 grid-column: span {columns};
}
.cardLayoutLeft {
 grid-template-columns: repeat({cardLayoutLeftColumns}, 11.3px);
 display: {cardLayoutLeftDisplay};
 grid-column: span {cardLayoutLeftColumns};
}
.cardLayoutRight {
 grid-template-columns: repeat({cardLayoutRightColumns}, 11.3px);
 grid-column: span {cardLayoutRightColumns};
}
.cardLayoutRight div[leftInRight] {
 display: {leftInRightDisplay};
}
.cardIframe {
 grid-row: span {rows};
 grid-column: span {columns};
}
.cardIframeAds {
 grid-row: span 12;
 grid-column: span {columns};
}
.nine_grid_area {
 margin-left: {commonMarginLeft}px;
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
        rows = 10 + j

        cardLayoutColumns = 0
        if widthLi[i][1] <= 280:
            cardLayoutColumns = 10
        else:
            cardLayoutColumns = int((widthLi[i][0] + 16) / 27.3)
        text = text.replace('{cardLayoutColumns}', str(cardLayoutColumns))

        columns = cardLayoutColumns
        if widthLi[i][0] >= 758 and widthLi[i][0] < 1004:
            columns = 9 * 3
        elif widthLi[i][0] >= 1004:
            columns = 10 * 3

        calcWidth = columns * 11.3 + (columns - 1) * 16
        calcHeight = rows * 11.3 + (rows - 1) * 16

        if calcWidth >= calcHeight:
            targetWidth = calcHeight / 1.6
            targetColumn = int((targetWidth + 16) / 27.3)
            columns = targetColumn
        elif (calcWidth < calcHeight) and (calcWidth >= (calcHeight / 1.6)):
            targetWidth = calcHeight / 1.6
            targetColumn = int((targetWidth + 16) / 27.3)
            columns = targetColumn
        elif (calcWidth < calcHeight) and (calcWidth < (calcHeight / 1.6)):
            targetHeight = calcWidth * 1.6
            targetRows = int((targetHeight + 16) / 27.3)
            rows = targetRows

        commonMarginLeft = 0

        text = text.replace('{columns}', str(columns))
        text = text.replace('{rows}', str(rows))
        text = text.replace('{rowsLarge}', str(rows + 12))

        if cardLayoutColumns - columns >= 3:
            cardLayoutLeftColumns = int((cardLayoutColumns - columns) / 2)
            if (cardLayoutColumns - columns) % 2 != 0:
                cardLayoutLeftColumns += 1
            cardLayoutRightColumns = cardLayoutColumns - columns - cardLayoutLeftColumns
            cardLayoutLeftDisplay = 'grid'
            leftInRightDisplay = 'none'
        else:
            cardLayoutLeftColumns = 0
            cardLayoutRightColumns = cardLayoutColumns
            cardLayoutLeftDisplay = 'none'
            leftInRightDisplay = 'block'
            #小屏幕时, 尽量居中
            if columns < cardLayoutColumns:
                commonMarginLeft = int((cardLayoutColumns - columns) * 27.3 / 2.0)

        text = text.replace('{commonMarginLeft}', str(commonMarginLeft))
        text = text.replace('{cardLayoutLeftColumns}', str(cardLayoutLeftColumns))
        text = text.replace('{cardLayoutLeftDisplay}', cardLayoutLeftDisplay)
        text = text.replace('{cardLayoutRightColumns}', str(cardLayoutRightColumns))
        text = text.replace('{leftInRightDisplay}', leftInRightDisplay)

        resultLi.append(text)

fOut = open('game.css', 'w')
fOut.write('\n'.join(resultLi))
fOut.close()

