import { describe, expect, it } from "vitest"
import { checkMdx } from "./mdx.ts"

describe("checkMdx", () => {
  it("accepts markdown, math and allowed components", async () => {
    await expect(
      checkMdx('# h\n\n$a^{2}$\n\n<YouTube id="x" />\n\n![alt](/a.png)')
    ).resolves.toBeUndefined()
  })

  it.each([
    ["iframe", '<iframe src="https://evil.example" />'],
    ["script", "<script>alert(1)</script>"],
    ["import", 'import x from "fs"'],
    ["expression", "{process.exit()}"],
    ["expression attribute", "<YouTube id={x} />"],
    ["spread attribute", "<YouTube {...x} />"],
    ["image without alt", "![](/a.png)"],
  ])("rejects %s", async (_, source) => {
    await expect(checkMdx(source)).rejects.toThrow()
  })
})
