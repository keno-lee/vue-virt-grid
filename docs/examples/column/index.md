# 列宽拖拽

## 开启列宽拖拽

```ts
interface Column {
  resizable: boolean;
}
```

<!<< ./ColumnResize.vue

## 支持设置最大最小宽

```ts
interface Column {
  resizable: boolean;
  minWidth: number;
  maxWidth: number;
}
```

<!<< ./MinMaxColumn.vue
