export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  views: number
  isBreaking: boolean
  author: {
    name: string
    avatar: string
  }
  source: {
    name: string
    url: string
  }
}

export interface NewsCategory {
  id: string
  name: string
  count: number
  color: string
}
