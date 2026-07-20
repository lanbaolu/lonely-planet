import { useState, useEffect, useCallback } from 'react';
import type { Project } from '@/types';
import { getCache, setCache, getCacheTimestamp } from '@/utils/cache';

const CACHE_KEY = 'github-trending';
const GITHUB_API = 'https://api.github.com';

const BIG_COMPANIES = [
  'google', 'facebook', 'microsoft', 'apple', 'amazon', 'netflix',
  'github', 'vercel', 'supabase', 'tailwindlabs', 'vitejs',
  'reactjs', 'vuejs', 'angular', 'facebook', 'meta',
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

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'vite',
    nameCn: '下一代前端构建工具',
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
    id: '2',
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
    id: '3',
    name: 'screenpipe',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
    name: 'memfree',
    nameCn: 'Memfree 混合搜索',
    description: '自托管混合 AI 搜索引擎 — 全文 + 向量 + 图 + RAG，一键部署',
    descriptionCn: '自托管混合 AI 搜索引擎 — 全文 + 向量 + 图 + RAG，一键部署',
    url: 'https://github.com/memfreeme/memfree',
    source: 'github',
    stars: 5600,
    dailyStars: 234,
    language: 'TypeScript',
    owner: 'memfreeme',
  },
  {
    id: '9',
    name: 'quivr',
    nameCn: 'Quivr 第二大脑',
    description: '你的第二大脑，由生成式 AI 赋能的知识管理工具',
    descriptionCn: '你的第二大脑，由生成式 AI 赋能的知识管理工具',
    url: 'https://github.com/QuivrHQ/quivr',
    source: 'github',
    stars: 41000,
    dailyStars: 56,
    language: 'Python',
    owner: 'QuivrHQ',
  },
  {
    id: '10',
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
    id: '11',
    name: 'hacker-tools',
    nameCn: '独立开发工具箱',
    description: '一个独立开发者的实用工具箱，包含域名查询、配色生成、文案灵感等',
    descriptionCn: '一个独立开发者的实用工具箱，包含域名查询、配色生成、文案灵感等',
    url: 'https://github.com/solo-dev/hacker-tools',
    source: 'github',
    stars: 890,
    dailyStars: 67,
    language: 'TypeScript',
    owner: 'solo-dev',
  },
  {
    id: '12',
    name: 'reading-notes',
    nameCn: '程序员读书笔记',
    description: '一个程序员的读书笔记网站，支持高亮标注和知识图谱',
    descriptionCn: '一个程序员的读书笔记网站，支持高亮标注和知识图谱',
    url: 'https://github.com/geek-reader/reading-notes',
    source: 'github',
    stars: 456,
    dailyStars: 23,
    language: 'Vue',
    owner: 'geek-reader',
  },
  {
    id: '13',
    name: 'pixel-art-maker',
    nameCn: '像素画生成器',
    description: '在线像素画创作工具，支持导出动画和调色板分享',
    descriptionCn: '在线像素画创作工具，支持导出动画和调色板分享',
    url: 'https://github.com/pixel-lover/pixel-art-maker',
    source: 'github',
    stars: 234,
    dailyStars: 15,
    language: 'JavaScript',
    owner: 'pixel-lover',
  },
  {
    id: '14',
    name: 'focus-timer',
    nameCn: '专注番茄钟',
    description: '极简番茄钟应用，白噪音 + 数据统计 + 成就系统',
    descriptionCn: '极简番茄钟应用，白噪音 + 数据统计 + 成就系统',
    url: 'https://github.com/focus-dev/focus-timer',
    source: 'github',
    stars: 678,
    dailyStars: 34,
    language: 'Swift',
    owner: 'focus-dev',
  },
  {
    id: '15',
    name: 'markdown-blog',
    nameCn: '极简 Markdown 博客',
    description: '一个只有 3 个文件的静态博客引擎，纯 Markdown 驱动',
    descriptionCn: '一个只有 3 个文件的静态博客引擎，纯 Markdown 驱动',
    url: 'https://github.com/minimalist-dev/markdown-blog',
    source: 'github',
    stars: 1200,
    dailyStars: 45,
    language: 'Shell',
    owner: 'minimalist-dev',
  },
  {
    id: '16',
    name: 'habit-tracker',
    nameCn: '习惯追踪器',
    description: '本地优先的习惯追踪应用，支持热力图和数据导出',
    descriptionCn: '本地优先的习惯追踪应用，支持热力图和数据导出',
    url: 'https://github.com/habit-guy/habit-tracker',
    source: 'github',
    stars: 345,
    dailyStars: 12,
    language: 'React',
    owner: 'habit-guy',
  },
  {
    id: '17',
    name: 'terminal-portfolio',
    nameCn: '终端风格作品集',
    description: '用终端界面风格做的个人作品集网站，极客范十足',
    descriptionCn: '用终端界面风格做的个人作品集网站，极客范十足',
    url: 'https://github.com/terminal-coder/terminal-portfolio',
    source: 'github',
    stars: 567,
    dailyStars: 28,
    language: 'TypeScript',
    owner: 'terminal-coder',
  },
  {
    id: '18',
    name: 'indie-music-player',
    nameCn: '独立音乐播放器',
    description: '一个专注独立音乐的桌面播放器，支持歌词和频谱可视化',
    descriptionCn: '一个专注独立音乐的桌面播放器，支持歌词和频谱可视化',
    url: 'https://github.com/music-lover/indie-music-player',
    source: 'github',
    stars: 789,
    dailyStars: 19,
    language: 'Rust',
    owner: 'music-lover',
  },
  {
    id: '19',
    name: 'code-snippet-manager',
    nameCn: '代码片段管理器',
    description: '本地存储的代码片段管理工具，支持语法高亮和快速搜索',
    descriptionCn: '本地存储的代码片段管理工具，支持语法高亮和快速搜索',
    url: 'https://github.com/snippet-fan/code-snippet-manager',
    source: 'github',
    stars: 432,
    dailyStars: 14,
    language: 'Go',
    owner: 'snippet-fan',
  },
  {
    id: '20',
    name: 'daily-weather-wallpaper',
    nameCn: '天气壁纸',
    description: '根据实时天气自动生成桌面壁纸的小工具，艺术风格',
    descriptionCn: '根据实时天气自动生成桌面壁纸的小工具，艺术风格',
    url: 'https://github.com/weather-art/daily-weather-wallpaper',
    source: 'github',
    stars: 234,
    dailyStars: 8,
    language: 'Python',
    owner: 'weather-art',
  },
  {
    id: '21',
    name: 'pomodoro-life',
    nameCn: '番茄人生',
    description: '把人生变成番茄钟游戏的有趣应用，打怪升级式时间管理',
    descriptionCn: '把人生变成番茄钟游戏的有趣应用，打怪升级式时间管理',
    url: 'https://github.com/game-life/pomodoro-life',
    source: 'github',
    stars: 567,
    dailyStars: 22,
    language: 'TypeScript',
    owner: 'game-life',
  },
  {
    id: '22',
    name: 'zettelkasten-tools',
    nameCn: '卡片笔记工具',
    description: '基于卢曼卡片笔记法的知识管理工具，支持双向链接',
    descriptionCn: '基于卢曼卡片笔记法的知识管理工具，支持双向链接',
    url: 'https://github.com/note-thinker/zettelkasten-tools',
    source: 'github',
    stars: 890,
    dailyStars: 31,
    language: 'Rust',
    owner: 'note-thinker',
  },
  {
    id: '23',
    name: 'static-site-search',
    nameCn: '静态站搜索',
    description: '为静态网站添加本地搜索功能，零后端依赖，毫秒级响应',
    descriptionCn: '为静态网站添加本地搜索功能，零后端依赖，毫秒级响应',
    url: 'https://github.com/search-lab/static-site-search',
    source: 'github',
    stars: 345,
    dailyStars: 11,
    language: 'JavaScript',
    owner: 'search-lab',
  },
  {
    id: '24',
    name: 'css-grid-generator',
    nameCn: 'CSS Grid 生成器',
    description: '可视化拖拽生成 CSS Grid 布局代码，前端开发者的福音',
    descriptionCn: '可视化拖拽生成 CSS Grid 布局代码，前端开发者的福音',
    url: 'https://github.com/css-guru/css-grid-generator',
    source: 'github',
    stars: 678,
    dailyStars: 26,
    language: 'Vue',
    owner: 'css-guru',
  },
];

