// ============================================================
// GIVORA — COMPLETE EGYPTIAN GEOGRAPHICAL DATABASE
// All 27 Governorates with official administrative cities and districts
// ============================================================

export interface EgyptianCity {
  id: string;
  name: { ar: string; en: string };
  districts?: { id: string; name: { ar: string; en: string } }[];
}

export interface EgyptianGovernorate {
  id: string;
  code: string;
  name: { ar: string; en: string };
  shippingFee: number; // in EGP
  deliveryEstimateDays: { min: number; max: number };
  isActive: boolean;
  cities: EgyptianCity[];
}

export const EGYPTIAN_GOVERNORATES: EgyptianGovernorate[] = [
  {
    id: 'cairo',
    code: 'CAI',
    name: { ar: 'القاهرة', en: 'Cairo' },
    shippingFee: 50,
    deliveryEstimateDays: { min: 1, max: 2 },
    isActive: true,
    cities: [
      {
        id: 'nasr-city',
        name: { ar: 'مدينة نصر', en: 'Nasr City' },
        districts: [
          { id: 'first-zone', name: { ar: 'المنطقة الأولى', en: 'First Zone' } },
          { id: 'seventh-zone', name: { ar: 'المنطقة السابعة', en: '7th Zone' } },
          { id: 'eighth-zone', name: { ar: 'المنطقة الثامنة', en: '8th Zone' } },
          { id: 'makram-ebeid', name: { ar: 'مكرم عبيد', en: 'Makram Ebeid' } },
          { id: 'abbas-el-akkad', name: { ar: 'عباس العقاد', en: 'Abbas El Akkad' } },
        ],
      },
      {
        id: 'new-cairo',
        name: { ar: 'القاهرة الجديدة (التجمع)', en: 'New Cairo (Fifth Settlement)' },
        districts: [
          { id: 'first-settlement', name: { ar: 'التجمع الأول', en: 'First Settlement' } },
          { id: 'third-settlement', name: { ar: 'التجمع الثالث', en: 'Third Settlement' } },
          { id: 'fifth-settlement', name: { ar: 'التجمع الخامس', en: 'Fifth Settlement' } },
          { id: 'rehab', name: { ar: 'الرحاب', en: 'Al Rehab' } },
          { id: 'madinaty', name: { ar: 'مدينتي', en: 'Madinaty' } },
          { id: 'choueifat', name: { ar: 'الشويفات', en: 'Choueifat' } },
        ],
      },
      {
        id: 'maadi',
        name: { ar: 'المعادي', en: 'Maadi' },
        districts: [
          { id: 'degla', name: { ar: 'دجلة', en: 'Degla' } },
          { id: 'sarayat', name: { ar: 'سرايات المعادي', en: 'Sarayat El Maadi' } },
          { id: 'zahraa-maadi', name: { ar: 'زهراء المعادي', en: 'Zahraa El Maadi' } },
        ],
      },
      {
        id: 'heliopolis',
        name: { ar: 'مصر الجديدة', en: 'Heliopolis' },
        districts: [
          { id: 'korba', name: { ar: 'الكوربة', en: 'El Korba' } },
          { id: 'merghany', name: { ar: 'المرغني', en: 'El Merghany' } },
          { id: 'ard-el-golf', name: { ar: 'أرض الجولف', en: 'Ard El Golf' } },
          { id: 'triumph', name: { ar: 'تريومف', en: 'Triumph' } },
        ],
      },
      {
        id: 'zamalek',
        name: { ar: 'الزمالك', en: 'Zamalek' },
        districts: [
          { id: 'gezeirah', name: { ar: 'الجزيرة', en: 'Gezira' } },
          { id: 'brazil-st', name: { ar: 'شارع البرازيل', en: 'Brazil St' } },
        ],
      },
      {
        id: 'downtown-cairo',
        name: { ar: 'وسط البلد', en: 'Downtown Cairo' },
        districts: [
          { id: 'tahrir', name: { ar: 'التحرير', en: 'Tahrir' } },
          { id: 'talaat-harb', name: { ar: 'طلعت حرب', en: 'Talaat Harb' } },
          { id: 'garden-city', name: { ar: 'جاردن سيتي', en: 'Garden City' } },
        ],
      },
      {
        id: 'shorouk',
        name: { ar: 'مدينة الشروق', en: 'Al Shorouk City' },
      },
      {
        id: 'obour',
        name: { ar: 'مدينة العبور', en: 'Al Obour City' },
      },
      {
        id: 'badr',
        name: { ar: 'مدينة بدر', en: 'Badr City' },
      },
      {
        id: 'shubra',
        name: { ar: 'شبرا', en: 'Shubra' },
      },
    ],
  },
  {
    id: 'giza',
    code: 'GZ',
    name: { ar: 'الجيزة', en: 'Giza' },
    shippingFee: 50,
    deliveryEstimateDays: { min: 1, max: 2 },
    isActive: true,
    cities: [
      {
        id: 'dokki',
        name: { ar: 'الدقي', en: 'Dokki' },
        districts: [
          { id: 'mossaddak', name: { ar: 'مصدق', en: 'Mossaddak' } },
          { id: 'messaha', name: { ar: 'المساحة', en: 'Messaha' } },
          { id: 'wezaret-el-zeraa', name: { ar: 'وزارة الزراعة', en: 'Ministry of Agriculture' } },
        ],
      },
      {
        id: 'mohandessin',
        name: { ar: 'المهندسين', en: 'Mohandessin' },
        districts: [
          { id: 'lebanon-sq', name: { ar: 'ميدان لبنان', en: 'Lebanon Square' } },
          { id: 'shehab', name: { ar: 'شارع شهاب', en: 'Shehab St' } },
          { id: 'gameat-el-dewal', name: { ar: 'جامعة الدول العربية', en: 'Gameat El Dewal' } },
        ],
      },
      {
        id: 'sheikh-zayed',
        name: { ar: 'الشيخ زايد', en: 'Sheikh Zayed' },
        districts: [
          { id: 'beverly-hills', name: { ar: 'بيفرلي هيلز', en: 'Beverly Hills' } },
          { id: 'hay-el-ashgar', name: { ar: 'حي الأشجار', en: 'Hay El Ashgar' } },
          { id: 'zayed-entrance-1', name: { ar: 'زايد مدخل 1', en: 'Zayed Entrance 1' } },
        ],
      },
      {
        id: '6th-october',
        name: { ar: 'مدينة 6 أكتوبر', en: '6th of October' },
        districts: [
          { id: 'al-motamayez', name: { ar: 'الحي المتميز', en: 'Al Motamayez' } },
          { id: 'al-hosary', name: { ar: 'ميدان الحصري', en: 'Al Hosary' } },
          { id: 'october-gardens', name: { ar: 'حدائق أكتوبر', en: 'October Gardens' } },
        ],
      },
      {
        id: 'haram',
        name: { ar: 'الهرم', en: 'Al Haram' },
        districts: [
          { id: 'faisal', name: { ar: 'فيصل', en: 'Faisal' } },
          { id: 'maryoutiya', name: { ar: 'المريوطية', en: 'Maryoutiya' } },
          { id: 'ahram-gardens', name: { ar: 'حدائق الأهرام', en: 'Ahram Gardens' } },
        ],
      },
      {
        id: 'omrania',
        name: { ar: 'العمرانية', en: 'Omrania' },
      },
      {
        id: 'hawamdia',
        name: { ar: 'الحوامدية', en: 'Hawamdia' },
      },
    ],
  },
  {
    id: 'alexandria',
    code: 'ALX',
    name: { ar: 'الإسكندرية', en: 'Alexandria' },
    shippingFee: 60,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      {
        id: 'smouha',
        name: { ar: 'سموحة', en: 'Smouha' },
      },
      {
        id: 'sidi-gaber',
        name: { ar: 'سيدي جابر', en: 'Sidi Gaber' },
      },
      {
        id: 'gleem',
        name: { ar: 'جليم', en: 'Gleem' },
      },
      {
        id: 'stanley',
        name: { ar: 'ستانلي', en: 'Stanley' },
      },
      {
        id: 'roushdy',
        name: { ar: 'رشدي', en: 'Roushdy' },
      },
      {
        id: 'loran',
        name: { ar: 'لوران', en: 'Loran' },
      },
      {
        id: 'mandara',
        name: { ar: 'المندرة', en: 'Mandara' },
      },
      {
        id: 'asafra',
        name: { ar: 'العصافرة', en: 'Asafra' },
      },
      {
        id: 'miami',
        name: { ar: 'ميامي', en: 'Miami' },
      },
      {
        id: 'montazah',
        name: { ar: 'المنتزه', en: 'Montazah' },
      },
      {
        id: 'agami',
        name: { ar: 'العجمي', en: 'Agami' },
      },
      {
        id: 'borg-el-arab',
        name: { ar: 'برج العرب', en: 'Borg El Arab' },
      },
    ],
  },
  {
    id: 'qalyubia',
    code: 'KB',
    name: { ar: 'القليوبية', en: 'Qalyubia' },
    shippingFee: 65,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'banha', name: { ar: 'بنها', en: 'Banha' } },
      { id: 'qalyub', name: { ar: 'قليوب', en: 'Qalyub' } },
      { id: 'shubra-el-kheima', name: { ar: 'شبرا الخيمة', en: 'Shubra El Kheima' } },
      { id: 'kanater-khayreya', name: { ar: 'القناطر الخيرية', en: 'El Qanater El Khayreya' } },
      { id: 'khanka', name: { ar: 'الخانكة', en: 'Khanka' } },
      { id: 'tookh', name: { ar: 'طوخ', en: 'Tookh' } },
    ],
  },
  {
    id: 'dakahlia',
    code: 'DK',
    name: { ar: 'الدقهلية', en: 'Dakahlia' },
    shippingFee: 65,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'mansoura', name: { ar: 'المنصورة', en: 'Mansoura' } },
      { id: 'talkha', name: { ar: 'طلخا', en: 'Talkha' } },
      { id: 'mit-ghamr', name: { ar: 'ميت غمر', en: 'Mit Ghamr' } },
      { id: 'senbellawin', name: { ar: 'السنبلاوين', en: 'Senbellawin' } },
      { id: 'dikirnis', name: { ar: 'دكرنس', en: 'Dikirnis' } },
      { id: 'belqas', name: { ar: 'بلقاس', en: 'Belqas' } },
    ],
  },
  {
    id: 'sharqia',
    code: 'SHR',
    name: { ar: 'الشرقية', en: 'Sharqia' },
    shippingFee: 65,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'zagazig', name: { ar: 'الزقازيق', en: 'Zagazig' } },
      { id: '10th-ramadan', name: { ar: 'العاشر من رمضان', en: '10th of Ramadan' } },
      { id: 'bilbeis', name: { ar: 'بلبيس', en: 'Bilbeis' } },
      { id: 'minya-el-qamh', name: { ar: 'منيا القمح', en: 'Minya El Qamh' } },
      { id: 'faqous', name: { ar: 'فاقوس', en: 'Faqous' } },
      { id: 'hehya', name: { ar: 'ههيا', en: 'Hehya' } },
    ],
  },
  {
    id: 'gharbia',
    code: 'GH',
    name: { ar: 'الغربية', en: 'Gharbia' },
    shippingFee: 65,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'tanta', name: { ar: 'طنطا', en: 'Tanta' } },
      { id: 'el-mahalla', name: { ar: 'المحلة الكبرى', en: 'El Mahalla El Kubra' } },
      { id: 'kafr-el-zayat', name: { ar: 'كفر الزيات', en: 'Kafr El Zayat' } },
      { id: 'zefta', name: { ar: 'زفتى', en: 'Zefta' } },
      { id: 'samannoud', name: { ar: 'سمنود', en: 'Samannoud' } },
    ],
  },
  {
    id: 'menoufia',
    code: 'MNF',
    name: { ar: 'المنوفية', en: 'Menoufia' },
    shippingFee: 65,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'shebin-el-koum', name: { ar: 'شبين الكوم', en: 'Shebin El Koum' } },
      { id: 'quesna', name: { ar: 'قويسنا', en: 'Quesna' } },
      { id: 'menouf', name: { ar: 'منوف', en: 'Menouf' } },
      { id: 'ashmoun', name: { ar: 'أشمون', en: 'Ashmoun' } },
      { id: 'berket-el-sabaa', name: { ar: 'بركة السبع', en: 'Berket El Sabaa' } },
      { id: 'sadat-city', name: { ar: 'مدينة السادات', en: 'Sadat City' } },
    ],
  },
  {
    id: 'damietta',
    code: 'DT',
    name: { ar: 'دمياط', en: 'Damietta' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'damietta-city', name: { ar: 'مدينة دمياط', en: 'Damietta City' } },
      { id: 'new-damietta', name: { ar: 'دمياط الجديدة', en: 'New Damietta' } },
      { id: 'ras-el-bar', name: { ar: 'رأس البر', en: 'Ras El Bar' } },
      { id: 'fareskour', name: { ar: 'فارسكور', en: 'Fareskour' } },
      { id: 'zarqa', name: { ar: 'الزرقا', en: 'Zarqa' } },
    ],
  },
  {
    id: 'kafr-el-sheikh',
    code: 'KFS',
    name: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'kafr-el-sheikh-city', name: { ar: 'مدينة كفر الشيخ', en: 'Kafr El Sheikh City' } },
      { id: 'desouk', name: { ar: 'دسوق', en: 'Desouk' } },
      { id: 'fuwwah', name: { ar: 'فوه', en: 'Fuwwah' } },
      { id: 'metobas', name: { ar: 'مطوبس', en: 'Metobas' } },
      { id: 'baltim', name: { ar: 'بلطيم', en: 'Baltim' } },
    ],
  },
  {
    id: 'beheira',
    code: 'BH',
    name: { ar: 'البحيرة', en: 'Beheira' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'damanhour', name: { ar: 'دمنهور', en: 'Damanhour' } },
      { id: 'kafr-el-dawar', name: { ar: 'كفر الدوار', en: 'Kafr El Dawar' } },
      { id: 'edko', name: { ar: 'إدكو', en: 'Edko' } },
      { id: 'rashid', name: { ar: 'رشيد', en: 'Rashid' } },
      { id: 'abu-hummus', name: { ar: 'أبو حمص', en: 'Abu Hummus' } },
      { id: 'wadi-el-natrun', name: { ar: 'وادي النطرون', en: 'Wadi El Natrun' } },
    ],
  },
  {
    id: 'port-said',
    code: 'PTS',
    name: { ar: 'بورسعيد', en: 'Port Said' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'sharq-district', name: { ar: 'حي الشرق', en: 'Sharq District' } },
      { id: 'arab-district', name: { ar: 'حي العرب', en: 'Arab District' } },
      { id: 'manakh-district', name: { ar: 'حي المناخ', en: 'Manakh District' } },
      { id: 'dawahy-district', name: { ar: 'حي الضواحي', en: 'Dawahy District' } },
      { id: 'port-fouad', name: { ar: 'بورفؤاد', en: 'Port Fouad' } },
      { id: 'zohour-district', name: { ar: 'حي الزهور', en: 'Zohour District' } },
    ],
  },
  {
    id: 'ismailia',
    code: 'IS',
    name: { ar: 'الإسماعيلية', en: 'Ismailia' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'ismailia-city', name: { ar: 'مدينة الإسماعيلية', en: 'Ismailia City' } },
      { id: 'fayed', name: { ar: 'فايد', en: 'Fayed' } },
      { id: 'qantara-sharq', name: { ar: 'القنطرة شرق', en: 'Qantara Sharq' } },
      { id: 'qantara-gharb', name: { ar: 'القنطرة غرب', en: 'Qantara Gharb' } },
      { id: 'tall-el-kebir', name: { ar: 'التل الكبير', en: 'Tall El Kebir' } },
    ],
  },
  {
    id: 'suez',
    code: 'SUZ',
    name: { ar: 'السويس', en: 'Suez' },
    shippingFee: 70,
    deliveryEstimateDays: { min: 2, max: 3 },
    isActive: true,
    cities: [
      { id: 'suez-district', name: { ar: 'حي السويس', en: 'Suez District' } },
      { id: 'arbaeen', name: { ar: 'الأربعين', en: 'Al Arbaeen' } },
      { id: 'ataka', name: { ar: 'عتاقة', en: 'Ataka' } },
      { id: 'faisal-suez', name: { ar: 'حي فيصل', en: 'Faisal District' } },
      { id: 'ain-sokhna', name: { ar: 'العين السخنة', en: 'Ain Sokhna' } },
    ],
  },
  {
    id: 'fayoum',
    code: 'FYM',
    name: { ar: 'الفيوم', en: 'Fayoum' },
    shippingFee: 75,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'fayoum-city', name: { ar: 'مدينة الفيوم', en: 'Fayoum City' } },
      { id: 'sinnuris', name: { ar: 'سنورس', en: 'Sinnuris' } },
      { id: 'ibshaway', name: { ar: 'إبشواي', en: 'Ibshaway' } },
      { id: 'tamiyyah', name: { ar: 'طامية', en: 'Tamiyyah' } },
      { id: 'youssef-el-seddiq', name: { ar: 'يوسف الصديق', en: 'Youssef El Seddiq' } },
    ],
  },
  {
    id: 'beni-suef',
    code: 'BNS',
    name: { ar: 'بني سويف', en: 'Beni Suef' },
    shippingFee: 75,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'beni-suef-city', name: { ar: 'مدينة بني سويف', en: 'Beni Suef City' } },
      { id: 'new-beni-suef', name: { ar: 'بني سويف الجديدة', en: 'New Beni Suef' } },
      { id: 'wasta', name: { ar: 'الواسطى', en: 'Al Wasta' } },
      { id: 'nasser', name: { ar: 'ناصر', en: 'Nasser' } },
      { id: 'beba', name: { ar: 'ببا', en: 'Beba' } },
      { id: 'ihnasya', name: { ar: 'إهناسيا', en: 'Ihnasya' } },
    ],
  },
  {
    id: 'minya',
    code: 'MN',
    name: { ar: 'المنيا', en: 'Minya' },
    shippingFee: 80,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'minya-city', name: { ar: 'مدينة المنيا', en: 'Minya City' } },
      { id: 'new-minya', name: { ar: 'المنيا الجديدة', en: 'New Minya' } },
      { id: 'mallawi', name: { ar: 'ملوي', en: 'Mallawi' } },
      { id: 'samalut', name: { ar: 'سمالوط', en: 'Samalut' } },
      { id: 'maghagha', name: { ar: 'مغاغة', en: 'Maghagha' } },
      { id: 'beni-mazar', name: { ar: 'بني مزار', en: 'Beni Mazar' } },
    ],
  },
  {
    id: 'assiut',
    code: 'AST',
    name: { ar: 'أسيوط', en: 'Assiut' },
    shippingFee: 80,
    deliveryEstimateDays: { min: 2, max: 4 },
    isActive: true,
    cities: [
      { id: 'assiut-city', name: { ar: 'مدينة أسيوط', en: 'Assiut City' } },
      { id: 'new-assiut', name: { ar: 'أسيوط الجديدة', en: 'New Assiut' } },
      { id: 'dairut', name: { ar: 'ديروط', en: 'Dairut' } },
      { id: 'manfalut', name: { ar: 'منفلوط', en: 'Manfalut' } },
      { id: 'qusiya', name: { ar: 'القوصية', en: 'Al Qusiya' } },
      { id: 'abnoub', name: { ar: 'أبنوب', en: 'Abnoub' } },
    ],
  },
  {
    id: 'sohag',
    code: 'SHG',
    name: { ar: 'سوهاج', en: 'Sohag' },
    shippingFee: 85,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'sohag-city', name: { ar: 'مدينة سوهاج', en: 'Sohag City' } },
      { id: 'new-sohag', name: { ar: 'سوهاج الجديدة', en: 'New Sohag' } },
      { id: 'akhmim', name: { ar: 'أخميم', en: 'Akhmim' } },
      { id: 'girga', name: { ar: 'جرجا', en: 'Girga' } },
      { id: 'tahta', name: { ar: 'طهطا', en: 'Tahta' } },
      { id: 'maragha', name: { ar: 'المراغة', en: 'Al Maragha' } },
    ],
  },
  {
    id: 'qena',
    code: 'KN',
    name: { ar: 'قنا', en: 'Qena' },
    shippingFee: 85,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'qena-city', name: { ar: 'مدينة قنا', en: 'Qena City' } },
      { id: 'new-qena', name: { ar: 'قنا الجديدة', en: 'New Qena' } },
      { id: 'nagaa-hammadi', name: { ar: 'نجع حمادي', en: 'Nagaa Hammadi' } },
      { id: 'qous', name: { ar: 'قوص', en: 'Qous' } },
      { id: 'deshna', name: { ar: 'دشنا', en: 'Deshna' } },
      { id: 'farshout', name: { ar: 'فرشوط', en: 'Farshout' } },
    ],
  },
  {
    id: 'luxor',
    code: 'LX',
    name: { ar: 'الأقصر', en: 'Luxor' },
    shippingFee: 90,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'luxor-city', name: { ar: 'مدينة الأقصر', en: 'Luxor City' } },
      { id: 'new-luxor', name: { ar: 'طيبة الجديدة', en: 'New Tiba' } },
      { id: 'esna', name: { ar: 'إسنا', en: 'Esna' } },
      { id: 'armant', name: { ar: 'أرمنت', en: 'Armant' } },
      { id: 'qarna', name: { ar: 'القرنة', en: 'Al Qarna' } },
    ],
  },
  {
    id: 'aswan',
    code: 'ASN',
    name: { ar: 'أسوان', en: 'Aswan' },
    shippingFee: 95,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'aswan-city', name: { ar: 'مدينة أسوان', en: 'Aswan City' } },
      { id: 'new-aswan', name: { ar: 'أسوان الجديدة', en: 'New Aswan' } },
      { id: 'kom-ombo', name: { ar: 'كوم أمبو', en: 'Kom Ombo' } },
      { id: 'edfu', name: { ar: 'إدفو', en: 'Edfu' } },
      { id: 'daraw', name: { ar: 'دراو', en: 'Daraw' } },
      { id: 'nasr-el-nuba', name: { ar: 'نصر النوبة', en: 'Nasr El Nuba' } },
    ],
  },
  {
    id: 'red-sea',
    code: 'BA',
    name: { ar: 'البحر الأحمر', en: 'Red Sea' },
    shippingFee: 95,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'hurghada', name: { ar: 'الغردقة', en: 'Hurghada' } },
      { id: 'el-gouna', name: { ar: 'الجونة', en: 'El Gouna' } },
      { id: 'safaga', name: { ar: 'سفاجا', en: 'Safaga' } },
      { id: 'quseir', name: { ar: 'القصير', en: 'El Quseir' } },
      { id: 'marsa-alam', name: { ar: 'مرسى علم', en: 'Marsa Alam' } },
      { id: 'ras-ghareb', name: { ar: 'رأس غارب', en: 'Ras Ghareb' } },
    ],
  },
  {
    id: 'matrouh',
    code: 'MT',
    name: { ar: 'مطروح', en: 'Matrouh' },
    shippingFee: 95,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'marsa-matrouh', name: { ar: 'مرسى مطروح', en: 'Marsa Matrouh' } },
      { id: 'north-coast', name: { ar: 'الساحل الشمالي', en: 'North Coast' } },
      { id: 'el-alamein', name: { ar: 'العلمين', en: 'El Alamein' } },
      { id: 'dabaa', name: { ar: 'الضبعة', en: 'Al Dabaa' } },
      { id: 'siwa', name: { ar: 'سيوة', en: 'Siwa' } },
    ],
  },
  {
    id: 'new-valley',
    code: 'WAD',
    name: { ar: 'الوادي الجديد', en: 'New Valley' },
    shippingFee: 110,
    deliveryEstimateDays: { min: 4, max: 6 },
    isActive: true,
    cities: [
      { id: 'kharga', name: { ar: 'الخارجة', en: 'Al Kharga' } },
      { id: 'dakhla', name: { ar: 'الداخلة', en: 'Al Dakhla' } },
      { id: 'farafra', name: { ar: 'الفرافرة', en: 'Farafra' } },
      { id: 'baris', name: { ar: 'باريس', en: 'Baris' } },
    ],
  },
  {
    id: 'south-sinai',
    code: 'JS',
    name: { ar: 'جنوب سيناء', en: 'South Sinai' },
    shippingFee: 95,
    deliveryEstimateDays: { min: 3, max: 5 },
    isActive: true,
    cities: [
      { id: 'sharm-el-sheikh', name: { ar: 'شرم الشيخ', en: 'Sharm El Sheikh' } },
      { id: 'dahab', name: { ar: 'دهب', en: 'Dahab' } },
      { id: 'nuweiba', name: { ar: 'نويبع', en: 'Nuweiba' } },
      { id: 'taba', name: { ar: 'طابا', en: 'Taba' } },
      { id: 'ras-sedr', name: { ar: 'رأس سدر', en: 'Ras Sedr' } },
      { id: 'tur-sinai', name: { ar: 'طور سيناء', en: 'El Tor' } },
    ],
  },
  {
    id: 'north-sinai',
    code: 'SIN',
    name: { ar: 'شمال سيناء', en: 'North Sinai' },
    shippingFee: 110,
    deliveryEstimateDays: { min: 4, max: 6 },
    isActive: true,
    cities: [
      { id: 'el-arish', name: { ar: 'العريش', en: 'El Arish' } },
      { id: 'bir-al-abd', name: { ar: 'بئر العبد', en: 'Bir Al Abd' } },
      { id: 'sheikh-zuweid', name: { ar: 'الشيخ زويد', en: 'Sheikh Zuweid' } },
      { id: 'nakhl', name: { ar: 'نخل', en: 'Nakhl' } },
      { id: 'hasana', name: { ar: 'الحسنة', en: 'Al Hasana' } },
    ],
  },
];

export function getGovernorateById(id: string): EgyptianGovernorate | undefined {
  return EGYPTIAN_GOVERNORATES.find((g) => g.id === id);
}

export function getShippingFeeForGovernorate(governorateId: string): number {
  const gov = getGovernorateById(governorateId);
  return gov ? gov.shippingFee : 60;
}
