module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  importOrder: [
    '^react*',
    '^@nestjs*',
    '<THIRD_PARTY_MODULES>',
    '^@api/(.*)$',
    '^@web/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'jsx', 'typescript'],
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
}