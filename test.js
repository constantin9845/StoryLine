const fs = require('fs');


let failed = false;

function log(msg) {
    console.log("[TEST] :" + msg);
}

function fail(msg) {
    console.error("[ERROR] :" + msg);
    failed = true;
}

function pass(msg) {
    console.log("[PASS] :" + msg);
}

// check for asset folders
const assetFolders = [
    "resources",
    "level_imgs",
];

assetFolders.forEach(folder => {
    if (!fs.existsSync(folder)) fail(`Asset folder not found: ${folder}`);
    else pass(`Asset folder found: ${folder}`);
});

// Check for required game files
const requiredFiles = [
    "assets.json",
    "db.json",
    "game.html",
    "index.html",
    "index.js",
    "level-selection.html",
    "story.html",
    "css/game.css",
    "css/level-selection.css",
    "css/story.css",
    "css/style.css",
    "scripts/level-selection.js",
    "scripts/level.js",
    "scripts/main.js",
    "scripts/story.js"
];

requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) fail(`Missing file: ${file}`);
    else pass(`File found: ${file}`);
});

// Check for JSON config validity of asssets.json
try{
    const cfg = JSON.parse(fs.readFileSync("assets.json", "utf-8"));
    pass(`assets.json parsed successfully`);

    if (typeof cfg['level2']['clues'] !== "object") {
        fail("assets.json: 'clues' should be an array");
    } else {
        pass("assets,json: clues is valid");
    }

    if (typeof cfg['level2']['story'] !== "string") {
        fail("assets.json: 'story' should be a string");
    } else {
        pass("assets,json: story is valid");
    }
}catch(err){
    fail("assets.json is not valid JSON: " + err.message)
}

// Check for JSON config validity of db.json
try{
    const cfg = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    pass(`db.json parsed successfully`);


    if (typeof cfg.clues !== "object") {
        fail("db.json: 'clues' should be an array");
    } else {
        pass("db.json: clues is valid");
    }

    if (typeof cfg.found !== "object") {
        fail("db.json: 'found' should be an array");
    } else {
        pass("db.json: found is valid");
    }
}catch(err){
    fail("db.json is not valid JSON: " + err.message)
}


if (failed) {
    console.error("\n[TESTS FAILED] — Game will not start.");
    process.exit(1);
} else {
    console.log("\n[ALL TESTS PASSED] — Ready to launch game.");
    process.exit(0);
}