# VitaMap

症状 → 营养素方向自查 App（中英双语，完全离线）。

Symptom-to-nutrient orientation app, bilingual, fully offline.

## 它做什么 / What it does

- **症状自查**：从 41 项常见表现（按 7 个身体系统分组）中勾选，按证据强度给出 **核心方向 / 辅助协同 / 参考** 三档营养素建议。
- **营养素百科**：92 种维生素、矿物质、氨基酸、植物提取物，按类别筛选或中英文搜索，含常见形式、作用、安全上限、禁忌。
- **安全预警**：脂溶性维生素累积毒性、矿物质拮抗（锌铜 / 铁钙锌 / 钙镁 / 钾钠）、与处方药的六类常见冲突。
- **我的清单**：本机保存（localStorage），自动检查所选营养素之间的相互作用并提示。
- **双语**：右上角一键切换中文 / English，选择会被记住。

数据模型遵循「实体解耦」原则：`Symptoms` × `Nutrients` × `Relation(strength, note)`，不做一对一映射，避免单一绝对化的诊断式结论。

## 构建 / Build

推送即自动编译（GitHub Actions，见 `.github/workflows/main.yml`）：

1. `Actions` 页面等待 `Build VitaMap APK` 完成
2. 在该次运行底部 `Artifacts` 下载 `vitamap-app-debug`
3. 解压得到 `app-debug.apk`，传到手机安装（需允许安装未知来源应用）

本地没有 Gradle 也可只改前端：直接用浏览器打开
`app/src/main/assets/index.html` 即可预览界面（数据与样式都在 `assets/` 内）。

## 校验 / Validate

```bash
node tools/validate.js      # 数据完整性：ID 重复、关联指向、双语字段缺失
python tools/make_icons.py  # 从 tools/icon-src.png 重新生成各密度图标
```

当前校验结果：92 nutrients / 41 symptoms / 180 relations / 0 errors / 0 warnings。

## 目录 / Layout

```
app/src/main/assets/
  index.html
  css/app.css
  js/data-nutrients-1.js   # 维生素、矿物质、氨基酸、脂肪酸…
  js/data-nutrients-2.js   # 植物提取物、其他活性物
  js/data-symptoms.js      # 症状、分组、症状-营养素关联（含强度与说明）
  js/app.js                # 单页应用逻辑
app/src/main/java/com/vitamap/app/MainActivity.kt   # WebView 壳 + 返回键接管
```

## 免责声明 / Disclaimer

本 App 仅提供营养学方向性参考，**不构成医疗诊断或处方**。持续或严重症状、正在服用处方药、孕期哺乳期、患有慢性疾病者，请先就医。剂量与上限以产品标签及医生建议为准。

This app provides nutritional orientation only and is **not a medical diagnosis or prescription**. Seek medical advice for persistent symptoms, during pregnancy or breastfeeding, if you take prescription medication or have a chronic condition.
