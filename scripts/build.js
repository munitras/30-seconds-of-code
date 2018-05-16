/*
  This is the builder script that generates the README and SNIPPETS_ARCHIVE files.
  Run using `npm run builder`.
*/
// Load modules
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const util = require('./util');
// Paths
const SNIPPETS_PATH = './snippets';
const SNIPPETS_ARCHIVE_PATH = './snippets_archive';
const STATIC_PARTS_PATH = './static-parts';
if(util.isTravisCI() && /^Travis build: \d+/g.test(process.env['TRAVIS_COMMIT_MESSAGE'])) {
  console.log(`${chalk.green('NOBUILD')} README build terminated, parent commit is a Travis build!`);
  process.exit(0);
}
if(util.isTravisCI() && (process.env['TRAVIS_EVENT_TYPE'] === 'cron' || process.env['TRAVIS_EVENT_TYPE'] === 'api')){
  console.log(`${chalk.green('ARCHIVE')} Cron job or custom build, building archive README!`);
  console.time('Builder');
  let snippets = {};
  // Synchronously read all snippets from snippets_archive folder and sort them as necessary (case-insensitive)
  try {
    const snippetFilenames = fs
      .readdirSync(SNIPPETS_ARCHIVE_PATH)
      .sort((a, b) => a.toLowerCase() - b.toLowerCase());
    // Store the data read from each snippet in the appropriate object
    for (const name of snippetFilenames.filter(s => s !== 'README.md')) {
      snippets[name] = fs.readFileSync(path.join(SNIPPETS_ARCHIVE_PATH, name), 'utf8');
    }
  } catch (err) {
    console.log(`${chalk.red('ERROR!')} During snippet loading: ${err}`);
    process.exit(1);
  }
  try {
    // Add the start static part
    let output = `![Logo](/logo.png)

# Snippets Archive

These snippets, while useful and interesting, didn\'t quite make it into the repository due to either having very specific use-cases or being outdated. However we felt like they might still be useful to some readers, so here they are.

## Table of Contents

`;
    for(const snippet of Object.entries(snippets))
      output += `* [\`${snippet[0].slice(0,-3)}\`](#${snippet[0].toLowerCase().slice(0,-3)})\n`;
    output += '\n---\n';
    for(const snippet of Object.entries(snippets)){
      let data = snippet[1];
      data =
        data.slice(0, data.lastIndexOf('```js')) +
        '<details>\n<summary>Examples</summary>\n\n' +
        data.slice(data.lastIndexOf('```js'), data.lastIndexOf('```')) +
        data.slice(data.lastIndexOf('```')) +
        '\n</details>\n';
      output += `\n${data + '\n<br>[⬆ Back to top](#table-of-contents)\n\n'}`;
    }

    // Write to the README file of the archive
    fs.writeFileSync(path.join(SNIPPETS_ARCHIVE_PATH,'README.md'), output);
  } catch (err) {
    console.log(`${chalk.red('ERROR!')} During README generation for snippets archive: ${err}`);
    process.exit(1);
  }

  console.log(`${chalk.green('SUCCESS!')} README file generated for snippets archive!`);
  console.timeEnd('Builder');
}
let snippets = {};
const EMOJIS = {
  adapter: '🔌',
  array: '📚',
  browser: '🌐',
  date: '⏱️',
  function: '🎛️',
  logic: '🔮',
  math: '➗',
  media: '📺',
  node: '📦',
  object: '🗃️',
  string: '📜',
  type: '📃',
  utility: '🔧'
};

let startPart = '',
  endPart = '',
  output = '',
  tagDbData = {};

console.time('Builder');

// Synchronously read all snippets from snippets folder and sort them as necessary (case-insensitive)
snippets = util.readSnippets(SNIPPETS_PATH);

// Load static parts for the README file
try {
  startPart = fs.readFileSync(path.join(STATIC_PARTS_PATH, 'README-start.md'), 'utf8');
  endPart = fs.readFileSync(path.join(STATIC_PARTS_PATH, 'README-end.md'), 'utf8');
} catch (err) {
  console.log(`${chalk.red('ERROR!')} During static part loading: ${err}`);
  process.exit(1);
}

// Load tag data from the database
tagDbData = util.readTags();
console.log(tagDbData);
// Create the output for the README file
try {
  const tags = [
    ...new Set(
      Object.entries(tagDbData)
        .map(t => t[1][0])
        .filter(v => v)
        .sort((a, b) => util.capitalize(a, true) === 'Uncategorized' ? 1 : util.capitalize(b, true) === 'Uncategorized' ? -1 : a.localeCompare(b)))
  ];

  console.log(tags);

  // Add the start static part
  output += `${startPart + '\n'}`;

  // Loop over tags and snippets to create the table of contents
  for (const tag of tags) {
    const capitalizedTag = util.capitalize(tag, true);
    output += `### ${
      EMOJIS[tag] || ''
    } ${capitalizedTag}\n\n<details>\n<summary>View contents</summary>\n\n`;
    for (const taggedSnippet of Object.entries(tagDbData).filter(v => v[1][0] === tag)) {
      output += `* [\`${taggedSnippet[0]}\`](#${taggedSnippet[0].toLowerCase()}${taggedSnippet[1].includes('advanced')?'-':''})\n`;
    }
    output += '\n</details>\n\n';
  }

  // Loop over tags and snippets to create the list of snippets
  for (const tag of tags) {
    const capitalizedTag = util.capitalize(tag, true);
    output += `---\n ## ${EMOJIS[tag] || ''} ${capitalizedTag}\n`;
    for (const taggedSnippet of Object.entries(tagDbData).filter(v => v[1][0] === tag)) {
      let data = snippets[taggedSnippet[0] + '.md'];
      // Add advanced tag
      if(taggedSnippet[1].includes('advanced')){
        data = data.split(/\r?\n/);
        data[0] = data[0] +' ![advanced](/advanced.svg)';
        data = data.join('\n');
      }
      data =
        data.slice(0, data.lastIndexOf('```js')) +
        '<details>\n<summary>Examples</summary>\n\n' +
        data.slice(data.lastIndexOf('```js'), data.lastIndexOf('```')) +
        data.slice(data.lastIndexOf('```')) +
        '\n</details>\n';
      output += `\n${data + '\n<br>[⬆ Back to top](#table-of-contents)\n\n'}`;
    }
  }

  // Add the ending static part
  output += `\n${endPart + '\n'}`;
  // Write to the README file
  fs.writeFileSync('README.md', output);
} catch (err) {
  console.log(`${chalk.red('ERROR!')} During README generation: ${err}`);
  process.exit(1);
}

console.log(`${chalk.green('SUCCESS!')} README file generated!`);
console.timeEnd('Builder');
