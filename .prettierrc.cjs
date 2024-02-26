module.exports = {
  $schema: 'https://json.schemastore.org/prettierrc',
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all', // 末尾加逗号 默认none es5 包括es5中的数组、对象 all 包括函数对象等所有可选
  arrowParens: 'always', // (x) => {} 箭头函数参数只有一个时是否要有小括号。always: 加；avoid: 省略括号
  wrapAttributes: true,
  sortAttributes: true, // 属性自动排序
};
