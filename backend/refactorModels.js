const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Convert `?` to `$1, $2, ...` inside db.query() and db.execute()
  content = content.replace(/(db\.query|db\.execute)\s*\(\s*(['"`])(.*?)(['"`])/g, (match, method, q1, query, q2) => {
    let index = 1;
    // Replace ? with $1, $2, etc. (Assuming no ? inside string literals in the query itself)
    const newQuery = query.replace(/\?/g, () => `$${index++}`);
    return `${method}(${q1}${newQuery}${q2}`;
  });

  // Convert `return result.insertId;` or `return result[0].insertId;` to `return result[0]?.id_...;`
  // We need RETURNING id_... for Postgres. This is a bit tricky to automate perfectly without AST.
  // Instead, let's just log where insertId is used, and I'll fix them manually.
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
