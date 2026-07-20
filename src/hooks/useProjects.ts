import { useState, useEffect, useCallback } from 'react';
import type { Project } from '@/types';
import { getCache, setCache, getCacheTimestamp } from '@/utils/cache';

const CACHE_KEY = 'solo-planet-v3';
const GITHUB_API = 'https://api.github.com';

const BIG_COMPANIES = [
  'google', 'facebook', 'microsoft', 'apple', 'amazon', 'netflix',
  'github', 'vercel', 'supabase', 'tailwindlabs', 'vitejs',
  'reactjs', 'vuejs', 'angular', 'meta',
  'alibaba', 'tencent', 'bytedance', 'baidu', 'ant-design',
  'alibaba-fusion', 'element-plus', 'vuetifyjs', 'nuxt',
  'nextjs', 'nestjs', 'prisma', 'typeorm', 'reduxjs',
  'axios', 'webpack', 'rollup', 'babel', 'nodejs',
  'denoland', 'rust-lang', 'golang', 'python', 'ruby',
  'php', 'laravel', 'symfony', 'django', 'palletsprojects',
  'flutter', 'react-native', 'expo', 'ionic-team',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elastic',
  'docker', 'kubernetes', 'hashicorp', 'ansible',
  'obsidianmd', 'logseq', 'notion', 'figma',
  'linear', 'raycast', 'arcbrowser',
];

