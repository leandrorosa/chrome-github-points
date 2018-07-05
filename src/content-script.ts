import * as pages from './pages'

// Run all pages
Object.keys(pages).forEach(pageName => {
  const PageClass = pages[pageName]
  const page = new PageClass()
  page.run()
})
