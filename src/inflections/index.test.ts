import { expect, test, describe } from 'vitest'
import { pluralize, singularize } from './index'

describe('.pluralize', () => {
  test('should return the plural form of a word', () => {
    expect(pluralize('word')).toEqual('words')
    expect(pluralize('datum')).toEqual('data')
    expect(pluralize('water')).toEqual('water')
    expect(pluralize('revrvrrtbrtb')).toEqual('revrvrrtbrtbs')
  })
})
describe('.singularize', () => {
  test('should return the singular form of a word', () => {
    expect(singularize('words')).toEqual('word')
    expect(singularize('quizzes')).toEqual('quiz')
    expect(singularize('news')).toEqual('news')
    expect(singularize('are')).toEqual('is')
  })
})
