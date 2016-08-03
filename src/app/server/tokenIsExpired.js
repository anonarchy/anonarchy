console.log("loaded tokenIsExpired")
Yavanna.provide( 'tokenIsExpired', () =>
    (user, now) => now - user.timestamp > 24 * 60 * 60 * 1000 * 7
)
