# Unity 面试题库 · 4 年经验

面向 **Unity 客户端开发（目标 4 年经验）** 的手机端刷题应用。纯静态单页，零依赖、零构建，直接部署在 GitHub Pages。

👉 线上地址：**https://pengfer.github.io/unity-interview-lab/**

手机浏览器打开后可「添加到主屏幕」，像 App 一样使用。

## 功能

| 模块 | 说明 |
| --- | --- |
| 📚 知识浏览 | 11 个分类、200+ 道题，支持关键词搜索、难度筛选；题目详情可看答案与解析 |
| 🎯 卡片学习 | 每次 20 题的闪卡模式，先思考再揭晓；答完自动安排下次复习时间（1/2/4/8/16 天间隔） |
| 📝 模拟考核 | 按分类 / 难度 / 题量自由组卷，逐题作答 + 答题卡跳转，交卷后给出得分、分类正确率与错题解析 |
| 🔥 每日打卡 | 连续天数、今日目标进度环、16 周学习热力图，完成每日目标自动打卡 |
| 🔁 错题本 | 答错自动收录，答对自动移出 |
| ⭐ 收藏 | 详情页右上角星标 |
| 📤 数据迁移 | 学习数据可导出 / 导入 JSON，换设备不丢进度 |
| 📱 PWA | 支持「添加到主屏幕」，离线可用（Service Worker），深色 / 浅色主题自适应 |

数据全部保存在浏览器 `localStorage`，不需要账号与后端。

## 题库覆盖

| 分类 | 题数 | 主要考点 |
| --- | --- | --- |
| C# 语言 | 24 | 值/引用类型、GC、装箱、委托事件、闭包、协程 vs async、LINQ、反射、集合底层 |
| 引擎核心 | 22 | 生命周期顺序、Time.timeScale、ScriptableObject、协程原理、场景加载、Prefab |
| 物理系统 | 16 | 碰撞 vs 触发、Rigidbody 类型、射线检测、连续碰撞、物理优化 |
| 渲染图形 | 23 | 渲染管线、Draw Call、合批/SRP Batcher/Instancing、Shader 变体、光照、后处理、Overdraw |
| 动画系统 | 16 | Animator 状态机、Blend Tree、Avatar Mask、Root Motion、IK、Timeline、动画优化 |
| UI 系统 | 16 | UGUI 合批与重建、Canvas 拆分、图集、CanvasScaler 适配、ScrollRect 复用、TMP |
| 性能优化 | 20 | Profiler、GC 与每帧分配、对象池、内存泄漏、渲染/物理/UI 优化、真机测试 |
| 资源管理 | 20 | Resources / AssetBundle / Addressables、热更流程、HybridCLR、包体优化 |
| 网络同步 | 18 | TCP/UDP、粘包、帧同步 vs 状态同步、预测回滚、断线重连、KCP |
| 架构设计 | 18 | 单例与替代、事件中心、对象池、状态机、MVC/MVVM、ECS/DOTS、asmdef |
| 数学算法 | 14 | 点乘叉乘、四元数、Lerp、AABB、射线求交、空间划分、A*、NavMesh |

共 **207 题**：基础 64 / 进阶 90 / 高级 53；单选 126 / 多选 41 / 判断 40。

## 目录结构

```
.
├── index.html              # 页面骨架
├── assets/
│   ├── app.css             # 全部样式（移动端优先）
│   ├── app.js              # 应用逻辑（路由 / 学习算法 / 考核 / 打卡）
│   └── bank.js             # 题库（由 data/*.json 自动生成，勿手改）
├── data/                   # 题库源文件，按分类拆分
│   ├── cs.json  engine.json  physics.json  render.json  anim.json
│   └── ui.json  perf.json  asset.json  net.json  arch.json  math.json
├── icons/                  # 应用图标
├── scripts/
│   ├── build_bank.py       # 校验并合并题库 → assets/bank.js
│   └── make_icons.py       # 生成图标 PNG
├── manifest.webmanifest    # PWA 清单
├── sw.js                   # Service Worker（离线缓存）
└── .nojekyll               # 关闭 GitHub Pages 的 Jekyll 处理
```

## 本地预览

题库目前是 `<script>` 直接引入的，所以双击 `index.html` 就能跑；但 PWA 与 Service Worker 需要 HTTP：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 维护题库

1. 编辑 `data/<分类>.json`，按下面的结构追加题目；
2. 运行校验 + 生成：

```bash
python scripts/build_bank.py
```

脚本会检查：`id` 唯一、`cat` 与文件名一致、`level/type` 枚举合法、`answer` 下标不越界、单选恰好 1 个答案、多选至少 2 个、判断题选项固定、`tags` 数量，并统计各分类题数。校验失败会列出全部问题且不覆盖 `bank.js`。

### 题目字段

```json
{
  "id": "cs-25",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "题干，可以包含 \n 换行",
  "code": "可选，代码片段",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": [1],
  "explain": "解析：讲清原理、干扰项错在哪、面试可能怎么追问。",
  "tags": ["GC", "内存"]
}
```

- `level`：`基础` / `进阶` / `高级`
- `type`：`single`（单选）/ `multi`（多选）/ `judge`（判断，`options` 固定 `["正确","错误"]`）
- `answer`：正确选项下标数组（从 0 开始）

## 部署到 GitHub Pages

仓库已就绪，推上去即可：

```bash
git remote add origin https://github.com/pengfer/unity-interview-lab.git
git push -u origin main
```

本项目当前已部署在 `main` 分支 `/ (root)`，推送后 GitHub Pages 会自动构建，约 1 分钟后生效：
**https://pengfer.github.io/unity-interview-lab/**

> 索引使用 hash 路由（`#/browse`），刷新与直达任意页面都不会 404。

## 说明

- 学习进度、打卡、错题都只存在当前浏览器；清理浏览器数据会丢失，建议定期用「导出学习数据」备份。
- 题库答案与解析用于复习参考，建议结合官方文档与真机验证。
