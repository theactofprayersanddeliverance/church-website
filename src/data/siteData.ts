import { SiteInfo, PastorInfo, ServiceItem, EventItem, SpecialVigil, FaqItem, VideoItem, TestimonyItem, BookItem, GiveMethod, LiveState } from '../types';

export const SITE: SiteInfo = {
  name: "The Act of Prayers and Deliverance Ministries International",
  short: "Act of Prayers & Deliverance Ministries",
  tagline: "Faith that transforms lives.",
  address: "Ubachukwu, amala ngor okpala, imo state, Nigeria",
  phone: "+234 (0) 800-PRAYERS",
  email: "theactofprayersanddeliverance@gmail.com",
  logoImage: "images/logo.png"
};

export const PASTOR: PastorInfo = {
  name: "Pastor Israel Revelation",
  title: "Founder and General Overseer",
  photoUrl: "images/i1.jpg",
  bio: [
    "Pastor Israel Revelation is the founder and General Overseer of The Act of Prayers and Deliverance Ministries International. Called with an apostolic burden for revival, fervent prayer, and biblical deliverance, God has used his ministry to transform countless lives, restore wounded souls, and bring liberty to the oppressed.",
    "His life and teaching are deeply rooted in prayer, the authority of the believer, and raising disciples who stand boldly upon the Word of God in righteousness and victory."
  ],
  coupleNames: "Pastor and Pastor Mrs Israel Revelation",
  coupleTitle: "General Overseer & First Lady",
  couplePhotoUrl: "images/i2.jpg",
  coupleBio: [
    "Pastor and Pastor Mrs Israel Revelation labor tirelessly together in spiritual leadership, shepherding the household of faith with wisdom, unconditional love, and spiritual maturity.",
    "Their united devotion serves as an anchor for families within the ministry, mentoring leaders and cultivating a warm, welcoming sanctuary where everyone can encounter God."
  ]
};

export const SERVICES: ServiceItem[] = [
  { id: 1, name: "Sunday Worship & Deliverance Service", day: 0, time: "09:00", venue: "Main Sanctuary" },
  { id: 2, name: "Youth Fellowship & Men's Fellowship", day: 1, time: "16:00", venue: "Fellowship Hall" },
  { id: 3, name: "Prayer Group Meeting", day: 1, time: "16:30", venue: "Main Sanctuary" },
  { id: 4, name: "Bible Study", day: 2, time: "16:00", venue: "Main Sanctuary" },
  { id: 5, name: "Choir Practice & Rehearsal", day: 3, time: "16:00", venue: "Music Wing" },
  { id: 6, name: "Choir Practice & Rehearsal", day: 6, time: "16:00", venue: "Music Wing" }
];

export const VIGILS: SpecialVigil[] = [
  {
    id: 1,
    title: "Workers' Night Vigil",
    subtitle: "Ministers & Church Workers Consecration",
    schedule: "Every 2nd Thursday of Every Month",
    time: "10:00 PM till Dawn",
    venue: "Main Sanctuary",
    info: "An intense, spirit-filled all-night prayer and leadership consecration meeting dedicated to church workers, leaders, and ministers."
  },
  {
    id: 2,
    title: "THE LAST NIGHT IN EGYPT",
    subtitle: "Monthly General Deliverance & Breakthrough Night Vigil",
    schedule: "Every Last Day of Every Month",
    time: "10:00 PM till Dawn",
    venue: "Main Sanctuary",
    info: "Our flagship general all-night deliverance vigil titled 'THE LAST NIGHT IN EGYPT' — a prophetic gathering where yokes are broken, ancestral bondages are destroyed, and God's people cross into freedom."
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "THE LAST NIGHT IN EGYPT (General Night Vigil)",
    date: "2026-10-31",
    time: "10:00 PM till Dawn",
    venue: "Main Sanctuary",
    info: "Our monthly general night vigil titled 'THE LAST NIGHT IN EGYPT' — every last day of every month. Total freedom, breakthrough prayer, and prophetic deliverance."
  },
  {
    id: 2,
    title: "Workers' Night Vigil",
    date: "2026-11-12",
    time: "10:00 PM till Dawn",
    venue: "Main Sanctuary",
    info: "Every second Thursday of the month. Consecration and spiritual empowerment for all church workers."
  },
  {
    id: 3,
    title: "THE LAST NIGHT IN EGYPT (Next Edition)",
    date: "2026-11-30",
    time: "10:00 PM till Dawn",
    venue: "Main Sanctuary",
    info: "General all-night vigil celebrating supernatural deliverance and victory over every oppression."
  }
];

