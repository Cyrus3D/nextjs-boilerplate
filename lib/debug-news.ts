"use server"

import { supabase } from "./supabase"

export async function fetchNewsFromDatabase() {
  console.log("=== 뉴스 데이터베이스 조회 시작 ===")

  if (!supabase) {
    console.error("❌ Supabase 클라이언트가 설정되지 않았습니다.")
    return { success: false, error: "Supabase 연결 실패" }
  }

  try {
    // 1. 테이블 존재 여부 확인
    console.log("📋 news_articles 테이블 스키마 확인 중...")
    const { data: schemaData, error: schemaError } = await supabase.from("news_articles").select("*").limit(0)

    if (schemaError) {
      console.error("❌ 테이블 스키마 확인 실패:", schemaError)
      return { success: false, error: schemaError.message }
    }

    console.log("✅ news_articles 테이블이 존재합니다.")

    // 2. 전체 뉴스 개수 확인
    console.log("📊 전체 뉴스 개수 확인 중...")
    const { count, error: countError } = await supabase
      .from("news_articles")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ 개수 조회 실패:", countError)
    } else {
      console.log(`📈 전체 뉴스 개수: ${count}개`)
    }

    // 3. 최신 뉴스 10개 조회
    console.log("📰 최신 뉴스 10개 조회 중...")
    const { data: newsData, error: newsError } = await supabase
      .from("news_articles")
      .select(`
        id,
        title,
        excerpt,
        category,
        tags,
        author,
        view_count,
        is_breaking,
        is_published,
        published_at,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    if (newsError) {
      console.error("❌ 뉴스 조회 실패:", newsError)
      return { success: false, error: newsError.message }
    }

    console.log("✅ 뉴스 조회 성공!")
    console.log(`📋 조회된 뉴스 개수: ${newsData?.length || 0}개`)

    // 4. 뉴스 목록 상세 출력
    if (newsData && newsData.length > 0) {
      console.log("\n=== 📰 뉴스 목록 ===")
      newsData.forEach((article, index) => {
        console.log(`\n${index + 1}. 📄 뉴스 ID: ${article.id}`)
        console.log(`   📝 제목: ${article.title}`)
        console.log(`   📂 카테고리: ${article.category}`)
        console.log(`   👤 작성자: ${article.author}`)
        console.log(`   👀 조회수: ${article.view_count}`)
        console.log(`   🔥 속보: ${article.is_breaking ? "예" : "아니오"}`)
        console.log(`   📢 게시됨: ${article.is_published ? "예" : "아니오"}`)
        console.log(`   🏷️ 태그: ${Array.isArray(article.tags) ? article.tags.join(", ") : "없음"}`)
        console.log(`   📅 게시일: ${article.published_at}`)
        console.log(`   📅 생성일: ${article.created_at}`)

        if (article.excerpt) {
          console.log(`   📄 요약: ${article.excerpt.substring(0, 100)}${article.excerpt.length > 100 ? "..." : ""}`)
        }
      })
    } else {
      console.log("📭 조회된 뉴스가 없습니다.")
    }

    // 5. 카테고리별 통계
    console.log("\n=== 📊 카테고리별 통계 ===")
    const { data: categoryStats, error: categoryError } = await supabase.from("news_articles").select("category")

    if (!categoryError && categoryStats) {
      const categoryCount: { [key: string]: number } = {}
      categoryStats.forEach((item) => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
      })

      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`📂 ${category}: ${count}개`)
      })
    }

    // 6. 속보 뉴스 확인
    console.log("\n=== 🔥 속보 뉴스 ===")
    const { data: breakingNews, error: breakingError } = await supabase
      .from("news_articles")
      .select("id, title, published_at")
      .eq("is_breaking", true)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5)

    if (!breakingError && breakingNews && breakingNews.length > 0) {
      breakingNews.forEach((news, index) => {
        console.log(`🔥 ${index + 1}. ${news.title} (${news.published_at})`)
      })
    } else {
      console.log("📭 현재 속보 뉴스가 없습니다.")
    }

    console.log("\n=== ✅ 뉴스 데이터베이스 조회 완료 ===")

    return {
      success: true,
      data: newsData,
      total: count || 0,
      message: "뉴스 조회 성공",
    }
  } catch (error) {
    console.error("❌ 뉴스 조회 중 예외 발생:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

export async function fetchNewsCategories() {
  console.log("\n=== 📂 뉴스 카테고리 조회 ===")

  if (!supabase) {
    console.error("❌ Supabase 클라이언트가 설정되지 않았습니다.")
    return { success: false, error: "Supabase 연결 실패" }
  }

  try {
    const { data: categories, error } = await supabase.from("news_categories").select("*").order("name")

    if (error) {
      console.error("❌ 카테고리 조회 실패:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ 카테고리 조회 성공!")
    console.log(`📋 카테고리 개수: ${categories?.length || 0}개`)

    if (categories && categories.length > 0) {
      categories.forEach((category, index) => {
        console.log(`${index + 1}. 📂 ${category.name} (ID: ${category.id})`)
        if (category.color_class) {
          console.log(`   🎨 색상: ${category.color_class}`)
        }
      })
    } else {
      console.log("📭 등록된 카테고리가 없습니다.")
    }

    return { success: true, data: categories }
  } catch (error) {
    console.error("❌ 카테고리 조회 중 예외 발생:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

export async function fetchNewsTags() {
  console.log("\n=== 🏷️ 뉴스 태그 조회 ===")

  if (!supabase) {
    console.error("❌ Supabase 클라이언트가 설정되지 않았습니다.")
    return { success: false, error: "Supabase 연결 실패" }
  }

  try {
    const { data: tags, error } = await supabase.from("news_tags").select("*").order("name")

    if (error) {
      console.error("❌ 태그 조회 실패:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ 태그 조회 성공!")
    console.log(`📋 태그 개수: ${tags?.length || 0}개`)

    if (tags && tags.length > 0) {
      tags.forEach((tag, index) => {
        console.log(`${index + 1}. 🏷️ ${tag.name} (ID: ${tag.id})`)
      })
    } else {
      console.log("📭 등록된 태그가 없습니다.")
    }

    return { success: true, data: tags }
  } catch (error) {
    console.error("❌ 태그 조회 중 예외 발생:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}
