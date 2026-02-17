import { mdToPdf } from 'md-to-pdf';
import { readdir } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const coursesDir = join(__dirname, '../docs/courses');
const outputDir = join(__dirname, '../docs/courses');

async function convertMarkdownToPDF() {
	try {
		const files = await readdir(coursesDir);
		const mdFiles = files.filter((file) => file.endsWith('.md'));

		console.log(`Found ${mdFiles.length} markdown files to convert...\n`);

		for (const file of mdFiles) {
			const inputPath = join(coursesDir, file);
			const outputPath = join(outputDir, file.replace('.md', '.pdf'));

			console.log(`Converting: ${file}`);

			try {
				await mdToPdf(
					{ path: inputPath },
					{
						dest: outputPath,
						pdf_options: {
							format: 'A4',
							margin: {
								top: '20mm',
								right: '20mm',
								bottom: '20mm',
								left: '20mm'
							}
						}
					}
				);
				console.log(`✓ Created: ${basename(outputPath)}\n`);
			} catch (err) {
				console.error(`Error converting ${file}:`, err.message);
			}
		}

		console.log('All files converted successfully!');
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

convertMarkdownToPDF();
