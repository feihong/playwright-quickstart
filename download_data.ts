import fs from 'node:fs/promises'
import path from 'node:path'
import playwright from 'playwright'

const links = `
https://www.kanunu8.com/files/chinese/201103/2371/59668.html
https://www.kanunu8.com/files/chinese/201103/2371/59669.html
https://www.kanunu8.com/files/chinese/201103/2371/59670.html
https://www.kanunu8.com/files/chinese/201103/2371/59671.html
https://www.kanunu8.com/files/chinese/201103/2371/59672.html
https://www.kanunu8.com/files/chinese/201103/2371/59673.html
https://www.kanunu8.com/files/chinese/201103/2371/59674.html
https://www.kanunu8.com/files/chinese/201103/2371/59675.html
https://www.kanunu8.com/files/chinese/201103/2371/59676.html
https://www.kanunu8.com/files/chinese/201103/2371/59677.html
https://www.kanunu8.com/files/chinese/201103/2371/59678.html
https://www.kanunu8.com/files/chinese/201103/2371/59679.html
https://www.kanunu8.com/files/chinese/201103/2371/59680.html
https://www.kanunu8.com/files/chinese/201103/2371/59681.html
https://www.kanunu8.com/files/chinese/201103/2371/59682.html
`
  .trim()
  .split('\n')

const outputDir = path.dirname(__filename) + '/output'
if (!await fs.exists(outputDir)) {
  await fs.mkdir(outputDir)
}

const browser = await playwright['firefox'].launch()
const context = await browser.newContext()
const page = await context.newPage()

const contents = []

for (const link of links) {
  console.log(`Visiting ${link}`)
  await page.goto(link)
  const content = await page.evaluate(() => {
    return {
      title: document.querySelector('h2').textContent.trim(),
      body:  document.querySelector('p').textContent.trim()
    }
  })

  console.log(`Found "${content.title}"`)
  // Save intermediate results for debugging
  const outputFile = path.join(outputDir, content.title + '.txt')
  await Bun.write(outputFile, content.body)

  contents.push(content)
}

console.log("Writing book.txt")
const outputFile = path.join(outputDir, 'book.txt')
const text = contents.map(({ title, body }, index) => `${index + 1} ${title}\n\n${body}`).join('\n\n')
await Bun.write(outputFile, text)

await browser.close()
