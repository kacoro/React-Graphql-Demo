import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
  name: 'Datetime',
  description: 'GraphQL 日期时间标量类型',
  // 序列化函数
  // 用于将值转换为适合http传输的数据，一般为字符串
  serialize(value) {
    // return value.toLocaleString();
    return value.toString();
  },
  // 解析函数
  // 将客户端通过 **variables** 参数传递的数值为 Date 类型
  parseValue(value) {
    return new Date(value);
  },
  // 解析函数
  // 将客户端传递的 **字面量参数** 解析为 Date 类型
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error(`参数类型有误： ${ast.kind}， 应当传递 "String" 值`);
  }
});