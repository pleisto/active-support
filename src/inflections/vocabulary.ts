import { Rule } from './rule'
/**
 * Implementation reference from:
 * @see {@link https://github.com/fakoua/Humanizer.ts/blob/master/src/Humanizer/Inflections/Vocabulary.ts}
 *
 * A container for exceptions to simple pluralization/singularization rules.
 * Vocabularies.Default contains an extensive list of rules for US English.
 * At this time, multiple vocabularies and removing existing rules are not supported.
 */
export class Vocabulary {
  private readonly _plurals = new Array<Rule>()
  private readonly _singulars = new Array<Rule>()
  private readonly _uncountables = new Array<string>()

  /// <summary>
  /// Adds a word to the vocabulary which cannot easily be pluralized/singularized by RegEx, e.g. "person" and "people".
  /// </summary>
  /// <param name="singular">The singular form of the irregular word, e.g. "person".</param>
  /// <param name="plural">The plural form of the irregular word, e.g. "people".</param>
  /// <param name="matchEnding">True to match these words on their own as well
  private applyRules(rules: Rule[], word: string, skipFirstRule: boolean): string {
    if (word == null) {
      return ''
    }

    if (this.isUncountable(word)) {
      return word
    }

    let result = word
    const end = skipFirstRule ? 1 : 0
    for (let i = rules.length - 1; i >= end; i--) {
      // eslint-disable-next-line no-cond-assign
      if ((result = rules[i]!.apply(word)) !== '') {
        break
      }
    }
    return result
  }

  /// <summary>
  /// Adds an uncountable word to the vocabulary, e.g. "fish".  Will be ignored when plurality is changed.
  /// </summary>
  private isUncountable(word: string): boolean {
    return this._uncountables.includes(word.toLowerCase())
  }

  /// <summary>
  /// Adds a rule to the vocabulary that does not follow trivial rules for pluralization, e.g. "bus" -> "buses"
  /// </summary>
  /// <param name="rule">RegEx to be matched, case insensitive, e.g. "(bus)es$"</param>
  /// as at the end of longer words. False, otherwise.</param>
  public addIrregular(singular: string, plural: string, matchEnding: boolean = true): void {
    if (matchEnding) {
      this.addPlural(`(${singular[0]})${singular.substring(1)}$`, `$1${plural.substring(1)}`)
      this.addSingular(`(${plural[0]})${plural.substring(1)}$`, `$1${singular.substring(1)}`)
    } else {
      this.addPlural(`^${singular}$`, plural)
      this.addSingular(`^${plural}$`, singular)
    }
  }

  /// <summary>
  /// Adds a rule to the vocabulary that does not follow trivial rules for singularization,
  /// e.g."vertices/indices -> "vertex/index"
  /// </summary>
  /// <param name="rule">RegEx to be matched, case insensitive, e.g. ""(vert|ind)ices$""</param>
  /// <param name="replacement">RegEx replacement  e.g. "$1"</param>
  public addPlural(rule: string, replacement: string): void {
    this._plurals.push(new Rule(rule, replacement))
  }

  /// <summary>
  /// Pluralizes the provided input considering irregular words
  /// </summary>
  /// <param name="word">Word to be pluralized</param>
  /// <param name="inputIsKnownToBeSingular">Normally you call Pluralize on singular words;
  /// but if you're unsure call it with false</param>
  /// <param name="replacement">RegEx replacement  e.g. "$1ex"</param>
  public addSingular(rule: string, replacement: string): void {
    this._singulars.push(new Rule(rule, replacement))
  }

  /// <summary>
  /// Singularizes the provided input considering irregular words
  /// </summary>
  /// <param name="word">Word to be singularized</param>
  /// <param name="inputIsKnownToBePlural">Normally you call Singularize on plural words; but if you're unsure
  /// call it with false</param>
  /// <param name="skipSimpleWords">Skip singularizing single words that have an 's' on the end</param>
  /// <param name="word">Word to be added to the list of uncountables.</param>
  public addUncountable(word: string): void {
    this._uncountables.push(word.toLowerCase())
  }

  /// <returns></returns>
  public pluralize(word: string, inputIsKnownToBeSingular: boolean = true): string {
    const result = this.applyRules(this._plurals, word, false)

    if (inputIsKnownToBeSingular) {
      return result ?? word
    }

    const asSingular = this.applyRules(this._singulars, word, false)
    const asSingularAsPlural = this.applyRules(this._plurals, asSingular, false)
    if (
      asSingular !== '' &&
      asSingular !== word &&
      `${asSingular}s` !== word &&
      asSingularAsPlural === word &&
      result !== word
    ) {
      return word
    }

    return result
  }

  /// <returns></returns>
  public singularize(word: string, inputIsKnownToBePlural: boolean = true, skipSimpleWords: boolean = false): string {
    const result = this.applyRules(this._singulars, word, skipSimpleWords)

    if (inputIsKnownToBePlural) {
      return result ?? word
    }

    // the Plurality is unknown so we should check all possibilities
    const asPlural = this.applyRules(this._plurals, word, false)
    const asPluralAsSingular = this.applyRules(this._singulars, asPlural, false)
    if (asPlural !== word && `${word}s` !== asPlural && asPluralAsSingular === word && result !== word) {
      return word
    }

    return result === '' ? word : result
  }
}
