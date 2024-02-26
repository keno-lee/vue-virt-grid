# API 文档

## Table 属性

| <div style="width: 180px;">属性名</div> | 说明                                                                | 类型                                                                                       | 可选值 | 默认值     |
| :-------------------------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- | :----- | :--------- |
| list                                    | 显示的数据                                                          | ListItem[]                                                                                 | —      | —          |
| columns                                 | 列信息集合                                                          | Column[]                                                                                   | —      | —          |
| row-key                                 | 行id变量名 `虚拟列表需要，如果不给保证默认值为id`                   | String/Number                                                                              | —      | id         |
| row-min-height                          | 行最小高度 `虚拟列表需要。如果不给需要保证最小高度不能低于默认值30` | Number                                                                                     | —      | 30         |
| show-header                             | 是否显示表头                                                        | Boolean                                                                                    | —      | true       |
| stripe                                  | 是否为斑马纹 table                                                  | Boolean                                                                                    | —      | false      |
| border                                  | 是否带有纵向边框                                                    | Boolean                                                                                    | —      | false      |
| highlight-current-row                   | 是否要高亮当前行                                                    | Boolean                                                                                    | —      | false      |
| highlight-current-column                | 是否要高亮当前列                                                    | Boolean                                                                                    | —      | false      |
| selection                               | 是否支持框选                                                        | Boolean                                                                                    | —      | false      |
| default-expand-all                      | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效     | Boolean                                                                                    | —      | false      |
| header-row-class-name                   | 表头行自定义类                                                      | `(data: { row: Column[]; rowIndex: number }): string`                                      | —      | `() => ''` |
| header-row-style                        | 表头行自定义样式                                                    | `(data: { row: Column[]; rowIndex: number }): string`                                      | —      | `() => ''` |
| header-cell-class-name                  | 表头单元格自定义类                                                  | `(data: { row: Column[]; column: Column; rowIndex: number; columnIndex: number }): string` | —      | `() => ''` |
| header-cell-style                       | 表头单元格自定义样式                                                | `(data: { row: Column[]; column: Column; rowIndex: number; columnIndex: number }): string` | —      | `() => ''` |
| row-class-name                          | 行自定义类                                                          | `(data: { row: ListItem; rowIndex: number }): string`                                      | —      | `() => ''` |
| row-style                               | 行自定义样式                                                        | `(data: { row: ListItem; rowIndex: number }): string`                                      | —      | `() => ''` |
| cell-class-name                         | 单元格自定义类                                                      | `(data: { row: ListItem; column: Column; rowIndex: number; columnIndex: number }): string` | —      | `() => ''` |
| cell-style                              | 单元格自定义样式                                                    | `(data: { row: ListItem; column: Column; rowIndex: number; columnIndex: number }): string` | —      | `() => ''` |

<!-- | row-id-name                             | 待开发（待定 是否需要） 指定行id变量名                          | -        | —      | -      |
| col-id-name                             | 待开发（待定 是否需要） 指定列id变量名                          | -        | —      | -      | -->

## Column 属性

| <div style="width: 100px;">属性名</div> | 说明                                                                                                                                                   | 类型                     | 可选值                    | 默认值 |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :------------------------ | :----- |
| id                                      | 必传                                                                                                                                                   | string\|number           |                           |        |
| title                                   | 显示的标题                                                                                                                                             | string                   | —                         | —      |
| type                                    | 对应列的类型。 如果设置了` index` 则显示该行的索引（从 1 开始计算）； 如果设置了` expand` 则显示为一个可展开的按钮；如果设置了`checkbox`则显示多选框； | string                   | index / expand / checkbox | —      |
| index                                   | 如果设置了 `type=index`，可以通过传递 `index` 属性来自定义索引                                                                                         | number / function(index) | —                         | —      |
| field                                   | 字段名称：对应列内容的字段名                                                                                                                           | string\|number           |                           |        |
| width                                   | 对应列的宽度                                                                                                                                           | number                   | —                         | —      |
| min-width                               | 当设置 resizable 时，对应列的最小宽度                                                                                                                  | number                   |                           |        |
| max-width                               | 当设置 resizable 时，对应列的最大宽度                                                                                                                  | number                   |                           |        |
| resizable                               | 对应列是否可以通过拖动改变宽度（当 border 属性为 false 时，仍然支持调整列宽，但表头会单独显示右边框线）                                                | Boolean                  |                           |        |
| fixed                                   | 列是否固定在左侧或者右侧。                                                                                                                             | string                   | 'left' / 'right' / ''     | —      |
| align                                   | 表格的对齐方式（表头和表身）                                                                                                                           | string                   | left / center / right     | left   |
| header-align                            | 表头对齐方式， 若不设置该项，则使用表格的对齐方式                                                                                                      | string                   | left / center / right     | —      |
| children                                | 嵌套列                                                                                                                                                 | Column[]                 |                           |        |
| class-name                              | 列的 className                                                                                                                                         | string                   | —                         | —      |
| header-render                           | 自定义渲染表头单元格                                                                                                                                   | function(column)         | —                         | —      |
| body-render                             | 自定义渲染变身单元格                                                                                                                                   | function(column, row)    | —                         | —      |

## Table 事件

| <div style="width: 140px;">事件名</div> | 说明                                                                                                                     | 回调参数                                                    |
| --------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| header-click                            | 当某一列的表头被点击时会触发该事件                                                                                       | `data: { event, column }`                                   |
| header-dblclick                         | 当某一列的表头被双击时会触发该事件                                                                                       | `data: { event, column }`                                   |
| header-contextmenu                      | 当某一列的表头被鼠标右键点击时触发该事件                                                                                 | `data: { event, column }`                                   |
| row-click                               | 当某一行被点击时会触发该事件                                                                                             | `data: { event, column, columnIndex, row rowIndex }`        |
| row-dblclick                            | 当某一行被双击时会触发该事件                                                                                             | `data: { event, column, columnIndex, row rowIndex }`        |
| row-contextmenu                         | 当某一行被鼠标右键点击时会触发该事件                                                                                     | `data: { event, column, columnIndex, row rowIndex }`        |
| cell-click                              | 当某个单元格被点击时会触发该事件                                                                                         | `data: { event, column, columnIndex, row, rowIndex, cell }` |
| cell-dblclick                           | 当某个单元格被双击击时会触发该事件                                                                                       | `data: { event, column, columnIndex, row, rowIndex, cell }` |
| cell-contextmenu                        | 当某个单元格被鼠标右键点击时会触发该事件                                                                                 | `data: { event, column, columnIndex, row, rowIndex, cell }` |
| expand-change                           | 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded） | `data: { row, expandedRows }`                               |
| box-selection                           | 当selection选中区域的时候触发该事件                                                                                      | `data: { areas: area[], cells: [] }`                        |
