import test from "ava"; import "babel-core/register"

import beautifyHTML from "../../../__tests__/utils/beautifyHTML"
import htmlMetas from "../../../html-metas"

import toHTML, { writeAllHTMLFiles } from "../index"


import { testStore, testRoutes } from "./utils"

test("don't break if there is nothing to transform", async (t) => {
  toHTML({
    urls: [],
    // metadata: {},
    // pagesData: {},
    // dest: "dest",
    // routes: {},
    // store: {},
    // baseUrl: { path: "/" },
  })
  .then((files) => {
    t.is(files.length, 0)
  })
  .catch((error) => {
    t.fail(error)
  })
})

test.cb("writeAllHTMLFiles", (t) => {
  t.plan(5)

  writeAllHTMLFiles({
    // metadata: {},
    urls: [
      "test-url",
    ],
    pagesData: {},
    dest: "dest",
    store: testStore,
    routes: testRoutes,
    baseUrl: { path: "/" },
    setPageData: (url, uri/* , pagesData, store */) => {
      t.is(url, "test-url")
      t.is(uri, "test-url")
    },
    writeHTMLFile: (basename, html) => {
      const expectedHTML = (
      `<!doctype html>
<html lang="en">

<head>
  ${ htmlMetas("static", { baseUrl: { path: "/" } }).join("\n  ") }
  <title data-react-helmet="true"></title>
</head>

<body>
  <div id="statinamic">
    <div id="statinamic-container">
      <p>TestContainer</p>
    </div>
  </div>
  <script>
    window.__INITIAL_STATE__ = {
      "pages": {}
    }
  </script>
  <script src="/statinamic-client.js"></script>
</body>

</html>`
      )
      t.is(basename, "dest/test-url")
      t.is(
        beautifyHTML(html),
        expectedHTML
      )
    },
    forgetPageData: (uri) => {
      t.is(uri, "test-url")
    },
  }, true)
  .then(() => {
    t.end()
  })
  .catch((error) => {
    t.fail(error)
  })
})