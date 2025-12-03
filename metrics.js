const fs = require("fs");
const path = require("path");

// pad strings
function pad(str, width) {
  str = String(str);
  if (str.length > width) return str.slice(0, width - 3) + '...';
  return str + ' '.repeat(width - str.length);
}

function analyzeClass(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const classMatch = /class\s+([A-Za-z0-9_]+)\s*{([\s\S]+)}/.exec(src);
  if (!classMatch) return null;

  const className = classMatch[1];
  const body = classMatch[2];

  const fields = [...body.matchAll(/this\.([A-Za-z0-9_]+)\s*=/g)].map(m => m[1]);
  const methodMatches = [...body.matchAll(/([A-Za-z0-9_]+)\s*\((.*?)\)\s*{([\s\S]*?)}\s*/g)];
  const methods = methodMatches.map(m => {
    const name = m[1];
    const body = m[3];
    const usedFields = fields.filter(f => body.includes(`this.${f}`));
    return { name, uses: usedFields };
  });

  let pairsWithSharedFields = 0;
  let totalPairs = 0;
  for (let i = 0; i < methods.length; i++) {
    for (let j = i + 1; j < methods.length; j++) {
      totalPairs++;
      if (methods[i].uses.some(f => methods[j].uses.includes(f))) pairsWithSharedFields++;
    }
  }

  const cohesion = totalPairs === 0 ? 100 : Math.round((pairsWithSharedFields / totalPairs) * 100);

  return {
    file: path.basename(filePath),
    class: className,
    fieldsCount: fields.length,
    methodsCount: methods.length,
    cohesion,
    hint: cohesion < 40 ? "Low cohesion" : "OK"
  };
}

function analyzeDirectory(dir) {
  const results = fs.readdirSync(dir)
    .filter(f => f.endsWith(".js"))
    .map(f => analyzeClass(path.join(dir, f)))
    .filter(r => r !== null);

  // Column widths
  const colWidths = { file: 15, class: 15, fields: 7, methods: 8, cohesion: 9, hint: 30 };

  // Print header
  console.log(
    pad("File", colWidths.file) +
    pad("Class", colWidths.class) +
    pad("Fields", colWidths.fields) +
    pad("Methods", colWidths.methods) +
    pad("Cohesion", colWidths.cohesion) +
    pad("Status", colWidths.hint)
  );
  console.log('-'.repeat(95));

  // Print rows
  results.forEach(r => {
    console.log(
      pad(r.file, colWidths.file) +
      pad(r.class, colWidths.class) +
      pad(r.fieldsCount, colWidths.fields) +
      pad(r.methodsCount, colWidths.methods) +
      pad(r.cohesion + '%', colWidths.cohesion) +
      pad(r.hint, colWidths.hint)
    );
  });
}


const folder = path.join(__dirname, "gameAssets");
analyzeDirectory(folder);
