import { describe, expect, it } from 'vitest'
import { Vocabulary } from './vocabulary'

describe('vocabulary', () => {
  describe('.singularize', () => {
    it('should handle unknown plurality edge case where singular rule matches but word is likely singular', () => {
      const vocabulary = new Vocabulary()

      // Add rules to simulate the edge case:
      // 1. A singularization rule that matches the potentially singular word.
      vocabulary.addSingular('matrix$', 'matri')
      // 2. A non-simple pluralization rule for the word.
      vocabulary.addPlural('matrix$', 'matrices')
      // 3. A singularization rule for the resulting plural form that reverts to the original word.
      vocabulary.addSingular('matrices$', 'matrix')

      // When plurality is unknown (false), and the above conditions are met,
      // the original word should be returned despite matching the first singular rule.
      expect(vocabulary.singularize('matrix', false)).toEqual('matrix')
    })

    // Add more tests for singularize here if needed
  })

  // Add tests for other Vocabulary methods here if needed
})
