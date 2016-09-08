

describe('cryptoHash', () => {
  const cryptoHash = Yavanna
    .withOverrides({env: {ANONYPOST_SECRET_KEY: 'asdf'}})
    .get('cryptoHash')

  it('hashes the array of strings by concatenating them', () => {
    expect(cryptoHash(['foo', 'bar']))
      .toEqual('64ab67af3db40fa231e47869f5b309fc2385a3fe4db184f9d36e951219aaf952')
    expect(cryptoHash(['foobar']))
      .toEqual('64ab67af3db40fa231e47869f5b309fc2385a3fe4db184f9d36e951219aaf952')

    expect(cryptoHash(['foo'])).toEqual('251e125e3185f1147969e336fbfafdcd5ab52014e931bef649f675250c2270af')
  })

  it('gives different outputs for different inputs', function() {
    expect(cryptoHash(['foobar'])).toEqual('64ab67af3db40fa231e47869f5b309fc2385a3fe4db184f9d36e951219aaf952')
    expect(cryptoHash(['foo'])).toEqual('251e125e3185f1147969e336fbfafdcd5ab52014e931bef649f675250c2270af')
  })

  it('refuses to hash an empty list of strings', () => {
    expect(() => cryptoHash([])).toThrowError('No strings passed to cryptoHash')
  })

  it('refuses to hash a list of empty strings', () => {
    expect(() => cryptoHash(['', ''])).toThrowError('Only empty strings passed to cryptoHash')
  })

  it('throws an exception when required if no secret key has been set', function() {
    expect(() => {
      Yavanna
        .withOverrides({env: {}})
        .get('cryptoHash')
    }).toThrowError('no secret key; set the ANONYPOST_SECRET_KEY env variable')
  })
})