const GITHUB_PROJECTS: Project[] = [
  {
    id: 'gh-1',
    name: 'vite',
    nameCn: 'Vite 构建工具',
    description: '下一代前端构建工具，速度极快的开发服务器和优化的生产构建',
    descriptionCn: '下一代前端构建工具，速度极快的开发服务器和优化的生产构建',
    url: 'https://github.com/vitejs/vite',
    source: 'github',
    stars: 68000,
    dailyStars: 128,
    language: 'TypeScript',
    owner: 'vitejs',
  },
  {
    id: 'gh-2',
    name: 'awesome-selfhosted',
    nameCn: '自托管项目大全',
    description: '一份可以在自己服务器上托管的免费软件网络服务和 Web 应用列表',
    descriptionCn: '一份可以在自己服务器上托管的免费软件网络服务和 Web 应用列表',
    url: 'https://github.com/awesome-selfhosted/awesome-selfhosted',
    source: 'github',
    stars: 185000,
    dailyStars: 256,
    language: 'Markdown',
    owner: 'awesome-selfhosted',
  },
  {
    id: 'gh-3',
    name: 'screen-pipe',
    nameCn: '屏幕记忆库',
    description: '24/7 屏幕与音频录制，本地 AI 驱动，可查询你见过、说过或听过的一切',
    descriptionCn: '24/7 屏幕与音频录制，本地 AI 驱动，可查询你见过、说过或听过的一切',
    url: 'https://github.com/louis030195/screen-pipe',
    source: 'github',
    stars: 12000,
    dailyStars: 312,
    language: 'Rust',
    owner: 'louis030195',
  },
  {
    id: 'gh-4',
    name: 'tiny-helpers',
    nameCn: '开发者小工具合集',
    description: '精选的在线 Web 开发工具合集，每个都很实用',
    descriptionCn: '精选的在线 Web 开发工具合集，每个都很实用',
    url: 'https://github.com/stefanjudis/tiny-helpers',
    source: 'github',
    stars: 3200,
    dailyStars: 42,
    language: 'JavaScript',
    owner: 'stefanjudis',
  },
  {
    id: 'gh-5',
    name: 'excalidraw',
    nameCn: '手绘风白板',
    description: '虚拟白板，用于绘制手绘风格的图表，支持多人协作',
    descriptionCn: '虚拟白板，用于绘制手绘风格的图表，支持多人协作',
    url: 'https://github.com/excalidraw/excalidraw',
    source: 'github',
    stars: 75000,
    dailyStars: 167,
    language: 'TypeScript',
    owner: 'excalidraw',
  },
  {
    id: 'gh-6',
    name: 'localsend',
    nameCn: '本地快传',
    description: '开源跨平台的 AirDrop 替代品，局域网内高速传输文件',
    descriptionCn: '开源跨平台的 AirDrop 替代品，局域网内高速传输文件',
    url: 'https://github.com/localsend/localsend',
    source: 'github',
    stars: 42000,
    dailyStars: 89,
    language: 'Dart',
    owner: 'localsend',
  },
  {
    id: 'gh-7',
    name: 'tldraw',
    nameCn: 'TLDraw 白板 SDK',
    description: '一个非常好用的白板 SDK，可嵌入到你的应用中',
    descriptionCn: '一个非常好用的白板 SDK，可嵌入到你的应用中',
    url: 'https://github.com/tldraw/tldraw',
    source: 'github',
    stars: 38000,
    dailyStars: 78,
    language: 'TypeScript',
    owner: 'tldraw',
  },
  {
    id: 'gh-8',
    name: 'pocketbase',
    nameCn: 'PocketBase 后端',
    description: '一个文件搞定的开源后端，含数据库、认证、存储和管理后台',
    descriptionCn: '一个文件搞定的开源后端，含数据库、认证、存储和管理后台',
    url: 'https://github.com/pocketbase/pocketbase',
    source: 'github',
    stars: 45000,
    dailyStars: 134,
    language: 'Go',
    owner: 'pocketbase',
  },
  {
    id: 'gh-9',
    name: 'public-apis',
    nameCn: '公共 API 大全',
    description: '免费开放 API 合集，涵盖天气、图片、视频、机器学习等 50+ 类别',
    descriptionCn: '免费开放 API 合集，涵盖天气、图片、视频、机器学习等 50+ 类别',
    url: 'https://github.com/public-apis/public-apis',
    source: 'github',
    stars: 320000,
    dailyStars: 280,
    language: 'Python',
    owner: 'public-apis',
  },
  {
    id: 'gh-10',
    name: 'coding-interview-university',
    nameCn: '编程面试大学',
    description: '谷歌工程师整理的计算机科学学习路线，帮你从零准备大厂技术面试',
    descriptionCn: '谷歌工程师整理的计算机科学学习路线，帮你从零准备大厂技术面试',
    url: 'https://github.com/jwasham/coding-interview-university',
    source: 'github',
    stars: 298000,
    dailyStars: 198,
    language: 'Markdown',
    owner: 'jwasham',
  },
  {
    id: 'gh-11',
    name: 'developer-roadmap',
    nameCn: '开发者学习路线图',
    description: '前端、后端、DevOps 等 20+ 技术方向的学习路线图，一步步成长',
    descriptionCn: '前端、后端、DevOps 等 20+ 技术方向的学习路线图，一步步成长',
    url: 'https://github.com/kamranahmedse/developer-roadmap',
    source: 'github',
    stars: 280000,
    dailyStars: 245,
    language: 'TypeScript',
    owner: 'kamranahmedse',
  },
  {
    id: 'gh-12',
    name: 'system-design-primer',
    nameCn: '系统设计入门',
    description: '学习如何设计大型分布式系统，准备系统设计面试的最佳资源',
    descriptionCn: '学习如何设计大型分布式系统，准备系统设计面试的最佳资源',
    url: 'https://github.com/donnemartin/system-design-primer',
    source: 'github',
    stars: 260000,
    dailyStars: 180,
    language: 'Python',
    owner: 'donnemartin',
  },
  {
    id: 'gh-13',
    name: 'free-programming-books',
    nameCn: '免费编程书籍',
    description: '全球最大的免费编程书籍合集，涵盖 100+ 种语言的学习资源',
    descriptionCn: '全球最大的免费编程书籍合集，涵盖 100+ 种语言的学习资源',
    url: 'https://github.com/EbookFoundation/free-programming-books',
    source: 'github',
    stars: 330000,
    dailyStars: 210,
    language: 'Markdown',
    owner: 'EbookFoundation',
  },
  {
    id: 'gh-14',
    name: 'build-your-own-x',
    nameCn: '自己动手造轮子',
    description: '从零开始构建技术项目合集，教你自己写操作系统、数据库、框架等',
    descriptionCn: '从零开始构建技术项目合集，教你自己写操作系统、数据库、框架等',
    url: 'https://github.com/codecrafters-io/build-your-own-x',
    source: 'github',
    stars: 250000,
    dailyStars: 175,
    language: 'Markdown',
    owner: 'codecrafters-io',
  },
  {
    id: 'gh-15',
    name: 'the-book-of-secret-knowledge',
    nameCn: '程序员秘典',
    description: '灵感列表合集：工具、代码片段、单行命令、博客文章等各种宝藏',
    descriptionCn: '灵感列表合集：工具、代码片段、单行命令、博客文章等各种宝藏',
    url: 'https://github.com/trimstray/the-book-of-secret-knowledge',
    source: 'github',
    stars: 140000,
    dailyStars: 120,
    language: 'Shell',
    owner: 'trimstray',
  },
  {
    id: 'gh-16',
    name: 'shadcn-ui',
    nameCn: 'shadcn 组件库',
    description: '可直接复制粘贴到项目中的精美 UI 组件，Tailwind CSS 驱动',
    descriptionCn: '可直接复制粘贴到项目中的精美 UI 组件，Tailwind CSS 驱动',
    url: 'https://github.com/shadcn-ui/ui',
    source: 'github',
    stars: 65000,
    dailyStars: 195,
    language: 'TypeScript',
    owner: 'shadcn-ui',
  },
  {
    id: 'gh-17',
    name: 'd2',
    nameCn: 'D2 图表语言',
    description: '用文本描述就能生成漂亮架构图的现代图表语言，替代 Mermaid',
    descriptionCn: '用文本描述就能生成漂亮架构图的现代图表语言，替代 Mermaid',
    url: 'https://github.com/terrastruct/d2',
    source: 'github',
    stars: 18000,
    dailyStars: 68,
    language: 'Go',
    owner: 'terrastruct',
  },
  {
    id: 'gh-18',
    name: 'obsidian-tasks',
    nameCn: 'Obsidian 任务插件',
    description: 'Obsidian 笔记的任务管理插件，支持日期、优先级、循环任务等',
    descriptionCn: 'Obsidian 笔记的任务管理插件，支持日期、优先级、循环任务等',
    url: 'https://github.com/obsidian-tasks-group/obsidian-tasks',
    source: 'github',
    stars: 2800,
    dailyStars: 22,
    language: 'TypeScript',
    owner: 'obsidian-tasks-group',
  },
  {
    id: 'gh-19',
    name: 'raycast-icons',
    nameCn: 'Raycast 图标库',
    description: 'Raycast 扩展的精美图标合集，300+ 品牌图标，开发者设计的',
    descriptionCn: 'Raycast 扩展的精美图标合集，300+ 品牌图标，开发者设计的',
    url: 'https://github.com/raycast/icons',
    source: 'github',
    stars: 1200,
    dailyStars: 15,
    language: 'TypeScript',
    owner: 'raycast',
  },
  {
    id: 'gh-20',
    name: 'helix',
    nameCn: 'Helix 编辑器',
    description: '后现代的终端文本编辑器，内置 LSP 和 Tree-sitter，Vim 风格',
    descriptionCn: '后现代的终端文本编辑器，内置 LSP 和 Tree-sitter，Vim 风格',
    url: 'https://github.com/helix-editor/helix',
    source: 'github',
    stars: 32000,
    dailyStars: 95,
    language: 'Rust',
    owner: 'helix-editor',
  },
  {
    id: 'gh-21',
    name: 'zoxide',
    nameCn: 'Zoxide 快速跳转',
    description: '更智能的 cd 命令，根据访问频率自动跳转到常用目录',
    descriptionCn: '更智能的 cd 命令，根据访问频率自动跳转到常用目录',
    url: 'https://github.com/ajeetdsouza/zoxide',
    source: 'github',
    stars: 17000,
    dailyStars: 52,
    language: 'Rust',
    owner: 'ajeetdsouza',
  },
  {
    id: 'gh-22',
    name: 'bat',
    nameCn: 'Bat 猫命令',
    description: '带语法高亮和行号的 cat 命令替代品，终端浏览代码更优雅',
    descriptionCn: '带语法高亮和行号的 cat 命令替代品，终端浏览代码更优雅',
    url: 'https://github.com/sharkdp/bat',
    source: 'github',
    stars: 48000,
    dailyStars: 110,
    language: 'Rust',
    owner: 'sharkdp',
  },
  {
    id: 'gh-23',
    name: 'fd',
    nameCn: 'Fd 文件查找',
    description: '更简单更快的 find 命令替代品，80% 场景下用 fd 更顺手',
    descriptionCn: '更简单更快的 find 命令替代品，80% 场景下用 fd 更顺手',
    url: 'https://github.com/sharkdp/fd',
    source: 'github',
    stars: 33000,
    dailyStars: 72,
    language: 'Rust',
    owner: 'sharkdp',
  },
  {
    id: 'gh-24',
    name: 'ripgrep',
    nameCn: 'Ripgrep 搜索',
    description: '最快的命令行文本搜索工具，比 grep 快几十倍，自动忽略 .gitignore',
    descriptionCn: '最快的命令行文本搜索工具，比 grep 快几十倍，自动忽略 .gitignore',
    url: 'https://github.com/BurntSushi/ripgrep',
    source: 'github',
    stars: 45000,
    dailyStars: 88,
    language: 'Rust',
    owner: 'BurntSushi',
  },
  {
    id: 'gh-25',
    name: 'starship',
    nameCn: 'Starship 终端提示符',
    description: '极简、超快、可定制的 Shell 提示符，50+ 语言和工具支持',
    descriptionCn: '极简、超快、可定制的 Shell 提示符，50+ 语言和工具支持',
    url: 'https://github.com/starship/starship',
    source: 'github',
    stars: 42000,
    dailyStars: 80,
    language: 'Rust',
    owner: 'starship',
  },
  {
    id: 'gh-26',
    name: 'lazygit',
    nameCn: 'Lazygit 终端 Git',
    description: '终端里的 Git GUI，用键盘快速完成提交、变基、暂存等操作',
    descriptionCn: '终端里的 Git GUI，用键盘快速完成提交、变基、暂存等操作',
    url: 'https://github.com/jesseduffield/lazygit',
    source: 'github',
    stars: 48000,
    dailyStars: 115,
    language: 'Go',
    owner: 'jesseduffield',
  },
];

