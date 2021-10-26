export const savefile = {
    global: "global.sav",
    game: (i) => "save" + i.toString().padStart(2, "0") + ".sav",
};
