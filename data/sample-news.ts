import type { NewsData } from "@/types/news"

export const sampleNews: Omit<NewsData, "id" | "created_at" | "updated_at">[] = [
  {
    title: "태국 방콕에서 새로운 한인 문화센터 개관",
    summary: "방콕 시내에 한인 커뮤니티를 위한 새로운 문화센터가 개관하여 다양한 문화 프로그램을 제공할 예정입니다.",
    content: `방콕 시내 중심가에 위치한 새로운 한인 문화센터가 지난 주말 성대한 개관식을 가졌습니다. 

이번에 개관한 문화센터는 총 3층 규모로, 1층에는 한국 전통 문화 전시관, 2층에는 다목적 강의실과 세미나실, 3층에는 한국어 교육센터가 마련되어 있습니다.

문화센터 관계자는 "태국 거주 한인들과 한국 문화에 관심 있는 태국인들을 위한 다양한 프로그램을 운영할 계획"이라고 밝혔습니다. 

주요 프로그램으로는 한국어 교육, 전통 문화 체험, K-pop 댄스 클래스, 한국 요리 교실 등이 있으며, 매월 한국 영화 상영회도 개최될 예정입니다.

개관식에는 주태국 한국대사관 관계자와 현지 한인회 임원진, 태국 정부 관계자 등 200여 명이 참석했습니다.`,
    image_url: "/placeholder.svg?height=400&width=600&text=한인문화센터",
    source: "태국한인신문",
    original_url: "https://example.com/korean-cultural-center-bangkok",
    published_at: "2024-01-15T09:00:00Z",
    category: "문화",
    tags: ["한인문화센터", "방콕", "문화프로그램", "한국어교육"],
    is_active: true,
    is_featured: true,
    view_count: 1250,
    original_language: "ko",
    is_translated: false,
  },
  {
    title: "태국 경제 성장률 3.2% 기록, 관광업 회복 기여",
    summary:
      "태국 정부가 발표한 최신 경제 지표에 따르면, 관광업 회복과 수출 증가로 인해 경제 성장률이 예상을 상회했습니다.",
    content: `태국 국가경제사회개발위원회(NESDC)가 발표한 최신 경제 지표에 따르면, 태국의 경제 성장률이 전년 대비 3.2%를 기록했다고 밝혔습니다.

이는 당초 예상했던 2.8%를 크게 상회하는 수치로, 주요 성장 동력은 관광업 회복과 수출 증가인 것으로 분석됩니다.

특히 관광업의 경우, 코로나19 팬데믹 이후 점진적으로 회복되고 있으며, 작년 한 해 동안 약 2,800만 명의 외국인 관광객이 태국을 방문했습니다. 이는 전년 대비 45% 증가한 수치입니다.

수출 부문에서도 전자제품, 자동차 부품, 농산물 등의 수출이 크게 증가하여 경제 성장에 기여했습니다.

NESDC 관계자는 "올해도 관광업과 수출업의 지속적인 성장이 예상되며, 경제 성장률은 3.5% 내외를 기록할 것으로 전망된다"고 말했습니다.

한편, 인플레이션율은 2.1%로 안정적인 수준을 유지하고 있어, 태국 경제의 전반적인 회복세가 지속될 것으로 보입니다.`,
    image_url: "/placeholder.svg?height=400&width=600&text=태국경제성장",
    source: "방콕포스트",
    original_url: "https://example.com/thailand-economic-growth",
    published_at: "2024-01-14T14:30:00Z",
    category: "경제",
    tags: ["태국경제", "GDP성장률", "관광업", "수출"],
    is_active: true,
    is_featured: false,
    view_count: 890,
    original_language: "ko",
    is_translated: false,
  },
  {
    title: "방콕 지하철 새 노선 개통, 교통 체증 완화 기대",
    summary: "방콕 대중교통공사가 새로운 지하철 노선을 개통하여 시민들의 교통 편의성이 크게 향상될 것으로 예상됩니다.",
    content: `방콕 대중교통공사(BMCL)가 새로운 지하철 노선인 '퍼플라인 연장선'을 정식 개통했다고 발표했습니다.

이번에 개통된 노선은 기존 퍼플라인을 방콕 시내 중심부까지 연장한 것으로, 총 12개의 새로운 역이 추가되었습니다. 새 노선은 방콕 북부 지역과 시내 중심가를 직접 연결하여 시민들의 교통 편의성을 크게 향상시킬 것으로 기대됩니다.

특히 새로운 노선은 쇼핑몰, 오피스 빌딩, 주거 지역을 효율적으로 연결하여 출퇴근 시간 교통 체증 완화에 크게 기여할 것으로 예상됩니다.

방콕 시장은 개통식에서 "이번 새 노선 개통으로 하루 약 50만 명의 승객이 이용할 것으로 예상되며, 이는 도로 교통량을 약 15% 감소시킬 것"이라고 밝혔습니다.

새 노선의 운행 시간은 오전 5시 30분부터 자정까지이며, 배차 간격은 평일 기준 3-4분입니다. 요금은 기존 노선과 동일하게 거리에 따라 15-42바트입니다.

시민들은 "출퇴근이 훨씬 편해질 것 같다"며 새 노선 개통을 환영하는 반응을 보이고 있습니다.`,
    image_url: "/placeholder.svg?height=400&width=600&text=방콕지하철",
    source: "네이션",
    original_url: "https://example.com/bangkok-subway-new-line",
    published_at: "2024-01-13T11:15:00Z",
    category: "사회",
    tags: ["방콕지하철", "퍼플라인", "대중교통", "교통체증"],
    is_active: true,
    is_featured: false,
    view_count: 654,
    original_language: "ko",
    is_translated: false,
  },
  {
    title: "Thai Government Announces New Digital Nomad Visa Program",
    summary:
      "Thailand introduces a new visa category specifically designed for digital nomads and remote workers, aiming to attract international talent.",
    content: `The Thai government has officially announced the launch of a new Digital Nomad Visa (DNV) program, designed to attract remote workers and digital nomads from around the world.

The new visa category, which will be available starting next month, allows holders to stay in Thailand for up to one year with the possibility of renewal. The program is part of Thailand's broader strategy to position itself as a hub for digital talent in Southeast Asia.

To qualify for the Digital Nomad Visa, applicants must demonstrate:
- A minimum monthly income of $2,500 USD
- Employment with a foreign company or proof of freelance income
- Health insurance coverage
- A clean criminal background check

The visa application process will be entirely digital, with most applications processed within 15 business days. The application fee is set at 10,000 Thai Baht (approximately $280 USD).

Tourism and Sports Minister Phiphat Ratchakitprakarn stated, "This new visa program will help Thailand attract high-skilled professionals who can contribute to our digital economy while enjoying our rich culture and lifestyle."

The program is expected to attract an estimated 100,000 digital nomads annually, potentially generating significant revenue for the tourism and service sectors.

Major cities like Bangkok, Chiang Mai, and Phuket are preparing special co-working spaces and digital nomad-friendly accommodations to welcome the influx of remote workers.`,
    image_url: "/placeholder.svg?height=400&width=600&text=Digital+Nomad+Visa",
    source: "Bangkok Post",
    original_url: "https://example.com/thailand-digital-nomad-visa",
    published_at: "2024-01-12T16:45:00Z",
    category: "정치",
    tags: ["디지털노마드", "비자", "원격근무", "태국정부"],
    is_active: true,
    is_featured: true,
    view_count: 2100,
    original_language: "en",
    is_translated: true,
  },
  {
    title: "ประเทศไทยเปิดตัวโครงการ 'Smart City' ในกรุงเทพฯ",
    summary: "รัฐบาลไทยเปิดตัวโครงการเมืองอัจฉริยะขนาดใหญ่ในกรุงเทพฯ เพื่อพัฒนาโครงสร้างพื้นฐานดิจิทัลและปรับปรุงคุณภาพชีวิตของประชาชน",
    content: `รัฐบาลไทยได้เปิดตัวโครงการ 'Smart City Bangkok' อย่างเป็นทางการ ซึ่งเป็นโครงการขนาดใหญ่มูลค่า 50 พันล้านบาท เพื่อพัฒนากรุงเทพฯ ให้เป็นเมืองอัจฉริยะระดับโลก

โครงการนี้จะดำเนินการในระยะเวลา 5 ปี โดยมีเป้าหมายหลักในการพัฒนา:
- ระบบการจราจรอัจฉริยะด้วยเทคโนโลยี AI
- ระบบการจัดการขยะและพลังงานที่ยั่งยืน  
- แพลตฟอร์มดิจิทัลสำหรับบริการภาครัฐ
- เครือข่ายอินเทอร์เน็ตความเร็วสูง 5G ทั่วเมือง

นายกรัฐมนตรีกล่าวในงานเปิดตัวว่า "โครงการ Smart City Bangkok จะเป็นต้นแบบสำหรับการพัฒนาเมืองอัจฉริยะในภูมิภาคเอเชียตะวันออกเฉียงใต้"

ในระยะแรก โครงการจะเริ่มต้นในพื้นที่ 3 เขต ได้แก่ เขตปทุมวัน เขตวัฒนา และเขตคลองเตย ก่อนที่จะขยายไปยังพื้นที่อื่นๆ ในกรุงเทพฯ

คาดว่าโครงการนี้จะสร้างงานใหม่ประมาณ 100,000 ตำแหน่ง และดึงดูดการลงทุนจากต่างประเทศมูลค่ากว่า 200 พันล้านบาท

ประชาชนสามารถติดตามความคืบหน้าของโครงการได้ผ่านแอปพลิเคชัน 'Bangkok Smart' ที่จะเปิดให้ดาวน์โหลดในเดือนหน้า`,
    image_url: "/placeholder.svg?height=400&width=600&text=Smart+City+Bangkok",
    source: "ไทยรัฐ",
    original_url: "https://example.com/bangkok-smart-city-project",
    published_at: "2024-01-11T13:20:00Z",
    category: "기술",
    tags: ["스마트시티", "방콕", "디지털전환", "AI기술"],
    is_active: true,
    is_featured: false,
    view_count: 756,
    original_language: "th",
    is_translated: true,
  },
]

// 뉴스 카테고리별 색상 매핑
export const newsCategoryColors: Record<string, string> = {
  정치: "bg-red-100 text-red-800",
  경제: "bg-blue-100 text-blue-800",
  사회: "bg-green-100 text-green-800",
  문화: "bg-purple-100 text-purple-800",
  스포츠: "bg-orange-100 text-orange-800",
  국제: "bg-indigo-100 text-indigo-800",
  생활: "bg-pink-100 text-pink-800",
  기술: "bg-gray-100 text-gray-800",
  일반: "bg-slate-100 text-slate-800",
}

// 언어별 정보
export const languageInfo: Record<string, { name: string; flag: string }> = {
  ko: { name: "한국어", flag: "🇰🇷" },
  en: { name: "영어", flag: "🇺🇸" },
  th: { name: "태국어", flag: "🇹🇭" },
}
