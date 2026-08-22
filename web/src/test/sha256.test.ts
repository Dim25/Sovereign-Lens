import { describe, expect, it } from 'vitest'
import { canonicalJson, sha256Hex } from '../lib/sha256'

describe('sha256', () => {
  it('matches the published vectors', () => {
    expect(sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    )
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })

  it('handles input spanning multiple blocks', () => {
    expect(sha256Hex('a'.repeat(1000)).slice(0, 12)).toBe('41edece42d63')
  })
})

describe('canonicalJson', () => {
  it('reproduces json.dumps(..., sort_keys=True)', () => {
    expect(canonicalJson([{ b: 1, a: 'x' }])).toBe('[{"a": "x", "b": 1}]')
    expect(canonicalJson([{ z: null, y: 0.65, x: true }])).toBe(
      '[{"x": true, "y": 0.65, "z": null}]',
    )
  })
})