export const TESTIMONIES: TestimonyItem[] = [
  { id: 1, name: "Sister Grace", title: "Healed after years of sickness", summary: "After a season of intense prayer and deliverance, I was completely healed. The doctors could not explain it, but God had the final word.", date: "2026-08-16", youtubeId: "" },
  { id: 2, name: "Brother Samuel", title: "Delivered from fear and anxiety", summary: "I came into the sanctuary bound by constant panic and insomnia. Through prayers, I left with supernatural peace that surpassed all understanding.", date: "2026-07-05", youtubeId: "" },
  { id: 3, name: "The Adebayo Family", title: "A marriage restored by grace", summary: "We were at the brink of divorce. Through pastoral counsel, prayer, and the love of Christ, God completely restored our home.", date: "2026-05-24", youtubeId: "" },
  { id: 4, name: "Brother Michael", title: "Open doors after two years of unemployment", summary: "I kept serving God and praying faithfully. God miraculously opened an executive door no man could shut.", date: "2026-03-29", youtubeId: "" },
  { id: 5, name: "Sister Deborah", title: "Set free from generational oppression", summary: "Chains of oppression that had plagued my family for decades were broken during our Prayer and Deliverance Night.", date: "2026-02-08", youtubeId: "" },
  { id: 6, name: "Brother David", title: "The miracle of answered prayer", summary: "Doctors said it was biologically impossible, but after we laid our request on the altar, God gave us our miracle baby.", date: "2025-12-14", youtubeId: "" }
];

export const BOOKS: BookItem[] = [
  { id: 1, title: "Anchored in Prayer", sub: "Spiritual warfare & study guide", color: "#26282b", link: "#/contact" },
  { id: 2, title: "Daily Bread of Life", sub: "30-day spiritual devotional", color: "#4a4033", link: "#/contact" },
  { id: 3, title: "First Steps in Christ", sub: "Foundational guide for new believers", color: "#34363a", link: "#/contact" },
  { id: 4, title: "Deliverance Prayer Journal", sub: "Guided scriptural prayer book", color: "#6a5a40", link: "#/contact" }
];

export const GIVE_METHODS: GiveMethod[] = [
  { id: 1, label: "Give online", detail: "Give tithes, offerings, and special seeds securely using your debit card or electronic transfer.", url: "" },
  { id: 2, label: "Bank transfer", detail: "Bank Name: First International Bank | Account Name: Act of Prayers Ministries | Account Number: 1029384756", url: "" },
  { id: 3, label: "Give in person", detail: "Offering envelopes and electronic POS terminals are available during all our weekly and special services.", url: "" }
];

export const BANK_ACCOUNTS = {
  offering: {
    bankName: "First Bank of Nigeria",
    accountName: "The Act of Prayers & Deliverance Ministries (Offering)",
    accountNumber: "2034981275",
    description: "For weekly offerings, tithes, sacrificial giving, and thanksgiving seeds."
  },
  donation: {
    bankName: "Zenith Bank PLC",
    accountName: "The Act of Prayers & Deliverance Ministries (Projects & Missions)",
    accountNumber: "1018472930",
    description: "For church building project, missionary support, crusade outreaches, and welfare."
  }
};

export const LIVE_DEFAULT: LiveState = {
  isLive: false,
  title: "Sunday Worship and Deliverance Service",
  subject: "The Mystery of Answered Prayers",
  speaker: "Pastor Israel Revelation",
  youtubeId: "y7CLuQTWGSM",
  viewers: 142,
  description: "Join Pastor Israel Revelation for an impactful service filled with heartfelt worship, deep spiritual revelation, and breakthrough prayer."
};

export const SEED_COMMENTS = [
  { author: "Grace A.", message: "Good morning church! Watching from London. Glory to God!" },
  { author: "Samuel O.", message: "Watching with my family. Amen and Amen!" },
  { author: "Mary K.", message: "This worship is lifting my spirit so powerfully today." },
  { author: "Brother Emmanuel", message: "Pastor Israel, more grace! God bless this altar." }
];

