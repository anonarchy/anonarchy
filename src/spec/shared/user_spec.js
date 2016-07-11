describe('A User', () => {
  const User = Yavanna.get('User')

  it('has a name', () => {
    expect(User('bob').name).toEqual('bob')
  })
})
