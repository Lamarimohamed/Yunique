const fs = require("fs")
const html = fs.readFileSync("src/imports/yunique-logo-intro__1_.html", "utf8")
const svgMatch = html.match(
  /<svg class="mark" viewBox="30 310 1380 780" xmlns="http:\/\/www.w3.org\/2000\/svg">([\s\S]*?)<\/svg>/,
)
let svgContent = svgMatch[1]

// Convert to JSX
svgContent = svgContent.replace(
  /style="animation-delay:(\d+ms)"/g,
  'style={{ animationDelay: "$1" }}',
)
svgContent = svgContent.replace(/fill-rule="evenodd"/g, 'fillRule="evenodd"')
svgContent = svgContent.replace(/class=/g, "className=")

const component = `export function LogoIntroSvg() {
  return (
    <svg className="mark" viewBox="30 310 1380 780" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>
  );
}
`
fs.writeFileSync("src/components/ui/LogoIntroSvg.tsx", component)