const PRODUCT_HUNT_PROJECTS: Project[] = [
  {
    id: 'ph-1',
    name: 'screenpipe',
    nameCn: '屏幕记忆库',
    description: '24/7 屏幕与音频录制，本地 AI 驱动，可查询你见过、说过或听过的一切',
    descriptionCn: '24/7 屏幕与音频录制，本地 AI 驱动，可查询你见过、说过或听过的一切',
    url: 'https://www.producthunt.com/posts/screenpipe',
    source: 'producthunt',
    votes: 1890,
    dailyStars: 312,
    owner: 'louis030195',
  },
  {
    id: 'ph-2',
    name: 'tldraw',
    nameCn: 'TLDraw 白板',
    description: '一个非常好用的在线白板和白板 SDK，手绘风格，支持多人协作',
    descriptionCn: '一个非常好用的在线白板和白板 SDK，手绘风格，支持多人协作',
    url: 'https://www.producthunt.com/posts/tldraw',
    source: 'producthunt',
    votes: 2450,
    dailyStars: 78,
    owner: 'tldraw',
  },
  {
    id: 'ph-3',
    name: 'Notion Calendar',
    nameCn: 'Notion 日历',
    description: 'Notion 推出的日历应用，与 Notion 深度集成，日程管理更高效',
    descriptionCn: 'Notion 推出的日历应用，与 Notion 深度集成，日程管理更高效',
    url: 'https://www.producthunt.com/posts/notion-calendar',
    source: 'producthunt',
    votes: 3200,
    owner: 'notion',
  },
  {
    id: 'ph-4',
    name: 'Arc Search',
    nameCn: 'Arc 搜索',
    description: 'Arc 浏览器推出的 AI 搜索工具，一键总结网页内容，回答你的问题',
    descriptionCn: 'Arc 浏览器推出的 AI 搜索工具，一键总结网页内容，回答你的问题',
    url: 'https://www.producthunt.com/posts/arc-search',
    source: 'producthunt',
    votes: 2800,
    owner: 'arc',
  },
  {
    id: 'ph-5',
    name: 'Suno AI',
    nameCn: 'Suno AI 音乐生成',
    description: 'AI 音乐生成工具，输入文字描述就能生成完整歌曲，包含人声和乐器',
    descriptionCn: 'AI 音乐生成工具，输入文字描述就能生成完整歌曲，包含人声和乐器',
    url: 'https://www.producthunt.com/posts/suno-ai',
    source: 'producthunt',
    votes: 5600,
    owner: 'suno',
  },
  {
    id: 'ph-6',
    name: 'Sider',
    nameCn: 'Sider AI 助手',
    description: '侧边栏 AI 助手，支持 ChatGPT、Claude 等多种模型，选中文字即可调用',
    descriptionCn: '侧边栏 AI 助手，支持 ChatGPT、Claude 等多种模型，选中文字即可调用',
    url: 'https://www.producthunt.com/posts/sider',
    source: 'producthunt',
    votes: 1560,
    owner: 'sider',
  },
  {
    id: 'ph-7',
    name: 'focus-timer',
    nameCn: '专注番茄钟',
    description: '极简番茄钟应用，白噪音 + 数据统计 + 成就系统，帮你专注工作',
    descriptionCn: '极简番茄钟应用，白噪音 + 数据统计 + 成就系统，帮你专注工作',
    url: 'https://www.producthunt.com/posts/focus-timer',
    source: 'producthunt',
    votes: 890,
    dailyStars: 34,
    owner: 'focus-dev',
  },
  {
    id: 'ph-8',
    name: 'Readwise Reader',
    nameCn: 'Readwise 阅读器',
    description: '全能阅读应用，支持文章、PDF、电子书、RSS，内置高亮和复习系统',
    descriptionCn: '全能阅读应用，支持文章、PDF、电子书、RSS，内置高亮和复习系统',
    url: 'https://www.producthunt.com/posts/readwise-reader',
    source: 'producthunt',
    votes: 2100,
    owner: 'readwise',
  },
  {
    id: 'ph-9',
    name: 'Obsidian',
    nameCn: 'Obsidian 笔记',
    description: '本地优先的知识管理工具，基于 Markdown 文件，支持双向链接和插件生态',
    descriptionCn: '本地优先的知识管理工具，基于 Markdown 文件，支持双向链接和插件生态',
    url: 'https://www.producthunt.com/posts/obsidian',
    source: 'producthunt',
    votes: 4500,
    dailyStars: 45,
    owner: 'obsidianmd',
  },
  {
    id: 'ph-10',
    name: 'Linear',
    nameCn: 'Linear 项目管理',
    description: '现代化的项目管理工具，专为软件团队设计，流畅的键盘操作体验',
    descriptionCn: '现代化的项目管理工具，专为软件团队设计，流畅的键盘操作体验',
    url: 'https://www.producthunt.com/posts/linear',
    source: 'producthunt',
    votes: 3800,
    owner: 'linear',
  },
  {
    id: 'ph-11',
    name: 'terminal-portfolio',
    nameCn: '终端风格作品集',
    description: '用终端界面风格做的个人作品集网站，极客范十足',
    descriptionCn: '用终端界面风格做的个人作品集网站，极客范十足',
    url: 'https://www.producthunt.com/posts/terminal-portfolio',
    source: 'producthunt',
    votes: 720,
    dailyStars: 28,
    owner: 'terminal-coder',
  },
  {
    id: 'ph-12',
    name: 'Raycast',
    nameCn: 'Raycast 启动器',
    description: 'Mac 上的超级启动器，替代 Spotlight，支持各种插件和快捷操作',
    descriptionCn: 'Mac 上的超级启动器，替代 Spotlight，支持各种插件和快捷操作',
    url: 'https://www.producthunt.com/posts/raycast',
    source: 'producthunt',
    votes: 4200,
    owner: 'raycast',
  },
  {
    id: 'ph-13',
    name: 'pixel-art-maker',
    nameCn: '像素画生成器',
    description: '在线像素画创作工具，支持导出动画和调色板分享',
    descriptionCn: '在线像素画创作工具，支持导出动画和调色板分享',
    url: 'https://www.producthunt.com/posts/pixel-art-maker',
    source: 'producthunt',
    votes: 560,
    dailyStars: 15,
    owner: 'pixel-lover',
  },
  {
    id: 'ph-14',
    name: 'Superhuman',
    nameCn: 'Superhuman 邮件',
    description: '最快的邮件客户端，键盘快捷键驱动，AI 智能撰写，让你处理邮件快 3 倍',
    descriptionCn: '最快的邮件客户端，键盘快捷键驱动，AI 智能撰写，让你处理邮件快 3 倍',
    url: 'https://www.producthunt.com/posts/superhuman',
    source: 'producthunt',
    votes: 2900,
    owner: 'superhuman',
  },
  {
    id: 'ph-15',
    name: 'zettelkasten-tools',
    nameCn: '卡片笔记工具',
    description: '基于卢曼卡片笔记法的知识管理工具，支持双向链接，构建你的第二大脑',
    descriptionCn: '基于卢曼卡片笔记法的知识管理工具，支持双向链接，构建你的第二大脑',
    url: 'https://www.producthunt.com/posts/zettelkasten-tools',
    source: 'producthunt',
    votes: 680,
    dailyStars: 31,
    owner: 'note-thinker',
  },
  {
    id: 'ph-16',
    name: 'Loom',
    nameCn: 'Loom 录屏',
    description: '一键录屏并分享视频链接，异步沟通神器，支持评论和标注',
    descriptionCn: '一键录屏并分享视频链接，异步沟通神器，支持评论和标注',
    url: 'https://www.producthunt.com/posts/loom',
    source: 'producthunt',
    votes: 3100,
    owner: 'loom',
  },
];

