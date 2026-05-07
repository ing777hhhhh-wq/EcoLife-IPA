export interface Challenge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  points: number;
  category: "water" | "energy" | "transport" | "food" | "waste";
  icon: string;
  frequency: "daily" | "weekly";
}

export interface Tip {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  category: "water" | "energy" | "transport" | "food" | "waste" | "nature";
  icon: string;
  impact: "low" | "medium" | "high";
}

export interface Badge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  pointsRequired: number;
  color: string;
}

export interface EcoFact {
  id: string;
  fact: string;
  factAr: string;
  icon: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Use Reusable Bags",
    titleAr: "استخدم أكياس قابلة لإعادة الاستخدام",
    description: "Avoid plastic bags today",
    descriptionAr: "تجنب الأكياس البلاستيكية اليوم",
    points: 10,
    category: "waste",
    icon: "shopping-bag",
    frequency: "daily",
  },
  {
    id: "c2",
    title: "5-Minute Shower",
    titleAr: "دش بـ 5 دقائق",
    description: "Keep your shower under 5 minutes",
    descriptionAr: "اجعل دشك أقل من 5 دقائق",
    points: 15,
    category: "water",
    icon: "droplet",
    frequency: "daily",
  },
  {
    id: "c3",
    title: "Walk or Cycle",
    titleAr: "المشي أو ركوب الدراجة",
    description: "Use active transport instead of a car",
    descriptionAr: "استخدم وسيلة نقل نشطة بدلاً من السيارة",
    points: 20,
    category: "transport",
    icon: "activity",
    frequency: "daily",
  },
  {
    id: "c4",
    title: "Plant-Based Meal",
    titleAr: "وجبة نباتية",
    description: "Eat at least one plant-based meal",
    descriptionAr: "تناول وجبة نباتية واحدة على الأقل",
    points: 15,
    category: "food",
    icon: "feather",
    frequency: "daily",
  },
  {
    id: "c5",
    title: "Unplug Devices",
    titleAr: "افصل الأجهزة",
    description: "Unplug unused electronics",
    descriptionAr: "افصل الإلكترونيات غير المستخدمة",
    points: 10,
    category: "energy",
    icon: "zap-off",
    frequency: "daily",
  },
  {
    id: "c6",
    title: "No Meat Day",
    titleAr: "يوم بلا لحوم",
    description: "Go meat-free for the entire day",
    descriptionAr: "أمضِ يوماً كاملاً بدون لحوم",
    points: 25,
    category: "food",
    icon: "coffee",
    frequency: "daily",
  },
  {
    id: "c7",
    title: "Recycle Properly",
    titleAr: "إعادة التدوير بشكل صحيح",
    description: "Sort all your waste correctly",
    descriptionAr: "فرز جميع النفايات بشكل صحيح",
    points: 20,
    category: "waste",
    icon: "refresh-ccw",
    frequency: "daily",
  },
  {
    id: "c8",
    title: "Turn Off Lights",
    titleAr: "أطفئ الأضواء",
    description: "Turn off lights when leaving a room",
    descriptionAr: "أطفئ الأضواء عند مغادرة الغرفة",
    points: 10,
    category: "energy",
    icon: "zap-off",
    frequency: "daily",
  },
  {
    id: "c9",
    title: "Plant a Tree",
    titleAr: "ازرع شجرة",
    description: "Plant or help plant a tree this week",
    descriptionAr: "ازرع شجرة أو ساعد في زراعتها هذا الأسبوع",
    points: 50,
    category: "nature",
    icon: "sun",
    frequency: "weekly",
  } as Challenge & { category: "nature" },
  {
    id: "c10",
    title: "Collect Litter",
    titleAr: "التقط القمامة",
    description: "Pick up 5 pieces of litter today",
    descriptionAr: "التقط 5 قطع من القمامة اليوم",
    points: 30,
    category: "waste",
    icon: "trash-2",
    frequency: "daily",
  },
  {
    id: "c11",
    title: "Cold Water Wash",
    titleAr: "غسيل بالماء البارد",
    description: "Wash clothes in cold water",
    descriptionAr: "اغسل الملابس بالماء البارد",
    points: 15,
    category: "energy",
    icon: "tag",
    frequency: "weekly",
  },
  {
    id: "c12",
    title: "Use Public Transport",
    titleAr: "استخدم المواصلات العامة",
    description: "Take public transport instead of driving",
    descriptionAr: "استخدم المواصلات العامة بدلاً من القيادة",
    points: 20,
    category: "transport",
    icon: "truck",
    frequency: "daily",
  },
];