// Generate comprehensive archive of videos, starting with real video
function generateVideos(): VideoItem[] {
  const list: VideoItem[] = [];
  // Real video
  list.push({
    id: 100,
    youtubeId: "y7CLuQTWGSM",
    title: "The Mystery of Answered Prayers & Deliverance",
    subject: "Open Heavens Series",
    speaker: "Pastor Israel Revelation",
    category: "Sunday Service",
    date: "2026-10-07",
    duration: "1 hr 25 min",
    thumbUrl: "",
    description: "An anointed and life-changing sermon by Pastor Israel Revelation exploring biblical principles of persistent prayer, breaking demonic obstacles, and walking in divine authority."
  });

  const a = ["The Power of", "Walking in", "Standing on", "Living by", "The Mystery of", "Breaking Through with", "Rooted in", "Rising in"];
  const b = ["Prayer", "Faith", "Deliverance", "Grace", "Fasting", "the Holy Spirit", "Praise", "Divine Favor"];
  const series = ["Open Heavens", "Chains Broken", "Walk of Faith", "Spiritual Authority"];
  const cats = ["Sunday Service", "Bible Study", "Deliverance Night", "Special Service"];
  const start = new Date(2020, 0, 10);

  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 70);
    const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    list.push({
      id: i + 1,
      title: `${a[i % a.length]} ${b[Math.floor(i / 4) % b.length]}`,
      subject: series[i % series.length],
      speaker: "Pastor Israel Revelation",
      category: cats[i % cats.length],
      date: iso,
      duration: `${50 + (i * 7) % 40} min`,
      youtubeId: i % 4 === 0 ? "y7CLuQTWGSM" : "",
      thumbUrl: "",
      description: `A powerful expository message delivered by Pastor Israel Revelation examining the riches of God's Word, prayer, and supernatural victory.`
    });
  }

  // Sort newest first
  return list.sort((x, y) => y.date.localeCompare(x.date));
}

export const VIDEOS: VideoItem[] = generateVideos();

export const FAQS: FaqItem[] = [
  {
    id: 1,
    category: "Ministry Focus",
    question: "What is the spiritual mandate and mission of The Act of Prayers & Deliverance Ministries?",
    answer: "Our ministry is founded upon apostolic prayer, prophetic deliverance, and the uncompromised Word of God. Under the leadership of General Overseer Pastor Israel Revelation, our mission is to liberate souls from spiritual bondages, heal the brokenhearted, ignite personal revival, and equip believers to walk in victory and righteousness through Jesus Christ."
  },
  {
    id: 2,
    category: "Weekly Services",
    question: "When and where do our regular weekly services and fellowship meetings take place?",
    answer: "We gather weekly at our International Headquarters Sanctuary: Sunday Worship & Deliverance Service (Sundays at 9:00 AM), Youth Fellowship and Men's Fellowship (Mondays at 4:00 PM), Prayer Group Meeting (Mondays at 4:30 PM), Bible Study (Tuesdays at 4:00 PM), and Choir Practice & Rehearsals (Wednesdays and Saturdays at 4:00 PM)."
  },
  {
    id: 3,
    category: "Monthly Vigils",
    question: "What are the two monthly night vigils and when are they held?",
    answer: "We hold two powerful monthly all-night vigils from 10:00 PM till Dawn: 1) The Workers' Night Vigil takes place every second (2nd) Thursday of every month, dedicated to ministers and church workers consecration. 2) Our flagship general deliverance vigil, titled 'THE LAST NIGHT IN EGYPT', takes place every last day of every month for everyone seeking total freedom and supernatural breakthroughs."
  },
  {
    id: 4,
    category: "Giving & Support",
    question: "How can I pay my offering, tithe, or support church projects?",
    answer: "To pay your offering, tithe, or project seed, simply go to the Give section on our website menu. Choose whether you want to make an Offering or a Ministry Donation, select your preferred payment method, and follow the step-by-step directions on the screen. All payment channels and account details are kept updated directly from our official server."
  },
  {
    id: 5,
    category: "Prayer & Counseling",
    question: "How can I request deliverance prayer or meet with Pastor Israel Revelation?",
    answer: "You are warmly welcome to visit our Sanctuary during our Tuesday Bible Studies or Monday Prayer Group meetings. You can also submit prayer requests and pastoral appointment requests directly through our Contact page, and our ministry pastoral team will connect with you."
  }
];

