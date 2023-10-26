
import { readFile, writeFile } from 'fs/promises'
import { fetchLatestBlogs, getBlogMdContent } from './function'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler() {
    try {
        const readmeTemplate = await readFile(
            path.join(__dirname, '..', 'readme-template.md'),
            'utf-8',
        )

        const readmeFilePath = path.join(__dirname, '..', 'README.md')

        const blogs = await fetchLatestBlogs(3)

        if (blogs) {
            const blogMdContent = getBlogMdContent(blogs)
            const finalReadmeContent = readmeTemplate.replace('<!-- {{ latest-blogs }}  -->', blogMdContent)
            await writeFile(readmeFilePath, finalReadmeContent.trim() + '\n', 'utf-8')
            console.log('✅ Successfully update readme file')
        }

    } catch (error) {
        console.error('Something went wrong while updating read me content')
        console.error(error)
        process.exit(1)
    }
}

handler().catch(error => {
    console.error(error)
    process.exit(1)
})