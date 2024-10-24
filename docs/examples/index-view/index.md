# 索引

## 常规索引

```ts
const columns = [
  {
    type: 'index',
  },
];
```

<!<< ./IndexView.vue

## 自定义索引

```ts
const columns = [
  {
    type: 'index',
    index: (index: number) => `x-${index}`,
  },
];
```

<!<< ./CustomIndexView.vue
