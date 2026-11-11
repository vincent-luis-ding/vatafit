/* VitaMap — app logic. Vanilla JS, offline, no dependencies. */
(function () {
  'use strict';

  var LS_LANG = 'vitamap.lang';
  var LS_LIST = 'vitamap.mylist';

  var state = {
    lang: 'zh',
    tab: 'check',
    view: 'form',           // form | result
    group: 'all',
    selected: [],
    query: '',
    cat: 'all',
    open: {},               // expanded nutrient ids
    mylist: []
  };

  /* ---------------- i18n ---------------- */
  var S = {
    zh: {
      sub: '症状 · 营养素自查',
      tabCheck: '自查', tabLib: '营养素', tabSafe: '安全', tabList: '清单',
      lead: '勾选你目前出现的表现，我们按证据强度列出值得关注的营养素，并同时给出安全上限与禁忌。本工具用于营养方向参考，不做疾病诊断。',
      pickGroup: '按系统筛选', all: '全部',
      selectedN: '已选 {n} 项',
      seeResult: '查看推荐方向',
      noResult: '请先勾选至少一项表现',
      back: '← 返回修改',
      resultFor: '基于 {n} 项表现',
      legendCore: '核心方向', legendSupport: '辅助协同', legendAdjunct: '参考（证据有限）',
      aggregate: '同一营养素出现在多项表现中时，只显示一次并按最高证据等级排序。',
      forms: '常见形式', role: '作用', ul: '安全上限', caution: '禁忌 / 注意', synergy: '协同成分',
      addBtn: '加入我的清单', added: '已在清单中',
      search: '搜索营养素中英文名、数据库标识…',
      emptySearch: '没有匹配的营养素',
      catAll: '全部',
      cat_vitamin: '维生素', cat_mineral: '矿物质', cat_amino: '氨基酸', cat_fatty: '脂肪酸',
      cat_botanical: '植物提取物', cat_protein: '蛋白与肽', cat_other: '其他',
      listTitle: '我的清单', listEmpty: '清单还是空的。在自查结果或营养素百科里点「加入我的清单」。',
      remove: '移除', clearAll: '清空清单', conflicts: '配伍与安全提醒',
      noConflict: '当前清单内未发现明显相互干扰的组合。仍需注意剂量上限。',
      noMed: '以上仅为营养素之间的常见相互作用，不包含处方药。若正在服药请先咨询医生或药师。',
      safeTitle: '安全与边界',
      disclaimer: '本 App 提供营养学方向性参考，不构成医疗诊断或处方。出现持续或严重症状、正在服用处方药、孕期哺乳期或患有慢性疾病时，请先就医。',
      toDoctor: '需要就医的信号',
      docItems: [
        '不明原因的体重下降、持续发热、夜间盗汗',
        '单侧肢体麻木、言语含糊、面部不对称（警惕卒中）',
        '胸痛、活动后气促、心悸伴晕厥',
        '黑便、呕血、无痛性血尿、异常阴道出血',
        '新发或快速增大的肿块、痣形态改变',
        '情绪低落持续两周以上并影响生活，或有自伤念头（请立即寻求专业帮助）'
      ]
    },
    en: {
      sub: 'Symptoms · Nutrient map',
      tabCheck: 'Check', tabLib: 'Nutrients', tabSafe: 'Safety', tabList: 'My list',
      lead: 'Tick what you are experiencing. We list the nutrients worth attention by strength of evidence, together with upper limits and contraindications. This is nutritional orientation, not a diagnosis.',
      pickGroup: 'Filter by system', all: 'All',
      selectedN: '{n} selected',
      seeResult: 'Show nutrient directions',
      noResult: 'Select at least one symptom first',
      back: '← Change selection',
      resultFor: 'based on {n} symptoms',
      legendCore: 'Core', legendSupport: 'Support', legendAdjunct: 'Reference (limited evidence)',
      aggregate: 'Each nutrient appears once, sorted by the highest evidence level across your selection.',
      forms: 'Forms', role: 'Role', ul: 'Upper limit', caution: 'Contraindications', synergy: 'Works with',
      addBtn: 'Add to my list', added: 'On my list',
      search: 'Search name or database identifier…',
      emptySearch: 'No matching nutrient',
      catAll: 'All',
      cat_vitamin: 'Vitamins', cat_mineral: 'Minerals', cat_amino: 'Amino acids', cat_fatty: 'Fatty acids',
      cat_botanical: 'Botanicals', cat_protein: 'Proteins & peptides', cat_other: 'Other',
      listTitle: 'My list', listEmpty: 'Your list is empty. Use "Add to my list" in results or the nutrient library.',
      remove: 'Remove', clearAll: 'Clear list', conflicts: 'Interaction & safety watch',
      noConflict: 'No obvious mutual interference in the current list. Upper limits still apply.',
      noMed: 'These are nutrient-nutrient interactions only, prescription drugs are not covered. Ask a doctor or pharmacist if you take medication.',
      safeTitle: 'Safety and limits',
      disclaimer: 'This app gives nutritional orientation only; it is not a diagnosis or a prescription. Seek medical care for persistent or severe symptoms, during pregnancy or breastfeeding, if you take prescription drugs, or if you have a chronic condition.',
      toDoctor: 'Red flags — see a doctor',
      docItems: [
        'Unexplained weight loss, persistent fever, night sweats',
        'One-sided numbness, slurred speech, facial asymmetry (possible stroke)',
        'Chest pain, exertional breathlessness, palpitations with fainting',
        'Black stool, vomiting blood, painless blood in urine, abnormal vaginal bleeding',
        'A new or rapidly growing lump, or a changing mole',
        'Low mood beyond two weeks that affects daily life, or any self-harm thoughts (seek help immediately)'
      ]
    }
  };
  function t(k) { return S[state.lang][k]; }
  function pick(obj) { return obj && (obj[state.lang] || obj.zh || obj.en) || ''; }

  var CAT_ORDER = ['vitamin', 'mineral', 'amino', 'fatty', 'botanical', 'protein', 'other'];
  var LEVELS = { core: 3, support: 2, adjunct: 1 };

  /* ---------------- helpers ---------------- */
  function loadLS(key, dflt) {
    try { var v = localStorage.getItem(key); return v === null ? dflt : JSON.parse(v); } catch (e) { return dflt; }
  }
  function saveLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function groupOf(id) { return GROUPS.filter(function (g) { return g.id === id; })[0]; }
  function levelLabel(l) { return { core: t('legendCore'), support: t('legendSupport'), adjunct: t('legendAdjunct') }[l]; }

  /* ---------------- derived data ---------------- */
  function symptomsShown() {
    return SYMPTOMS.filter(function (s) { return state.group === 'all' || s.g === state.group; });
  }

  function buildRecommendations() {
    var map = {};
    state.selected.forEach(function (sid) {
      var sym = SYMPTOMS.filter(function (s) { return s.id === sid; })[0];
      if (!sym) return;
      sym.r.forEach(function (rel) {
        var id = rel[0], lvl = rel[1], note = rel[2];
        if (!NUTRIENT_BY_ID[id]) return;
        if (!map[id]) map[id] = { id: id, best: lvl, notes: [], symptoms: [] };
        if (LEVELS[lvl] > LEVELS[map[id].best]) map[id].best = lvl;
        map[id].notes.push({ text: pick(note), from: pick({ zh: sym.zh, en: sym.en }) });
        map[id].symptoms.push(pick({ zh: sym.zh, en: sym.en }));
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return LEVELS[b.best] - LEVELS[a.best] || b.symptoms.length - a.symptoms.length; });
  }

  var RULES = [
    {
      test: function (ids) { return ids.indexOf('iron') > -1 && ids.indexOf('calcium') > -1; },
      zh: { t: '铁与钙同服互相压制吸收', d: '钙与铁在同一受体竞争，两者补充时间至少间隔 2 小时；铁建议配维生素 C，钙建议随餐分次。' },
      en: { t: 'Iron and calcium block each other', d: 'They compete for the same transporter. Separate them by 2 hours at least; pair iron with vitamin C and split calcium doses with meals.' }
    },
    {
      test: function (ids) { return ids.indexOf('zinc') > -1 && ids.indexOf('iron') > -1; },
      zh: { t: '锌与铁会互相竞争吸收', d: '高剂量锌与铁同服时两种都吸收下降；分开时段服用，并把每日锌控制在 40 mg 以内。' },
      en: { t: 'Zinc and iron compete', d: 'High-dose zinc with iron reduces absorption of both. Take them at different times and keep zinc under 40 mg/day.' }
    },
    {
      test: function (ids) { return ids.indexOf('zinc') > -1 && ids.indexOf('copper') === -1; },
      zh: { t: '长期补锌没有配铜', d: '锌超过 40 mg/日持续数周会诱发继发性缺铜（贫血、神经病变）。按每 15–30 mg 锌配 1–2 mg 铜。' },
      en: { t: 'Zinc without copper', d: 'Zinc above 40 mg/day for weeks can induce copper deficiency (anemia, neuropathy). Pair 1–2 mg copper per 15–30 mg zinc.' }
    },
    {
      test: function (ids) { return (ids.indexOf('k2') > -1 || ids.indexOf('vitk') > -1); },
      zh: { t: '维生素 K 与抗凝药', d: '正在服用华法林等维生素 K 拮抗剂时，K1/K2 会削弱药效，必须由医生监测 INR，不可自行加量。' },
      en: { t: 'Vitamin K and anticoagulants', d: 'On warfarin or other vitamin K antagonists, K1/K2 reduce drug effect. A doctor must monitor INR; do not add on your own.' }
    },
    {
      test: function (ids) { return ids.indexOf('berberine') > -1; },
      zh: { t: '小檗碱是强效 CYP3A4 抑制剂', d: '会显著升高他汀、免疫抑制剂、部分抗心律失常药的浓度，合用前必须咨询医生。' },
      en: { t: 'Berberine strongly inhibits CYP3A4', d: 'It raises levels of statins, immunosuppressants and some antiarrhythmics. Consult a doctor before combining.' }
    },
    {
      test: function (ids) { return ids.indexOf('iron') > -1; },
      zh: { t: '补铁前应有化验依据', d: '没有缺铁证据（血常规 + 铁蛋白）时补铁会增加氧化应激与铁蓄积风险，男性与绝经后女性尤其需要先查。' },
      en: { t: 'Confirm deficiency before iron', d: 'Without evidence (CBC + ferritin), iron adds oxidative stress and overload risk, especially in men and postmenopausal women.' }
    },
    {
      test: function (ids) { return ids.indexOf('htp') > -1 || ids.indexOf('same') > -1; },
      zh: { t: '血清素能成分与抗抑郁药', d: '5-HTP 与 SAMe 严禁与 SSRI/SNRI/MAOI 合用，可能引发血清素综合征；双相障碍者 SAMe 可能诱发躁狂。' },
      en: { t: 'Serotonergic agents and antidepressants', d: '5-HTP and SAMe must never be combined with SSRI/SNRI/MAOI (serotonin syndrome); SAMe may trigger mania in bipolar disorder.' }
    },
    {
      test: function (ids) { return ids.indexOf('vita') > -1 || ids.indexOf('vitd3') > -1; },
      zh: { t: '脂溶性维生素有累积上限', d: '维 A ≤3000 μg RAE/日、维 D ≤4000 IU/日；两者都蓄积于肝脏与脂肪，长期超量不易排出。' },
      en: { t: 'Fat-soluble vitamins accumulate', d: 'Vitamin A ≤3000 μg RAE/day, vitamin D ≤4000 IU/day. Both store in liver and fat and do not wash out quickly.' }
    },
    {
      test: function (ids) { return ids.indexOf('potassium') > -1; },
      zh: { t: '补钾需先确认肾功能', d: '肾功能不全、服用 ACEI/ARB 或保钾利尿剂者补钾可致高钾血症（心律失常风险）。' },
      en: { t: 'Check kidney function before potassium', d: 'In renal impairment or on ACEI/ARB or potassium-sparing diuretics, potassium can cause hyperkalemia and arrhythmia.' }
    },
    {
      test: function (ids) { return ids.indexOf('biotin') > -1; },
      zh: { t: '生物素干扰化验结果', d: '高剂量生物素会让甲状腺激素、肌钙蛋白等免疫检测失真，抽血与手术前停用 3–5 天。' },
      en: { t: 'Biotin skews lab results', d: 'High-dose biotin distorts immunoassays such as TSH and troponin. Stop 3–5 days before blood tests or surgery.' }
    }
  ];

  function conflictsFor(ids) {
    return RULES.filter(function (r) { return r.test(ids); })
      .map(function (r) { return { t: pick(r.zh ? { zh: r.zh.t, en: r.en.t } : null), d: pick({ zh: r.zh.d, en: r.en.d }) }; });
  }

  /* ---------------- render: nutrient card ---------------- */
  function nutrientCard(rec, opts) {
    opts = opts || {};
    var n = NUTRIENT_BY_ID[rec.id];
    if (!n) return '';
    var open = !!state.open[n.id];
    var inList = state.mylist.indexOf(n.id) > -1;
    var whyHtml = '';
    if (rec.notes && rec.notes.length) {
      whyHtml = rec.notes.slice(0, 2).map(function (x) {
        return '<div class="why">' + (rec.notes.length > 1 ? '· ' : '') + esc(x.text) + '</div>';
      }).join('');
    }
    var syn = (n.syn || []).filter(function (id) { return NUTRIENT_BY_ID[id]; });
    return '' +
      '<div class="ncard" data-nid="' + n.id + '">' +
        '<div class="nhead" data-act="toggle" data-nid="' + n.id + '">' +
          '<div class="nname"><div class="z">' + esc(pick(n)) + '</div><div class="e">' + esc(state.lang === 'zh' ? n.en : n.zh) + '</div></div>' +
          (rec.best && opts.showBadge !== false ? '<span class="badge ' + rec.best + '">' + levelLabel(rec.best) + '</span>' : '') +
        '</div>' +
        whyHtml +
        (open ?
          '<div class="ndetail">' +
            '<div class="row"><div class="k">' + t('role') + '</div><div class="v">' + esc(pick(n.r)) + '</div></div>' +
            '<div class="row"><div class="k">' + t('forms') + '</div><div class="v">' + esc(pick(n.f)) + '</div></div>' +
            '<div class="row"><div class="k">' + t('ul') + '</div><div class="v">' + esc(pick(n.u)) + '</div></div>' +
            '<div class="ulbox"><b>' + t('caution') + ':</b> ' + esc(pick(n.c)) + '</div>' +
            (syn.length ? '<div class="synergy">' + t('synergy') + ': ' + syn.map(function (id) {
              return '<a class="synlink" data-act="open" data-nid="' + id + '">' + esc(pick(NUTRIENT_BY_ID[id])) + '</a>';
            }).join('') + '</div>' : '') +
          '</div>'
          : '') +
        '<button class="addbtn' + (inList ? ' on' : '') + '" data-act="add" data-nid="' + n.id + '">' +
          (inList ? '✓ ' + t('added') : '+ ' + t('addBtn')) +
        '</button>' +
      '</div>';
  }

  /* ---------------- render: pages ---------------- */
  function renderCheck() {
    if (state.view === 'result') return renderResult();

    var html = '<div class="lead">' + esc(t('lead')) + '</div>';
    html += '<div class="section-title">' + esc(t('pickGroup')) + '</div><div class="chips">';
    html += '<button class="chip' + (state.group === 'all' ? ' on' : '') + '" data-act="group" data-g="all">' + esc(t('all')) + '</button>';
    GROUPS.forEach(function (g) {
      html += '<button class="chip' + (state.group === g.id ? ' on' : '') + '" data-act="group" data-g="' + g.id + '">' +
        '<span class="dot" style="background:' + g.c + '"></span>' + esc(pick({ zh: g.zh, en: g.en })) + '</button>';
    });
    html += '</div>';

    html += '<div class="symgrid" style="margin-top:16px">';
    symptomsShown().forEach(function (s) {
      var on = state.selected.indexOf(s.id) > -1;
      html += '<button class="symcard' + (on ? ' on' : '') + '" data-act="pick" data-sid="' + s.id + '">' +
        '<div class="z">' + esc(pick({ zh: s.zh, en: s.en })) + '</div>' +
        '<div class="e">' + esc(pick({ zh: s.note.zh, en: s.note.en })) + '</div></button>';
    });
    html += '</div>';
    return html;
  }

  function renderResult() {
    var recs = buildRecommendations();
    var html = '<div class="resulthead"><button class="backbtn" data-act="back">' + esc(t('back')) + '</button>' +
      '<div style="font-size:12.5px;color:var(--ink-3)">' + t('resultFor').replace('{n}', state.selected.length) + '</div></div>';
    html += '<div class="legend">' +
      '<span class="badge core">' + t('legendCore') + '</span>' +
      '<span class="badge support">' + t('legendSupport') + '</span>' +
      '<span class="badge adjunct">' + t('legendAdjunct') + '</span></div>';
    html += '<div class="lead" style="margin-top:-6px">' + esc(t('aggregate')) + '</div>';
    recs.forEach(function (r) { html += nutrientCard(r); });
    return html;
  }

  function renderLib() {
    var q = state.query.trim().toLowerCase();
    var list = NUTRIENTS.filter(function (n) {
      if (state.cat !== 'all' && n.cat !== state.cat) return false;
      if (!q) return true;
      var hay = (n.zh + ' ' + n.en + ' ' + n.db + ' ' + pick(n.f)).toLowerCase();
      return hay.indexOf(q) > -1;
    }).sort(function (a, b) {
      return CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat) || a.zh.localeCompare(b.zh, 'zh');
    });

    var html = '<input class="search" id="searchbox" placeholder="' + esc(t('search')) + '" value="' + esc(state.query) + '">';
    html += '<div class="catrow">';
    html += '<button class="chip' + (state.cat === 'all' ? ' on' : '') + '" data-act="cat" data-c="all">' + esc(t('catAll')) + '</button>';
    CAT_ORDER.forEach(function (c) {
      var count = NUTRIENTS.filter(function (n) { return n.cat === c; }).length;
      if (!count) return;
      html += '<button class="chip' + (state.cat === c ? ' on' : '') + '" data-act="cat" data-c="' + c + '">' +
        esc(t('cat_' + c)) + ' ' + count + '</button>';
    });
    html += '</div>';

    if (!list.length) {
      html += '<div class="empty">' + esc(t('emptySearch')) + '</div>';
    } else {
      list.forEach(function (n) {
        html += nutrientCard({ id: n.id, best: null, notes: [] }, { showBadge: false });
      });
    }
    return html;
  }

  function renderSafe() {
    var zh = state.lang === 'zh';
    var html = '<div class="section-title">' + esc(t('safeTitle')) + '</div>';

    html += '<div class="panel danger"><span class="tagline">' + (zh ? '必须知道' : 'Must know') + '</span>' +
      '<h3>' + (zh ? '脂溶性维生素的累积毒性' : 'Fat-soluble vitamins accumulate') + '</h3>' +
      '<p>' + (zh
        ? '维生素 A、D、E、K 不在尿液排出，过量会蓄积于肝脏与脂肪：维 A 长期 >3000 μg RAE/日可致肝损与颅压升高，孕期高剂量有致畸风险；维 D 长期 >4000 IU/日可致高钙血症与肾结石。'
        : 'Vitamins A, D, E and K are not excreted in urine. Chronic vitamin A above 3000 μg RAE/day causes liver damage and raised intracranial pressure, and high doses are teratogenic in pregnancy; vitamin D above 4000 IU/day can cause hypercalcemia and kidney stones.') +
      '</p><p style="margin-top:8px">' + (zh
        ? '水溶性 B 族与维生素 C 相对安全，但 B6 长期 >100 mg/日可致周围神经病变，维生素 C >2 g/日易腹泻并增加草酸结石风险。'
        : 'Water-soluble B vitamins and vitamin C are safer, but chronic vitamin B6 above 100 mg/day causes peripheral neuropathy, and vitamin C above 2 g/day causes diarrhea and oxalate stone risk.') + '</p></div>';

    html += '<div class="panel"><span class="tagline">' + (zh ? '矿物质拮抗' : 'Mineral antagonism') + '</span>' +
      '<h3>' + (zh ? '锌、铜、铁、钙的配比逻辑' : 'The zinc, copper, iron, calcium logic') + '</h3><ul>' +
      '<li>' + (zh ? '<b>锌—铜</b>：高剂量补锌（>40 mg/日）会抢占铜的吸收位点，几周后可出现缺铜性贫血与神经病变。每 15–30 mg 锌配 1–2 mg 铜。' : '<b>Zinc-copper</b>: zinc above 40 mg/day outcompetes copper; weeks later copper-deficiency anemia and neuropathy can appear. Pair 1–2 mg copper per 15–30 mg zinc.') + '</li>' +
      '<li>' + (zh ? '<b>铁—钙—锌</b>：三者共用二价金属转运体，同服互相压制。铁与钙间隔 2 小时，铁配维生素 C 提升吸收。' : '<b>Iron-calcium-zinc</b>: they share divalent metal transporters and suppress each other. Separate iron and calcium by 2h; pair iron with vitamin C.') + '</li>' +
      '<li>' + (zh ? '<b>钙—镁</b>：钙与镁互为拮抗，补钙过量会加重镁缺乏（抽筋、便秘）；比例大致 2:1 更稳妥。' : '<b>Calcium-magnesium</b>: they antagonize each other; excess calcium worsens magnesium deficiency (cramps, constipation). Roughly 2:1 is safer.') + '</li>' +
      '<li>' + (zh ? '<b>钾—钠</b>：肾功能不全或服用 ACEI/ARB、保钾利尿剂者补钾有高钾血症风险。' : '<b>Potassium-sodium</b>: potassium supplementation risks hyperkalemia in renal impairment or on ACEI/ARB and potassium-sparing diuretics.') + '</li>' +
      '</ul></div>';

    html += '<div class="panel"><span class="tagline">' + (zh ? '处方药相互作用' : 'Prescription interactions') + '</span>' +
      '<h3>' + (zh ? '最常见的六类冲突' : 'Six most common conflicts') + '</h3><ul>' +
      '<li>' + (zh ? '维生素 K1/K2 与华法林：削弱抗凝，必须医生监测 INR。' : 'Vitamin K1/K2 with warfarin: weakens anticoagulation; INR must be monitored.') + '</li>' +
      '<li>' + (zh ? '5-HTP / SAMe 与 SSRI、SNRI、MAOI：血清素综合征风险。' : '5-HTP / SAMe with SSRI, SNRI, MAOI: serotonin syndrome risk.') + '</li>' +
      '<li>' + (zh ? '银杏、姜黄素、高剂量 Omega-3、维生素 E 与抗凝/抗血小板药：出血叠加。' : 'Ginkgo, curcumin, high-dose omega-3, vitamin E with anticoagulants/antiplatelets: additive bleeding.') + '</li>' +
      '<li>' + (zh ? '小檗碱、槲皮素、白藜芦醇与经 CYP3A4 代谢的药物（他汀、免疫抑制剂）：血药浓度升高。' : 'Berberine, quercetin, resveratrol with CYP3A4 substrates (statins, immunosuppressants): drug levels rise.') + '</li>' +
      '<li>' + (zh ? '钙、铁、锌、镁与左甲状腺素、四环素/喹诺酮类抗生素：间隔 2–4 小时。' : 'Calcium, iron, zinc, magnesium with levothyroxine and tetracycline/quinolone antibiotics: separate by 2-4 hours.') + '</li>' +
      '<li>' + (zh ? '高剂量生物素：干扰甲状腺激素、肌钙蛋白等免疫检测，抽血前停用 3–5 天。' : 'High-dose biotin distorts TSH and troponin immunoassays; stop 3–5 days before blood tests.') + '</li>' +
      '</ul></div>';

    html += '<div class="panel"><span class="tagline">' + (zh ? '何时就医' : 'See a doctor') + '</span>' +
      '<h3>' + esc(t('toDoctor')) + '</h3><ul>' +
      t('docItems').map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      '</ul></div>';

    html += '<div class="panel"><span class="tagline">' + (zh ? '使用边界' : 'Boundaries') + '</span>' +
      '<p>' + esc(t('disclaimer')) + '</p></div>';
    return html;
  }

  function renderList() {
    var html = '<div class="section-title">' + esc(t('listTitle')) + ' · ' + state.mylist.length + '</div>';
    if (!state.mylist.length) {
      html += '<div class="empty">' + esc(t('listEmpty')) + '</div>';
      return html;
    }

    var conf = conflictsFor(state.mylist);
    html += '<div class="section-title">' + esc(t('conflicts')) + '</div>';
    if (!conf.length) {
      html += '<div class="panel"><p>' + esc(t('noConflict')) + '</p></div>';
    } else {
      conf.forEach(function (c) {
        html += '<div class="conflict"><div class="t">' + esc(c.t) + '</div><div class="d">' + esc(c.d) + '</div></div>';
      });
    }
    html += '<div style="font-size:11.5px;color:var(--ink-3);margin:2px 0 16px">' + esc(t('noMed')) + '</div>';

    state.mylist.forEach(function (id) {
      var n = NUTRIENT_BY_ID[id]; if (!n) return;
      html += '<div class="ncard listcard"><div><div class="z">' + esc(pick(n)) + '</div><div class="e">' + esc(state.lang === 'zh' ? n.en : n.zh) + '</div></div>' +
        '<button class="removebtn" data-act="remove" data-nid="' + id + '">' + esc(t('remove')) + '</button></div>';
    });
    html += '<button class="ghost" style="margin-top:6px" data-act="clear">' + esc(t('clearAll')) + '</button>';
    return html;
  }

  /* ---------------- render shell ---------------- */
  function render() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelector('.brand h1').textContent = 'VitaMap';
    document.querySelector('.brand span').textContent = t('sub');
    document.querySelector('.langbtn').textContent = state.lang === 'zh' ? 'EN' : '中文';

    var main = document.getElementById('main');
    if (state.tab === 'check') main.innerHTML = '<div class="wrap">' + renderCheck() + '</div>';
    else if (state.tab === 'lib') main.innerHTML = '<div class="wrap">' + renderLib() + '</div>';
    else if (state.tab === 'safe') main.innerHTML = '<div class="wrap">' + renderSafe() + '</div>';
    else main.innerHTML = '<div class="wrap">' + renderList() + '</div>';

    // selection bar
    var bar = document.getElementById('selbar');
    if (state.tab === 'check' && state.view === 'form') {
      var n = state.selected.length;
      bar.innerHTML = '<div><button class="primary" ' + (n ? '' : 'disabled') + ' data-act="showresult">' +
        (n ? t('seeResult') + ' · ' + t('selectedN').replace('{n}', n) : t('noResult')) + '</button></div>';
    } else {
      bar.innerHTML = '';
    }

    // nav
    var nav = document.getElementById('nav');
    var tabs = [['check', '◎'], ['lib', '▤'], ['safe', '⚑'], ['list', '☆']];
    nav.innerHTML = tabs.map(function (x) {
      var badge = (x[0] === 'list' && state.mylist.length) ? '<span class="navbadge">' + state.mylist.length + '</span>' : '';
      return '<button class="navbtn' + (state.tab === x[0] ? ' on' : '') + '" data-act="tab" data-tab="' + x[0] + '">' +
        '<span class="ic">' + x[1] + '</span><span>' + t('tab' + x[0].charAt(0).toUpperCase() + x[0].slice(1)) + '</span>' + badge + '</button>';
    }).join('');

    if (state.tab === 'lib') {
      var box = document.getElementById('searchbox');
      if (box) {
        box.addEventListener('input', function (e) {
          state.query = e.target.value;
          var caret = e.target.selectionStart;
          render();
          var nb = document.getElementById('searchbox');
          if (nb) { nb.focus(); try { nb.setSelectionRange(caret, caret); } catch (er) {} }
        });
      }
    }
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');

    if (act === 'tab') { state.tab = el.getAttribute('data-tab'); state.view = 'form'; render(); window.scrollTo(0, 0); return; }
    if (act === 'group') { state.group = el.getAttribute('data-g'); render(); return; }
    if (act === 'pick') {
      var sid = el.getAttribute('data-sid');
      var i = state.selected.indexOf(sid);
      if (i > -1) state.selected.splice(i, 1); else state.selected.push(sid);
      render(); return;
    }
    if (act === 'showresult') { if (state.selected.length) { state.view = 'result'; render(); window.scrollTo(0, 0); } return; }
    if (act === 'back') { state.view = 'form'; render(); window.scrollTo(0, 0); return; }
    if (act === 'toggle') {
      var id = el.getAttribute('data-nid');
      state.open[id] = !state.open[id];
      render(); return;
    }
    if (act === 'open') {
      var oid = el.getAttribute('data-nid');
      state.open[oid] = true;
      state.tab = 'lib'; state.query = ''; state.cat = 'all';
      render();
      var card = document.querySelector('.ncard[data-nid="' + oid + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (act === 'add') {
      var nid = el.getAttribute('data-nid');
      var j = state.mylist.indexOf(nid);
      if (j > -1) state.mylist.splice(j, 1); else state.mylist.push(nid);
      saveLS(LS_LIST, state.mylist);
      render(); return;
    }
    if (act === 'remove') {
      var rid = el.getAttribute('data-nid');
      var k = state.mylist.indexOf(rid);
      if (k > -1) state.mylist.splice(k, 1);
      saveLS(LS_LIST, state.mylist); render(); return;
    }
    if (act === 'clear') { state.mylist = []; saveLS(LS_LIST, state.mylist); render(); return; }
    if (act === 'cat') { state.cat = el.getAttribute('data-c'); render(); return; }
  });

  document.querySelector('.langbtn').addEventListener('click', function () {
    state.lang = state.lang === 'zh' ? 'en' : 'zh';
    saveLS(LS_LANG, state.lang);
    render();
  });

  /* ---------------- boot ---------------- */
  var savedLang = loadLS(LS_LANG, 'zh');
  state.lang = (savedLang === 'en' || savedLang === 'zh') ? savedLang : 'zh';
  var savedList = loadLS(LS_LIST, []);
  state.mylist = Array.isArray(savedList) ? savedList.filter(function (id) { return NUTRIENT_BY_ID[id]; }) : [];

  render();
  window.VitaMap = {
    state: state,
    nutrients: NUTRIENTS,
    symptoms: SYMPTOMS,
    /* Called from the Android back button: returns true when the app handled
       the navigation itself, false when the system may close the activity. */
    handleBack: function () {
      if (state.view === 'result') { state.view = 'form'; render(); window.scrollTo(0, 0); return true; }
      if (state.tab !== 'check') { state.tab = 'check'; state.view = 'form'; render(); window.scrollTo(0, 0); return true; }
      if (state.open && Object.keys(state.open).length) {
        state.open = {}; render(); return true;
      }
      return false;
    }
  };
})();
