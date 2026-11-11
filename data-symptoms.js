/* VitaMap data layer — symptoms, groups and the symptom→nutrient relations.
 * level: core = 核心缺乏方向 (high evidence), support = 辅助协同, adjunct = 参考/证据有限
 * Relation carries its own note so the UI can explain *why* that nutrient was suggested.
 */
const GROUPS = [
  { id: 'neuro',  zh: '神经与情绪', en: 'Nerves & Mood',        c: '#6C5CE7' },
  { id: 'skin',   zh: '皮肤·毛发·指甲', en: 'Skin, Hair & Nails', c: '#C77D4A' },
  { id: 'muscle', zh: '肌肉与骨骼', en: 'Muscles & Bones',        c: '#2F855A' },
  { id: 'sense',  zh: '眼·耳·感官', en: 'Eyes, Ears & Senses',   c: '#2B6CB0' },
  { id: 'digest', zh: '消化与代谢', en: 'Digestion & Metabolism', c: '#B7791F' },
  { id: 'immune', zh: '免疫与循环', en: 'Immunity & Circulation', c: '#C53030' },
  { id: 'age',    zh: '衰老与长寿', en: 'Longevity & Aging',      c: '#4A5568' }
];

const SYMPTOMS = [
  /* ---------- 神经与情绪 ---------- */
  { id: 'insomnia', g: 'neuro', zh: '入睡困难 / 易醒多梦', en: 'Trouble falling asleep / frequent waking',
    note: { zh: '入睡潜伏期长、夜间易醒或梦多', en: 'Long sleep latency, frequent night waking or vivid dreams' },
    r: [
      ['magnesium', 'core', { zh: '甘氨酸镁/苏糖酸镁松弛神经肌肉，缩短入睡潜伏期', en: 'Glycinate or L-threonate relaxes neuromuscular tone and shortens sleep latency' }],
      ['vitb6', 'core', { zh: '协助色氨酸转化为 5-HTP 与褪黑素', en: 'Helps convert tryptophan into 5-HTP and melatonin' }],
      ['melatonin', 'support', { zh: '直接调节昼夜节律与入睡时点，小剂量 0.5–3 mg', en: 'Directly sets circadian phase; 0.5-3 mg is enough' }],
      ['gaba', 'support', { zh: '抑制性递质，降低交感过度激活', en: 'Inhibitory transmitter that lowers sympathetic overdrive' }],
      ['glycine', 'support', { zh: '降低核心体温，促进深睡起始', en: 'Lowers core temperature to help sleep onset' }],
      ['theanine', 'support', { zh: '提升 α 波，放松而不嗜睡', en: 'Raises alpha waves: calm without sedation' }]
    ] },
  { id: 'anxiety', g: 'neuro', zh: '焦虑 / 神经紧绷 / 易惊跳', en: 'Anxiety / tension / startle easily',
    note: { zh: '交感神经过度激活、皮质醇偏高', en: 'Sympathetic overdrive with elevated cortisol' },
    r: [
      ['ashwagandha', 'core', { zh: '降低皮质醇与焦虑评分（KSM-66 证据较多）', en: 'Lowers cortisol and anxiety scores, best evidence with KSM-66' }],
      ['theanine', 'core', { zh: '促进放松性 α 波，缓冲咖啡因紧张感', en: 'Promotes relaxing alpha waves; buffers caffeine jitter' }],
      ['glycine', 'support', { zh: '抑制性氨基酸，降低神经兴奋性', en: 'Inhibitory amino acid lowering neural excitability' }],
      ['magnesium', 'support', { zh: '缺镁时神经肌肉兴奋性升高、易惊跳', en: 'Low magnesium raises neuromuscular excitability and startle' }],
      ['rhodiola', 'support', { zh: '适应原，改善压力下的疲劳与情绪', en: 'Adaptogen improving stress-related fatigue and mood' }],
      ['gaba', 'adjunct', { zh: '口服 GABA 证据中等，可作为辅助', en: 'Oral GABA has moderate evidence; adjunct only' }]
    ] },
  { id: 'low_mood', g: 'neuro', zh: '情绪低落 / 抑郁倾向', en: 'Low mood / depressive tendency',
    note: { zh: '持续低落、兴趣减退（中重度需专业治疗）', en: 'Persistent low mood and loss of interest; moderate-severe needs clinical care' },
    r: [
      ['vitd3', 'core', { zh: '低维 D 与抑郁评分显著相关，先查 25(OH)D', en: 'Low vitamin D correlates with depression scores; check 25(OH)D first' }],
      ['omega3', 'core', { zh: '高 EPA 配方对抑郁倾向证据最强', en: 'High-EPA formulas have the strongest evidence' }],
      ['same', 'support', { zh: '甲基供体，参与神经递质甲基化（需医生监督）', en: 'Methyl donor for neurotransmitter methylation; needs supervision' }],
      ['htp', 'support', { zh: '血清素前体，禁与 SSRI 类合用', en: 'Serotonin precursor; never combine with SSRIs' }],
      ['methylfolate', 'support', { zh: 'MTHFR 变异者用活性叶酸改善治疗反应', en: 'Active folate improves treatment response in MTHFR variants' }],
      ['b12', 'support', { zh: '缺乏时表现为情绪低落与认知迟钝', en: 'Deficiency presents as low mood and cognitive slowing' }]
    ] },
  { id: 'brainfog', g: 'neuro', zh: '记忆力减退 / 脑雾', en: 'Memory decline / brain fog',
    note: { zh: '注意力涣散、找词困难、思维迟滞', en: 'Poor focus, word-finding difficulty, mental sluggishness' },
    r: [
      ['citicoline', 'core', { zh: '胆碱 + 胞苷双供体，支持磷脂与线粒体膜', en: 'Dual choline and cytidine donor for phospholipids and mitochondrial membranes' }],
      ['agpc', 'core', { zh: '高穿透胆碱供体，提高乙酰胆碱', en: 'Highly absorbed choline donor raising acetylcholine' }],
      ['ps', 'support', { zh: '膜磷脂，降低皮质醇对记忆的干扰', en: 'Membrane phospholipid that blunts cortisol interference with memory' }],
      ['b12', 'support', { zh: '缺乏导致髓鞘与认知功能下降，尤其老年与素食者', en: 'Deficiency impairs myelin and cognition, especially in older adults and vegans' }],
      ['pqq', 'support', { zh: '线粒体生物合成刺激，与 CoQ10 协同', en: 'Stimulates mitochondrial biogenesis, paired with CoQ10' }],
      ['omega3', 'support', { zh: 'DHA 是神经元膜结构成分', en: 'DHA is a structural neuronal membrane component' }]
    ] },
  { id: 'neuropathy', g: 'neuro', zh: '周围神经麻木 / 手足刺痛', en: 'Peripheral numbness / tingling in hands and feet',
    note: { zh: '对称性麻木、针刺感、烧灼感（需先排除糖尿病与 B12 缺乏）', en: 'Symmetric numbness, pins and needles, burning; rule out diabetes and B12 deficiency' },
    r: [
      ['b12', 'core', { zh: '髓鞘合成必需；甲钴胺形式优先', en: 'Required for myelin synthesis; methylcobalamin preferred' }],
      ['b1', 'core', { zh: '糖代谢与神经传导必需，酒精与高糖消耗大', en: 'Essential for glucose metabolism and nerve conduction; depleted by alcohol and sugar' }],
      ['ala', 'core', { zh: '抗氧化并改善神经传导（糖尿病神经病变研究常用）', en: 'Antioxidant that improves nerve conduction; used in diabetic neuropathy trials' }],
      ['vitb6', 'support', { zh: '注意：长期 >100 mg 反而可引起神经病变', en: 'Note: chronic doses above 100 mg can themselves cause neuropathy' }],
      ['methylfolate', 'support', { zh: '与 B12 协同降低同型半胱氨酸', en: 'Works with B12 to lower homocysteine' }]
    ] },
  { id: 'migraine', g: 'neuro', zh: '头痛 / 偏头痛频繁', en: 'Frequent headaches / migraine',
    note: { zh: '每月 ≥4 次或伴先兆，需先排除继发性病因', en: 'Four or more attacks monthly or with aura; rule out secondary causes' },
    r: [
      ['b2', 'core', { zh: '高剂量核黄素改善脑线粒体能量代谢（预防用）', en: 'High-dose riboflavin improves cerebral mitochondrial energy metabolism for prevention' }],
      ['magnesium', 'core', { zh: '柠檬酸镁/甘氨酸镁用于预防，缺镁者优先', en: 'Citrate or glycinate for prevention; best if magnesium is low' }],
      ['coq10', 'support', { zh: '线粒体功能与偏头痛预防', en: 'Mitochondrial support and migraine prophylaxis' }],
      ['omega3', 'support', { zh: '降低神经炎症与头痛频率', en: 'Reduces neuroinflammation and attack frequency' }]
    ] },

  /* ---------- 皮肤·毛发·指甲 ---------- */
  { id: 'peeling_fingers', g: 'skin', zh: '手指脱皮 / 干燥起屑', en: 'Peeling fingertips / dry flaking skin',
    note: { zh: '表皮屏障分化障碍，常伴口角炎', en: 'Barrier differentiation failure, often with angular cheilitis' },
    r: [
      ['vita', 'core', { zh: '上皮细胞分化必需；脂溶性有蓄积上限', en: 'Required for epithelial differentiation; fat-soluble with accumulation limit' }],
      ['b2', 'core', { zh: '缺乏典型表现为口角炎、舌炎与脱皮', en: 'Deficiency classically causes cheilitis, glossitis and peeling' }],
      ['b3', 'support', { zh: '烟酰胺维持皮肤屏障与神经酰胺合成', en: 'Niacinamide supports barrier and ceramide synthesis' }],
      ['zinc', 'support', { zh: '锌参与快速分化细胞的蛋白合成', en: 'Zinc supports protein synthesis in rapidly dividing cells' }],
      ['omega3', 'support', { zh: '必需脂肪酸缺乏加重干燥脱屑', en: 'Essential fatty acid deficiency worsens dryness and flaking' }]
    ] },
  { id: 'hair_loss', g: 'skin', zh: '脱发 / 头发变稀疏', en: 'Hair loss / thinning',
    note: { zh: '先排查缺铁（查铁蛋白）与甲状腺、雄激素性脱发', en: 'First rule out iron deficiency (ferritin), thyroid disease and androgenetic alopecia' },
    r: [
      ['iron', 'core', { zh: '铁蛋白 <30 ng/ml 时补铁可改善（无缺乏证据勿补）', en: 'Repletion helps when ferritin is below 30 ng/ml; do not supplement without evidence' }],
      ['biotin', 'core', { zh: '角蛋白合成辅因子；注意干扰甲状腺化验', en: 'Keratin synthesis cofactor; note it skews thyroid assays' }],
      ['zinc', 'support', { zh: '缺锌与休止期脱发相关', en: 'Zinc deficiency is linked to telogen effluvium' }],
      ['vitd3', 'support', { zh: '低维 D 与弥漫性脱发相关', en: 'Low vitamin D correlates with diffuse hair loss' }],
      ['collagen', 'support', { zh: '提供甘氨酸/脯氨酸底物，协同维生素 C', en: 'Supplies glycine and proline substrates, paired with vitamin C' }],
      ['silicon', 'adjunct', { zh: '胶原交联微量元素，证据中等', en: 'Trace element for collagen cross-linking, moderate evidence' }]
    ] },
  { id: 'grey_hair', g: 'skin', zh: '早生白发', en: 'Premature greying',
    note: { zh: '黑色素合成辅因子不足；遗传因素常为主因', en: 'Cofactor shortages for melanin synthesis; genetics is often the main driver' },
    r: [
      ['copper', 'core', { zh: '酪氨酸酶含铜，缺铜影响黑色素合成', en: 'Tyrosinase is copper-dependent; deficiency impairs melanin synthesis' }],
      ['b12', 'support', { zh: '恶性贫血可伴早白发', en: 'Pernicious anemia can present with early greying' }],
      ['b5', 'support', { zh: '泛酸参与黑色素代谢（传统用法，证据有限）', en: 'Pantothenic acid in melanin metabolism; traditional use, limited evidence' }],
      ['paba', 'adjunct', { zh: '证据弱，不建议长期大剂量', en: 'Weak evidence; avoid long-term high doses' }]
    ] },
  { id: 'brittle_nails', g: 'skin', zh: '指甲易脆 / 断裂', en: 'Brittle, splitting nails',
    note: { zh: '角蛋白二硫键形成不足或长期接触水与清洁剂', en: 'Weak keratin disulfide bonds, or chronic water and detergent exposure' },
    r: [
      ['biotin', 'core', { zh: '多项研究显示改善甲板厚度与脆裂', en: 'Several trials show improved nail thickness and splitting' }],
      ['iron', 'core', { zh: '缺铁时指甲变薄、匙状甲', en: 'Iron deficiency thins nails and causes koilonychia' }],
      ['msm', 'support', { zh: '提供硫，支持角蛋白二硫键', en: 'Sulfur donor supporting keratin disulfide bonds' }],
      ['calcium', 'support', { zh: '与胶原/角蛋白基质矿化相关', en: 'Involved in matrix mineralization' }],
      ['silicon', 'support', { zh: '改善指甲与毛发强度（证据中等）', en: 'Improves nail and hair strength, moderate evidence' }]
    ] },
  { id: 'nail_spots', g: 'skin', zh: '指甲白斑（点状白甲）', en: 'White spots on nails (punctate leukonychia)',
    note: { zh: '多为微小外伤所致，反复出现再考虑营养因素', en: 'Usually from micro-trauma; consider nutrition only if recurrent' },
    r: [
      ['zinc', 'core', { zh: '锌参与快速分化细胞蛋白合成', en: 'Zinc supports protein synthesis in rapidly dividing cells' }],
      ['calcium', 'support', { zh: '钙与甲板基质形成相关', en: 'Calcium relates to nail plate matrix formation' }]
    ] },
  { id: 'keratosis', g: 'skin', zh: '皮肤粗糙 / 毛囊角化（鸡皮）', en: 'Rough skin / keratosis pilaris (chicken skin)',
    note: { zh: '上皮过度角化，常见于上臂外侧与大腿', en: 'Follicular hyperkeratosis, common on outer arms and thighs' },
    r: [
      ['vita', 'core', { zh: '视黄醇缺乏导致毛囊角化过度', en: 'Retinol deficiency drives follicular hyperkeratosis' }],
      ['omega3', 'support', { zh: '必需脂肪酸维持角质层屏障', en: 'Essential fatty acids maintain stratum corneum barrier' }],
      ['vitc', 'support', { zh: '抗氧化并支持胶原与屏障修复', en: 'Antioxidant support for collagen and barrier repair' }],
      ['zinc', 'support', { zh: '参与表皮分化与修复', en: 'Involved in epidermal differentiation and repair' }]
    ] },
  { id: 'acne', g: 'skin', zh: '痤疮 / 油脂分泌失衡', en: 'Acne / unbalanced sebum',
    note: { zh: '皮脂腺炎症与 5α-还原酶活性相关', en: 'Sebaceous inflammation driven partly by 5-alpha-reductase activity' },
    r: [
      ['zinc', 'core', { zh: '调节 5α-还原酶与皮脂腺炎症（30 mg 研究常用）', en: 'Modulates 5-alpha-reductase and sebaceous inflammation; 30 mg used in trials' }],
      ['b3', 'core', { zh: '烟酰胺外用/内服减少皮脂与炎症', en: 'Niacinamide reduces sebum and inflammation, topical or oral' }],
      ['vita', 'support', { zh: '维 A 调控角质化，避免高剂量蓄积', en: 'Vitamin A regulates keratinization; avoid high accumulated doses' }],
      ['probiotics', 'support', { zh: '调节肠-皮轴与菌群', en: 'Modulates the gut-skin axis and flora' }],
      ['omega3', 'support', { zh: '降低皮脂腺炎症介质', en: 'Lowers sebaceous inflammatory mediators' }]
    ] },
  { id: 'wound_healing', g: 'skin', zh: '伤口愈合缓慢', en: 'Slow wound healing',
    note: { zh: '胶原交联与免疫上皮修复底物不足；糖尿病需先控糖', en: 'Deficient collagen cross-linking and immune repair substrates; control glucose in diabetes' },
    r: [
      ['vitc', 'core', { zh: '胶原羟化酶辅因子，缺 C 伤口不愈合', en: 'Collagen hydroxylase cofactor; wounds fail without vitamin C' }],
      ['zinc', 'core', { zh: '上皮化与免疫细胞功能必需', en: 'Essential for epithelialization and immune cell function' }],
      ['arginine', 'support', { zh: '一氧化氮与胶原合成底物', en: 'Substrate for nitric oxide and collagen synthesis' }],
      ['glutamine', 'support', { zh: '肠屏障与免疫细胞燃料', en: 'Fuel for gut barrier and immune cells' }],
      ['collagen', 'support', { zh: '提供胶原肽底物与甘氨酸', en: 'Supplies collagen peptide substrates and glycine' }]
    ] },
  { id: 'pale_skin', g: 'skin', zh: '皮肤黏膜苍白', en: 'Pale skin and mucous membranes',
    note: { zh: '提示血红蛋白不足，先查血常规与铁蛋白', en: 'Suggests low hemoglobin; check CBC and ferritin first' },
    r: [
      ['iron', 'core', { zh: '缺铁性贫血最常见原因（需先化验确认）', en: 'Most common cause of anemia; confirm with labs first' }],
      ['b12', 'core', { zh: '巨幼细胞性贫血，常伴舌炎与麻木', en: 'Megaloblastic anemia, often with glossitis and numbness' }],
      ['folate', 'support', { zh: '红细胞成熟必需；勿掩盖 B12 缺乏', en: 'Required for red cell maturation; do not mask B12 deficiency' }],
      ['vitc', 'support', { zh: '促进非血红素铁吸收', en: 'Enhances non-heme iron absorption' }]
    ] },
  { id: 'bruising', g: 'skin', zh: '容易淤青 / 皮下出血点', en: 'Easy bruising / petechiae',
    note: { zh: '血管脆性增加或凝血级联受损；反复出现需查凝血功能', en: 'Capillary fragility or clotting cascade issues; recurrent cases need coagulation tests' },
    r: [
      ['vitc', 'core', { zh: '胶原与血管内皮完整性必需（坏血病表现）', en: 'Required for collagen and endothelial integrity (scurvy sign)' }],
      ['vitk', 'support', { zh: '凝血因子活化必需；服抗凝药者需医生指导', en: 'Required to activate clotting factors; medical guidance if on anticoagulants' }],
      ['bioflavonoids', 'support', { zh: '芦丁/橙皮苷降低毛细血管通透性', en: 'Rutin and hesperidin reduce capillary permeability' }],
      ['k2', 'adjunct', { zh: '血管钙化与弹性维护，证据偏中等', en: 'Vascular elasticity support, moderate evidence' }]
    ] },

  /* ---------- 肌肉与骨骼 ---------- */
  { id: 'fatigue', g: 'muscle', zh: '四肢乏力 / 全身倦怠', en: 'Weakness / general fatigue',
    note: { zh: '先查血常规、铁蛋白、B12、甲状腺与维 D', en: 'Start with CBC, ferritin, B12, thyroid and vitamin D' },
    r: [
      ['iron', 'core', { zh: '缺铁时携氧下降、易疲劳（需化验确认）', en: 'Iron deficiency lowers oxygen delivery and causes fatigue; confirm with labs' }],
      ['b12', 'core', { zh: '缺乏导致乏力、麻木与认知下降', en: 'Deficiency causes fatigue, numbness and cognitive decline' }],
      ['coq10', 'support', { zh: '线粒体电子传递链关键因子，尤其用他汀者', en: 'Key electron transport factor, especially on statins' }],
      ['creatine', 'support', { zh: '补充磷酸肌酸池，改善力量与耐力', en: 'Replenishes phosphocreatine for strength and endurance' }],
      ['carnitine', 'support', { zh: '脂肪酸进入线粒体的载体', en: 'Carrier that shuttles fatty acids into mitochondria' }],
      ['vitd3', 'support', { zh: '低维 D 与肌无力、疲乏相关', en: 'Low vitamin D correlates with muscle weakness and fatigue' }]
    ] },
  { id: 'cramps', g: 'muscle', zh: '小腿抽筋 / 肌肉痉挛', en: 'Leg cramps / muscle spasms',
    note: { zh: '夜间或运动后发作，电解质失衡常见', en: 'Often nocturnal or post-exercise; electrolyte imbalance is common' },
    r: [
      ['magnesium', 'core', { zh: '神经肌肉接头兴奋性调节，缺镁最典型', en: 'Regulates neuromuscular junction excitability; classic deficiency sign' }],
      ['potassium', 'core', { zh: '细胞内外电位差维持，利尿剂使用者易缺', en: 'Maintains transmembrane potential; easily lost on diuretics' }],
      ['calcium', 'support', { zh: '与镁需平衡，单补钙可能加重痉挛', en: 'Must balance with magnesium; calcium alone can worsen cramps' }],
      ['vitd3', 'support', { zh: '影响钙吸收与肌肉功能', en: 'Affects calcium absorption and muscle function' }],
      ['taurine', 'adjunct', { zh: '调节细胞钙稳态，证据中等', en: 'Regulates cellular calcium handling, moderate evidence' }]
    ] },
  { id: 'osteoporosis', g: 'muscle', zh: '骨质疏松 / 骨痛', en: 'Osteoporosis / bone pain',
    note: { zh: '需 DXA 骨密度评估；补充剂不能替代药物与负重运动', en: 'Assess with DXA; supplements do not replace medication or weight-bearing exercise' },
    r: [
      ['calcium', 'core', { zh: '骨基质矿化原料，需分次 ≤500 mg 吸收', en: 'Bone mineral substrate; split doses of 500 mg or less' }],
      ['vitd3', 'core', { zh: '促进钙吸收与骨钙素表达', en: 'Drives calcium absorption and osteocalcin expression' }],
      ['k2', 'core', { zh: '激活骨钙素把钙引入骨而非血管', en: 'Activates osteocalcin to route calcium into bone, not arteries' }],
      ['magnesium', 'support', { zh: '参与骨晶体形成与维 D 活化', en: 'Involved in bone crystal formation and vitamin D activation' }],
      ['boron', 'support', { zh: '延长钙与维 D 保留（证据中等）', en: 'Extends calcium and vitamin D retention, moderate evidence' }],
      ['strontium', 'adjunct', { zh: '骨密度证据较强，但须与钙间隔 2 小时', en: 'Strong bone density evidence; separate 2h from calcium' }]
    ] },
  { id: 'soreness', g: 'muscle', zh: '运动后酸痛延迟 / 修复慢', en: 'Delayed post-exercise soreness / slow recovery',
    note: { zh: '肌肉蛋白合成与糖原恢复不足', en: 'Insufficient muscle protein synthesis and glycogen recovery' },
    r: [
      ['whey', 'core', { zh: '完整氨基酸谱 + 高亮氨酸，启动 MPS', en: 'Complete amino profile with high leucine to trigger MPS' }],
      ['bcaa', 'support', { zh: '亮氨酸激活 mTOR，减少肌损伤标志', en: 'Leucine activates mTOR and lowers damage markers' }],
      ['glutamine', 'support', { zh: '支持免疫与糖原恢复', en: 'Supports immunity and glycogen recovery' }],
      ['taurine', 'support', { zh: '缓冲氧化应激与肌肉钙稳态', en: 'Buffers oxidative stress and muscle calcium handling' }],
      ['magnesium', 'support', { zh: '参与 ATP 利用与肌肉松弛', en: 'Involved in ATP utilization and muscle relaxation' }]
    ] },
  { id: 'joint', g: 'muscle', zh: '关节弹响 / 软骨磨损疼痛', en: 'Joint clicking / cartilage wear and pain',
    note: { zh: '评估体重负荷与力线；红肿热痛需排除炎症性关节炎', en: 'Assess load and alignment; red, hot, swollen joints need inflammatory workup' },
    r: [
      ['glucosamine', 'core', { zh: '软骨糖胺聚糖与滑液基质合成底物', en: 'Substrate for cartilage glycosaminoglycans and synovial matrix' }],
      ['collagen2', 'core', { zh: '未变性 II 型胶原调节关节局部免疫', en: 'Undenatured type II collagen modulates local joint immunity' }],
      ['chondroitin', 'support', { zh: '抑制软骨降解酶，常与氨基葡萄糖配伍', en: 'Inhibits cartilage-degrading enzymes; usually paired with glucosamine' }],
      ['msm', 'support', { zh: '提供硫，支持软骨基质与抗炎', en: 'Sulfur donor for cartilage matrix and anti-inflammatory support' }],
      ['curcumin', 'support', { zh: '抑制 NF-κB 与 COX-2 炎症通路', en: 'Inhibits NF-κB and COX-2 inflammatory pathways' }]
    ] },

  /* ---------- 眼·耳·感官 ---------- */
  { id: 'night_blindness', g: 'sense', zh: '夜盲 / 暗适应能力差', en: 'Night blindness / poor dark adaptation',
    note: { zh: '视紫红质合成不足；长期维生素 A 缺乏可致干眼与角膜病变', en: 'Deficient rhodopsin synthesis; chronic vitamin A deficiency can cause xerophthalmia' },
    r: [
      ['vita', 'core', { zh: '视黄醛是视紫红质发色团；锌依赖脱氢酶转化', en: 'Retinal is the rhodopsin chromophore; conversion needs a zinc-dependent dehydrogenase' }],
      ['zinc', 'support', { zh: '参与维 A 结合蛋白合成与转运', en: 'Required for retinol-binding protein synthesis and transport' }],
      ['bilberry', 'adjunct', { zh: '花青素改善暗适应（证据中等）', en: 'Anthocyanins improve dark adaptation, moderate evidence' }]
    ] },
  { id: 'dry_eyes', g: 'sense', zh: '干眼 / 视疲劳', en: 'Dry eyes / eye strain',
    note: { zh: '黄斑色素与泪膜脂质层不足，长时间屏幕用眼加重', en: 'Low macular pigment and tear film lipids; screen time worsens it' },
    r: [
      ['lutein', 'core', { zh: '黄斑区抗蓝光滤镜，10–20 mg', en: 'Macular blue-light filter, 10-20 mg' }],
      ['zeaxanthin', 'core', { zh: '与叶黄素按 5:1 配比沉积于黄斑中心', en: 'Deposits centrally in the macula, 5:1 with lutein' }],
      ['dha', 'support', { zh: '维持泪膜脂质层与睑板腺功能', en: 'Maintains tear film lipid layer and meibomian gland function' }],
      ['bilberry', 'support', { zh: '改善眼部微循环，缓解视疲劳', en: 'Improves ocular microcirculation and strain' }],
      ['astaxanthin', 'support', { zh: '穿过血视网膜屏障抗氧化', en: 'Crosses the blood-retina barrier as an antioxidant' }]
    ] },
  { id: 'taste_smell', g: 'sense', zh: '味觉 / 嗅觉迟钝', en: 'Dulled taste or smell',
    note: { zh: '味觉素为含锌金属蛋白；感染后嗅觉减退另需评估', en: 'Gustin is a zinc metalloprotein; post-viral loss needs separate assessment' },
    r: [
      ['zinc', 'core', { zh: '味觉素（Gustin）是典型的含锌金属蛋白', en: 'Gustin, the taste protein, is a classic zinc metalloprotein' }],
      ['b12', 'adjunct', { zh: '缺乏可致味觉与嗅觉异常', en: 'Deficiency can distort taste and smell' }]
    ] },
  { id: 'tinnitus', g: 'sense', zh: '耳鸣（血管性或代谢性）', en: 'Tinnitus (vascular or metabolic)',
    note: { zh: '单侧或搏动性耳鸣需先排除血管病变', en: 'Unilateral or pulsatile tinnitus needs vascular workup first' },
    r: [
      ['ginkgo', 'support', { zh: '改善内耳微循环灌注（证据中等）', en: 'Improves inner-ear microperfusion, moderate evidence' }],
      ['magnesium', 'support', { zh: '内耳神经传导与血管张力调节', en: 'Inner-ear nerve conduction and vascular tone' }],
      ['b12', 'support', { zh: '缺乏时听神经传导受损', en: 'Deficiency impairs auditory nerve conduction' }]
    ] },

  /* ---------- 消化与代谢 ---------- */
  { id: 'bloating', g: 'digest', zh: '腹胀 / 消化不良 / 吸收不良', en: 'Bloating / indigestion / malabsorption',
    note: { zh: '胃酸偏低或胰酶活性不足；持续需排除 SIBO 与乳糜泻', en: 'Low stomach acid or pancreatic enzyme insufficiency; rule out SIBO and celiac disease' },
    r: [
      ['enzymes', 'core', { zh: '补偿蛋白酶/淀粉酶/脂肪酶活性不足', en: 'Compensates for protease, amylase and lipase insufficiency' }],
      ['betainehcl', 'support', { zh: '胃酸偏低者随蛋白餐补充盐酸（溃疡者禁用）', en: 'HCl with protein meals for low acidity; contraindicated in ulcer' }],
      ['probiotics', 'support', { zh: '改善菌群与产气，SIBO 者慎用', en: 'Improves flora and gas; caution in SIBO' }],
      ['zinc', 'adjunct', { zh: '胃酸不足影响锌与矿物质吸收', en: 'Low acidity impairs zinc and mineral absorption' }]
    ] },
  { id: 'constipation', g: 'digest', zh: '顽固性便秘', en: 'Stubborn constipation',
    note: { zh: '先增加饮水与可溶性纤维；药物性便秘需评估用药', en: 'First increase water and soluble fiber; review medication-induced constipation' },
    r: [
      ['psyllium', 'core', { zh: '高黏度可溶性纤维，需 300 ml 水送服', en: 'High-viscosity soluble fiber; take with 300 ml water' }],
      ['magnesium', 'core', { zh: '柠檬酸镁/氧化镁增加肠道渗透压（便溏为剂量信号）', en: 'Citrate or oxide raises osmotic load; loose stool signals dose ceiling' }],
      ['probiotics', 'support', { zh: '双歧杆菌/乳杆菌定植改善传输时间', en: 'Bifidobacteria and lactobacilli improve transit time' }],
      ['inulin', 'support', { zh: '喂养有益菌，逐步加量减少胀气', en: 'Feeds beneficial flora; titrate up to limit gas' }]
    ] },
  { id: 'leaky_gut', g: 'digest', zh: '肠漏 / 肠道黏膜敏感', en: 'Leaky gut / mucosal sensitivity',
    note: { zh: '食物敏感、腹胀与皮肤问题并存时考虑；非正式诊断术语', en: 'Consider when food sensitivities, bloating and skin issues coexist; not a formal diagnosis' },
    r: [
      ['glutamine', 'core', { zh: '肠上皮主要燃料，维持紧密连接蛋白', en: 'Primary enterocyte fuel; maintains tight junction proteins' }],
      ['zinccarnosine', 'core', { zh: '局部释放锌，加速黏膜修复', en: 'Releases zinc locally to speed mucosal repair' }],
      ['butyrate', 'support', { zh: '结肠上皮首选燃料，抗炎并加固屏障', en: 'Preferred colonocyte fuel; anti-inflammatory and barrier-strengthening' }],
      ['probiotics', 'support', { zh: '调节菌群与短链脂肪酸生成', en: 'Modulates flora and short-chain fatty acid production' }]
    ] },
  { id: 'postmeal_sleepy', g: 'digest', zh: '餐后嗜睡 / 糖代谢异常', en: 'Post-meal drowsiness / poor glucose control',
    note: { zh: '餐后血糖波动大；需查 HbA1c 与空腹血糖', en: 'Large postprandial glucose swings; check HbA1c and fasting glucose' },
    r: [
      ['chromium', 'core', { zh: '增强胰岛素受体敏感性', en: 'Enhances insulin receptor sensitivity' }],
      ['inositol', 'core', { zh: '第二信使系统，改善胰岛素信号', en: 'Second messenger improving insulin signaling' }],
      ['berberine', 'support', { zh: '激活 AMPK，需注意 CYP3A4 药物相互作用', en: 'Activates AMPK; watch CYP3A4 drug interactions' }],
      ['cinnamon', 'support', { zh: '水溶性肉桂提取物改善餐后血糖', en: 'Water-soluble cinnamon extract improves postprandial glucose' }],
      ['magnesium', 'support', { zh: '缺镁加重胰岛素抵抗', en: 'Low magnesium worsens insulin resistance' }]
    ] },
  { id: 'fatty_liver', g: 'digest', zh: '脂肪肝 / 肝脏代谢迟缓', en: 'Fatty liver / sluggish hepatic metabolism',
    note: { zh: '需减重与运动为基础；补充剂仅辅助', en: 'Weight loss and exercise are the base; supplements are adjunct only' },
    r: [
      ['silymarin', 'core', { zh: '稳定肝细胞膜并提升谷胱甘肽', en: 'Stabilizes hepatocyte membranes and raises glutathione' }],
      ['choline', 'core', { zh: '促进肝内 VLDL 转运脂肪（缺乏致脂肪肝）', en: 'Drives hepatic VLDL fat export; deficiency causes fatty liver' }],
      ['nac', 'support', { zh: '谷胱甘肽前体，抗氧化护肝', en: 'Glutathione precursor for antioxidant liver support' }],
      ['inositol', 'support', { zh: '改善肝脏胰岛素信号与脂质沉积', en: 'Improves hepatic insulin signaling and lipid deposition' }]
    ] },

  /* ---------- 免疫与循环 ---------- */
  { id: 'frequent_colds', g: 'immune', zh: '频繁感冒 / 易感染', en: 'Frequent colds / prone to infection',
    note: { zh: '每年多次上呼吸道感染；先查血常规与免疫球蛋白', en: 'Multiple upper respiratory infections yearly; check CBC and immunoglobulins' },
    r: [
      ['vitd3', 'core', { zh: 'T 细胞分化与黏膜免疫，低维 D 者感染率更高', en: 'T-cell differentiation and mucosal immunity; deficiency raises infection rates' }],
      ['vitc', 'core', { zh: '黏膜上皮与中性粒细胞功能', en: 'Mucosal epithelium and neutrophil function' }],
      ['zinc', 'core', { zh: '巨噬细胞吞噬与黏膜修复；感冒初期含服可缩短病程', en: 'Macrophage phagocytosis and mucosal repair; lozenges shorten early colds' }],
      ['elderberry', 'support', { zh: '缩短上呼吸道感染病程', en: 'Shortens upper respiratory infection duration' }],
      ['betaglucan', 'support', { zh: '训练先天免疫识别能力', en: 'Trains innate immune recognition' }],
      ['probiotics', 'support', { zh: '黏膜免疫与呼吸道感染频率', en: 'Mucosal immunity and respiratory infection frequency' }]
    ] },
  { id: 'palpitations', g: 'immune', zh: '心悸 / 早搏（非器质性）', en: 'Palpitations / benign premature beats',
    note: { zh: '必须先用动态心电图排除器质性心律失常', en: 'Must exclude structural arrhythmia with Holter monitoring first' },
    r: [
      ['coq10', 'core', { zh: '心肌细胞能量转运关键因子', en: 'Key factor in myocardial energy transfer' }],
      ['magnesium', 'core', { zh: '心肌动作电位极化稳定性，缺镁易早搏', en: 'Stabilizes cardiac action potential repolarization; low magnesium triggers ectopy' }],
      ['potassium', 'support', { zh: '低钾是早搏常见诱因（需监测血钾）', en: 'Low potassium is a common trigger; monitor serum levels' }],
      ['taurine', 'support', { zh: '调节心肌钙稳态，缓冲交感应激', en: 'Regulates myocardial calcium handling and buffers sympathetic stress' }]
    ] },
  { id: 'edema', g: 'immune', zh: '水肿 / 晨起面部浮肿', en: 'Edema / morning facial puffiness',
    note: { zh: '高钠饮食与蛋白质不足常见；单侧水肿需排除血栓', en: 'Often high sodium and low protein; unilateral swelling needs a thrombosis check' },
    r: [
      ['potassium', 'core', { zh: '拮抗钠潴留，促进细胞内外体液交换（需正常肾功能）', en: 'Antagonizes sodium retention and shifts fluid across membranes; needs normal renal function' }],
      ['vitb6', 'core', { zh: '参与体液调节，经前水潴留研究常用', en: 'Involved in fluid regulation; used in premenstrual water retention studies' }],
      ['magnesium', 'support', { zh: '与钾协同维持渗透压平衡', en: 'Works with potassium to maintain osmotic balance' }],
      ['dandelion', 'adjunct', { zh: '温和排钠利尿，菊科过敏者禁用', en: 'Mild natriuretic; contraindicated in Asteraceae allergy' }]
    ] },
  { id: 'cold_intolerance', g: 'immune', zh: '畏寒 / 基础代谢率低', en: 'Cold intolerance / low basal metabolism',
    note: { zh: '先查 TSH、FT4 与铁蛋白；甲减需药物治疗', en: 'Check TSH, free T4 and ferritin; hypothyroidism needs medication' },
    r: [
      ['iodine', 'core', { zh: 'T4/T3 合成必需原料（自身免疫甲状腺病需医生指导）', en: 'Raw material for T4/T3; medical guidance in autoimmune thyroid disease' }],
      ['selenium', 'core', { zh: '脱碘酶核心成分，把 T4 转为活性 T3', en: 'Core of deiodinases that convert T4 to active T3' }],
      ['tyrosine', 'support', { zh: '甲状腺素骨架原料', en: 'Backbone precursor for thyroid hormone' }],
      ['iron', 'support', { zh: '缺铁降低甲状腺过氧化物酶活性', en: 'Iron deficiency lowers thyroid peroxidase activity' }]
    ] },
  { id: 'high_hcy', g: 'immune', zh: '同型半胱氨酸偏高（Hcy）', en: 'Elevated homocysteine',
    note: { zh: '心血管与神经风险标志；需 B12、叶酸、B6 三路协同', en: 'Cardiovascular and neurological risk marker; needs B12, folate and B6 together' },
    r: [
      ['methylfolate', 'core', { zh: '再甲基化主路径的活性叶酸', en: 'Active folate for the main remethylation route' }],
      ['b12', 'core', { zh: '甲钴胺作为再甲基化辅酶', en: 'Methylcobalamin as the remethylation coenzyme' }],
      ['vitb6', 'core', { zh: '转硫路径（生成半胱氨酸）必需', en: 'Required for the transsulfuration route to cysteine' }],
      ['betaine', 'support', { zh: '甜菜碱提供替代性再甲基化路径', en: 'Betaine provides an alternative remethylation route' }]
    ] },
  { id: 'prostate', g: 'immune', zh: '前列腺充血 / 夜尿频多（男性）', en: 'Prostate congestion / nocturia (men)',
    note: { zh: '中老年男性常见；先查 PSA 与前列腺体积', en: 'Common in older men; check PSA and prostate volume first' },
    r: [
      ['sawpalmetto', 'core', { zh: '抑制前列腺局部 5α-还原酶，降低 PSA 读数', en: 'Inhibits local prostatic 5-alpha-reductase and lowers PSA readings' }],
      ['zinc', 'core', { zh: '前列腺液锌浓度高，参与局部免疫', en: 'Prostatic fluid is zinc-rich; supports local immunity' }],
      ['lycopene', 'support', { zh: '前列腺主要类胡萝卜素抗氧化剂', en: 'Main carotenoid antioxidant in prostate tissue' }]
    ] },

  /* ---------- 衰老与长寿 ---------- */
  { id: 'mito', g: 'age', zh: '线粒体功能减退 / 产能衰竭', en: 'Mitochondrial decline / low energy output',
    note: { zh: '运动耐力下降、恢复慢、易疲劳', en: 'Declining endurance, slow recovery, easy fatigue' },
    r: [
      ['nmn', 'core', { zh: '提升细胞内 NAD+，激活 Sirtuins 与线粒体新生', en: 'Raises intracellular NAD+ to activate sirtuins and mitochondrial biogenesis' }],
      ['coq10', 'core', { zh: '电子传递链核心，直接参与 ATP 生成', en: 'Core of the electron transport chain for ATP production' }],
      ['pqq', 'support', { zh: '刺激线粒体生物合成，与 CoQ10 协同', en: 'Stimulates mitochondrial biogenesis with CoQ10' }],
      ['ala', 'support', { zh: '再生维生素 C/E 与谷胱甘肽，保护线粒体', en: 'Recycles vitamin C/E and glutathione to protect mitochondria' }]
    ] },
  { id: 'telomere', g: 'age', zh: '端粒损伤 / 基因组不稳定', en: 'Telomere damage / genomic instability',
    note: { zh: '慢性压力、氧化应激与睡眠不足加速端粒缩短', en: 'Chronic stress, oxidative stress and poor sleep accelerate shortening' },
    r: [
      ['resveratrol', 'core', { zh: '激活 SIRT1，抗自由基应激并维护端粒完整性', en: 'Activates SIRT1, fights radical stress and protects telomere integrity' }],
      ['pterostilbene', 'support', { zh: '白藜芦醇高吸收衍生物，同靶点', en: 'High-absorption resveratrol analog with the same target' }],
      ['astragaloside', 'adjunct', { zh: '端粒酶激活研究成分，人体数据有限', en: 'Research-stage telomerase activator; limited human data' }]
    ] },
  { id: 'senescent', g: 'age', zh: '衰老细胞堆积（Senescent Cells）', en: 'Accumulated senescent cells',
    note: { zh: 'SASP 炎症表型导致慢性低度炎症与组织功能下降', en: 'The SASP phenotype drives chronic low-grade inflammation and tissue decline' },
    r: [
      ['quercetin', 'core', { zh: 'Senolytic：靶向清除衰老细胞并抑制 SASP', en: 'Senolytic: clears senescent cells and suppresses the SASP' }],
      ['fisetin', 'core', { zh: '天然 Senolytic 中最强效之一，建议间歇使用', en: 'One of the most potent natural senolytics; use intermittently' }],
      ['apigenin', 'support', { zh: 'CDK 抑制 + GABA-A 调节，兼有 senolytic 作用', en: 'CDK inhibition plus GABA-A modulation with senolytic activity' }]
    ] },
  { id: 'ages', g: 'age', zh: '糖基化终产物（AGEs）蓄积', en: 'Advanced glycation end-product (AGE) accumulation',
    note: { zh: '皮肤弹性下降、血管硬化；控糖比补剂更关键', en: 'Skin stiffening and vascular hardening; glucose control matters more than supplements' },
    r: [
      ['carnosine', 'core', { zh: '阻断 AGEs 交联反应，兼具 pH 缓冲', en: 'Blocks AGE cross-linking and buffers intracellular pH' }],
      ['benfotiamine', 'core', { zh: '激活转酮醇酶，阻断糖基化三条通路', en: 'Activates transketolase to block three glycation pathways' }],
      ['ala', 'support', { zh: '抗氧化并改善糖代谢', en: 'Antioxidant that improves glucose handling' }]
    ] },
  { id: 'inflammaging', g: 'age', zh: '慢性低度炎症（Inflammaging）', en: 'Chronic low-grade inflammation (inflammaging)',
    note: { zh: 'CRP/IL-6 轻度升高、恢复慢、易疲劳', en: 'Mildly raised CRP/IL-6, slow recovery, fatigue' },
    r: [
      ['curcumin', 'core', { zh: '抑制 COX-2 与 NLRP3 炎症小体', en: 'Inhibits COX-2 and the NLRP3 inflammasome' }],
      ['omega3', 'core', { zh: '高 EPA 配方降低炎症介质生成', en: 'High-EPA formulas reduce inflammatory mediator production' }],
      ['spermidine', 'support', { zh: '诱导自噬，改善免疫衰老', en: 'Induces autophagy and improves immune aging' }],
      ['quercetin', 'support', { zh: '稳定肥大细胞，抑制 SASP 分泌', en: 'Stabilizes mast cells and suppresses SASP secretion' }]
    ] }
];

const NUTRIENTS = NUTRIENTS_A.concat(NUTRIENTS_B);
const NUTRIENT_BY_ID = {};
NUTRIENTS.forEach(n => { NUTRIENT_BY_ID[n.id] = n; });

/* Extra composite entries referenced above that are not single molecules */
NUTRIENTS.push({
  id: 'betaine', zh: '无水甜菜碱（三甲基甘氨酸）', en: 'Betaine (TMG)', db: 'Trimethylglycine', cat: 'amino',
  f: { zh: '无水甜菜碱 500–1500 mg', en: 'Anhydrous betaine 500-1500 mg' },
  r: { zh: '甲基供体，经 BHMT 通路降低同型半胱氨酸', en: 'Methyl donor lowering homocysteine via the BHMT pathway' },
  u: { zh: '≤3000 mg/日', en: '≤3000 mg/day' },
  c: { zh: '与甜菜碱盐酸盐不同，不要混用；可升高 LDL（大剂量）', en: 'Distinct from betaine HCl, do not confuse; high doses may raise LDL' },
  syn: ['methylfolate', 'b12', 'vitb6']
});
NUTRIENT_BY_ID['betaine'] = NUTRIENTS[NUTRIENTS.length - 1];
