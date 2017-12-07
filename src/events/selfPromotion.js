
module.exports.run = async (client, message) => {

}

//Functions used to check if a player has the desired role
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role)
{
    if (pluck(mem.roles).includes(role))
    {
        return true;
    } else {
        return false;
    }

}

//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}