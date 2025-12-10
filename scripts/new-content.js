#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const contentTypes = {
  paper: 'papers',
  project: 'projects',
  notebook: 'notebooks',
  blog: 'blogs'
};

async function main() {
  console.log('\n🎨 Content Generator\n');
  
  // Ask for content type
  console.log('Content types:');
  console.log('1. Paper');
  console.log('2. Project');
  console.log('3. Notebook');
  console.log('4. Blog');
  
  const typeChoice = await question('\nSelect content type (1-4): ');
  
  const typeMap = {
    '1': 'paper',
    '2': 'project',
    '3': 'notebook',
    '4': 'blog'
  };
  
  const contentType = typeMap[typeChoice];
  
  if (!contentType) {
    console.log('❌ Invalid choice');
    rl.close();
    return;
  }
  
  const slug = await question('Enter slug (lowercase-with-hyphens): ');
  
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    console.log('❌ Invalid slug. Use lowercase letters, numbers, and hyphens only.');
    rl.close();
    return;
  }
  
  const contentDir = contentTypes[contentType];
  // Prefer Markdown template; fallback to JSON
  const mdTemplatePath = path.join(process.cwd(), 'content', contentDir, '_template.md');
  const jsonTemplatePath = path.join(process.cwd(), 'content', contentDir, '_template.json');
  const useMarkdown = fs.existsSync(mdTemplatePath);
  const templatePath = useMarkdown ? mdTemplatePath : jsonTemplatePath;
  const newFilePath = path.join(process.cwd(), 'content', contentDir, `${slug}.${useMarkdown ? 'md' : 'json'}`);
  
  // Check if file already exists
  if (fs.existsSync(newFilePath)) {
    const ext = useMarkdown ? 'md' : 'json';
    console.log(`❌ File already exists: ${slug}.${ext}`);
    rl.close();
    return;
  }
  
  // Read template
  const raw = fs.readFileSync(templatePath, 'utf8');
  if (useMarkdown) {
    // Replace slug in frontmatter
    const updated = raw.replace(/slug:\s*.*/i, `slug: ${slug}`);
    fs.writeFileSync(newFilePath, updated);
  } else {
    const template = JSON.parse(raw);
    template.slug = slug;
    fs.writeFileSync(newFilePath, JSON.stringify(template, null, 2));
  }
  
  console.log(`\n✅ Created: content/${contentDir}/${slug}.json`);
  console.log(`\n📝 Edit the file to add your content, then:`);
  console.log(`   git add content/${contentDir}/${slug}.json`);
  console.log(`   git commit -m "Add new ${contentType}: ${slug}"`);
  console.log(`   git push`);
  console.log(`\n🚀 Vercel will automatically deploy your changes!\n`);
  
  rl.close();
}

main().catch(console.error);
