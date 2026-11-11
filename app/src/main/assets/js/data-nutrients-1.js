/* VitaMap data layer — part 1
 * Schema mirrors the relational model: Symptoms, Nutrients, Symptom_Nutrient_Relation.
 * Each nutrient carries safety metadata (upper limit + contraindications) so the UI can
 * always show a warning next to a suggestion instead of a bare recommendation.
 */
const NUTRIENTS_A = [
  {
    id: 'magnesium', zh: '镁', en: 'Magnesium', db: 'Magnesium', cat: 'mineral',
    f: { zh: '甘氨酸镁、苏糖酸镁、柠檬酸镁、苹果酸镁', en: 'Glycinate, L-threonate, citrate, malate' },
    r: { zh: '300 多种酶的辅因子，调控神经肌肉兴奋性与能量代谢', en: 'Cofactor for 300+ enzymes; regulates neuromuscular excitability and energy metabolism' },
    u: { zh: '补充剂来源 ≤350 mg/日（EFSA 成人）；过量以腹泻为信号', en: 'Supplemental ≤350 mg/day (EFSA, adults); diarrhea is the excess signal' },
    c: { zh: '肾功能不全者禁用；与四环素/喹诺酮类抗生素间隔 2 小时', en: 'Contraindicated in renal impairment; separate 2h from tetracycline/quinolone antibiotics' },
    syn: ['vitb6', 'potassium']
  },
  {
    id: 'vitb6', zh: '维生素 B6', en: 'Vitamin B6', db: 'Pyridoxine / P5P', cat: 'vitamin',
    f: { zh: '盐酸吡哆醇、活性 P5P', en: 'Pyridoxine HCl, active P5P' },
    r: { zh: '色氨酸→5-HTP→褪黑素、以及同型半胱氨酸代谢的必需辅酶', en: 'Essential coenzyme for tryptophan→5-HTP→melatonin and homocysteine clearance' },
    u: { zh: '≤100 mg/日（IOM）；长期 >100 mg 有周围神经病变风险', en: '≤100 mg/day (IOM); chronic >100 mg carries peripheral neuropathy risk' },
    c: { zh: '左旋多巴（未配伍卡比多巴）会降低药效；孕期高剂量证据不足', en: 'Reduces levodopa efficacy without carbidopa; high-dose evidence in pregnancy is limited' },
    syn: ['magnesium', 'b12', 'folate']
  },
  {
    id: 'melatonin', zh: '褪黑素', en: 'Melatonin', db: 'Melatonin', cat: 'other',
    f: { zh: '即释 0.5–3 mg、缓释型', en: 'Immediate release 0.5–3 mg, sustained release' },
    r: { zh: '调节昼夜节律与入睡时点，小剂量往往比大剂量更有效', en: 'Sets circadian phase and sleep onset; lower doses often work better than high ones' },
    u: { zh: '自行使用 ≤3 mg/日；更高剂量需医生指导', en: 'Self-use ≤3 mg/day; higher doses need medical guidance' },
    c: { zh: '与镇静催眠药、酒精叠加抑制；自身免疫病、孕期慎用；服药后勿驾驶', en: 'Stacks with sedatives and alcohol; caution in autoimmune disease and pregnancy; do not drive after use' },
    syn: ['vitb6', 'magnesium']
  },
  {
    id: 'gaba', zh: 'GABA（γ-氨基丁酸）', en: 'GABA', db: 'Gamma-aminobutyric acid', cat: 'amino',
    f: { zh: '游离型 GABA 100–300 mg', en: 'Free-form GABA 100–300 mg' },
    r: { zh: '抑制性神经递质，降低交感张力与入睡潜伏期', en: 'Inhibitory neurotransmitter; lowers sympathetic tone and sleep latency' },
    u: { zh: '无官方上限；口服吸收有限，多数研究用 ≤300 mg', en: 'No official UL; oral absorption is limited, most studies use ≤300 mg' },
    c: { zh: '与降压药、镇静药可能叠加；证据等级偏中等', en: 'Possible stacking with antihypertensives and sedatives; evidence is moderate' },
    syn: ['theanine', 'glycine']
  },
  {
    id: 'glycine', zh: '甘氨酸', en: 'Glycine', db: 'Glycine', cat: 'amino',
    f: { zh: '游离甘氨酸粉 3 g 睡前', en: 'Free glycine powder 3 g at bedtime' },
    r: { zh: '抑制性氨基酸，降低核心体温促进入睡；胶原与谷胱甘肽原料', en: 'Inhibitory amino acid that lowers core temperature at sleep onset; collagen and glutathione substrate' },
    u: { zh: '≤15 g/日通常耐受良好', en: 'Up to 15 g/day is generally well tolerated' },
    c: { zh: '大剂量可致胃部不适；与抗精神病药合用需谨慎', en: 'High doses may cause gastric upset; caution with antipsychotics' },
    syn: ['gaba', 'magnesium']
  },
  {
    id: 'theanine', zh: 'L-茶氨酸', en: 'L-Theanine', db: 'L-Theanine', cat: 'amino',
    f: { zh: 'L-茶氨酸 100–200 mg', en: 'L-theanine 100–200 mg' },
    r: { zh: '提升 α 波、放松而不嗜睡，缓冲咖啡因的紧张感', en: 'Raises alpha waves: calm without sedation, buffers caffeine jitter' },
    u: { zh: '≤1200 mg/日研究剂量内耐受良好', en: 'Well tolerated up to 1200 mg/day in studies' },
    c: { zh: '与降压药可能叠加降血压；孕期数据有限', en: 'May add to antihypertensive effect; limited pregnancy data' },
    syn: ['gaba', 'magnesium']
  },
  {
    id: 'rhodiola', zh: '红景天提取物', en: 'Rhodiola rosea', db: 'Rhodiola rosea extract', cat: 'botanical',
    f: { zh: '标准含 3% 红景天苷 / 1% 酪醇', en: 'Standardized 3% rosavins / 1% salidroside' },
    r: { zh: '适应原，改善疲劳与压力下的皮质醇反应', en: 'Adaptogen; improves fatigue resistance and cortisol response under stress' },
    u: { zh: '200–600 mg/日（提取物）', en: '200–600 mg/day of extract' },
    c: { zh: '可能升高血压与心率，高血压者慎用；与抗抑郁药可能叠加', en: 'May raise BP and heart rate; caution in hypertension; possible stacking with antidepressants' },
    syn: ['ashwagandha', 'b5']
  },
  {
    id: 'ashwagandha', zh: '南非醉茄', en: 'Ashwagandha', db: 'Withania somnifera (KSM-66)', cat: 'botanical',
    f: { zh: 'KSM-66 / Sensoril 根提取物 300–600 mg', en: 'KSM-66 or Sensoril root extract 300–600 mg' },
    r: { zh: '降低皮质醇与焦虑评分，改善睡眠质量', en: 'Lowers cortisol and anxiety scores; improves sleep quality' },
    u: { zh: '≤600 mg/日（提取物），建议周期性使用', en: '≤600 mg/day of extract, used cyclically' },
    c: { zh: '孕期/哺乳期禁用；可能刺激甲状腺；有肝损伤个案报告；与镇静药叠加', en: 'Avoid in pregnancy and lactation; may stimulate thyroid; rare liver injury reports; stacks with sedatives' },
    syn: ['rhodiola', 'magnesium']
  },
  {
    id: 'vitd3', zh: '维生素 D3', en: 'Vitamin D3', db: 'Cholecalciferol', cat: 'vitamin',
    f: { zh: '胆钙化醇 D3，随脂肪餐服用', en: 'Cholecalciferol, taken with a fat-containing meal' },
    r: { zh: '免疫调节、钙磷吸收、情绪与肌肉功能的核心激素前体', en: 'Core hormone precursor for immunity, calcium-phosphorus absorption, mood and muscle function' },
    u: { zh: '≤4000 IU/日（100 μg，成人 UL）；血 25(OH)D 应定期监测', en: '≤4000 IU/day (100 μg adult UL); monitor serum 25(OH)D' },
    c: { zh: '高钙血症、肉芽肿性疾病（结节病等）慎用；需与 K2 协同', en: 'Caution in hypercalcemia and granulomatous disease (sarcoidosis); pair with K2' },
    syn: ['k2', 'magnesium', 'calcium']
  },
  {
    id: 'same', zh: 'SAMe（S-腺苷蛋氨酸）', en: 'SAMe', db: 'S-Adenosyl methionine', cat: 'amino',
    f: { zh: '丁烷二磺酸腺苷蛋氨酸 200–800 mg，空腹', en: 'SAMe disulfate tosylate 200–800 mg, empty stomach' },
    r: { zh: '甲基供体，参与神经递质甲基化与情绪调节', en: 'Universal methyl donor involved in neurotransmitter methylation and mood' },
    u: { zh: '≤1600 mg/日（研究剂量）；建议医生监督', en: '≤1600 mg/day in trials; medical supervision advised' },
    c: { zh: '双相障碍可诱发躁狂；与 SSRI/MAOI 合用有血清素综合征风险；帕金森病慎用', en: 'Can trigger mania in bipolar disorder; serotonin syndrome risk with SSRI/MAOI; caution in Parkinson disease' },
    syn: ['b12', 'folate', 'methylfolate']
  },
  {
    id: 'omega3', zh: 'Omega-3（EPA/DHA）', en: 'Omega-3 (EPA/DHA)', db: 'EPA / DHA', cat: 'fatty',
    f: { zh: '高 EPA 鱼油、藻油 DHA、rTG 型吸收更佳', en: 'High-EPA fish oil, algal DHA; rTG form absorbs better' },
    r: { zh: '抑制神经炎症、构成细胞膜、参与神经递质与情绪通路', en: 'Dampens neuroinflammation, builds cell membranes, supports neurotransmitter and mood pathways' },
    u: { zh: 'EPA+DHA ≤3 g/日；更高剂量需医生指导', en: 'EPA+DHA ≤3 g/day; higher doses need medical guidance' },
    c: { zh: '>3 g/日增加出血倾向，与抗凝药叠加；有房颤风险信号；海鲜过敏者选藻油', en: 'Above 3 g/day raises bleeding risk with anticoagulants; atrial fibrillation signal reported; choose algal oil if fish-allergic' },
    syn: ['curcumin', 'vitd3']
  },
  {
    id: 'htp', zh: '5-HTP', en: '5-HTP', db: '5-Hydroxytryptophan', cat: 'amino',
    f: { zh: '5-羟色氨酸 50–100 mg，建议含脱羧酶抑制剂配方', en: '5-hydroxytryptophan 50–100 mg, ideally with a decarboxylase inhibitor' },
    r: { zh: '血清素与褪黑素的直接前体', en: 'Direct precursor to serotonin and melatonin' },
    u: { zh: '≤300 mg/日；从小剂量开始', en: '≤300 mg/day; start low' },
    c: { zh: '严禁与 SSRI/SNRI/MAOI/曲普坦类合用（血清素综合征）；可致胃肠不适', en: 'Never combine with SSRI/SNRI/MAOI/triptans (serotonin syndrome); may cause GI upset' },
    syn: ['vitb6', 'melatonin']
  },
  {
    id: 'agpc', zh: 'Alpha-GPC', en: 'Alpha-GPC', db: 'Alpha-glycerylphosphorylcholine', cat: 'amino',
    f: { zh: 'α-甘油磷酸胆碱 300–600 mg', en: 'Alpha-GPC 300–600 mg' },
    r: { zh: '高穿透性胆碱供体，提高乙酰胆碱水平', en: 'Highly bioavailable choline donor that raises acetylcholine' },
    u: { zh: '≤1200 mg/日', en: '≤1200 mg/day' },
    c: { zh: '可能引起头痛与血压轻度下降；与抗胆碱药作用相反', en: 'May cause headache and mild BP drop; opposes anticholinergic drugs' },
    syn: ['citicoline', 'ps', 'b12']
  },
  {
    id: 'citicoline', zh: 'CDP-胆碱（胞磷胆碱）', en: 'Citicoline (CDP-Choline)', db: 'Citicoline', cat: 'amino',
    f: { zh: '胞磷胆碱 250–500 mg', en: 'Citicoline 250–500 mg' },
    r: { zh: '同时提供胆碱与胞苷，支持磷脂合成与线粒体膜稳定', en: 'Supplies both choline and cytidine for phospholipid synthesis and membrane stability' },
    u: { zh: '≤2000 mg/日', en: '≤2000 mg/day' },
    c: { zh: '偶有头痛、失眠；与左旋多巴可能叠加效应', en: 'Occasional headache or insomnia; may add to levodopa effects' },
    syn: ['agpc', 'ps']
  },
  {
    id: 'ps', zh: '磷脂酰丝氨酸（PS）', en: 'Phosphatidylserine', db: 'Phosphatidylserine', cat: 'fatty',
    f: { zh: '大豆或向日葵来源磷脂酰丝氨酸 100–300 mg', en: 'Soy or sunflower-derived PS 100–300 mg' },
    r: { zh: '细胞膜磷脂，降低运动与压力下的皮质醇反应，支持记忆', en: 'Membrane phospholipid; blunts cortisol response to stress and exercise, supports memory' },
    u: { zh: '≤400 mg/日', en: '≤400 mg/day' },
    c: { zh: '大豆来源者大豆过敏需注意；与抗凝药理论叠加', en: 'Soy-derived form matters for soy allergy; theoretical stacking with anticoagulants' },
    syn: ['agpc', 'omega3']
  },
  {
    id: 'b12', zh: '维生素 B12（甲钴胺）', en: 'Vitamin B12 (Methylcobalamin)', db: 'Methylcobalamin', cat: 'vitamin',
    f: { zh: '甲钴胺舌下含服或肌注', en: 'Methylcobalamin sublingual or injection' },
    r: { zh: '髓鞘合成、红细胞生成与甲基化循环的关键辅酶', en: 'Key coenzyme for myelin synthesis, red cell production and the methylation cycle' },
    u: { zh: '无官方上限；水溶性，多余排出', en: 'No official UL; water-soluble and excess is excreted' },
    c: { zh: '二甲双胍、PPI 长期使用与素食者缺乏率高；叶酸可掩盖其缺乏', en: 'High deficiency risk with metformin, long-term PPI and vegan diets; folate can mask deficiency' },
    syn: ['folate', 'methylfolate', 'vitb6']
  },
  {
    id: 'pqq', zh: 'PQQ（吡咯喹啉醌）', en: 'PQQ', db: 'Pyrroloquinoline quinone', cat: 'other',
    f: { zh: 'PQQ 10–20 mg', en: 'PQQ 10–20 mg' },
    r: { zh: '线粒体生物合成刺激剂，与 CoQ10 协同', en: 'Stimulates mitochondrial biogenesis; works with CoQ10' },
    u: { zh: '≤20 mg/日', en: '≤20 mg/day' },
    c: { zh: '长期安全性数据有限；动物研究提示高剂量影响生殖，孕期避免', en: 'Long-term safety data limited; high-dose animal data suggest reproductive effects, avoid in pregnancy' },
    syn: ['coq10', 'ala', 'nmn']
  },
  {
    id: 'b1', zh: '维生素 B1（硫胺素）', en: 'Vitamin B1 (Thiamine)', db: 'Thiamine', cat: 'vitamin',
    f: { zh: '盐酸硫胺素、苯磷硫胺（脂溶性）', en: 'Thiamine HCl; fat-soluble benfotiamine' },
    r: { zh: '糖代谢与神经传导必需；酒精、高糖饮食消耗大', en: 'Essential for glucose metabolism and nerve conduction; depleted by alcohol and high-sugar diets' },
    u: { zh: '无官方上限；水溶性', en: 'No official UL; water-soluble' },
    c: { zh: '长期酗酒者快速补充需同时补镁，否则可诱发低镁', en: 'Rapid repletion in heavy drinkers should include magnesium to avoid hypomagnesemia' },
    syn: ['vitb6', 'b12', 'ala']
  },
  {
    id: 'ala', zh: '硫辛酸（ALA）', en: 'Alpha-Lipoic Acid', db: 'Alpha-lipoic acid', cat: 'other',
    f: { zh: 'R-硫辛酸或 α-硫辛酸 300–600 mg，空腹', en: 'R-ALA or ALA 300–600 mg, empty stomach' },
    r: { zh: '万能抗氧化剂，再生维生素 C/E 与谷胱甘肽，改善神经传导', en: 'Universal antioxidant that recycles vitamin C/E and glutathione; improves nerve conduction' },
    u: { zh: '≤1200 mg/日', en: '≤1200 mg/day' },
    c: { zh: '可致低血糖（与降糖药叠加）；空腹易胃部不适；饮酒者减少吸收', en: 'Can cause hypoglycemia (stacks with antidiabetics); gastric upset on empty stomach; alcohol reduces absorption' },
    syn: ['b1', 'b12', 'coq10']
  },
  {
    id: 'b2', zh: '维生素 B2（核黄素）', en: 'Vitamin B2 (Riboflavin)', db: 'Riboflavin', cat: 'vitamin',
    f: { zh: '核黄素或核黄素-5-磷酸', en: 'Riboflavin or riboflavin-5-phosphate' },
    r: { zh: 'FAD/FMN 辅酶核心，参与线粒体呼吸与偏头痛预防', en: 'Core of FAD/FMN coenzymes: mitochondrial respiration and migraine prophylaxis' },
    u: { zh: '无官方上限；尿液变黄为正常现象', en: 'No official UL; bright yellow urine is expected' },
    c: { zh: '高剂量（400 mg）偏头痛方案需医生评估；可干扰部分比色法化验', en: '400 mg migraine protocols need medical review; may interfere with some colorimetric lab assays' },
    syn: ['coq10', 'magnesium']
  },
  {
    id: 'coq10', zh: '辅酶 Q10', en: 'Coenzyme Q10', db: 'Ubiquinone / Ubiquinol', cat: 'other',
    f: { zh: '泛醌或泛醇 100–200 mg，随脂肪餐', en: 'Ubiquinone or ubiquinol 100–200 mg with fat' },
    r: { zh: '线粒体电子传递链与心肌能量代谢的关键因子', en: 'Key factor in the mitochondrial electron transport chain and cardiac energy metabolism' },
    u: { zh: '≤1200 mg/日研究内安全；常用 ≤200 mg', en: 'Safe up to 1200 mg/day in studies; typical use ≤200 mg' },
    c: { zh: '他汀类药物会降低体内水平；与华法林结构相似可能降低抗凝效果，需监测 INR', en: 'Statins lower endogenous levels; structurally similar to warfarin and may reduce INR, monitor it' },
    syn: ['pqq', 'selenium', 'omega3']
  },
  {
    id: 'vita', zh: '维生素 A', en: 'Vitamin A', db: 'Retinol / Beta-carotene', cat: 'vitamin',
    f: { zh: '视黄醇棕榈酸酯（动物源）、β-胡萝卜素（植物源）', en: 'Retinyl palmitate (animal source), beta-carotene (plant source)' },
    r: { zh: '上皮细胞分化、黏膜屏障与视紫红质合成', en: 'Epithelial differentiation, mucosal barrier and rhodopsin synthesis' },
    u: { zh: '≤3000 μg RAE/日（IOM 成人）；孕期预成型维 A 上限更低', en: '≤3000 μg RAE/day (IOM adults); lower ceiling in pregnancy for preformed vitamin A' },
    c: { zh: '脂溶性可蓄积中毒（肝损、颅压升高）；孕期高剂量致畸；吸烟者高剂量 β-胡萝卜素增加肺癌风险', en: 'Fat-soluble accumulation causes liver damage and raised ICP; teratogenic in pregnancy; high-dose beta-carotene raises lung cancer risk in smokers' },
    syn: ['zinc', 'b2', 'vitd3']
  },
  {
    id: 'b3', zh: '维生素 B3（烟酰胺/烟酸）', en: 'Vitamin B3 (Niacinamide)', db: 'Niacin / Nicotinamide', cat: 'vitamin',
    f: { zh: '烟酰胺（不潮红）、烟酸（可潮红）', en: 'Nicotinamide (no flush), nicotinic acid (flushes)' },
    r: { zh: 'NAD+/NADP+ 前体，参与 200 多种氧化还原反应与皮脂调节', en: 'NAD+/NADP+ precursor for 200+ redox reactions and sebum regulation' },
    u: { zh: '烟酸 ≤35 mg/日（IOM UL）；烟酰胺治疗剂量需医生指导', en: 'Niacin ≤35 mg/day (IOM UL); therapeutic nicotinamide doses need medical guidance' },
    c: { zh: '烟酸大剂量潮红、肝毒性、升高血糖与尿酸；痛风者慎用', en: 'High-dose niacin: flushing, hepatotoxicity, raised glucose and uric acid; caution in gout' },
    syn: ['zinc', 'b2', 'vitb6']
  },
  {
    id: 'zinc', zh: '锌', en: 'Zinc', db: 'Zinc', cat: 'mineral',
    f: { zh: '吡啶甲酸锌、甘氨酸锌、葡萄糖酸锌', en: 'Picolinate, bisglycinate, gluconate' },
    r: { zh: '300 多种酶的辅因子：免疫、伤口愈合、味觉、皮脂与毛囊', en: 'Cofactor for 300+ enzymes: immunity, wound healing, taste, sebum and hair follicles' },
    u: { zh: '≤40 mg/日（IOM UL）；长期高剂量必须配铜', en: '≤40 mg/day (IOM UL); long high-dose use must include copper' },
    c: { zh: '空腹引起恶心；长期 >40 mg 造成继发性缺铜（贫血、神经病变）；与铁、钙、四环素竞争吸收', en: 'Nausea on empty stomach; chronic >40 mg causes copper deficiency (anemia, neuropathy); competes with iron, calcium and tetracyclines' },
    syn: ['copper', 'vitc', 'vita']
  },
  {
    id: 'biotin', zh: '生物素（B7）', en: 'Biotin (B7)', db: 'Biotin', cat: 'vitamin',
    f: { zh: '生物素 1000–5000 μg', en: 'Biotin 1000–5000 μg' },
    r: { zh: '角蛋白合成与脂肪酸代谢的羧化酶辅因子', en: 'Carboxylase cofactor for keratin synthesis and fatty acid metabolism' },
    u: { zh: '无官方上限', en: 'No official UL' },
    c: { zh: '高剂量会严重干扰甲状腺激素、肌钙蛋白等免疫检测，术前与化验前停用 3–5 天', en: 'High doses distort immunoassays for TSH and troponin; stop 3–5 days before surgery or lab tests' },
    syn: ['zinc', 'iron', 'msm']
  },
  {
    id: 'iron', zh: '铁', en: 'Iron', db: 'Ferrous bisglycinate / sulfate', cat: 'mineral',
    f: { zh: '甘氨酸亚铁（温和）、硫酸亚铁、羰基铁', en: 'Ferrous bisglycinate (gentle), sulfate, carbonyl iron' },
    r: { zh: '血红蛋白与肌红蛋白合成，氧运输与细胞能量', en: 'Hemoglobin and myoglobin synthesis, oxygen transport and cellular energy' },
    u: { zh: '≤45 mg/日（IOM UL，补充剂来源）', en: '≤45 mg/day (IOM UL, supplemental)' },
    c: { zh: '无明确缺铁证据不应补铁；过量致氧化应激与铁蓄积；与钙、锌、茶/咖啡、PPI 冲突；可致便秘', en: 'Do not supplement without evidence of deficiency; excess causes oxidative stress and overload; conflicts with calcium, zinc, tea/coffee, PPIs; may constipate' },
    syn: ['vitc', 'b12', 'folate']
  },
  {
    id: 'collagen', zh: '胶原蛋白肽', en: 'Collagen Peptides', db: 'Hydrolyzed collagen peptides', cat: 'protein',
    f: { zh: 'I/III 型水解胶原肽 5–10 g，配维生素 C', en: 'Hydrolyzed type I/III peptides 5–10 g with vitamin C' },
    r: { zh: '提供羟脯氨酸/甘氨酸底物，支持皮肤弹性、毛发与指甲角蛋白', en: 'Supplies hydroxyproline and glycine for skin elasticity, hair and nail keratin' },
    u: { zh: '≤15 g/日', en: '≤15 g/day' },
    c: { zh: '鱼类/牛源过敏者注意来源；肾功能不全者需控制蛋白总量', en: 'Check the fish or bovine source for allergy; limit total protein in renal impairment' },
    syn: ['vitc', 'silicon', 'biotin']
  },
  {
    id: 'copper', zh: '铜', en: 'Copper', db: 'Copper', cat: 'mineral',
    f: { zh: '甘氨酸铜、葡萄糖酸铜 1–2 mg', en: 'Copper bisglycinate or gluconate 1–2 mg' },
    r: { zh: '酪氨酸酶（黑色素）、铜锌超氧化物歧化酶与铁转运的辅因子', en: 'Cofactor for tyrosinase (melanin), Cu/Zn-SOD and iron transport' },
    u: { zh: '≤10 mg/日（IOM UL）', en: '≤10 mg/day (IOM UL)' },
    c: { zh: '与锌严格拮抗：每补 15–30 mg 锌应配 1–2 mg 铜；铜过量致肝损伤（Wilson 病者禁用）', en: 'Strictly antagonistic to zinc: pair 1–2 mg copper per 15–30 mg zinc; excess causes liver injury (avoid in Wilson disease)' },
    syn: ['zinc', 'iron']
  },
  {
    id: 'b5', zh: '泛酸（B5）', en: 'Pantothenic Acid (B5)', db: 'Pantothenic acid', cat: 'vitamin',
    f: { zh: '泛酸钙、泛醇', en: 'Calcium pantothenate, panthenol' },
    r: { zh: '辅酶 A 与酰基载体蛋白的组成，参与角蛋白与黑色素代谢', en: 'Building block of coenzyme A and acyl carrier protein; supports keratin and melanin metabolism' },
    u: { zh: '无官方上限；高剂量可致轻度腹泻', en: 'No official UL; high doses may cause mild diarrhea' },
    c: { zh: '大剂量可能延长出血时间，与抗凝药同用需留意', en: 'High doses may prolong bleeding time; watch with anticoagulants' },
    syn: ['biotin', 'copper', 'b12']
  },
  {
    id: 'paba', zh: 'PABA（对氨基苯甲酸）', en: 'PABA', db: 'Para-aminobenzoic acid', cat: 'other',
    f: { zh: 'PABA 100–500 mg（常与 B 族复配）', en: 'PABA 100–500 mg, often in B-complex' },
    r: { zh: '叶酸合成中间体，传统上用于白发与皮肤色素', en: 'Intermediate in folate synthesis; traditionally used for grey hair and pigmentation' },
    u: { zh: '证据有限，不建议长期大剂量', en: 'Limited evidence; avoid long-term high doses' },
    c: { zh: '可能引起皮疹与肝损伤个案；磺胺类药物拮抗；孕期避免', en: 'Rash and rare liver injury reported; antagonizes sulfonamides; avoid in pregnancy' },
    syn: ['copper', 'biotin']
  },
  {
    id: 'calcium', zh: '钙', en: 'Calcium', db: 'Calcium citrate / carbonate', cat: 'mineral',
    f: { zh: '柠檬酸钙（不依赖胃酸）、碳酸钙（需随餐）', en: 'Citrate (acid-independent), carbonate (needs a meal)' },
    r: { zh: '骨基质矿化、神经肌肉兴奋性与凝血级联', en: 'Bone matrix mineralization, neuromuscular excitability and the clotting cascade' },
    u: { zh: '≤2500 mg/日（IOM UL，含食物）', en: '≤2500 mg/day (IOM UL, diet plus supplement)' },
    c: { zh: '单次吸收上限约 500 mg，需分次；与铁、锌、左甲状腺素间隔 2–4 小时；肾结石者慎用', en: 'Absorption caps near 500 mg per dose, so split doses; separate 2–4h from iron, zinc and levothyroxine; caution with kidney stones' },
    syn: ['vitd3', 'k2', 'magnesium']
  },
  {
    id: 'msm', zh: 'MSM（有机硫）', en: 'MSM', db: 'Methylsulfonylmethane', cat: 'other',
    f: { zh: 'MSM 1–3 g', en: 'MSM 1–3 g' },
    r: { zh: '提供甲基与硫，支持角蛋白二硫键、关节软骨与谷胱甘肽', en: 'Methyl and sulfur donor supporting keratin disulfide bonds, cartilage and glutathione' },
    u: { zh: '≤6 g/日研究内耐受良好', en: 'Well tolerated up to 6 g/day in studies' },
    c: { zh: '可致轻度胃肠不适与头痛；长期安全性数据有限', en: 'Mild GI upset and headache possible; long-term safety data limited' },
    syn: ['glucosamine', 'chondroitin', 'vitc']
  },
  {
    id: 'silicon', zh: '硅（二氧化硅/正硅酸）', en: 'Silicon', db: 'Silicon dioxide / orthosilicic acid', cat: 'mineral',
    f: { zh: '正硅酸（胆碱稳定型）5–10 mg', en: 'Orthosilicic acid (choline-stabilized) 5–10 mg' },
    r: { zh: '胶原交联与骨基质形成的微量元素', en: 'Trace element for collagen cross-linking and bone matrix formation' },
    u: { zh: '≤700 mg/日（食物来源总量）；补充剂常见 ≤10 mg', en: '≤700 mg/day total from food; supplements typically ≤10 mg' },
    c: { zh: '证据等级偏中等；长期高剂量安全性未确立', en: 'Moderate evidence; long-term high-dose safety not established' },
    syn: ['collagen', 'calcium']
  },
  {
    id: 'vitc', zh: '维生素 C', en: 'Vitamin C', db: 'Ascorbic acid', cat: 'vitamin',
    f: { zh: '抗坏血酸、抗坏血酸钠/脂质体 C', en: 'Ascorbic acid, sodium ascorbate, liposomal C' },
    r: { zh: '胶原羟化酶辅因子、抗氧化与免疫上皮修复', en: 'Cofactor for collagen hydroxylases; antioxidant and epithelial immune repair' },
    u: { zh: '≤2000 mg/日（IOM UL）；>1 g 易腹泻', en: '≤2000 mg/day (IOM UL); above 1 g commonly causes diarrhea' },
    c: { zh: '可增加草酸/肾结石风险；G6PD 缺乏者大剂量静脉给药可致溶血；干扰血糖仪读数', en: 'May raise oxalate and kidney stone risk; high IV doses can hemolyze in G6PD deficiency; skews glucose meter readings' },
    syn: ['iron', 'zinc', 'collagen']
  },
  {
    id: 'probiotics', zh: '益生菌', en: 'Probiotics', db: 'Lactobacillus / Bifidobacterium', cat: 'other',
    f: { zh: '多菌株复配（乳杆菌 + 双歧杆菌），≥10^9 CFU', en: 'Multi-strain Lactobacillus + Bifidobacterium, ≥10^9 CFU' },
    r: { zh: '调节肠道菌群、短链脂肪酸生成与肠屏障、皮肤轴', en: 'Modulates gut flora, short-chain fatty acid production, barrier and the gut-skin axis' },
    u: { zh: '按产品标示；长期使用建议轮换菌株', en: 'Per label; rotate strains with long-term use' },
    c: { zh: '免疫抑制、危重患者与中心静脉导管者有菌血症风险；SIBO 者慎用', en: 'Bacteremia risk in immunosuppressed, critically ill or central-line patients; caution in SIBO' },
    syn: ['inulin', 'butyrate', 'glutamine']
  },
  {
    id: 'arginine', zh: 'L-精氨酸', en: 'L-Arginine', db: 'L-Arginine', cat: 'amino',
    f: { zh: 'L-精氨酸 3–6 g，或瓜氨酸替代', en: 'L-arginine 3–6 g, or citrulline as alternative' },
    r: { zh: '一氧化氮前体，改善微循环与伤口愈合', en: 'Nitric oxide precursor improving microcirculation and wound healing' },
    u: { zh: '≤6 g/日（分次）', en: '≤6 g/day in divided doses' },
    c: { zh: '与降压药叠加；疱疹病毒感染者可能被激活；近期心梗者禁用', en: 'Stacks with antihypertensives; may activate herpes virus; contraindicated after recent MI' },
    syn: ['vitc', 'glutamine', 'zinc']
  },
  {
    id: 'glutamine', zh: 'L-谷氨酰胺', en: 'L-Glutamine', db: 'L-Glutamine', cat: 'amino',
    f: { zh: 'L-谷氨酰胺 5–10 g，肠溶或粉剂', en: 'L-glutamine 5–10 g, powder or enteric' },
    r: { zh: '肠上皮细胞主要燃料，维持紧密连接与黏膜修复', en: 'Primary fuel for enterocytes; maintains tight junctions and mucosal repair' },
    u: { zh: '≤30 g/日研究内使用', en: 'Up to 30 g/day in studies' },
    c: { zh: '严重肝病、肝性脑病与癫痫者慎用；肾衰需限蛋白', en: 'Caution in severe liver disease, hepatic encephalopathy and seizures; protein restriction in renal failure' },
    syn: ['zinc', 'probiotics', 'butyrate']
  },
  {
    id: 'folate', zh: '叶酸（B9）', en: 'Folate (B9)', db: 'Folic acid', cat: 'vitamin',
    f: { zh: '叶酸 400–800 μg；备孕标准 400 μg', en: 'Folic acid 400–800 μg; 400 μg standard in preconception' },
    r: { zh: '一碳单位转移、DNA 合成与红细胞成熟', en: 'One-carbon transfer, DNA synthesis and red cell maturation' },
    u: { zh: '≤1000 μg/日（合成叶酸 UL）；天然食物叶酸无上限', en: '≤1000 μg/day (synthetic folic acid UL); food folate has no UL' },
    c: { zh: '高剂量可掩盖 B12 缺乏的神经损伤；MTHFR 变异者宜用活性 5-MTHF', en: 'High doses can mask B12 neuropathy; those with MTHFR variants may prefer active 5-MTHF' },
    syn: ['b12', 'methylfolate', 'vitb6']
  },
  {
    id: 'vitk', zh: '维生素 K（K1/K2）', en: 'Vitamin K (K1/K2)', db: 'Phylloquinone / Menaquinone', cat: 'vitamin',
    f: { zh: 'K1 叶绿醌（凝血）、K2 MK-4/MK-7（骨与血管）', en: 'K1 phylloquinone (clotting), K2 MK-4/MK-7 (bone and vessels)' },
    r: { zh: '激活凝血因子与骨钙素、基质 Gla 蛋白', en: 'Activates clotting factors, osteocalcin and matrix Gla protein' },
    u: { zh: '无官方上限', en: 'No official UL' },
    c: { zh: '服用华法林等维生素 K 拮抗剂者必须保持摄入稳定并监测 INR，不可随意加量', en: 'On warfarin or other vitamin K antagonists, keep intake steady and monitor INR; do not add freely' },
    syn: ['vitd3', 'calcium', 'k2']
  }
];
