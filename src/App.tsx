import { useEffect, useState } from 'react'
import './App.css'

type PageContent = {
  title: string
  slug: string
  layout: string
  heading: string
  body: string | null
  seoTitle: string | null
  seoDescription: string | null
}

const DOMAIN = 'bellasrestaurant.com'

export default function App() {
  const [page, setPage] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch(
          `/api/public/sites/${encodeURIComponent(DOMAIN)}/pages/home`,
        )

        if (!response.ok) {
          throw new Error('Unable to load website content.')
        }

        const content: PageContent = await response.json()
        setPage(content)
      } catch {
        setError('Website content is currently unavailable.')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [])

  useEffect(() => {
    if (!page) return

    document.title = page.seoTitle || page.title

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )

    if (description) {
      description.content = page.seoDescription || page.body || ''
    }
  }, [page])

  if (loading) {
    return <main className="status-message">Loading Bella's Restaurant...</main>
  }

  if (error || !page) {
    return <main className="status-message">{error || 'Page not found.'}</main>
  }

  return (
    <div className="restaurant-site">
      <header className="site-header">
        <div className="brand">Bella's Restaurant</div>
        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">Welcome to Bella's</p>
            <h1>{page.heading}</h1>
            <p className="hero-description">
              {page.body || 'Delicious food, warm hospitality, and memorable moments.'}
            </p>
            <a href="#about" className="primary-button">
              Discover Our Restaurant
            </a>
          </div>
        </section>

        <section id="about" className="about-section">
          <p className="eyebrow">Our Story</p>
          <h2>Good food. Great company.</h2>
          <p>
            At Bella's Restaurant, we believe every meal should feel special.
            Join us for fresh flavors and a welcoming atmosphere.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} Bella's Restaurant
      </footer>
    </div>
  )
}