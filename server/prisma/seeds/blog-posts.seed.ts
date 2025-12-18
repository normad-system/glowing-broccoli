import { PrismaClient } from '@prisma/client';

export async function seedBlogPosts(prisma: PrismaClient) {
  console.log('🌱 Seeding blog posts...');

  const gitCategory = await prisma.category.findUnique({
    where: { slug: 'git' },
  });

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@fitsystem.com' },
  });

  if (!gitCategory || !adminUser) {
    console.log('⚠️  Git category or admin user not found');
    return;
  }

  const posts = [
    {
      slug: 'git-getting-started',
      titleKo: 'Git 시작하기: 설치와 초기 설정',
      titleEn: 'Getting Started with Git: Installation and Initial Setup',
      titleJa: 'Gitを始める：インストールと初期設定',
      contentKo: '# Git 시작하기\n\nGit은 분산 버전 관리 시스템입니다.\n\n## 설치\n\n### macOS\n```bash\nbrew install git\n```\n\n### Windows\nGit 공식 사이트에서 다운로드\n\n## 초기 설정\n\n```bash\ngit config --global user.name "Your Name"\ngit config --global user.email "your@email.com"\n```',
      contentEn: '# Getting Started with Git\n\nGit is a distributed version control system.\n\n## Installation\n\n### macOS\n```bash\nbrew install git\n```\n\n### Windows\nDownload from official Git website\n\n## Initial Configuration\n\n```bash\ngit config --global user.name "Your Name"\ngit config --global user.email "your@email.com"\n```',
      contentJa: '# Gitを始める\n\nGitは分散バージョン管理システムです。\n\n## インストール\n\n### macOS\n```bash\nbrew install git\n```\n\n### Windows\nGit公式サイトからダウンロード\n\n## 初期設定\n\n```bash\ngit config --global user.name "Your Name"\ngit config --global user.email "your@email.com"\n```',
      excerptKo: 'Git 設치부터 초기 설정까지 단계별로 알아봅니다.',
      excerptEn: 'Learn Git installation and initial setup step by step.',
      excerptJa: 'Gitのインストールから初期設定まで段階的に学びます。',
      metaKeywords: 'git,설치,초기설정,버전관리',
      published: true,
    },
    {
      slug: 'git-basic-commands',
      titleKo: 'Git 기본 명령어: add, commit, push',
      titleEn: 'Git Basic Commands: add, commit, push',
      titleJa: 'Git基本コマンド：add、commit、push',
      contentKo: '# Git 기본 명령어\n\n## git add\n```bash\ngit add .\n```\n\n## git commit\n```bash\ngit commit -m "message"\n```\n\n## git push\n```bash\ngit push origin main\n```',
      contentEn: '# Git Basic Commands\n\n## git add\n```bash\ngit add .\n```\n\n## git commit\n```bash\ngit commit -m "message"\n```\n\n## git push\n```bash\ngit push origin main\n```',
      contentJa: '# Git基本コマンド\n\n## git add\n```bash\ngit add .\n```\n\n## git commit\n```bash\ngit commit -m "message"\n```\n\n## git push\n```bash\ngit push origin main\n```',
      excerptKo: 'Git의 기본 명령어를 마스터하세요.',
      excerptEn: 'Master the basic Git commands.',
      excerptJa: 'Gitの基本コマンドをマスターしましょう。',
      metaKeywords: 'git,add,commit,push,명령어',
      published: true,
    },
    {
      slug: 'git-branching-strategy',
      titleKo: 'Git 브랜치 전략',
      titleEn: 'Git Branching Strategy',
      titleJa: 'Gitブランチ戦略',
      contentKo: '# Git 브랜치 전략\n\n## 브랜치란?\n독립적인 작업 공간입니다.\n\n## Git Flow\n- main: 프로덕션\n- develop: 개발\n- feature: 기능개발',
      contentEn: '# Git Branching Strategy\n\n## What is a Branch?\nAn independent workspace.\n\n## Git Flow\n- main: Production\n- develop: Development\n- feature: Features',
      contentJa: '# Gitブランチ戦略\n\n## ブランチとは？\n独立した作業スペースです。\n\n## Git Flow\n- main: 本番\n- develop: 開発\n- feature: 機能開発',
      excerptKo: '효과적인 브랜치 전략을 배워보세요.',
      excerptEn: 'Learn effective branching strategies.',
      excerptJa: '効果的なブランチ戦略を学びましょう。',
      metaKeywords: 'git,branch,git-flow,전략',
      published: true,
    },
    {
      slug: 'git-conflict-resolution',
      titleKo: 'Git 충돌 해결',
      titleEn: 'Git Conflict Resolution',
      titleJa: 'Git競合解決',
      contentKo: '# Git 충돌 해결\n\n## 충돌이란?\n같은 파일을 다르게 수정했을 때 발생합니다.\n\n## 해결 방법\n1. 충돌 파일 열기\n2. 마커 확인\n3. 최종 코드 선택\n4. 커밋',
      contentEn: '# Git Conflict Resolution\n\n## What is a Conflict?\nOccurs when the same file is modified differently.\n\n## Resolution\n1. Open conflicted files\n2. Check markers\n3. Choose final code\n4. Commit',
      contentJa: '# Git競合解決\n\n## 競合とは？\n同じファイルが異なって変更されたときに発生します。\n\n## 解決方法\n1. 競合ファイルを開く\n2. マーカーを確認\n3. 最終コードを選択\n4. コミット',
      excerptKo: '머지 컨플릭트를 해결하는 방법을 배워보세요.',
      excerptEn: 'Learn how to resolve merge conflicts.',
      excerptJa: 'マージコンフリクトを解決する方法を学びましょう。',
      metaKeywords: 'git,conflict,merge,충돌',
      published: true,
    },
    {
      slug: 'github-pull-request-guide',
      titleKo: 'GitHub Pull Request 가이드',
      titleEn: 'GitHub Pull Request Guide',
      titleJa: 'GitHub Pull Requestガイド',
      contentKo: '# GitHub Pull Request\n\n## PR이란?\n코드 리뷰를 위한 GitHub 기능입니다.\n\n## PR 생성\n1. 브랜치 작업\n2. GitHub에 푸시\n3. PR 생성\n4. 리뷰 요청',
      contentEn: '# GitHub Pull Request\n\n## What is a PR?\nGitHub feature for code review.\n\n## Creating PR\n1. Work on branch\n2. Push to GitHub\n3. Create PR\n4. Request review',
      contentJa: '# GitHub Pull Request\n\n## PRとは？\nコードレビューのためのGitHub機能です。\n\n## PR作成\n1. ブランチで作業\n2. GitHubにプッシュ\n3. PRを作成\n4. レビューを依頼',
      excerptKo: 'Pull Request 작성과 코드 리뷰 가이드입니다.',
      excerptEn: 'Guide to Pull Requests and code reviews.',
      excerptJa: 'Pull Requestとコードレビューのガイドです。',
      metaKeywords: 'github,pull-request,code-review,pr',
      published: true,
    },
  ];

  for (const post of posts) {
    const { slug, ...data } = post;
    await prisma.blogPost.upsert({
      where: { slug },
      update: { ...data, categoryId: gitCategory.id, authorId: adminUser.id },
      create: {
        slug,
        ...data,
        categoryId: gitCategory.id,
        authorId: adminUser.id,
      },
    });
    console.log(`✅ Blog post "${slug}" created`);
  }

  console.log('✨ Blog posts seeded successfully!');
}
