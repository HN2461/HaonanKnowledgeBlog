// 这里只保留"当天"的消息摘要。
// 主人说"汇总消息"时，Codex 会基于当天代码改动刷新这里的内容。

export const dailyChangeSummary = {
  date: '2026-05-16',
  items: [
    {
      category: '内容上新',
      time: '23:20',
      title: '新增Git认证与账号密码辨析文档',
      summary: '在项目复用技术/Git 目录下新增一篇面向初学者的 Git 认证说明文，系统讲清 Git 本身、GitHub/Gitee/公司平台账号、HTTPS、SSH、Token 与 user.name/user.email 的边界，并补充 Git 专题目录页。',
      content: '第一点：新增 `public/notes/项目复用技术/Git/Git账号密码到底是什么_Git平台认证_HTTPS_SSH_Token全解.md`，围绕“拉代码时到底在验证谁”展开，系统拆解 Git 工具、代码托管平台、HTTPS 与 SSH 两种协议、平台密码与 Token、SSH key、本地提交署名 `user.name`/`user.email` 之间的区别；第二点：文章重点解释“Git 本身没有统一账号密码”“拉个人仓库和公司仓库为何要用不同身份”“QQ 邮箱可能只是平台注册邮箱或提交署名邮箱”“为什么同一台电脑会对不同仓库弹出不同认证方式”，并给出 `git remote -v`、`git config --global user.name`、`git config --show-origin --get-all credential.helper`、`ssh -T` 等排查命令；第三点：补充 `public/notes/项目复用技术/Git/目录.md`，将 Git 专题整理成可浏览的目录页，明确先看认证辨析再看分支追踪排障的阅读顺序；第四点：按协作规则将旧的 `data/dailyChangeSummary.js` 中 2026-05-14 摘要迁移归档到 `data/history/2026-05-11_20.js`，并将当日摘要重置为 2026-05-16 的本次内容。'
    }
  ],
}
