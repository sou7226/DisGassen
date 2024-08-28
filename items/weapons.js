const ironSword = {
    weapon_id: 1,
    name: "鉄の剣",
    type: "剣",
    effect: "鉄で精錬された剣",
    attak: 10,
    value: 100,
    rarity: "1"
};
const goldenSword = {
    weapon_id: 2,
    name: "金の剣",
    type: "剣",
    effect: "金で精錬された剣",
    attak: 20,
    value: 99999999,
    rarity: "5"
};
const weapons = [
    ironSword,
    goldenSword
];

module.exports = { weapons };