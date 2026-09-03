export interface DareQuestion {
  id: string;
  textAr: string;
  textEn: string;
}

export const DARE_LIST: DareQuestion[] = [
  {
    id: 'dare_1',
    textAr: 'لا يُسمح لك بقول كلمتي “نعم” أو “لا” لبقية اللعبة، وإذا قلت إحداهما تنفذ عقاباً',
    textEn: 'You are forbidden from saying "Yes" or "No" for the rest of the game. If you say either, you face a penalty!',
  },
  {
    id: 'dare_2',
    textAr: 'في كل مرة يوجه فيها شخص حديثه إليك، يجب أن ترد عليه بسؤال فقط.',
    textEn: 'Every time someone speaks to you, you must answer back with a question only.',
  },
  {
    id: 'dare_3',
    textAr: 'يُمنع عليك استخدام يدك اليمنى (أو اليسرى إذا كنت أعسر) حتى ينتهي اللعب.',
    textEn: 'You are not allowed to use your dominant hand (right if right-handed, left if left-handed) until the game ends.',
  },
  {
    id: 'dare_4',
    textAr: 'استبدل اسمك بـ “القط المفترس” حتى نهاية اللعبة، ولا ترد على أي شخص يناديك باسمك الحقيقي.',
    textEn: 'Replace your name with "The Predator Cat" until the game ends. Do not answer anyone calling your real name!',
  },
  {
    id: 'dare_5',
    textAr: 'يجب أن تضحك بشكل شرير بصوت عالٍ بعد كل مرة تتحدث فيها، مهما كان الموضوع جاداً. لبقية اللعبة.',
    textEn: 'You must burst into an evil villain laugh out loud after every time you speak, no matter how serious the topic is!',
  },
  {
    id: 'dare_6',
    textAr: 'كلما نطق شخص باسمك في الغرفة، يجب أن تصفق ثلاث مرات. حتى نهاية اللعبة',
    textEn: 'Whenever anyone says your name in the room, you must clap three times. Until the game ends!',
  },
  {
    id: 'dare_7',
    textAr: 'تحدث ببطء شديد وكأنك في مشهد بالتصوير البطيء حتى نهاية الجولة',
    textEn: 'Speak in extreme slow motion as if you are in a cinematic slow-mo scene until the round finishes.',
  },
  {
    id: 'dare_8',
    textAr: 'تناول ملعقة صغيرة صلصة حارة دون شرب ماء لمدة دقيقة.',
    textEn: 'Eat a small spoonful of hot sauce (harissa) without drinking water for a full minute.',
  },
  {
    id: 'dare_9',
    textAr: 'دع المجموعة تخلط لك مشروباً من ثلاثة مكونات صالحة للشرب من الثلاجة، واشرب كأساً صغيراً منه.',
    textEn: 'Let the group concoct a potion using three edible ingredients from the fridge, and drink a small glass of it.',
  },
  {
    id: 'dare_10',
    textAr: 'كُل شريحة ليمون كاملة وحاول ألا تغير تعابير وجهك على الإطلاق.',
    textEn: 'Eat a whole slice of raw lemon and keep an absolute deadpan face without wincing.',
  },
  {
    id: 'dare_11',
    textAr: 'امضغ فص ثوم نيئاً أو قطعة صغيرة من البصل.',
    textEn: 'Chew a raw clove of garlic or a piece of raw onion.',
  },
  {
    id: 'dare_12',
    textAr: 'كول بطاطا صغيرة كاملا',
    textEn: 'Eat an entire small cooked potato in one bite.',
  },
  {
    id: 'dare_13',
    textAr: 'أغمض عينيك، ودع المجموعة تختار لك طعاماً تعرف أنه مناسب لك، ثم تذوقه وحاول تخمينه',
    textEn: 'Close your eyes, let the group feed you a mystery edible food, and guess what it is.',
  },
  {
    id: 'dare_14',
    textAr: 'قم بعمل 10 تمرين ضغط متتالية، وإذا توقفت تبدأ من جديد.',
    textEn: 'Do 10 consecutive push-ups; if you pause, restart from 1!',
  },
  {
    id: 'dare_15',
    textAr: 'قف على قدم واحدة وارفع يديك في الهواء، وابقَ هكذا وغني ياليلي ويا ليلة وش نشكيلك يايما...',
    textEn: 'Stand on one foot with hands in the air and loudly sing "Ya Lili w Ya Lila wech nechkilk ya yemma..."',
  },
  {
    id: 'dare_16',
    textAr: 'حاول أن تلعق كوعك، أو استمر في المحاولة بجدية تامة لمدة دقيقة.',
    textEn: 'Try to lick your own elbow, or attempt it earnestly for a full minute.',
  },
  {
    id: 'dare_17',
    textAr: 'ضع كتاباً على رأسك وامشِ في خط مستقيم ذهاباً وإياباً ثلاث مرات دون أن يقع.',
    textEn: 'Balance a book on your head and walk in a straight line back and forth three times without letting it drop.',
  },
  {
    id: 'dare_18',
    textAr: 'قم بعمل تمرين “البلانك” لمدة دقيقة كاملة بينما يلقي الباقون نكاتاً لمحاولة إضحاكك وإسقاطك.',
    textEn: 'Hold a plank position for one full minute while everyone else tells jokes to make you laugh and collapse.',
  },
  {
    id: 'dare_19',
    textAr: 'ضع قطعة صغيرة ونظيفة من الطعام على طبق أو طاولة، وحاول التقاطها بفمك فقط ويداك خلف ظهرك.',
    textEn: 'Pick up a clean bite of food from a plate using only your mouth with hands behind your back.',
  },
  {
    id: 'dare_20',
    textAr: 'اركض في مكانك بأقصى سرعة ممكنة لمدة دقيقة.',
    textEn: 'Sprint in place at top speed for a full 60 seconds.',
  },
  {
    id: 'dare_21',
    textAr: 'اتخذ وضعية تمثال يختارها لك اللاعبون، وابقَ ثابتاً تماماً لمدة 30 ثانية مهما حاولوا إضحاكك.',
    textEn: 'Freeze in a funny statue pose chosen by the players and stay dead still for 30 seconds while they try to break you.',
  },
  {
    id: 'dare_22',
    textAr: 'أرسل رسالة صوتية لصديق عشوائي تغني فيها شارة مسلسل كرتوني قديم.',
    textEn: 'Send a voice note to a random friend singing an old cartoon theme song.',
  },
  {
    id: 'dare_23',
    textAr: 'انشر صورة مضحكة أو غير مفهومة لك على “ستوري” إنستغرام، واتركها لمدة 15 دقيقة قبل حذفها.',
    textEn: 'Post a ridiculous or confusing picture of yourself on your Instagram story for 15 minutes before deleting.',
  },
  {
    id: 'dare_24',
    textAr: 'افتح سجل البحث في يوتيوب أو جوجل، واقرأ آخر 5 أشياء بحثت عنها بصوت عالٍ.',
    textEn: 'Open your YouTube or Google search history and read the last 5 searches out loud.',
  },
  {
    id: 'dare_25',
    textAr: 'أرسل رمزاً تعبيرياً لقلب مكسور إلى الشخص رقم 7 في قائمة جهات الاتصال الخاصة بك دون كتابة أي كلمة أخرى.',
    textEn: 'Send a broken heart emoji 💔 to the 7th contact in your phone list with zero explanation.',
  },
  {
    id: 'dare_26',
    textAr: 'غيّر صورتك الشخصية على أحد حساباتك إلى صورة حيوان مضحك لمدة ساعة.',
    textEn: 'Change your profile picture on WhatsApp or Instagram to a goofy animal for one hour.',
  },
  {
    id: 'dare_27',
    textAr: 'أرسل رسالة إلى أحد أصدقائك المقربين تقول فيها: “أنا أعرف ما فعلته الصيف الماضي”.',
    textEn: 'Text a close friend: "I know what you did last summer," and do not elaborate.',
  },
  {
    id: 'dare_28',
    textAr: 'أرسل رسالة إلى أحد والديك أو إخوتك تقول فيها: “هل يمكنني تبني تمساح؟” وانتظر ردهم.',
    textEn: 'Text your parents or sibling: "Can I adopt a pet crocodile?" and wait for their reaction.',
  },
  {
    id: 'dare_29',
    textAr: 'مثل حدثا يعرفه اصدقائك بدون صوت وهم يحاولون التخميين',
    textEn: 'Act out a memorable event your friends know using only silent gestures until they guess it.',
  },
  {
    id: 'dare_30',
    textAr: 'افتح تطبيق الموسيقى وابحث عن أغنية تذكرك بأحد الموجودين، شغّل عشر ثوانٍ ودعهم يخمنون من هو.',
    textEn: 'Play 10 seconds of a song that reminds you of someone in the room, and let them guess who it is.',
  },
  {
    id: 'dare_31',
    textAr: 'التقط سيلفي وأنت تحاول النفخ في خديك وإغلاق عين ورفع حاجب في الوقت نفسه، من محاولة واحدة.',
    textEn: 'Snap a selfie puffing your cheeks, winking one eye, and raising one eyebrow all at once in one attempt.',
  },
  {
    id: 'dare_32',
    textAr: 'مثّل خمس عطسات متتالية، لكن يجب أن تكون كل عطسة أصغر وأهدأ من التي قبلها.',
    textEn: 'Act out five consecutive sneezes, with each sneeze progressively tinier and quieter than the last.',
  },
  {
    id: 'dare_33',
    textAr: 'افتح مؤقت الهاتف وحاول إيقافه عند 5.55 ثوانٍ بالضبط. لديك محاولتان اذا اخطأت تضرب',
    textEn: 'Open your phone stopwatch and stop it at exactly 5.55 seconds! You have two tries.',
  },
  {
    id: 'dare_34',
    textAr: 'حتى يأتي دورك القادم، ممنوع عليك الالتفات برأسك؛ إذا أردت النظر إلى جانبك عليك تدوير جسمك كله.',
    textEn: 'Until your next turn, you cannot turn your neck; to look sideways you must rotate your whole body.',
  },
  {
    id: 'dare_35',
    textAr: 'اقفز في مكانك ثماني مرات، وفي كل قفزة غيّر تعبير وجهك تماماً.',
    textEn: 'Jump in place eight times, changing your facial expression dramatically on every single bounce.',
  },
  {
    id: 'dare_36',
    textAr: 'حتى دورك القادم، عليك الجلوس على طرف الكرسي وكأن الكرسي لا يثق بك وأنت لا تثق به.',
    textEn: 'Until your next turn, sit precariously on the very edge of your chair like neither of you trusts the other.',
  },
  {
    id: 'dare_37',
    textAr: 'حتى يأتي دورك القادم، عليك أن تنهي كل جملة تقولها بصوت «تن تن تن».',
    textEn: 'Until your next turn, end every sentence you utter with "Ten ten ten!"',
  },
  {
    id: 'dare_38',
    textAr: 'حتى يأتي دورك القادم، كلما قال أحد «اسمك» عليك أن تتجمد مكانك لثانيتين.',
    textEn: 'Until your next turn, every time someone says your name, freeze completely for 2 seconds.',
  },
  {
    id: 'dare_39',
    textAr: 'حتى يأتي دورك القادم، عليك الحفاظ على تواصل بصري مع كل شخص يتحدث إليك حتى ينهي كلامه.',
    textEn: 'Until your next turn, keep unwavering, unblinking eye contact with whoever speaks to you.',
  },
  {
    id: 'dare_40',
    textAr: 'استخدم يدك غير المعتادة فقط حتى يأتي دورك القادم. خبئها او ضعها خلف يدك',
    textEn: 'Use only your non-dominant hand until your next turn. Keep the other hand hidden behind your back.',
  },
  {
    id: 'dare_41',
    textAr: 'أمسك أذنك اليمنى بيدك اليسرى وأنفك بيدك اليمنى، ثم بدّل اليدين خمس مرات بسرعة من دون أن تخطئ.',
    textEn: 'Touch your right ear with left hand and your nose with right hand, then rapidly swap five times without failing.',
  },
  {
    id: 'dare_42',
    textAr: 'دندن أغنية معروفة من دون كلمات حتى يخمنها أحد.',
    textEn: 'Hum a famous melody with no words until someone in the room guesses the song.',
  },
  {
    id: 'dare_43',
    textAr: 'احضر 5 أشياء من نفس اللون',
    textEn: 'Find and bring 5 objects of the exact same color in 30 seconds.',
  },
  {
    id: 'dare_44',
    textAr: 'المس 5 اشياء من نفس اللون',
    textEn: 'Touch 5 different items of the exact same color in the room.',
  },
  {
    id: 'dare_45',
    textAr: 'قلد شخصًا من المجموعة بدون ذكر اسمه',
    textEn: 'Impersonate someone in this group without saying their name until they identify who it is.',
  },
  {
    id: 'dare_46',
    textAr: 'تحدث مع كوب أو وسادة كأنها أعز صديق لك',
    textEn: 'Have a passionate conversation with a cup or a pillow as if it was your best friend.',
  },
];

export function getRandomDare(excludeId?: string): DareQuestion {
  const filtered = excludeId ? DARE_LIST.filter(d => d.id !== excludeId) : DARE_LIST;
  const list = filtered.length > 0 ? filtered : DARE_LIST;
  return list[Math.floor(Math.random() * list.length)];
}
