import { baseOptions } from './options'
import { parse } from './parser'
import { generate } from './codegen'
import { optimize } from './optimizer'

export function compiler (template, options) {
  const ast = parse(template, { ...baseOptions, ...options })
  optimize(ast, { ...baseOptions, ...options })
  const code = generate(ast)
  return {
    ast,
    render: code.render
  }
}
