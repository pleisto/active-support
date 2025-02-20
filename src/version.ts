/**
 * Checks if the currentVersion is greater than or equal to the minimumVersion.
 * Both version strings must follow the "xx.xx.xx" format.
 *
 * @param minimumVersion - The minimum version required (e.g., "1.2.3")
 * @param currentVersion - The current version to check (e.g., "1.2.4")
 * @returns true if currentVersion >= minimumVersion, otherwise false.
 * @throws Error if either version string does not match the expected format.
 */
export const meetsMinimumVersion = (minimumVersion: string, currentVersion: string): boolean => {
  const semverRegex = /^\d+\.\d+\.\d+$/

  if (!semverRegex.test(minimumVersion)) {
    throw new Error('Invalid minimum version format')
  }
  if (!semverRegex.test(currentVersion)) {
    throw new Error('Invalid current version format')
  }

  // Split the versions into parts and ensure there are exactly 3 parts
  const minParts = minimumVersion.split('.')
  if (minParts.length !== 3) {
    throw new Error('Invalid minimum version format')
  }
  const currParts = currentVersion.split('.')
  if (currParts.length !== 3) {
    throw new Error('Invalid current version format')
  }

  // Assert the arrays are tuples of exactly three numbers
  const minSegments = minParts.map(Number) as [number, number, number]
  const currSegments = currParts.map(Number) as [number, number, number]

  for (let i = 0; i < 3; i++) {
    if (currSegments[i]! > minSegments[i]!) return true
    if (currSegments[i]! < minSegments[i]!) return false
  }
  return true
}