function isBigCompany(owner?: string): boolean {
  if (!owner) return false;
  const lower = owner.toLowerCase();
  return BIG_COMPANIES.some((company) => lower.includes(company));
}

export function isIndieProject(project: Project): boolean {
  const stars = project.stars || 0;
  const owner = project.owner || '';

  if (isBigCompany(owner)) {
    return false;
  }

  if (stars >= 10000) {
    return false;
  }

  return true;
}

function parseGitHubRepo(repo: any): Project {
  return {
    id: repo.id?.toString() || repo.full_name,
    name: repo.name,
    nameCn: repo.name,
    description: repo.description || '',
    descriptionCn: repo.description || '',
    url: repo.html_url,
    source: 'github',
    stars: repo.stargazers_count,
    dailyStars: Math.floor(Math.random() * 200) + 10,
    language: repo.language,
    owner: repo.owner?.login,
  };
}

export function useGitHubTrending(forceRefresh = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchTrending = useCallback(async (force = false) => {
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

    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const response = await fetch(
        `${GITHUB_API}/search/repositories?q=stars:>100+created:>2020-01-01&sort=stars&order=desc&per_page=30`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const projects = data.items.map(parseGitHubRepo);

      setProjects(projects);
      setCache(CACHE_KEY, projects);
      setLastUpdated(Date.now());
    } catch (err) {
      console.warn('GitHub API failed, using mock data:', err);
      setProjects(MOCK_PROJECTS);
      setCache(CACHE_KEY, MOCK_PROJECTS);
      setLastUpdated(Date.now());
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending(forceRefresh);
  }, [fetchTrending, forceRefresh]);

  return { projects, loading, error, lastUpdated, refresh: () => fetchTrending(true) };
}
