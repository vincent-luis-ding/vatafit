/* VitaMap data layer — part 2 */
const NUTRIENTS_B = [
  {
    id: 'k2', zh: '维生素 K2（MK-7）', en: 'Vitamin K2 (MK-7)', db: 'Menaquinone-7', cat: 'vitamin',
    f: { zh: 'MK-7 90–180 μg', en: 'MK-7 90–180 μg' },
    r: { zh: '激活骨钙素把钙引导进骨而非血管壁，与 D3 是固定搭档', en: 'Activates osteocalcin to route calcium into bone rather than arteries; fixed partner of D3' },
    u: { zh: '无官方上限；常用 90–180 μg', en: 'No official UL; typical 90–180 μg' },
    c: { zh: '华法林等抗凝药者禁用或需医生严格监测；不能替代抗凝治疗', en: 'Contraindicated or strictly monitored on warfarin; never replaces anticoagulation' },
    syn: ['vitd3', 'calcium', 'magnesium']
  },
  {
    id: 'boron', zh: '硼', en: 'Boron', db: 'Boron', cat: 'mineral',
    f: { zh: '甘氨酸硼 3 mg', en: 'Boron glycinate 3 mg' },
    r: { zh: '延长维 D 与钙的保留、影响骨代谢与游离睾酮', en: 'Extends vitamin D and calcium retention; affects bone metabolism and free testosterone' },
    u: { zh: '≤20 mg/日（IOM UL，成人）', en: '≤20 mg/day (IOM UL, adults)' },
    c: { zh: '高剂量有生殖毒性动物数据；孕期避免；可轻度升高雌二醇', en: 'High doses show reproductive toxicity in animals; avoid in pregnancy; mildly raises estradiol' },
    syn: ['calcium', 'vitd3', 'magnesium']
  },
  {
    id: 'strontium', zh: '锶', en: 'Strontium', db: 'Strontium citrate / ranelate', cat: 'mineral',
    f: { zh: '柠檬酸锶（膳食补充）；雷奈酸锶为处方药', en: 'Strontium citrate (supplement); strontium ranelate is prescription-only' },
    r: { zh: '同时促进成骨与抑制破骨，骨密度研究证据较强', en: 'Stimulates bone formation and inhibits resorption; strong bone-density evidence' },
    u: { zh: '≤680 mg/日元素锶；不建议自行长期使用', en: '≤680 mg/day elemental strontium; not advised for unsupervised long-term use' },
    c: { zh: '必须与钙间隔 2 小时以上；干扰骨密度 DXA 读数；静脉血栓风险（雷奈酸锶）', en: 'Separate from calcium by 2h; skews DXA readings; venous thrombosis risk with ranelate' },
    syn: ['calcium', 'vitd3']
  },
  {
    id: 'bcaa', zh: '支链氨基酸（BCAA）', en: 'BCAA', db: 'Leucine / Isoleucine / Valine', cat: 'amino',
    f: { zh: '亮氨酸:异亮氨酸:缬氨酸 = 2:1:1，5–10 g', en: 'Leucine:isoleucine:valine 2:1:1, 5–10 g' },
    r: { zh: '亮氨酸激活 mTOR 启动肌肉蛋白合成，减少运动性肌损伤', en: 'Leucine triggers mTOR-driven muscle protein synthesis and reduces exercise-induced damage' },
    u: { zh: '≤20 g/日', en: '≤20 g/day' },
    c: { zh: '单独 BCAA 缺乏完全氨基酸谱，长期替代蛋白不理想；枫糖尿症者禁用', en: 'BCAA alone lacks a complete amino profile; avoid as a protein substitute long term; contraindicated in maple syrup urine disease' },
    syn: ['whey', 'creatine', 'glutamine']
  },
  {
    id: 'whey', zh: '乳清蛋白肽', en: 'Whey Protein', db: 'Whey protein isolate/hydrolysate', cat: 'protein',
    f: { zh: '分离乳清（低乳糖）或水解乳清 20–30 g', en: 'Whey isolate (low lactose) or hydrolysate 20–30 g' },
    r: { zh: '完整必需氨基酸谱 + 高亮氨酸，恢复糖原与肌肉修复', en: 'Complete essential amino acid profile with high leucine; restores glycogen and muscle repair' },
    u: { zh: '按蛋白需求 1.2–2.0 g/kg 体重总量计', en: 'Count toward total protein of 1.2–2.0 g/kg body weight' },
    c: { zh: '牛奶蛋白过敏者禁用；肾功能不全者需限蛋白；部分产品含重金属需选第三方检测', en: 'Contraindicated in milk protein allergy; protein restriction in renal impairment; choose third-party tested brands' },
    syn: ['bcaa', 'creatine', 'glutamine']
  },
  {
    id: 'taurine', zh: '牛磺酸', en: 'Taurine', db: 'Taurine', cat: 'amino',
    f: { zh: '牛磺酸 1–3 g', en: 'Taurine 1–3 g' },
    r: { zh: '调节心肌与神经细胞钙稳态、缓冲氧化应激、结合胆汁酸', en: 'Regulates calcium handling in heart and nerve cells, buffers oxidative stress, conjugates bile acids' },
    u: { zh: '≤3 g/日（EFSA 补充剂）', en: '≤3 g/day (EFSA, supplemental)' },
    c: { zh: '与锂盐合用可能降低锂排泄；能量饮料中与咖啡因叠加加重心悸', en: 'May reduce lithium clearance; in energy drinks, stacks with caffeine to worsen palpitations' },
    syn: ['magnesium', 'coq10', 'potassium']
  },
  {
    id: 'glucosamine', zh: '氨基葡萄糖（葡萄糖胺）', en: 'Glucosamine', db: 'Glucosamine sulfate', cat: 'other',
    f: { zh: '硫酸氨基葡萄糖 1500 mg（分次随餐）', en: 'Glucosamine sulfate 1500 mg divided with meals' },
    r: { zh: '关节软骨糖胺聚糖与滑液基质合成底物', en: 'Substrate for cartilage glycosaminoglycans and synovial matrix' },
    u: { zh: '≤1500 mg/日', en: '≤1500 mg/day' },
    c: { zh: '甲壳类过敏者慎用（虾蟹壳来源）；可能轻度影响血糖与 INR', en: 'Caution with shellfish allergy (shell-derived); may mildly affect glucose and INR' },
    syn: ['chondroitin', 'msm', 'collagen2']
  },
  {
    id: 'chondroitin', zh: '硫酸软骨素', en: 'Chondroitin Sulfate', db: 'Chondroitin sulfate', cat: 'other',
    f: { zh: '硫酸软骨素 800–1200 mg', en: 'Chondroitin sulfate 800–1200 mg' },
    r: { zh: '抑制软骨降解酶、保留关节水分与弹性', en: 'Inhibits cartilage-degrading enzymes; retains joint water and elasticity' },
    u: { zh: '≤1200 mg/日', en: '≤1200 mg/day' },
    c: { zh: '与抗凝药可能叠加出血；牛源制品需注意来源', en: 'Possible bleeding stacking with anticoagulants; check bovine source' },
    syn: ['glucosamine', 'msm', 'curcumin']
  },
  {
    id: 'collagen2', zh: 'II 型胶原蛋白（UC-II）', en: 'Type II Collagen (UC-II)', db: 'Undenatured type II collagen', cat: 'protein',
    f: { zh: '未变性 II 型胶原 40 mg 睡前空腹', en: 'Undenatured type II collagen 40 mg at bedtime, empty stomach' },
    r: { zh: '口服耐受机制调节关节局部免疫反应', en: 'Oral tolerance mechanism that modulates local joint immune response' },
    u: { zh: '≤40 mg/日（未变性型）', en: '≤40 mg/day (undenatured form)' },
    c: { zh: '禽类来源，蛋/鸡肉过敏者慎用；与免疫抑制剂合用证据不足', en: 'Avian source, caution with egg or chicken allergy; insufficient data with immunosuppressants' },
    syn: ['glucosamine', 'curcumin', 'msm']
  },
  {
    id: 'curcumin', zh: '姜黄素', en: 'Curcumin', db: 'Curcuminoids', cat: 'botanical',
    f: { zh: '高纯度姜黄素 + 胡椒碱或磷脂载体，500–1000 mg', en: 'High-purity curcumin with piperine or phospholipid carrier, 500–1000 mg' },
    r: { zh: '抑制 NF-κB、COX-2 与 NLRP3 炎症小体，缓解关节炎症', en: 'Inhibits NF-κB, COX-2 and the NLRP3 inflammasome; relieves joint inflammation' },
    u: { zh: '≤8 g/日（未改良吸收）；改良型按产品标示', en: '≤8 g/day for plain curcumin; enhanced-absorption forms per label' },
    c: { zh: '抗凝药/抗血小板药叠加出血；胆结石与胆管梗阻者慎用；可升高肝酶个案', en: 'Bleeding stacking with anticoagulants/antiplatelets; caution in gallstones or bile duct obstruction; rare liver enzyme elevation' },
    syn: ['omega3', 'chondroitin', 'msm']
  },
  {
    id: 'lutein', zh: '叶黄素', en: 'Lutein', db: 'Lutein', cat: 'botanical',
    f: { zh: '游离叶黄素 10–20 mg，随脂肪餐', en: 'Free lutein 10–20 mg with a fat-containing meal' },
    r: { zh: '沉积于黄斑区，构成抗蓝光滤镜并清除单线态氧', en: 'Deposits in the macula as a blue-light filter and singlet oxygen scavenger' },
    u: { zh: '≤20 mg/日（EFSA 可接受摄入量）', en: '≤20 mg/day (EFSA acceptable intake)' },
    c: { zh: '高剂量长期使用可使皮肤轻度黄染；吸烟者不建议单独大剂量 β-胡萝卜素复配', en: 'Long high-dose use may mildly yellow the skin; smokers should avoid high-dose beta-carotene pairings' },
    syn: ['zeaxanthin', 'dha', 'astaxanthin']
  },
  {
    id: 'zeaxanthin', zh: '玉米黄质', en: 'Zeaxanthin', db: 'Zeaxanthin', cat: 'botanical',
    f: { zh: '玉米黄质 2–10 mg（含 meso-玉米黄质）', en: 'Zeaxanthin 2–10 mg, including meso-zeaxanthin' },
    r: { zh: '黄斑中心凹主要色素，与叶黄素按 5:1 配比', en: 'Dominant foveal pigment; typically dosed 5:1 with lutein' },
    u: { zh: '≤20 mg/日（与叶黄素合计）', en: '≤20 mg/day combined with lutein' },
    c: { zh: '安全性良好；黄斑色素密度改善需连续 3–6 个月', en: 'Good safety profile; macular pigment density needs 3–6 months of consistent use' },
    syn: ['lutein', 'dha']
  },
  {
    id: 'dha', zh: 'DHA（藻油）', en: 'DHA (Algal)', db: 'Docosahexaenoic acid', cat: 'fatty',
    f: { zh: '藻油 DHA 500–1000 mg（素食友好）', en: 'Algal DHA 500–1000 mg (vegan-friendly)' },
    r: { zh: '视网膜与神经元膜结构脂肪酸，维持泪膜脂质层', en: 'Structural fatty acid of retina and neurons; maintains the tear film lipid layer' },
    u: { zh: '≤3 g/日 EPA+DHA 合计', en: '≤3 g/day combined EPA+DHA' },
    c: { zh: '高剂量增加出血倾向；与抗凝药叠加；房颤风险信号', en: 'High doses increase bleeding tendency with anticoagulants; atrial fibrillation signal' },
    syn: ['lutein', 'omega3', 'astaxanthin']
  },
  {
    id: 'bilberry', zh: '越橘 / 花青素', en: 'Bilberry / Anthocyanins', db: 'Vaccinium myrtillus extract', cat: 'botanical',
    f: { zh: '标准含 25% 花青素的越橘提取物 80–160 mg', en: 'Bilberry extract standardized to 25% anthocyanins, 80–160 mg' },
    r: { zh: '改善眼部微循环、增强毛细血管抵抗与暗适应', en: 'Improves ocular microcirculation, capillary resistance and dark adaptation' },
    u: { zh: '≤320 mg/日（提取物）', en: '≤320 mg/day of extract' },
    c: { zh: '与抗凝药可能叠加；低血糖倾向者留意', en: 'Possible stacking with anticoagulants; watch for hypoglycemia tendency' },
    syn: ['lutein', 'vitc', 'bioflavonoids']
  },
  {
    id: 'astaxanthin', zh: '虾青素', en: 'Astaxanthin', db: 'Astaxanthin', cat: 'botanical',
    f: { zh: '虾青素 4–12 mg，随脂肪餐', en: 'Astaxanthin 4–12 mg with fat' },
    r: { zh: '强脂溶性抗氧化剂，穿过血视网膜屏障减轻光氧化损伤', en: 'Potent lipid-soluble antioxidant that crosses the blood-retina barrier to limit photo-oxidative damage' },
    u: { zh: '≤12 mg/日（EFSA 12 mg）', en: '≤12 mg/day (EFSA 12 mg)' },
    c: { zh: '虾蟹来源者过敏注意（藻源可避）；极高剂量可致皮肤橙染', en: 'Shellfish-derived forms may allergize (algal source avoids it); very high doses orange the skin' },
    syn: ['lutein', 'dha', 'vitc']
  },
  {
    id: 'ginkgo', zh: '银杏叶提取物', en: 'Ginkgo Biloba', db: 'Ginkgo biloba extract EGb 761', cat: 'botanical',
    f: { zh: 'EGb 761 标准提取物 120–240 mg', en: 'Standardized EGb 761 extract 120–240 mg' },
    r: { zh: '改善脑与内耳微循环灌注、抑制血小板活化因子', en: 'Improves cerebral and inner-ear microperfusion; inhibits platelet-activating factor' },
    u: { zh: '≤240 mg/日（提取物）', en: '≤240 mg/day of extract' },
    c: { zh: '与抗凝/抗血小板药叠加出血；术前 2 周停用；可能降低癫痫阈值；生叶有毒不可用', en: 'Bleeding stacking with anticoagulants/antiplatelets; stop 2 weeks before surgery; may lower seizure threshold; raw leaves are toxic' },
    syn: ['magnesium', 'b12', 'coq10']
  },
  {
    id: 'enzymes', zh: '消化酶复合物', en: 'Digestive Enzymes', db: 'Protease / Amylase / Lipase', cat: 'other',
    f: { zh: '蛋白酶+淀粉酶+脂肪酶+纤维素酶，随餐服用', en: 'Protease, amylase, lipase, cellulase; take with meals' },
    r: { zh: '补偿胰外分泌不足，减少腹胀与餐后不适', en: 'Compensates for exocrine pancreatic insufficiency; reduces bloating and postprandial discomfort' },
    u: { zh: '按产品活性单位标示；随餐使用', en: 'Per labeled activity units; use with meals' },
    c: { zh: '胃溃疡、急性胰腺炎发作期与食管静脉曲张者慎用；菠萝/木瓜来源过敏注意', en: 'Caution in gastric ulcer, acute pancreatitis and esophageal varices; watch pineapple/papaya allergies' },
    syn: ['betainehcl', 'probiotics']
  },
  {
    id: 'betainehcl', zh: '甜菜碱盐酸盐（Betaine HCl）', en: 'Betaine HCl', db: 'Betaine hydrochloride', cat: 'other',
    f: { zh: 'Betaine HCl 500–1000 mg 随含蛋白餐', en: 'Betaine HCl 500–1000 mg with protein meals' },
    r: { zh: '为胃酸偏低者提供盐酸，改善蛋白消化与矿物质吸收', en: 'Supplies HCl for low stomach acid; improves protein digestion and mineral absorption' },
    u: { zh: '按耐受递增，上限以不引起烧心为准', en: 'Titrate up to tolerance; ceiling is where heartburn starts' },
    c: { zh: '胃溃疡、胃炎、服用 PPI/抗酸剂者禁用；不可与 NSAIDs 或酒精同服', en: 'Contraindicated in ulcer, gastritis and on PPI/antacids; never with NSAIDs or alcohol' },
    syn: ['enzymes', 'zinc']
  },
  {
    id: 'inulin', zh: '菊粉（可溶性纤维）', en: 'Inulin', db: 'Inulin / FOS', cat: 'other',
    f: { zh: '菊粉/低聚果糖 5–10 g，逐步加量', en: 'Inulin/FOS 5–10 g, titrate up' },
    r: { zh: '选择性喂养双歧杆菌，增加短链脂肪酸与粪便体积', en: 'Selectively feeds Bifidobacteria; raises short-chain fatty acids and stool bulk' },
    u: { zh: '≤20 g/日；从 3 g 起渐进', en: '≤20 g/day; start at 3 g and titrate' },
    c: { zh: '初期胀气明显；IBS 与 FODMAP 敏感者慎用；与药物间隔 2 小时', en: 'Bloating at first; caution in IBS and FODMAP sensitivity; separate 2h from medication' },
    syn: ['probiotics', 'butyrate', 'psyllium']
  },
  {
    id: 'psyllium', zh: '洋车前子壳', en: 'Psyllium Husk', db: 'Plantago ovata husk', cat: 'other',
    f: { zh: '洋车前子壳 3–5 g，配 300 ml 水', en: 'Psyllium husk 3–5 g with 300 ml water' },
    r: { zh: '高黏度可溶性纤维，软化粪便并延缓糖吸收', en: 'High-viscosity soluble fiber; softens stool and slows glucose absorption' },
    u: { zh: '≤10 g/日；必须足量饮水', en: '≤10 g/day with generous water intake' },
    c: { zh: '饮水不足可致食管/肠道梗阻；与口服药间隔 2 小时；吞咽困难者禁用', en: 'Inadequate water risks esophageal or bowel obstruction; separate 2h from oral drugs; avoid if dysphagia' },
    syn: ['inulin', 'magnesium', 'probiotics']
  },
  {
    id: 'zinccarnosine', zh: '锌-肌肽', en: 'Zinc-Carnosine', db: 'Zinc L-carnosine', cat: 'other',
    f: { zh: '锌-肌肽 75 mg（含锌约 16 mg）', en: 'Zinc-carnosine 75 mg (about 16 mg zinc)' },
    r: { zh: '在胃黏膜局部释放锌，加速溃疡愈合与紧密连接修复', en: 'Releases zinc locally in gastric mucosa; speeds ulcer healing and tight-junction repair' },
    u: { zh: '≤150 mg/日；计入每日锌总量', en: '≤150 mg/day; counts toward total daily zinc' },
    c: { zh: '长期使用需按锌铜比例配铜；与抗生素间隔 2 小时', en: 'Long-term use needs copper pairing; separate 2h from antibiotics' },
    syn: ['zinc', 'glutamine', 'probiotics']
  },
  {
    id: 'butyrate', zh: '丁酸盐（三丁酸甘油酯）', en: 'Butyrate', db: 'Tributyrin / Sodium butyrate', cat: 'other',
    f: { zh: '三丁酸甘油酯或丁酸钠 300–600 mg', en: 'Tributyrin or sodium butyrate 300–600 mg' },
    r: { zh: '结肠上皮首选燃料，维持紧密连接与抗炎', en: 'Preferred fuel of colonocytes; maintains tight junctions and lowers inflammation' },
    u: { zh: '≤1200 mg/日', en: '≤1200 mg/day' },
    c: { zh: '钠盐型高血压者注意钠负荷；肠溶型可减少胃部不适', en: 'Sodium salt adds sodium load in hypertension; enteric form reduces gastric discomfort' },
    syn: ['probiotics', 'glutamine', 'inulin']
  },
  {
    id: 'chromium', zh: '吡啶甲酸铬', en: 'Chromium Picolinate', db: 'Chromium picolinate', cat: 'mineral',
    f: { zh: '吡啶甲酸铬 200–400 μg', en: 'Chromium picolinate 200–400 μg' },
    r: { zh: '增强胰岛素受体敏感性，改善餐后血糖曲线', en: 'Enhances insulin receptor sensitivity and smooths the postprandial glucose curve' },
    u: { zh: '≤500 μg/日（补充剂）', en: '≤500 μg/day supplemental' },
    c: { zh: '与降糖药叠加致低血糖；肾功能不全者蓄积风险；个案报告肾损伤', en: 'Hypoglycemia when stacked with antidiabetics; accumulation risk in renal impairment; rare kidney injury reports' },
    syn: ['berberine', 'inositol', 'magnesium']
  },
  {
    id: 'berberine', zh: '小檗碱（黄连素）', en: 'Berberine', db: 'Berberine HCl', cat: 'botanical',
    f: { zh: '盐酸小檗碱 500 mg，每日 2–3 次随餐', en: 'Berberine HCl 500 mg two to three times daily with meals' },
    r: { zh: '激活 AMPK、改善胰岛素抵抗与血脂', en: 'Activates AMPK; improves insulin resistance and lipids' },
    u: { zh: '≤1500 mg/日；建议周期性使用', en: '≤1500 mg/day, used cyclically' },
    c: { zh: '强效抑制 CYP3A4，与多种药物（他汀、免疫抑制剂等）相互作用；孕期禁用；可致便秘与低血糖', en: 'Potent CYP3A4 inhibitor interacting with statins and immunosuppressants; contraindicated in pregnancy; may constipate and lower glucose' },
    syn: ['chromium', 'inositol', 'cinnamon']
  },
  {
    id: 'inositol', zh: '肌醇', en: 'Inositol', db: 'Myo-inositol / D-chiro-inositol', cat: 'other',
    f: { zh: '肌醇 2–4 g（肌醇:D-手性肌醇 40:1 常用于 PCOS）', en: 'Inositol 2–4 g (40:1 myo:D-chiro ratio common in PCOS)' },
    r: { zh: '第二信使系统组成，改善胰岛素信号与卵巢功能', en: 'Second-messenger component improving insulin signaling and ovarian function' },
    u: { zh: '≤18 g/日研究内使用', en: 'Up to 18 g/day in studies' },
    c: { zh: '大剂量轻度胃肠不适；双相障碍者高剂量可能诱发躁狂（个案）', en: 'High doses cause mild GI upset; case reports of mania induction in bipolar disorder' },
    syn: ['chromium', 'berberine', 'folate']
  },
  {
    id: 'cinnamon', zh: '肉桂提取物', en: 'Cinnamon Extract', db: 'Cinnamomum cassia / verum', cat: 'botanical',
    f: { zh: '水溶性肉桂提取物 500–1000 mg（选低香豆素型）', en: 'Water-soluble cinnamon extract 500–1000 mg, low-coumarin type' },
    r: { zh: '改善胰岛素敏感性与餐后血糖，辅助脂代谢', en: 'Improves insulin sensitivity and postprandial glucose; supports lipid metabolism' },
    u: { zh: '桂皮（Cassia）香豆素 ≤0.1 mg/kg 体重/日', en: 'Cassia coumarin ≤0.1 mg/kg body weight per day' },
    c: { zh: '桂皮型香豆素具肝毒性，长期高剂量不可用；与降糖药叠加；与抗凝药冲突', en: 'Cassia coumarin is hepatotoxic; no long-term high doses; stacks with antidiabetics and anticoagulants' },
    syn: ['chromium', 'berberine', 'magnesium']
  },
  {
    id: 'silymarin', zh: '水飞蓟素', en: 'Silymarin', db: 'Silybum marianum extract', cat: 'botanical',
    f: { zh: '水飞蓟素 150–300 mg（含 silibinin）', en: 'Silymarin 150–300 mg, silibinin-standardized' },
    r: { zh: '稳定肝细胞膜、促进谷胱甘肽合成与肝内 VLDL 转运', en: 'Stabilizes hepatocyte membranes, boosts glutathione and hepatic VLDL export' },
    u: { zh: '≤600 mg/日', en: '≤600 mg/day' },
    c: { zh: '菊科植物过敏者禁用；可能影响 CYP450 与降糖药；胆管梗阻者慎用', en: 'Contraindicated in Asteraceae allergy; may affect CYP450 and antidiabetics; caution with bile duct obstruction' },
    syn: ['choline', 'nac', 'inositol']
  },
  {
    id: 'choline', zh: '胆碱', en: 'Choline', db: 'Choline bitartrate', cat: 'amino',
    f: { zh: '酒石酸氢胆碱 500–1000 mg；或磷脂酰胆碱', en: 'Choline bitartrate 500–1000 mg, or phosphatidylcholine' },
    r: { zh: '乙酰胆碱与磷脂酰胆碱前体，参与肝内脂肪转运', en: 'Precursor for acetylcholine and phosphatidylcholine; moves fat out of the liver' },
    u: { zh: '≤3500 mg/日（IOM UL）；高剂量体味呈鱼腥味', en: '≤3500 mg/day (IOM UL); high doses cause a fishy body odor' },
    c: { zh: '抑郁倾向者高剂量可能加重；三甲胺尿症者禁用', en: 'High doses may worsen low mood; contraindicated in trimethylaminuria' },
    syn: ['agpc', 'silymarin', 'b12']
  },
  {
    id: 'nac', zh: 'N-乙酰半胱氨酸（NAC）', en: 'NAC', db: 'N-acetylcysteine', cat: 'amino',
    f: { zh: 'NAC 600–1200 mg（空腹）', en: 'NAC 600–1200 mg on an empty stomach' },
    r: { zh: '谷胱甘肽前体，抗氧化、护肝与化痰', en: 'Glutathione precursor: antioxidant, liver support, mucolytic' },
    u: { zh: '≤2400 mg/日（补充剂）', en: '≤2400 mg/day supplemental' },
    c: { zh: '可能诱发支气管痉挛（哮喘）；与硝酸甘油合用致严重低血压；抗生素需间隔 2 小时', en: 'May trigger bronchospasm in asthma; severe hypotension with nitroglycerin; separate 2h from antibiotics' },
    syn: ['ala', 'silymarin', 'selenium']
  },
  {
    id: 'elderberry', zh: '接骨木莓提取物', en: 'Elderberry', db: 'Sambucus nigra extract', cat: 'botanical',
    f: { zh: '接骨木莓提取物 500–1000 mg 或糖浆', en: 'Elderberry extract 500–1000 mg or syrup' },
    r: { zh: '富含花青素，缩短上呼吸道感染病程', en: 'Anthocyanin-rich; shortens upper respiratory infection duration' },
    u: { zh: '≤1000 mg/日（提取物）', en: '≤1000 mg/day of extract' },
    c: { zh: '生果与未煮熟制品有毒（氰苷）；自身免疫病与免疫抑制剂使用者慎用', en: 'Raw or uncooked berries are toxic (cyanogenic glycosides); caution in autoimmune disease and on immunosuppressants' },
    syn: ['vitc', 'zinc', 'betaglucan']
  },
  {
    id: 'betaglucan', zh: 'β-葡聚糖', en: 'Beta-Glucan', db: 'Beta-1,3/1,6-glucan', cat: 'other',
    f: { zh: '酵母 β-葡聚糖 250–500 mg', en: 'Yeast beta-glucan 250–500 mg' },
    r: { zh: '训练先天免疫（巨噬细胞/中性粒细胞）的病原识别', en: 'Trains innate immune pathogen recognition via macrophages and neutrophils' },
    u: { zh: '≤1000 mg/日', en: '≤1000 mg/day' },
    c: { zh: '免疫抑制剂使用者与自身免疫病慎用；燕麦来源需注意麸质交叉', en: 'Caution on immunosuppressants and in autoimmune disease; oat-derived forms may carry gluten cross-contact' },
    syn: ['vitd3', 'zinc', 'probiotics']
  },
  {
    id: 'dandelion', zh: '蒲公英提取物', en: 'Dandelion Extract', db: 'Taraxacum officinale', cat: 'botanical',
    f: { zh: '蒲公英叶/根提取物 500–1000 mg', en: 'Dandelion leaf or root extract 500–1000 mg' },
    r: { zh: '温和利尿排钠，缓解水潴留；苦味促胆汁分泌', en: 'Mild natriuretic diuresis for fluid retention; bitter compounds promote bile flow' },
    u: { zh: '证据偏中等；与利尿剂同用易电解质失衡', en: 'Moderate evidence; electrolyte loss if combined with diuretics' },
    c: { zh: '菊科过敏、胆结石与胆管梗阻者禁用；与钾排泄型利尿剂、锂盐叠加', en: 'Contraindicated in Asteraceae allergy, gallstones and bile duct obstruction; stacks with potassium-wasting diuretics and lithium' },
    syn: ['potassium', 'vitb6', 'magnesium']
  },
  {
    id: 'iodine', zh: '碘', en: 'Iodine', db: 'Potassium iodide', cat: 'mineral',
    f: { zh: '碘化钾 150–220 μg', en: 'Potassium iodide 150–220 μg' },
    r: { zh: '甲状腺素 T4/T3 合成的必需原料', en: 'Essential raw material for T4/T3 synthesis' },
    u: { zh: '≤1100 μg/日（IOM UL）；>500 μg 长期可诱发甲状腺功能异常', en: '≤1100 μg/day (IOM UL); chronic >500 μg may induce thyroid dysfunction' },
    c: { zh: '桥本/Graves 等自身免疫甲状腺病需医生指导，补碘可能加重；海带等食物碘含量极高', en: 'Autoimmune thyroid disease (Hashimoto/Graves) needs medical guidance; iodine may aggravate it; seaweed is extremely high in iodine' },
    syn: ['selenium', 'tyrosine', 'iron']
  },
  {
    id: 'selenium', zh: '硒', en: 'Selenium', db: 'Selenomethionine', cat: 'mineral',
    f: { zh: '硒代蛋氨酸或硒酵母 100–200 μg', en: 'Selenomethionine or selenium yeast 100–200 μg' },
    r: { zh: '谷胱甘肽过氧化物酶与脱碘酶的核心，甲状腺激素转化必需', en: 'Core of glutathione peroxidase and deiodinases; required for thyroid hormone conversion' },
    u: { zh: '≤400 μg/日（IOM UL）；>200 μg 长期有毒性风险', en: '≤400 μg/day (IOM UL); chronic >200 μg carries toxicity risk' },
    c: { zh: '过量致脱发、指甲变形与蒜味呼吸；巴西坚果单颗含硒可达 90 μg 以上，计入总量', en: 'Excess causes hair loss, nail changes and garlic breath; a single Brazil nut can exceed 90 μg, count it' },
    syn: ['iodine', 'coq10', 'vitc']
  },
  {
    id: 'tyrosine', zh: 'L-酪氨酸', en: 'L-Tyrosine', db: 'L-Tyrosine', cat: 'amino',
    f: { zh: 'L-酪氨酸 500–1000 mg 空腹', en: 'L-tyrosine 500–1000 mg on an empty stomach' },
    r: { zh: '甲状腺素与儿茶酚胺（多巴胺/去甲肾上腺素）前体', en: 'Precursor for thyroid hormones and catecholamines (dopamine/noradrenaline)' },
    u: { zh: '≤1200 mg/日', en: '≤1200 mg/day' },
    c: { zh: '与 MAOI、甲状腺激素、左旋多巴冲突；偏头痛与高剂量咖啡因叠加加重；甲亢者禁用', en: 'Conflicts with MAOIs, thyroid hormone and levodopa; worsens migraine with high caffeine; contraindicated in hyperthyroidism' },
    syn: ['iodine', 'selenium', 'vitb6']
  },
  {
    id: 'methylfolate', zh: '甲基叶酸（5-MTHF）', en: 'Methylfolate (5-MTHF)', db: 'L-5-methyltetrahydrofolate', cat: 'vitamin',
    f: { zh: '活性 5-MTHF 400–800 μg（Quatrefolic/钙盐）', en: 'Active 5-MTHF 400–800 μg (Quatrefolic or calcium salt)' },
    r: { zh: '绕过 MTHFR 酶限速步骤的活性叶酸，直接进入甲基化循环', en: 'Active folate that bypasses the rate-limiting MTHFR step and enters the methylation cycle directly' },
    u: { zh: '≤1000 μg DFE/日', en: '≤1000 μg DFE/day' },
    c: { zh: '仍可掩盖 B12 缺乏；与甲氨蝶呤等抗叶酸药冲突；MTHFR 变异者吸收更佳', en: 'Still can mask B12 deficiency; conflicts with methotrexate-type antifolates; better absorbed with MTHFR variants' },
    syn: ['b12', 'vitb6', 'same']
  },
  {
    id: 'sawpalmetto', zh: '锯棕榈提取物', en: 'Saw Palmetto', db: 'Serenoa repens extract', cat: 'botanical',
    f: { zh: '标准含 85–95% 脂肪酸甾醇的浆果提取物 320 mg', en: 'Berry extract standardized to 85-95% fatty acids and sterols, 320 mg' },
    r: { zh: '抑制前列腺局部 5α-还原酶，缓解良性增生症状', en: 'Inhibits local prostatic 5-alpha-reductase; relieves benign hyperplasia symptoms' },
    u: { zh: '≤320 mg/日', en: '≤320 mg/day' },
    c: { zh: '会降低 PSA 读数，筛查前必须告知医生；与抗凝药可能叠加；孕期禁用', en: 'Lowers PSA readings, tell your doctor before screening; possible bleeding stacking; contraindicated in pregnancy' },
    syn: ['zinc', 'lycopene', 'selenium']
  },
  {
    id: 'lycopene', zh: '番茄红素', en: 'Lycopene', db: 'Lycopene', cat: 'botanical',
    f: { zh: '番茄红素 10–20 mg，随脂肪餐', en: 'Lycopene 10–20 mg with fat' },
    r: { zh: '前列腺与皮肤的主要类胡萝卜素抗氧化剂', en: 'Main carotenoid antioxidant for prostate and skin' },
    u: { zh: '≤75 mg/日（EFSA 可接受摄入量）', en: '≤75 mg/day (EFSA acceptable intake)' },
    c: { zh: '番茄过敏者注意；长期超高剂量可致皮肤橙黄（番茄红素血症），无害可逆', en: 'Watch tomato allergy; very high long-term doses can orange the skin (lycopenemia), harmless and reversible' },
    syn: ['zinc', 'sawpalmetto', 'lutein']
  },
  {
    id: 'nmn', zh: 'NMN / NR', en: 'NMN / NR', db: 'Nicotinamide mononucleotide', cat: 'other',
    f: { zh: 'NMN 或烟酰胺核糖 250–1000 mg，舌下或胶囊', en: 'NMN or nicotinamide riboside 250–1000 mg, sublingual or capsule' },
    r: { zh: '提升细胞内 NAD+，激活 Sirtuins 与线粒体新生', en: 'Raises intracellular NAD+ to activate sirtuins and mitochondrial biogenesis' },
    u: { zh: '≤1000 mg/日；长期人体安全性仍在研究中', en: '≤1000 mg/day; long-term human safety still under study' },
    c: { zh: '肿瘤患者与正在接受化疗者避免（可能被肿瘤利用）；痛风者注意烟酸代谢通路', en: 'Avoid in cancer and during chemotherapy (tumors may exploit it); gout patients should watch the niacin pathway' },
    syn: ['resveratrol', 'pqq', 'coq10']
  },
  {
    id: 'resveratrol', zh: '白藜芦醇', en: 'Resveratrol', db: 'trans-Resveratrol', cat: 'botanical',
    f: { zh: '反式白藜芦醇 250–500 mg，随脂肪餐', en: 'trans-Resveratrol 250–500 mg with fat' },
    r: { zh: '激活 SIRT1/AMPK，改善内皮功能与抗自由基应激', en: 'Activates SIRT1/AMPK; improves endothelial function and antioxidant defense' },
    u: { zh: '≤1000 mg/日；更高剂量肝酶升高报告', en: '≤1000 mg/day; higher doses linked to raised liver enzymes' },
    c: { zh: '与抗凝药、CYP3A4 底物药物相互作用；更年期高剂量可能加重潮热；雌激素依赖肿瘤慎用', en: 'Interacts with anticoagulants and CYP3A4 substrates; high doses may worsen hot flashes; caution in estrogen-dependent cancer' },
    syn: ['nmn', 'pterostilbene', 'quercetin']
  },
  {
    id: 'pterostilbene', zh: '紫檀芪', en: 'Pterostilbene', db: 'Pterostilbene', cat: 'botanical',
    f: { zh: '紫檀芪 50–150 mg', en: 'Pterostilbene 50–150 mg' },
    r: { zh: '白藜芦醇的甲基化衍生物，口服生物利用度更高，同样激活 SIRT1', en: 'Methylated resveratrol analog with better oral bioavailability; also activates SIRT1' },
    u: { zh: '≤300 mg/日；长期数据有限', en: '≤300 mg/day; long-term data limited' },
    c: { zh: '与 CYP450 底物药物可能相互作用；降脂药叠加；孕期避免', en: 'Possible CYP450 drug interactions; stacks with lipid-lowering drugs; avoid in pregnancy' },
    syn: ['resveratrol', 'nmn']
  },
  {
    id: 'astragaloside', zh: '黄芪甲苷', en: 'Astragaloside IV', db: 'Astragaloside IV', cat: 'botanical',
    f: { zh: '黄芪提取物（含黄芪甲苷）500–1000 mg', en: 'Astragalus extract standardized for astragaloside IV, 500–1000 mg' },
    r: { zh: '端粒酶激活与免疫调节的研究热点成分', en: 'Research-stage telomerase activation and immune modulation' },
    u: { zh: '人体长期数据有限', en: 'Limited long-term human data' },
    c: { zh: '自身免疫病与免疫抑制剂使用者慎用；与抗凝药可能叠加；孕期避免', en: 'Caution in autoimmune disease and on immunosuppressants; possible bleeding stacking; avoid in pregnancy' },
    syn: ['resveratrol', 'betaglucan']
  },
  {
    id: 'quercetin', zh: '槲皮素', en: 'Quercetin', db: 'Quercetin', cat: 'botanical',
    f: { zh: '槲皮素 500–1000 mg（含菠萝蛋白酶助吸收）', en: 'Quercetin 500–1000 mg, with bromelain for absorption' },
    r: { zh: 'Senolytic 清除衰老细胞、稳定肥大细胞、抑制 SASP 炎症表型', en: 'Senolytic that clears senescent cells, stabilizes mast cells and suppresses the SASP phenotype' },
    u: { zh: '≤1000 mg/日', en: '≤1000 mg/day' },
    c: { zh: '抑制 CYP3A4 与 P-gp，影响多种药物；与抗凝药叠加；肾病患者慎用', en: 'Inhibits CYP3A4 and P-gp, affecting many drugs; bleeding stacking; caution in kidney disease' },
    syn: ['fisetin', 'apigenin', 'vitc']
  },
  {
    id: 'fisetin', zh: '非瑟酮', en: 'Fisetin', db: 'Fisetin', cat: 'botanical',
    f: { zh: '非瑟酮 100–500 mg，间歇性使用（如每月数日）', en: 'Fisetin 100–500 mg, used intermittently (e.g. a few days monthly)' },
    r: { zh: '研究中最强效的天然 Senolytic 之一，靶向清除衰老细胞', en: 'One of the most potent natural senolytics; targets senescent cell clearance' },
    u: { zh: '≤500 mg/日；长期安全性未确立', en: '≤500 mg/day; long-term safety not established' },
    c: { zh: '抑制多种 CYP 酶；与抗凝药叠加；高剂量动物数据提示胚胎毒性，孕期避免', en: 'Inhibits several CYP enzymes; bleeding stacking; high-dose animal data suggest embryotoxicity, avoid in pregnancy' },
    syn: ['quercetin', 'apigenin', 'spermidine']
  },
  {
    id: 'apigenin', zh: '芹菜素', en: 'Apigenin', db: 'Apigenin', cat: 'botanical',
    f: { zh: '芹菜素 50–200 mg 睡前', en: 'Apigenin 50–200 mg at bedtime' },
    r: { zh: '温和的 CDK 抑制与 GABA-A 调节，兼具 Senolytic 与助眠作用', en: 'Mild CDK inhibition and GABA-A modulation; both senolytic and sleep-supportive' },
    u: { zh: '≤300 mg/日', en: '≤300 mg/day' },
    c: { zh: '与镇静药叠加嗜睡；抑制 CYP 酶；孕期数据不足', en: 'Adds to sedative drowsiness; CYP inhibition; insufficient pregnancy data' },
    syn: ['quercetin', 'fisetin', 'melatonin']
  },
  {
    id: 'carnosine', zh: '肌肽（L-Carnosine）', en: 'L-Carnosine', db: 'Beta-alanyl-L-histidine', cat: 'amino',
    f: { zh: '肌肽 500–1000 mg；或 β-丙氨酸提高肌肉肌肽', en: 'Carnosine 500–1000 mg, or beta-alanine to raise muscle carnosine' },
    r: { zh: '抗糖基化（阻断 AGEs 交联）与缓冲细胞内 pH', en: 'Anti-glycation (blocks AGE cross-links) and intracellular pH buffering' },
    u: { zh: '≤2000 mg/日', en: '≤2000 mg/day' },
    c: { zh: 'β-丙氨酸可致皮肤刺痛感（无害）；肾功能不全者需谨慎', en: 'Beta-alanine causes harmless skin tingling; caution in renal impairment' },
    syn: ['benfotiamine', 'ala']
  },
  {
    id: 'benfotiamine', zh: '苯磷硫胺', en: 'Benfotiamine', db: 'Benfotiamine', cat: 'vitamin',
    f: { zh: '苯磷硫胺 150–300 mg', en: 'Benfotiamine 150–300 mg' },
    r: { zh: '脂溶性 B1，激活转酮醇酶阻断糖基化三条通路', en: 'Fat-soluble thiamine that activates transketolase to block three glycation pathways' },
    u: { zh: '≤600 mg/日', en: '≤600 mg/day' },
    c: { zh: '高剂量可能影响甲状腺功能检测；与降糖药叠加低血糖个案', en: 'High doses may affect thyroid function tests; rare hypoglycemia with antidiabetics' },
    syn: ['carnosine', 'b1', 'ala']
  },
  {
    id: 'spermidine', zh: '亚精胺', en: 'Spermidine', db: 'Spermidine', cat: 'other',
    f: { zh: '亚精胺 1–6 mg（小麦胚芽提取物）', en: 'Spermidine 1–6 mg from wheat germ extract' },
    r: { zh: '诱导自噬（Autophagy），改善线粒体功能与免疫衰老', en: 'Induces autophagy; improves mitochondrial function and immune aging' },
    u: { zh: '≤6 mg/日；高剂量可致胃肠不适', en: '≤6 mg/day; high doses cause GI upset' },
    c: { zh: '可能促进肿瘤细胞增殖（动物研究有争议）；肿瘤患者避免高剂量；麸质来源注意', en: 'May promote tumor cell proliferation in animal studies (contested); avoid high doses in cancer; wheat germ carries gluten' },
    syn: ['fisetin', 'nmn', 'resveratrol']
  },
  {
    id: 'bioflavonoids', zh: '柑橘类黄酮 / 芦丁', en: 'Bioflavonoids / Rutin', db: 'Rutin / Hesperidin', cat: 'botanical',
    f: { zh: '芦丁 + 橙皮苷复合 500–1000 mg', en: 'Rutin plus hesperidin complex 500–1000 mg' },
    r: { zh: '强化毛细血管、降低血管脆性与通透性', en: 'Strengthens capillaries and reduces vessel fragility and permeability' },
    u: { zh: '≤1000 mg/日', en: '≤1000 mg/day' },
    c: { zh: '与抗凝药可能叠加；柑橘/芸香科过敏注意；抑制部分 CYP 酶', en: 'Possible bleeding stacking; watch citrus/Rutaceae allergy; some CYP inhibition' },
    syn: ['vitc', 'bilberry', 'vitk']
  },
  {
    id: 'potassium', zh: '钾', en: 'Potassium', db: 'Potassium citrate / chloride', cat: 'mineral',
    f: { zh: '柠檬酸钾（优先食物补钾：蔬果、豆类）', en: 'Potassium citrate; food sources (vegetables, legumes) preferred' },
    r: { zh: '维持细胞内外渗透压与心肌动作电位极化', en: 'Maintains osmotic balance across membranes and cardiac action potential repolarization' },
    u: { zh: '补充剂多限制在 ≤99 mg/片；总量按 3400–4700 mg/日食物计', en: 'Supplement tablets usually limited to ≤99 mg; total intake target 3400-4700 mg/day from food' },
    c: { zh: '肾功能不全、ACEI/ARB、保钾利尿剂与醛固酮拮抗剂者禁用高钾；必须监测血钾', en: 'Contraindicated in renal impairment and on ACEI/ARB, potassium-sparing diuretics or aldosterone blockers; monitor serum potassium' },
    syn: ['magnesium', 'calcium', 'taurine']
  },
  {
    id: 'creatine', zh: '肌酸', en: 'Creatine', db: 'Creatine monohydrate', cat: 'amino',
    f: { zh: '一水肌酸 3–5 g/日，无需冲击期', en: 'Creatine monohydrate 3-5 g/day, no loading phase needed' },
    r: { zh: '磷酸肌酸补充 ATP 池，改善力量、肌肉量与认知疲劳', en: 'Phosphocreatine replenishes the ATP pool; improves strength, muscle mass and cognitive fatigue' },
    u: { zh: '≤10 g/日（分次）', en: '≤10 g/day in divided doses' },
    c: { zh: '肾功能不全者禁用；初期体重上升为水分；需保证饮水', en: 'Contraindicated in renal impairment; initial weight gain is water; keep hydrated' },
    syn: ['whey', 'bcaa', 'taurine']
  },
  {
    id: 'carnitine', zh: '左旋肉碱', en: 'L-Carnitine', db: 'L-Carnitine / ALCAR', cat: 'amino',
    f: { zh: '酒石酸左旋肉碱 1–2 g；或乙酰左旋肉碱（脑型）', en: 'L-carnitine tartrate 1-2 g; acetyl-L-carnitine for brain effects' },
    r: { zh: '把长链脂肪酸运入线粒体氧化，支持肌肉能量与耐力', en: 'Carries long-chain fatty acids into mitochondria; supports muscle energy and endurance' },
    u: { zh: '≤3 g/日', en: '≤3 g/day' },
    c: { zh: '可升高 TMAO（心血管风险标志）；癫痫与双相障碍者慎用；与甲状腺药（左甲状腺素）干扰', en: 'Raises TMAO, a cardiovascular risk marker; caution in seizures and bipolar disorder; interferes with levothyroxine' },
    syn: ['coq10', 'bcaa', 'ala']
  }
];
