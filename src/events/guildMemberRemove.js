module.exports = (client, member) => {
  if (!member.guild.mainServer) return;

  member.saveRoles();
};
