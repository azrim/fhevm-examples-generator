import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { parse as parseComment } from 'comment-parser';

interface ParsedDocs {
  title?: string;
  purpose?: string;
  chapters: Map<string, { examples: string[]; notes: string[] }>;
  generalNotes: string[];
}

/**
 * Parse JSDoc/TSDoc comments from test files
 */
async function parseTestFiles(targetPath: string): Promise<ParsedDocs> {
  const docs: ParsedDocs = {
    chapters: new Map(),
    generalNotes: [],
  };

  // Find all test files
  const testFiles = await glob('test/**/*.ts', {
    cwd: targetPath,
    absolute: true,
  });

  console.log(`      Found ${testFiles.length} test file(s)`);

  for (const testFile of testFiles) {
    const content = await fs.readFile(testFile, 'utf-8');

    // Parse block comments
    const comments = parseComment(content, { spacing: 'preserve' });

    for (const comment of comments) {
      // Extract tags
      for (const tag of comment.tags) {
        const tagName = tag.tag;
        const tagValue = tag.name + ' ' + tag.description;
        const cleanValue = tagValue.trim();

        switch (tagName) {
          case 'title':
            if (!docs.title) {
              docs.title = cleanValue;
            }
            break;

          case 'purpose':
            if (!docs.purpose) {
              docs.purpose = cleanValue;
            }
            break;

          case 'chapter':
            const chapterName = cleanValue;
            if (!docs.chapters.has(chapterName)) {
              docs.chapters.set(chapterName, { examples: [], notes: [] });
            }
            break;

          case 'example':
            // Find the most recent chapter or use default
            const chapters = Array.from(docs.chapters.keys());
            const currentChapter = chapters[chapters.length - 1] || 'Examples';
            if (!docs.chapters.has(currentChapter)) {
              docs.chapters.set(currentChapter, { examples: [], notes: [] });
            }
            docs.chapters.get(currentChapter)!.examples.push(cleanValue);
            break;

          case 'note':
            // Add to current chapter or general notes
            const chapterKeys = Array.from(docs.chapters.keys());
            if (chapterKeys.length > 0) {
              const lastChapter = chapterKeys[chapterKeys.length - 1];
              docs.chapters.get(lastChapter)!.notes.push(cleanValue);
            } else {
              docs.generalNotes.push(cleanValue);
            }
            break;
        }
      }

      // Also check description for inline tags
      if (comment.description) {
        const desc = comment.description.trim();
        if (desc && !docs.purpose) {
          docs.purpose = desc;
        }
      }
    }
  }

  return docs;
}

/**
 * Generate GitBook-compatible README.md
 */
export async function generateDocs(
  targetPath: string,
  exampleName: string
): Promise<string | null> {
  try {
    console.log(`      Parsing test files for documentation...`);
    const docs = await parseTestFiles(targetPath);

    // Build README content
    let readme = '';

    // Title
    const title = docs.title || `${exampleName} Example`;
    readme += `# ${title}\n\n`;

    // Purpose/Description
    if (docs.purpose) {
      readme += `${docs.purpose}\n\n`;
    } else {
      readme += `This example demonstrates the ${exampleName} functionality in FHEVM.\n\n`;
    }

    // Chapters
    if (docs.chapters.size > 0) {
      for (const [chapterName, chapterContent] of docs.chapters) {
        readme += `## ${chapterName}\n\n`;

        // Examples in this chapter
        if (chapterContent.examples.length > 0) {
          for (const example of chapterContent.examples) {
            readme += `### ${example}\n\n`;
          }
        }

        // Notes in this chapter
        if (chapterContent.notes.length > 0) {
          for (const note of chapterContent.notes) {
            readme += `> **Note:** ${note}\n\n`;
          }
        }
      }
    }

    // General notes
    if (docs.generalNotes.length > 0) {
      readme += `## Notes\n\n`;
      for (const note of docs.generalNotes) {
        readme += `> ${note}\n\n`;
      }
    }

    // How to run tests
    readme += `## How to Run Tests\n\n`;
    readme += `\`\`\`bash\n`;
    readme += `# Install dependencies\n`;
    readme += `npm ci\n\n`;
    readme += `# Run tests\n`;
    readme += `npm test\n\n`;
    readme += `# Or compile only\n`;
    readme += `npx hardhat compile\n`;
    readme += `\`\`\`\n\n`;

    // What this example teaches
    readme += `## What This Example Teaches\n\n`;
    if (docs.purpose) {
      readme += `${docs.purpose}\n\n`;
    }

    readme += `This example demonstrates:\n\n`;

    if (docs.chapters.size > 0) {
      for (const [chapterName, chapterContent] of docs.chapters) {
        readme += `- **${chapterName}**: `;
        if (chapterContent.examples.length > 0) {
          readme += chapterContent.examples.join(', ');
        } else {
          readme += `Core concepts and implementation`;
        }
        readme += `\n`;
      }
    } else {
      readme += `- Core FHEVM functionality\n`;
      readme += `- Smart contract development with encrypted data\n`;
      readme += `- Testing patterns for FHE operations\n`;
    }

    readme += `\n`;

    // Additional resources
    readme += `## Additional Resources\n\n`;
    readme += `- [FHEVM Documentation](https://docs.zama.ai/fhevm)\n`;
    readme += `- [Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)\n`;
    readme += `- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)\n`;

    // Write README
    const readmePath = path.join(targetPath, 'README.md');
    await fs.writeFile(readmePath, readme);
    console.log(`      ✅ Generated README.md`);

    return readmePath;
  } catch (error: any) {
    console.error(`      ❌ Failed to generate docs: ${error.message}`);
    return null;
  }
}
