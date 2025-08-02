import { supabase, getDatabaseStatus, type DatabaseStatus } from "./supabase"

// 데이터베이스 테이블 스키마 확인
export async function checkTableSchemas() {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase 클라이언트가 설정되지 않았습니다.",
    }
  }

  const results = {
    business_cards: false,
    news_articles: false,
    categories: false,
    tags: false,
    news_categories: false,
    news_tags: false,
  }

  const errors: string[] = []

  try {
    // business_cards 테이블 확인
    const { error: businessError } = await supabase
      .from("business_cards")
      .select("id, title, description, category")
      .limit(1)

    if (!businessError) {
      results.business_cards = true
    } else {
      errors.push(`business_cards: ${businessError.message}`)
    }

    // news_articles 테이블 확인
    const { error: newsError } = await supabase.from("news_articles").select("id, title, content, category").limit(1)

    if (!newsError) {
      results.news_articles = true
    } else {
      errors.push(`news_articles: ${newsError.message}`)
    }

    // categories 테이블 확인
    const { error: categoriesError } = await supabase.from("categories").select("id, name").limit(1)

    if (!categoriesError) {
      results.categories = true
    } else {
      errors.push(`categories: ${categoriesError.message}`)
    }

    // tags 테이블 확인
    const { error: tagsError } = await supabase.from("tags").select("id, name").limit(1)

    if (!tagsError) {
      results.tags = true
    } else {
      errors.push(`tags: ${tagsError.message}`)
    }

    // news_categories 테이블 확인
    const { error: newsCategoriesError } = await supabase.from("news_categories").select("id, name").limit(1)

    if (!newsCategoriesError) {
      results.news_categories = true
    } else {
      errors.push(`news_categories: ${newsCategoriesError.message}`)
    }

    // news_tags 테이블 확인
    const { error: newsTagsError } = await supabase.from("news_tags").select("id, name").limit(1)

    if (!newsTagsError) {
      results.news_tags = true
    } else {
      errors.push(`news_tags: ${newsTagsError.message}`)
    }

    return {
      success: Object.values(results).some(Boolean),
      results,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
      results,
    }
  }
}

// 데이터베이스 데이터 개수 확인
export async function getDataCounts() {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase 클라이언트가 설정되지 않았습니다.",
    }
  }

  try {
    const counts = {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
      news_categories: 0,
      news_tags: 0,
    }

    // 각 테이블의 데이터 개수 확인
    const tables = Object.keys(counts) as (keyof typeof counts)[]

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (!error && count !== null) {
          counts[table] = count
        }
      } catch (error) {
        console.warn(`${table} 테이블 개수 조회 실패:`, error)
      }
    }

    return {
      success: true,
      counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

// 데이터베이스 함수 존재 여부 확인
export async function checkDatabaseFunctions() {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase 클라이언트가 설정되지 않았습니다.",
    }
  }

  const functions = {
    increment_view_count: false,
    increment_exposure_count: false,
    increment_news_view_count: false,
  }

  try {
    // increment_view_count 함수 테스트
    try {
      await supabase.rpc("increment_view_count", { card_id: "test" })
      functions.increment_view_count = true
    } catch (error) {
      console.warn("increment_view_count 함수가 존재하지 않습니다.")
    }

    // increment_exposure_count 함수 테스트
    try {
      await supabase.rpc("increment_exposure_count", { card_id: "test" })
      functions.increment_exposure_count = true
    } catch (error) {
      console.warn("increment_exposure_count 함수가 존재하지 않습니다.")
    }

    // increment_news_view_count 함수 테스트
    try {
      await supabase.rpc("increment_news_view_count", { article_id: "test" })
      functions.increment_news_view_count = true
    } catch (error) {
      console.warn("increment_news_view_count 함수가 존재하지 않습니다.")
    }

    return {
      success: true,
      functions,
      available: Object.values(functions).filter(Boolean).length,
      total: Object.keys(functions).length,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
      functions,
    }
  }
}

// 종합 데이터베이스 상태 확인
export async function getComprehensiveDatabaseStatus() {
  console.log("🔍 종합 데이터베이스 상태 확인 시작...")

  const status = await getDatabaseStatus()
  const schemas = await checkTableSchemas()
  const counts = await getDataCounts()
  const functions = await checkDatabaseFunctions()

  const result = {
    timestamp: new Date().toISOString(),
    connection: status,
    schemas,
    data: counts,
    functions,
    overall: {
      healthy: status.isConnected && schemas.success && (counts.success ? counts.total > 0 : false),
      issues: [] as string[],
    },
  }

  // 문제점 수집
  if (!status.isConnected) {
    result.overall.issues.push("데이터베이스 연결 실패")
  }

  if (!schemas.success) {
    result.overall.issues.push("테이블 스키마 문제")
  }

  if (counts.success && counts.total === 0) {
    result.overall.issues.push("데이터가 없음")
  }

  if (functions.success && functions.available === 0) {
    result.overall.issues.push("데이터베이스 함수가 없음 (직접 업데이트 사용)")
  }

  // 콘솔에 상태 출력
  console.log("📊 데이터베이스 상태 요약:")
  console.log(`  연결 상태: ${status.isConnected ? "✅ 연결됨" : "❌ 연결 실패"}`)
  console.log(`  테이블 상태: ${schemas.success ? "✅ 정상" : "❌ 문제 있음"}`)
  console.log(`  데이터 개수: ${counts.success ? `✅ ${counts.total}개` : "❌ 확인 실패"}`)
  console.log(`  함수 상태: ${functions.success ? `✅ ${functions.available}/${functions.total}개` : "❌ 확인 실패"}`)
  console.log(`  전체 상태: ${result.overall.healthy ? "✅ 정상" : "⚠️ 문제 있음"}`)

  if (result.overall.issues.length > 0) {
    console.log("⚠️ 발견된 문제:")
    result.overall.issues.forEach((issue) => console.log(`  - ${issue}`))
  }

  return result
}

// 실시간 데이터베이스 모니터링
export class DatabaseMonitor {
  private interval: NodeJS.Timeout | null = null
  private listeners: ((status: DatabaseStatus) => void)[] = []

  start(intervalMs = 30000) {
    if (this.interval) {
      this.stop()
    }

    this.interval = setInterval(async () => {
      const status = await getDatabaseStatus()
      this.notifyListeners(status)
    }, intervalMs)

    console.log(`📡 데이터베이스 모니터링 시작 (${intervalMs}ms 간격)`)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      console.log("📡 데이터베이스 모니터링 중지")
    }
  }

  addListener(callback: (status: DatabaseStatus) => void) {
    this.listeners.push(callback)
  }

  removeListener(callback: (status: DatabaseStatus) => void) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  private notifyListeners(status: DatabaseStatus) {
    this.listeners.forEach((listener) => {
      try {
        listener(status)
      } catch (error) {
        console.error("데이터베이스 상태 리스너 오류:", error)
      }
    })
  }
}

// 전역 모니터 인스턴스
export const databaseMonitor = new DatabaseMonitor()
