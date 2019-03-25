module.exports = (client, oldUser, newUser) => {
  newUser.loadMember().then(async member => {
    await member.checkUserExistence();
    client.models.Members.update(
      {
        Username: newUser.username.replace(/[^0-9a-z\!\-\?\.\,\'\"\#\@\/ ]/gi, "")
      },
      {
        where: {
          DiscordID: newUser.id
        }
      }
    )
  })
}