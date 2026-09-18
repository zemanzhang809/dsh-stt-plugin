# DSH 插件开发踩坑实录

> 来源:开发 `dsh-stt-plugin`(语音输入插件)过程中的真实排查记录。
> 四轮"插件列表里有、UI 却不出现"的排查,每轮各对应一个独立的坑。
> 希望后来者能在一个下午里避开我们踩过的所有坑。

---

## 目录

1. [背景与插件形态](#1-背景与插件形态)
2. [组合层:patch 与 profile 的坑](#2-组合层patch-与-profile-的坑)
3. [包清单与构建产物的坑](#3-包清单与构建产物的坑)
4. [客户端运行时的坑](#4-客户端运行时的坑)
5. [设置(settings)系统的坑](#5-设置settings系统的坑)
6. [UI 放置位的选择](#6-ui-放置位的选择)
7. [调试方法论与排查顺序](#7-调试方法论与排查顺序)
8. [接入/发布前检查清单](#8-接入发布前检查清单)

---

## 1. 背景与插件形态

目标插件是**双面 bundle**:

| 半边 | 运行位置 | 职责 |
| --- | --- | --- |
| Host(`lib/index.js`,Node ESM) | DSH Node 进程 | 注册 `ui-stt` 设置命名空间(Schemastery schema) |
| Client(`lib/client.js`,浏览器经典脚本) | Web GUI 页面 | 麦克风按钮(Slot)+ 设置页(Slot)+ Web Speech API 听写 |

一个包同时声明两端:

```jsonc
// package.json(节选)
{
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"   // ← 坑 3.1,见下文
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "platform": "web" }
  }
}
```

本地测试采用 **link 安装 + patch 插入行**(包管理器统一使用 pnpm):

```sh
cd ~/.dsh/profiles/web
pnpm add /绝对路径/dsh-stt-plugin        # link: 符号链接,改源码重 build 即生效
# 然后在 cordis.patch.yml 中插入插件行(坑 2.1)
```

---

## 2. 组合层:patch 与 profile 的坑

### 坑 2.1 用户 patch 层安装新插件必须用 `insert` 形式 ⭐️(第一轮排查的根因)

在 profile 的 `cordis.patch.yml` 里,**裸条目 `{ id: stt, name: "..." }` 的语义是"按 id 定位一个已存在的行并覆盖其配置"**,不是"安装"。

- 社区插件条目之所以那样写,是因为它们由包自己的 `dsh.bundle.patch` 先 `insert`,用户 patch 再按 id 调开关。
- 指向不存在的 id → 组合失败:`patch: entry "stt" not found`。
- **症状**:插件列表里有包,但 Host/Client 什么都没挂载,启动日志可能只有一行小字甚至没有报错。
- **反面坑**:同一 id 不允许出现两条 insert。`dsh plugin add` 会因包声明 `dsh.bundle.patch` 而把包自动对账进 `dsh.profile.bundles`(bundle 层自带 insert);此时若用户层还留着手工 insert 行,组合直接失败。切换安装方式时,务必清掉旧方式的插件行。

正确写法:

```yaml
# cordis.patch.yml(用户层)
- insert:
    - id: stt
      name: dsh-stt-plugin          # 通过 profile node_modules 解析
- { id: web-ui-xxx, name: "@scope/pkg/entry", disabled: false }   # 覆盖行照旧
```

### 坑 2.2 live reload 的覆盖范围有边界

`package.json` 里 `dsh.profile.patchReload: "live"` 时:

| 改动 | 是否热生效 |
| --- | --- |
| profile 的 `cordis.patch.yml` | ✅ 热重组 |
| `$DSH_HOME/cordis.patch.yml`(home 层) | ✅ 热重组 |
| `dsh.profile.bundles`(bundle 层) | ❌ 需重启 |
| node_modules 里的包内容(Host 侧 `lib/index.js`) | ❌ 需重启(模块热重载默认关闭) |
| 客户端 bundle 文件(`lib/client.js` 内容变化) | ✅ 服务端重建 graph,浏览器刷新即可 |

结论:**改 Host 代码必须重启;改 Client 代码刷新页面即可**。

### 坑 2.3 `--dump-config` 是最快的组合验证手段

不启动实例就能验证 patch 形式与解析:

```sh
node --import tsx/esm apps/cli/src/bin.ts --profile web --dump-config
```

我们就是靠它第一时间拿到 `patch: entry "stt" not found` 的(此前启动日志里毫无线索)。

---

## 3. 包清单与构建产物的坑

### 坑 3.1 `exports` 必须暴露 `./package.json` ⭐️(第二轮排查的根因)

客户端模块系统通过 **Node 的 exports 解析**读取包 manifest(`dsh.client` 声明、`exports["./client"]` 都从这来)。`exports` 映射漏掉 `./package.json` 时,manifest 定位失败 → **浏览器半边静默地永远不加载**,Host 半边却一切正常。

```jsonc
"exports": {
  ".": "./lib/index.js",
  "./client": "./lib/client.js",
  "./package.json": "./package.json"    // 必须有
}
```

### 坑 3.2 客户端产物的精确契约

DSH 客户端模块协议要求 `lib/client.js` 是这样的经典 CJS 脚本:

```js
window.__ModuleLoader__.load({ id: "dsh-stt-plugin", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
/* esbuild 产物主体 */
return module.exports; } });
```

用 esbuild 落地的要点:

- **没有 `intro` 选项**:`var module = { exports: {} }; var exports = module.exports;` 要写进 `banner`,与 `window.__ModuleLoader__.load({...factory: (require) => {` 拼在一起;`return module.exports; } });` 放 `footer`。
- **`id` 必须严格等于包名**(boot graph 以它为键)。
- **external**: `react`、`react/jsx-runtime`、`react-dom` 等由外壳的平台模块表提供,不要打包进去。
- 验证手段:`new Function('require', code)` + 假 `window.__ModuleLoader__` 捕获 factory(见 `scripts/smoke.mjs`)。

### 坑 3.3 git 依赖的 prepare 构建陷阱 → 提交预构建产物 ⭐️(安装兼容性)

pnpm 安装 **git 依赖**时有两个相互叠加的约束:

1. 会运行被安装包自己的 `prepare` 脚本,但**不安装它的 devDependencies** —— `prepare` 里调用 esbuild 必然失败;
2. pnpm ≥ 10 默认拦截依赖的构建脚本,直到消费侧 `pnpm-workspace.yaml` 的 `allowBuilds` 放行(`dsh plugin` 的 CLI 失败时会专门提示这一点)——而要求每个用户手工改 profile 配置,是最差的安装体验。

**兼容处理(本项目采用)**:让消费端安装**零构建脚本**——

- 预构建的 `lib/` 直接随仓库提交(`.gitignore` 不忽略它),消费端 clone 即用;
- 从 `package.json` 删除 `prepare`(构建工具只留在 devDependencies,供插件仓库内 `pnpm install && pnpm build` 开发用);
- 代价与权衡:仓库里多两份构建产物、需要与 `src/` 同步提交(发布前跑 `pnpm check && pnpm test` 把关);收益是 `github:` 安装对任何 pnpm 版本、任何 profile 配置都开箱即用,不存在"卡在构建审批"这个失败面。

顺带的收益:pnpm 安装本包时连唯一的运行时依赖 schemastery 之外什么都不会构建,git clone + 复制即完成。

仓库内开发仍需 `pnpm-workspace.yaml` 的 `allowBuilds: esbuild: true`(**pnpm 12 起不再读取 `package.json` 的 `pnpm` 字段**,审批统一放 workspace 配置)。

另外 `pnpm add <本地目录>` 产生 `link:` 符号链接,**不会执行被链接包的 prepare 脚本**——link 开发迭代时记得手动 `pnpm build`。

### 坑 3.4 分发路径决定安装可达性(`github:` 依赖卡死在 resolved)

`github:` 依赖的第一步是 `git ls-remote` + `git clone` github.com——**在访问不了 GitHub 的网络下,安装会停在 `Progress: resolved …` 直到超时**:

```
[ERROR] Command failed with exit code 128: git ls-remote "https://github.com/….git" HEAD "HEAD^{}"
fatal: unable to access 'https://github.com/…': Failed to connect to github.com:443
```

这与包内容毫无关系,改代码救不了;能改的是**分发路径**。按网络可达性排序:

1. **npm registry**(推荐):registry 拉取不走 GitHub,国内可配 `registry.npmmirror.com` 镜像;包发布后 `dsh plugin --profile web add <包名>` 即可。
2. **GitHub 直连**:需要网络可达或 git 代理(`git config --global http.proxy …`);README 里应写明 `git ls-remote … Could not connect` 症状对照,避免用户误判为插件问题。
3. **本地路径兜底**:拷贝目录后 `dsh plugin --profile web add C:\绝对路径\插件目录`(绝对路径原样传给 pnpm)。

配套工程:仓库带 `.github/workflows/publish.yml`(推 `v*` tag 自动 `npm publish`,`NPM_TOKEN` 走 secrets),让 registry 版本与源码同源。另注意 `dsh plugin` CLI 失败时打印的 allowBuilds 提示是通用兜底文案——先看真实报错(pnpm 的 git/registry 错误会原样透传),别被它带偏。

---

## 4. 客户端运行时的坑

### 坑 4.1 客户端插件必须导出 `inject` 声明服务依赖 ⭐️(第四轮排查的根因)

客户端半边只用 `ctx.get('slots')` 而**不导出 `inject` 数组**时,插件在页面启动时立即激活——通常早于服务提供方挂载——所有 `ctx.get` 返回 `undefined`:

```
[dsh-stt-plugin] slots service absent — nothing to register
```

修复:

```ts
// src/client/index.tsx
export const inject = ['slots', 'locale', 'settingsScope']
```

导出后 Fiber 保持 PENDING 直到服务就绪,apply 才在正确时机执行。真正可选的服务(如 timer)可以留在 `ctx.get` + 回退。**Host 半边同理**(坑 5.2)。

### 坑 4.2 Slot 的 `inject` 面展开为组件顶层 props ⭐️(第三轮排查的根因)

Slot 渲染器把注册时 `inject` 面的每个成员**逐字展开为组件 props**(`InjectFace<I> = I`):

```tsx
slots.register(
  { name: 'settings.section', id: 'stt', inject: () => ({ config, schedule, scope, persisted }) },
  (props) => Section(props),   // props.config() ✔   props.injected.config() ✘
)
```

按嵌套方式读取 → 首帧渲染抛错 → React **静默丢弃**该条目:其余一切正常,唯独 UI "消失"。官方样例(`ui-settings-unarchive-sessions`)的 `const { t, unarchive } = props` 就是证据。

### 坑 4.3 会话级 Slot 的标准 props 与渲染条件

- Session 作用域的 Slot 组件自动收到标准 props:`useInput`(选择器 hook)、`inputActions`(`setDraft` / `submit`)、`useSession` 等。**要防御性判空**——我们用 `props.useInput !== undefined ? props.useInput(...) : undefined`(同一挂载实例内 props 稳定,hook 顺序不会漂移)。
- 列表 Slot 是否渲染由 owner 决定:`conversation.input.right` 只在 `input !== undefined && sessionId !== undefined` 时渲染——**没进会话时按钮本来就不存在**,别误判为挂载失败。
- 写入草稿前检查输入机阶段(`phase === 'plain'`),繁忙阶段拒绝写入。

### 坑 4.4 控制台探针 + 插件标签

在 apply 首尾加带插件标签的 `console.log`,是确认客户端半边"是否真的执行到哪一步"的最快手段:

```
[dsh-stt-plugin] client half applying
[dsh-stt-plugin] slots registered: mic button + settings page
```

判读:两行都有→看渲染报错;只有第一行→apply 中途抛错;一行都没有→模块未物化(回到组合层排查)。

### 坑 4.5 浏览器信任围栏让 HTTP 探测失效

Web UI 有 browser-trust 围栏:启动 URL 带 `?token=...`;**不带 token 的脚本化 HTTP 探测即使资源健康也返回 401/404**——我们曾误判插件 404 就是未挂载。验证一律去浏览器控制台,别用 curl/PowerShell。

---

## 5. 设置(settings)系统的坑

### 坑 5.1 Host 注册命名空间必须用 Schemastery schema

`ctx.settings.register(ns, schema)` 的 schema 会被 `schema.toJSON()` 序列化进 describe mirror 供客户端消费。设置默认值 = schema 的 `.default()`;客户端控件初始值与"恢复默认"语义都来自它。

### 坑 5.2 Host 半边同样要 `inject = ['settings']` ⭐️(自动发送开关被禁用的根因)

Host apply 若在 settings 服务挂载前执行,`ctx.get('settings')` 为 undefined → **命名空间从未注册** → 客户端作用域 `unavailable`(`snapshot.writable === false`)→ 设置页所有控件禁用。修复:

```ts
// src/host.ts
export const inject = ['settings']
```

### 坑 5.3 客户端作用域的读取与降级

```ts
const scope = ctx.get('settingsScope')?.bind({ namespace: 'ui-stt', decode: decodeConfig })
```

- `decode` 可以绕过 schema envelope 的 rehydrate 兼容问题,自行收窄 wire 值。
- `snapshot.writable` / `snapshot.mode('host'|'memory')` 决定控件是否可写;**不要在不可写时假装成功**,把降级原因显示出来(我们用两行提示文案区分"服务缺失"与"只读/内存模式")。
- `scope.set()` 失败时作用域自身会回滚恢复,但要 `catch` 住 promise,避免未处理的 rejection。

---

## 6. UI 放置位的选择

composer 工具行只有两个**可累加列表**:`conversation.input.left`(工具行左端)与 `conversation.input.right`(右端、提交动作之前,紧邻模型选择器)。

- "模型选择器与发送按钮**之间**"没有累加座位;精确占位需要整体替换常驻输入器(`conversation.composer.bar`,single 插槽)——会同时遮蔽官方 UI 及其全部子插槽,**不要做**。
- 选位原则:累加 Slot 的近似位 > 替换常驻组件的精确位;并在文档里写清楚取舍,上游出更细粒度座位后一行迁移。
- `settings.section` 是设置弹框的完整页面(导航 id + order + label thunk);单个设置项可用 `settings.general.item`。

---

## 7. 调试方法论与排查顺序

这次四轮排查收敛出的顺序,建议照抄:

```text
① dsh --profile <name> --dump-config        组合层:patch 形式/解析(秒级,免启动)
② 启动终端日志                               挂载报错(注意:可能什么都没有)
③ 浏览器控制台插件标签日志                    客户端 apply 执行到哪一步
④ 控制台红色报错                             渲染层崩溃(坑 4.2 类型)
⑤ 渲染级测试(pnpm test)                     不开浏览器复现渲染崩溃
```

**渲染级测试**是本次最重要的方法论收获:用 `react-dom/server` + 假 slot/locale/settings 服务,把两个组件按"渲染器会传的 props"真实渲染一遍——坑 4.2 那类崩溃从此在 CI 里就会爆,而不是静默 blank。见 `scripts/smoke.mjs` Phase 3。

开发循环:

```text
改 src → pnpm build → (Client 改动)刷新页面 / (Host 改动)重启实例 → pnpm test
```

---

## 8. 接入/发布前检查清单

- [ ] `cordis.patch.yml`(插件自带)使用 `insert` 形式,`id` 唯一
- [ ] `package.json`:`dsh.bundle.patch` + `dsh.client.platform = "web"` + `exports` 含 `.`、`./client`、`./package.json`
- [ ] 客户端产物 banner 的 `id` 与包名一致;react 系保持 external
- [ ] `pnpm-workspace.yaml` 声明 `allowBuilds`(esbuild 等,仓库内开发用)
- [ ] 预构建 `lib/` 已随仓库提交且无 `prepare` 脚本 —— 消费端安装零构建脚本
- [ ] 预发布跑过 `pnpm check && pnpm test`,确认提交的 `lib/` 与 `src/` 同步
- [ ] 客户端入口导出 `inject`(所有被读取的服务);Host 入口同理
- [ ] Slot 组件按**扁平 props** 读取 inject 面;标准 props(useInput/inputActions)判空
- [ ] 设置命名空间用 Schemastery;客户端 `settingsScope.bind` 带 `decode`;不可写时有可见降级提示
- [ ] `pnpm check && pnpm test` 全绿(含渲染级测试)
- [ ] `dsh --profile <name> --dump-config` 通过后再启动
- [ ] 在浏览器里验证(而非 HTTP 探测);Host 改动记得重启