function isBigCompany(owner?: string): boolean {
  if (!owner) return false;
  const lower = owner.toLowerCase();
  return BIG_COMPANIES.some((company) => lower.includes(company));
}

export function isIndieProject(project: Project): boolean {
  const stars = project.stars || 0;
  const votes = project.votes || 0;
  const owner = project.owner || '';

  if (isBigCompany(owner)) {
    return false;
  }

  const hasStars = project.stars !== undefined;
  const hasVotes = project.votes !== undefined;

  if (hasStars && stars >= 15000) {
    return false;
  }

  if (hasVotes && votes >= 2500) {
    return false;
  }

  return true;
}

function mergeProjects(githubProjects: Project[], phProjects: Project[]): Project[] {
  const map = new Map<string, Project>();

  for (const p of githubProjects) {
    map.set(p.name.toLowerCase(), {
      ...p,
      sources: ['github'],
    } as any);
  }

  for (const p of phProjects) {
    const key = p.name.toLowerCase();
    if (map.has(key)) {
      const existing = map.get(key)!;
      (existing as any).sources = [...((existing as any).sources || ['github']), 'producthunt'];
      existing.dailyStars = Math.max(existing.dailyStars || 0, p.dailyStars || 0);
    } else {
      map.set(key, {
        ...p,
        sources: ['producthunt'],
      } as any);
    }
  }

  return Array.from(map.values());
}

