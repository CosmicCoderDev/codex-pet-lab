# 贡献指南

[English](./CONTRIBUTING.md)

欢迎贡献代码和宠物素材，但必须保持中英文同步、尽量不增加依赖，并如实区分“角色构思”和“可安装成品”。

## 开始之前

1. 阅读[素材政策](./ASSET_POLICY.zh-CN.md)。
2. 阅读[图集格式说明](./docs/FORMAT.zh-CN.md)。
3. 大规模界面改版或格式调整应先创建 Issue 讨论。

## 新增内置宠物

创建 `pets/<pet-id>/`，包含：

```text
pet.json
preview.gif
spritesheet.webp
```

公开内置宠物必须是通过验证的 v2 图集：`1536×2288`、8×11 格、57 帧标准动画、16 个环顾方向、未使用格子全透明且没有可见色键绿边。`pet.json` 中的 ID 必须和目录名一致。

同时更新英文和简体中文界面及 README，在 PR 中说明素材来源，并提供接触表或动画视觉 QA 证据。

## 必须执行的检查

```powershell
npm test
npm run check
.\scripts\install-pet.ps1 -PetId <pet-id> -CodexHome ".\workbench\install-smoke" -Force
```

所有动画循环都要人工检查。结构校验通过不代表角色一致性、动作或方向语义一定正确。

## Pull Request

每个 PR 保持单一范围，说明改了什么、为什么改、用户影响、验证证据和剩余视觉风险。不要提交工作台临时文件、生成提示词或未授权参考素材。