export const TIPS: Tip[] = [
  {
    id: "t1",
    title: "Save Water While Brushing",
    titleAr: "وفر الماء أثناء تنظيف الأسنان",
    content: "Turn off the tap while brushing your teeth. You can save up to 8 liters per minute.",
    contentAr: "أغلق الصنبور أثناء تنظيف أسنانك. يمكنك توفير ما يصل إلى 8 لترات في الدقيقة.",
    category: "water",
    icon: "droplet",
    impact: "medium",
  },
  {
    id: "t2",
    title: "LED Bulbs Save Energy",
    titleAr: "المصابيح LED توفر الطاقة",
    content: "Switch to LED bulbs. They use 75% less energy and last 25 times longer than incandescent bulbs.",
    contentAr: "انتقل إلى مصابيح LED. تستهلك 75% طاقة أقل وتدوم 25 مرة أطول من المصابيح التقليدية.",
    category: "energy",
    icon: "zap",
    impact: "high",
  },
  {
    id: "t3",
    title: "Bring a Reusable Bottle",
    titleAr: "احضر قنينة معاد استخدامها",
    content: "Using a reusable water bottle can save hundreds of plastic bottles per year from landfills.",
    contentAr: "استخدام قنينة ماء معاد استخدامها يمكن أن يوفر مئات القناني البلاستيكية سنوياً من مكبات النفايات.",
    category: "waste",
    icon: "droplet",
    impact: "medium",
  },
  {
    id: "t4",
    title: "Eat Less Red Meat",
    titleAr: "تناول اللحوم الحمراء بشكل أقل",
    content: "Producing 1 kg of beef generates 27 kg of CO2. Reducing meat consumption is one of the most impactful changes you can make.",
    contentAr: "إنتاج كيلوغرام واحد من اللحم البقري يولد 27 كيلوغراماً من CO2. تقليل استهلاك اللحوم من أكثر التغييرات تأثيراً.",
    category: "food",
    icon: "heart",
    impact: "high",
  },
  {
    id: "t5",
    title: "Carpool or Share Rides",
    titleAr: "شارك في السيارة",
    content: "Sharing rides with others reduces CO2 emissions significantly and saves money on fuel.",
    contentAr: "مشاركة السيارة مع الآخرين تقلل انبعاثات CO2 بشكل كبير وتوفر المال على الوقود.",
    category: "transport",
    icon: "truck",
    impact: "high",
  },
  {
    id: "t6",
    title: "Compost Food Waste",
    titleAr: "سماد النفايات الغذائية",
    content: "Composting food scraps reduces methane from landfills and creates nutrient-rich soil.",
    contentAr: "تسميد نفايات الطعام يقلل من الميثان في مكبات النفايات ويخلق تربة غنية بالمغذيات.",
    category: "food",
    icon: "refresh-ccw",
    impact: "medium",
  },
  {
    id: "t7",
    title: "Fix Leaky Faucets",
    titleAr: "إصلاح الصنابير المتسربة",
    content: "A dripping faucet can waste over 11,000 liters of water per year. Fix leaks promptly.",
    contentAr: "صنبور متسرب يمكنه إهدار أكثر من 11,000 لتر من الماء سنوياً. أصلح التسربات على الفور.",
    category: "water",
    icon: "tool",
    impact: "high",
  },
  {
    id: "t8",
    title: "Unplug When Not in Use",
    titleAr: "افصل الكابلات عند عدم الاستخدام",
    content: "Electronics on standby still consume power. Unplug chargers and appliances when not in use.",
    contentAr: "الإلكترونيات في وضع الاستعداد لا تزال تستهلك الطاقة. افصل الشواحن والأجهزة عند عدم استخدامها.",
    category: "energy",
    icon: "power",
    impact: "low",
  },
  {
    id: "t9",
    title: "Buy Local Produce",
    titleAr: "اشترِ المنتجات المحلية",
    content: "Local food travels shorter distances, reducing transport emissions and supporting your community.",
    contentAr: "الطعام المحلي يقطع مسافات أقصر، مما يقلل من انبعاثات النقل ويدعم مجتمعك.",
    category: "food",
    icon: "shopping-bag",
    impact: "medium",
  },
  {
    id: "t10",
    title: "Use Stairs",
    titleAr: "استخدم الدرج",
    content: "Taking stairs instead of elevators saves electricity and keeps you fit at the same time.",
    contentAr: "استخدام الدرج بدلاً من المصعد يوفر الكهرباء ويبقيك بصحة جيدة في نفس الوقت.",
    category: "energy",
    icon: "trending-up",
    impact: "low",
  },
  {
    id: "t11",
    title: "Shorter Showers",
    titleAr: "دش أقصر",
    content: "Every minute saved in the shower saves about 10 liters of water. Try a 5-minute shower.",
    contentAr: "كل دقيقة يتم توفيرها في الدش توفر حوالي 10 لترات من الماء. جرب دشاً لمدة 5 دقائق.",
    category: "water",
    icon: "droplet",
    impact: "medium",
  },
  {
    id: "t12",
    title: "Plant Native Trees",
    titleAr: "ازرع أشجاراً محلية",
    content: "Native plants require less water and maintenance, and provide habitat for local wildlife.",
    contentAr: "النباتات المحلية تحتاج إلى ماء وصيانة أقل، وتوفر موطناً للحياة البرية المحلية.",
    category: "nature",
    icon: "sun",
    impact: "high",
  },
];

