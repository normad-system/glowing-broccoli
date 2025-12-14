import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      slug: 'tutorials',
      nameKo: '튜토리얼',
      nameEn: 'Tutorials',
      nameJa: 'チュートリアル',
      descriptionKo: '단계별 학습 가이드와 실전 예제',
      descriptionEn: 'Step-by-step learning guides and practical examples',
      descriptionJa: 'ステップバイステップの学習ガイドと実践例',
      icon: '📚',
      color: '#3B82F6',
      order: 1,
    },
    {
      slug: 'git',
      nameKo: 'Git 사용법',
      nameEn: 'Git Usage',
      nameJa: 'Git使用方法',
      descriptionKo: 'Git 버전 관리 시스템 활용법과 협업 워크플로우',
      descriptionEn: 'Git version control system usage and collaboration workflows',
      descriptionJa: 'Gitバージョン管理システムの活用法とコラボレーションワークフロー',
      icon: '🔀',
      color: '#F05032',
      order: 2,
    },
    {
      slug: 'web-security',
      nameKo: '웹 보안',
      nameEn: 'Web Security',
      nameJa: 'Webセキュリティ',
      descriptionKo: '웹 애플리케이션 보안 취약점 분석 및 대응 방법',
      descriptionEn: 'Web application security vulnerabilities analysis and countermeasures',
      descriptionJa: 'Webアプリケーションのセキュリティ脆弱性分析と対策',
      icon: '🔒',
      color: '#EF4444',
      order: 3,
    },
    {
      slug: 'azure',
      nameKo: 'Azure',
      nameEn: 'Azure',
      nameJa: 'Azure',
      descriptionKo: 'Microsoft Azure 클라우드 서비스 활용 가이드',
      descriptionEn: 'Microsoft Azure cloud services usage guide',
      descriptionJa: 'Microsoft Azureクラウドサービス活用ガイド',
      icon: '☁️',
      color: '#0078D4',
      order: 4,
    },
    {
      slug: 'aws',
      nameKo: 'AWS',
      nameEn: 'AWS',
      nameJa: 'AWS',
      descriptionKo: 'Amazon Web Services 클라우드 인프라 구축 및 운영',
      descriptionEn: 'Amazon Web Services cloud infrastructure setup and operation',
      descriptionJa: 'Amazon Web Servicesクラウドインフラ構築と運用',
      icon: '🚀',
      color: '#FF9900',
      order: 5,
    },
    {
      slug: 'tech-issues',
      nameKo: '기술 이슈',
      nameEn: 'Tech Issues',
      nameJa: '技術イシュー',
      descriptionKo: '최신 기술 트렌드와 이슈 분석',
      descriptionEn: 'Latest tech trends and issues analysis',
      descriptionJa: '最新技術トレンドとイシュー分析',
      icon: '🔥',
      color: '#F59E0B',
      order: 6,
    },
    {
      slug: 'performance',
      nameKo: '성능 최적화',
      nameEn: 'Performance Optimization',
      nameJa: 'パフォーマンス最適化',
      descriptionKo: '웹 애플리케이션 성능 개선 기법',
      descriptionEn: 'Web application performance improvement techniques',
      descriptionJa: 'Webアプリケーションのパフォーマンス改善技法',
      icon: '⚡',
      color: '#06B6D4',
      order: 7,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Category "${category.nameEn}" created/updated`);
  }

  console.log('✨ Categories seeded successfully!');
}

// Run if executed directly
if (require.main === module) {
  const prisma = new PrismaClient();
  seedCategories(prisma)
    .catch((e) => {
      console.error('❌ Error seeding categories:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