function parseGitHubRepo(repo: any): Project {
  const nameLower = repo.name?.toLowerCase() || '';
  const translation = TRANSLATIONS[nameLower];

  return {
    id: repo.id?.toString() || repo.full_name,
    name: repo.name,
    nameCn: translation?.nameCn || repo.name,
    description: repo.description || '',
    descriptionCn: translation?.descriptionCn || repo.description || '',
    url: repo.html_url,
    source: 'github',
    stars: repo.stargazers_count,
    dailyStars: Math.floor(Math.random() * 200) + 10,
    language: repo.language,
    owner: repo.owner?.login,
  };
}

const TRANSLATIONS: Record<string, { nameCn: string; descriptionCn: string }> = {
  'vite': {
    nameCn: 'Vite 构建工具',
    descriptionCn: '下一代前端构建工具，提供极快的开发服务器热更新和优化的生产构建',
  },
  'react': {
    nameCn: 'React 框架',
    descriptionCn: 'Facebook 开源的用于构建用户界面的 JavaScript 库',
  },
  'vue': {
    nameCn: 'Vue 框架',
    descriptionCn: '渐进式 JavaScript 框架，易于上手，灵活高效',
  },
  'next.js': {
    nameCn: 'Next.js 全栈框架',
    descriptionCn: 'React 全栈开发框架，支持 SSR、SSG、API Routes 等多种渲染模式',
  },
  'tailwindcss': {
    nameCn: 'Tailwind CSS',
    descriptionCn: '实用优先的 CSS 框架，通过原子类快速构建自定义界面',
  },
  'typescript': {
    nameCn: 'TypeScript',
    descriptionCn: 'JavaScript 的超集，添加了类型系统，让代码更健壮更易维护',
  },
  'prisma': {
    nameCn: 'Prisma 数据库工具',
    descriptionCn: '下一代 Node.js 和 TypeScript 数据库 ORM，支持多种数据库',
  },
  'trpc': {
    nameCn: 'tRPC 端到端类型',
    descriptionCn: 'TypeScript 端到端类型安全的 API 解决方案，前后端类型共享',
  },
  'svelte': {
    nameCn: 'Svelte 框架',
    descriptionCn: '编译型前端框架，无虚拟 DOM，运行时性能优异',
  },
  'astro': {
    nameCn: 'Astro 静态站点',
    descriptionCn: '面向内容驱动网站的全栈框架，零默认 JS，支持多种 UI 框架',
  },
  'excalidraw': {
    nameCn: 'Excalidraw 手绘白板',
    descriptionCn: '手绘风格的在线白板工具，支持多人协作和导出',
  },
  'tldraw': {
    nameCn: 'tldraw 白板 SDK',
    descriptionCn: '优秀的在线白板和白板 SDK，手绘风格，可嵌入应用',
  },
  'pocketbase': {
    nameCn: 'PocketBase 后端',
    descriptionCn: '单文件开源后端，包含数据库、认证、存储和管理后台',
  },
  'localsend': {
    nameCn: 'LocalSend 快传',
    descriptionCn: '开源跨平台 AirDrop 替代品，局域网内高速传输文件',
  },
  'obsidian': {
    nameCn: 'Obsidian 笔记',
    descriptionCn: '本地优先的知识管理工具，基于 Markdown，支持双向链接和插件',
  },
  'notion': {
    nameCn: 'Notion 笔记',
    descriptionCn: '一体化的笔记、文档、项目管理和知识库工具',
  },
  'figma': {
    nameCn: 'Figma 设计工具',
    descriptionCn: '基于浏览器的协作设计工具，UI/UX 设计师首选',
  },
  'raycast': {
    nameCn: 'Raycast 启动器',
    descriptionCn: 'Mac 超级启动器，替代 Spotlight，支持丰富的插件生态',
  },
  'linear': {
    nameCn: 'Linear 项目管理',
    descriptionCn: '现代化的软件项目管理工具，流畅的键盘操作体验',
  },
  'superhuman': {
    nameCn: 'Superhuman 邮件',
    descriptionCn: '最快的邮件客户端，键盘驱动，AI 智能撰写，效率翻倍',
  },
  'loom': {
    nameCn: 'Loom 录屏',
    descriptionCn: '一键录屏并分享视频链接，异步沟通神器，支持评论标注',
  },
  'suno': {
    nameCn: 'Suno AI 音乐',
    descriptionCn: 'AI 音乐生成工具，输入文字描述即可生成带人声的完整歌曲',
  },
  'arc': {
    nameCn: 'Arc 浏览器',
    descriptionCn: '全新设计的浏览器，内置 AI 功能，重新定义上网体验',
  },
  'readwise': {
    nameCn: 'Readwise 阅读器',
    descriptionCn: '全能阅读应用，支持文章、PDF、电子书、RSS，内置高亮复习',
  },
  'sider': {
    nameCn: 'Sider AI 助手',
    descriptionCn: '侧边栏 AI 助手，支持多种大模型，选中文字即可调用 AI',
  },
  'screen-pipe': {
    nameCn: 'ScreenPipe 屏幕记忆',
    descriptionCn: '24/7 屏幕与音频录制，本地 AI 驱动，可搜索你见过听过的一切',
  },
  'screenpipe': {
    nameCn: 'ScreenPipe 屏幕记忆',
    descriptionCn: '24/7 屏幕与音频录制，本地 AI 驱动，可搜索你见过听过的一切',
  },
  'tiny-helpers': {
    nameCn: '开发者小工具合集',
    descriptionCn: '精选的在线 Web 开发工具合集，每个都很实用',
  },
  'awesome-selfhosted': {
    nameCn: '自托管项目大全',
    descriptionCn: '可以在自己服务器上托管的免费软件和 Web 应用列表',
  },
  'public-apis': {
    nameCn: '公共 API 大全',
    descriptionCn: '免费开放 API 合集，涵盖天气、图片、视频、机器学习等 50+ 类别',
  },
  'coding-interview-university': {
    nameCn: '编程面试大学',
    descriptionCn: '谷歌工程师整理的计算机科学学习路线，帮你从零准备大厂技术面试',
  },
  'developer-roadmap': {
    nameCn: '开发者学习路线图',
    descriptionCn: '前端、后端、DevOps 等 20+ 技术方向的学习路线图，一步步成长',
  },
  'system-design-primer': {
    nameCn: '系统设计入门',
    descriptionCn: '学习如何设计大型分布式系统，准备系统设计面试的最佳资源',
  },
  'free-programming-books': {
    nameCn: '免费编程书籍',
    descriptionCn: '全球最大的免费编程书籍合集，涵盖 100+ 种语言的学习资源',
  },
  'build-your-own-x': {
    nameCn: '自己动手造轮子',
    descriptionCn: '从零开始构建技术项目合集，教你自己写操作系统、数据库、框架等',
  },
  'the-book-of-secret-knowledge': {
    nameCn: '程序员秘典',
    descriptionCn: '灵感列表合集：工具、代码片段、单行命令、博客文章等各种宝藏',
  },
  'shadcn-ui': {
    nameCn: 'shadcn 组件库',
    descriptionCn: '可直接复制粘贴到项目中的精美 UI 组件，Tailwind CSS 驱动',
  },
  'ui': {
    nameCn: 'shadcn 组件库',
    descriptionCn: '可直接复制粘贴到项目中的精美 UI 组件，Tailwind CSS 驱动',
  },
  'd2': {
    nameCn: 'D2 图表语言',
    descriptionCn: '用文本描述就能生成漂亮架构图的现代图表语言，替代 Mermaid',
  },
  'helix': {
    nameCn: 'Helix 编辑器',
    descriptionCn: '后现代的终端文本编辑器，内置 LSP 和 Tree-sitter，Vim 风格',
  },
  'zoxide': {
    nameCn: 'Zoxide 快速跳转',
    descriptionCn: '更智能的 cd 命令，根据访问频率自动跳转到常用目录',
  },
  'bat': {
    nameCn: 'Bat 猫命令',
    descriptionCn: '带语法高亮和行号的 cat 命令替代品，终端浏览代码更优雅',
  },
  'fd': {
    nameCn: 'Fd 文件查找',
    descriptionCn: '更简单更快的 find 命令替代品，80% 场景下用 fd 更顺手',
  },
  'ripgrep': {
    nameCn: 'Ripgrep 搜索',
    descriptionCn: '最快的命令行文本搜索工具，比 grep 快几十倍，自动忽略 .gitignore',
  },
  'starship': {
    nameCn: 'Starship 终端提示符',
    descriptionCn: '极简、超快、可定制的 Shell 提示符，50+ 语言和工具支持',
  },
  'lazygit': {
    nameCn: 'Lazygit 终端 Git',
    descriptionCn: '终端里的 Git GUI，用键盘快速完成提交、变基、暂存等操作',
  },
  'obsidian-tasks': {
    nameCn: 'Obsidian 任务插件',
    descriptionCn: 'Obsidian 笔记的任务管理插件，支持日期、优先级、循环任务等',
  },
};

export function useProjects(forceRefresh = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchAll = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);

    if (!force) {
      const cached = getCache(CACHE_KEY);
      if (cached) {
        setProjects(cached.projects);
        setLastUpdated(getCacheTimestamp(CACHE_KEY));
        setLoading(false);
        return;
      }
    }

    const merged = mergeProjects(GITHUB_PROJECTS, PRODUCT_HUNT_PROJECTS);
    setProjects(merged);
    setCache(CACHE_KEY, merged);
    setLastUpdated(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll(forceRefresh);
  }, [fetchAll, forceRefresh]);

  return { projects, loading, error, lastUpdated, refresh: () => fetchAll(true) };
}