export const BADGES: Badge[] = [
  {
    id: "b1",
    title: "Green Beginner",
    titleAr: "المبتدئ الأخضر",
    description: "Earn your first 50 points",
    descriptionAr: "اكسب أول 50 نقطة",
    icon: "feather",
    pointsRequired: 50,
    color: "#A5D6A7",
  },
  {
    id: "b2",
    title: "Eco Warrior",
    titleAr: "محارب البيئة",
    description: "Reach 150 points",
    descriptionAr: "احصل على 150 نقطة",
    icon: "shield",
    pointsRequired: 150,
    color: "#66BB6A",
  },
  {
    id: "b3",
    title: "Nature Guardian",
    titleAr: "حارس الطبيعة",
    description: "Reach 300 points",
    descriptionAr: "احصل على 300 نقطة",
    icon: "star",
    pointsRequired: 300,
    color: "#2D7D46",
  },
  {
    id: "b4",
    title: "Planet Hero",
    titleAr: "بطل الكوكب",
    description: "Reach 500 points",
    descriptionAr: "احصل على 500 نقطة",
    icon: "globe",
    pointsRequired: 500,
    color: "#1B5E20",
  },
  {
    id: "b5",
    title: "Eco Legend",
    titleAr: "أسطورة البيئة",
    description: "Reach 1000 points",
    descriptionAr: "احصل على 1000 نقطة",
    icon: "star",
    pointsRequired: 1000,
    color: "#FFC107",
  },
];

export const ECO_FACTS: EcoFact[] = [
  {
    id: "f1",
    fact: "Every year, 8 million metric tons of plastic end up in the oceans.",
    factAr: "كل عام، 8 ملايين طن متري من البلاستيك ينتهي بها المطاف في المحيطات.",
    icon: "wind",
  },
  {
    id: "f2",
    fact: "A single tree can absorb as much as 21 kg of CO2 per year.",
    factAr: "شجرة واحدة يمكنها استيعاب ما يصل إلى 21 كيلوغراماً من CO2 سنوياً.",
    icon: "sun",
  },
  {
    id: "f3",
    fact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    factAr: "إعادة تدوير علبة ألمنيوم واحدة يوفر طاقة كافية لتشغيل التلفاز لمدة 3 ساعات.",
    icon: "refresh-ccw",
  },
  {
    id: "f4",
    fact: "If everyone ate plant-based one day per week, CO2 emissions would drop by 1.2 billion tons.",
    factAr: "إذا أكل الجميع طعاماً نباتياً يوماً واحداً في الأسبوع، ستنخفض انبعاثات CO2 بمقدار 1.2 مليار طن.",
    icon: "feather",
  },
  {
    id: "f5",
    fact: "The average person uses about 100 plastic bags per year.",
    factAr: "يستخدم الشخص العادي حوالي 100 كيس بلاستيكي في السنة.",
    icon: "shopping-bag",
  },
  {
    id: "f6",
    fact: "Solar energy is the most abundant energy source on Earth.",
    factAr: "الطاقة الشمسية هي أكثر مصادر الطاقة وفرة على الأرض.",
    icon: "sun",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  water: "#1E88E5",
  energy: "#FDD835",
  transport: "#FF7043",
  food: "#8BC34A",
  waste: "#78909C",
  nature: "#2D7D46",
};

export const CATEGORY_LABELS: Record<string, string> = {
  water: "الماء",
  energy: "الطاقة",
  transport: "التنقل",
  food: "الطعام",
  waste: "النفايات",
  nature: "الطبيعة",
};
