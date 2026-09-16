// Campus Pulse Seed & Mock Store for Graceful Fallback / Demo Mode

const SEED_PINS = [
  {
    id: 1,
    name: "EDC Step Building",
    category: "Society Hub",
    latitude: 30.3562,
    longitude: 76.3648,
    rating: 4.7,
    distance_metric: "50m from main gate",
    description: "Entrepreneurship Development Cell — home to startup workshops and pitch events.",
    icon_color: "#9D4EDD",
  },
  {
    id: 2,
    name: "Nirvana Park",
    category: "Recreational",
    latitude: 30.3571,
    longitude: 76.3655,
    rating: 4.9,
    distance_metric: "Central campus",
    description: "The iconic green heart of campus. Students gather here for cultural fests and sunsets.",
    icon_color: "#00F5FF",
  },
  {
    id: 3,
    name: "LHC Block",
    category: "Academic",
    latitude: 30.3558,
    longitude: 76.3638,
    rating: 4.3,
    distance_metric: "Near main road",
    description: "Lecture Hall Complex — largest academic block hosting 500+ capacity auditoriums.",
    icon_color: "#FF2D78",
  },
  {
    id: 4,
    name: "F Block",
    category: "Academic",
    latitude: 30.3550,
    longitude: 76.3645,
    rating: 4.1,
    distance_metric: "West campus",
    description: "Faculty and Computer Science labs. Home to CCS (Computer Club Society).",
    icon_color: "#9D4EDD",
  },
  {
    id: 5,
    name: "Thapar Library",
    category: "Academic",
    latitude: 30.3565,
    longitude: 76.3660,
    rating: 4.8,
    distance_metric: "Centre of campus",
    description: "Multi-storey central library with 24-hr study zones and digital resources.",
    icon_color: "#00F5FF",
  },
  {
    id: 6,
    name: "Main Cafeteria",
    category: "Food",
    latitude: 30.3556,
    longitude: 76.3650,
    rating: 4.4,
    distance_metric: "Near hostels",
    description: "Central canteen serving everything from biryani to maggi. Open 7am-11pm.",
    icon_color: "#FF9500",
  },
  {
    id: 7,
    name: "Swimming Pool Complex",
    category: "Sports",
    latitude: 30.3580,
    longitude: 76.3640,
    rating: 4.6,
    distance_metric: "North campus",
    description: "Olympic-size pool used for inter-university aquatics meets.",
    icon_color: "#00F5FF",
  },
  {
    id: 8,
    name: "Main Gate",
    category: "Landmark",
    latitude: 30.3545,
    longitude: 76.3630,
    rating: 4.2,
    distance_metric: "Entry point",
    description: "The iconic Thapar University main entrance. Reference point for all campus navigation.",
    icon_color: "#FF2D78",
  },
]

const now = Date.now()
const dayMs = 24 * 60 * 60 * 1000

const SEED_EVENTS = [
  {
    id: 1,
    society_name: "CCS",
    title: "HackThapar 2025: 36-Hour Hackathon",
    description:
      "The flagship hackathon of Thapar Institute. Build groundbreaking software, AI systems, or hardware prototypes over 36 hours. Mentors from top tech giants, delicious catering, and massive swag packs!",
    tagline: "Innovate. Build. Deploy.",
    venue: "LHC Auditorium & CS Labs",
    event_date: new Date(now + 2 * dayMs + 9 * 3600000).toISOString(),
    event_end_date: new Date(now + 3 * dayMs + 21 * 3600000).toISOString(),
    max_capacity: 250,
    registered_count: 184,
    is_registered: false,
    category: "Tech",
    icon_color: "#9D4EDD",
    friends_attending: ["Ananya Sharma", "Kabir Singh", "Rohan Verma"],
    itinerary: [
      { time: "09:00 AM", activity: "Check-in & Team Registration" },
      { time: "10:30 AM", activity: "Keynote & Problem Statement Release" },
      { time: "12:00 PM", activity: "Hacking Commences" },
      { time: "08:00 PM", activity: "Mentorship Round 1 & Midnight Pizza" },
      { time: "09:00 AM (Day 2)", activity: "Breakfast & Code Freeze Check" },
      { time: "03:00 PM (Day 2)", activity: "Grand Pitching & Prize Distribution" },
    ],
  },
  {
    id: 2,
    society_name: "Mudra",
    title: "Battle of the Bands: Campus Sonic War",
    description:
      "8 high-octane college bands clash live at the Open Air Theatre. Live rock, fusion, metal, and indie beats under the starry Patiala sky.",
    tagline: "Feel the sonic rhythm.",
    venue: "Open Air Theatre (OAT)",
    event_date: new Date(now + 3 * dayMs + 18 * 3600000).toISOString(),
    event_end_date: new Date(now + 3 * dayMs + 22 * 3600000).toISOString(),
    max_capacity: 500,
    registered_count: 320,
    is_registered: false,
    category: "Non-Tech",
    icon_color: "#FF2D78",
    friends_attending: ["Kabir Singh", "Tanmay Roy", "Simran Kaur"],
    itinerary: [
      { time: "06:00 PM", activity: "Gates Open & Opening Acoustic Act" },
      { time: "06:45 PM", activity: "Round 1: Original Compositions (4 Bands)" },
      { time: "08:15 PM", activity: "Intermission & DJ Guest Set" },
      { time: "08:45 PM", activity: "Round 2: Covers & Fusion (4 Bands)" },
      { time: "10:00 PM", activity: "Judges Decision & Trophy Handover" },
    ],
  },
  {
    id: 3,
    society_name: "FAP",
    title: "Frames '25: Annual Photo Exhibition & Workshop",
    description:
      "Master the art of visual storytelling. Learn light manipulation, portrait aesthetics, and street photography from award-winning national photographers.",
    tagline: "Through the Lens of Creativity.",
    venue: "Nirvana Park Exhibition Tent",
    event_date: new Date(now + 4 * dayMs + 14 * 3600000).toISOString(),
    event_end_date: new Date(now + 4 * dayMs + 19 * 3600000).toISOString(),
    max_capacity: 80,
    registered_count: 55,
    is_registered: true,
    category: "Non-Tech",
    icon_color: "#00F5FF",
    friends_attending: ["Ananya Sharma", "Priya Patel"],
    itinerary: [
      { time: "02:00 PM", activity: "Exhibition Gallery Walkthrough" },
      { time: "03:30 PM", activity: "DSLR & Mobile Cinematography Masterclass" },
      { time: "05:00 PM", activity: "Golden Hour Photo Walk in Nirvana Park" },
      { time: "06:30 PM", activity: "Live Photo Critique & Best Shot Awards" },
    ],
  },
  {
    id: 4,
    society_name: "Trident",
    title: "RoboWars & Autonomous Drone Race",
    description:
      "High-voltage combat robotics in a bulletproof arena alongside high-speed FPV drone obstacle courses. Watch 15kg spinners destroy opponents!",
    tagline: "Metal Meets Mayhem.",
    venue: "Sports Ground Complex",
    event_date: new Date(now + 6 * dayMs + 11 * 3600000).toISOString(),
    event_end_date: new Date(now + 6 * dayMs + 17 * 3600000).toISOString(),
    max_capacity: 300,
    registered_count: 210,
    is_registered: false,
    category: "Tech",
    icon_color: "#FF9500",
    friends_attending: ["Aarav Gupta", "Tanmay Roy"],
    itinerary: [
      { time: "11:00 AM", activity: "Bot Inspection & Safety Briefing" },
      { time: "11:30 AM", activity: "FPV Drone Agility Qualifier" },
      { time: "01:30 PM", activity: "15kg RoboWars Prelims (Deathmatches)" },
      { time: "03:45 PM", activity: "Obstacle Drone Grand Finals" },
      { time: "04:45 PM", activity: "RoboWars Championship Final & Crowning" },
    ],
  },
  {
    id: 5,
    society_name: "E-Cell",
    title: "VenturePulse: Campus Shark Tank & Pitch Fest",
    description:
      "Pitch your early-stage startup or tech idea to prominent angel investors and TU alumni founders. ₹1,00,000 direct equity-free grant pool!",
    tagline: "Turn your vision into a venture.",
    venue: "EDC Step Building Auditorium",
    event_date: new Date(now + 8 * dayMs + 10 * 3600000).toISOString(),
    event_end_date: new Date(now + 8 * dayMs + 16 * 3600000).toISOString(),
    max_capacity: 120,
    registered_count: 88,
    is_registered: false,
    category: "Tech",
    icon_color: "#10B981",
    friends_attending: ["Rohan Verma"],
    itinerary: [
      { time: "10:00 AM", activity: "Founder Registration & Networking Mixer" },
      { time: "11:00 AM", activity: "Top 10 Pitches (5 mins pitch + 5 mins Q&A)" },
      { time: "01:00 PM", activity: "Networking Lunch with Venture Capitalists" },
      { time: "02:30 PM", activity: "Keynote: From Campus Project to Series A" },
      { time: "03:45 PM", activity: "Grant Announcements & Term Sheet Signings" },
    ],
  },
  {
    id: 6,
    society_name: "Aagaaz",
    title: "Nukkad Natak: Street Play Showcase",
    description:
      "Experience the raw energy of street theater addressing burning social issues, digital culture, and university life with live percussion beats.",
    tagline: "Voice of the Unheard.",
    venue: "Cafeteria Central Circle",
    event_date: new Date(now + 1 * dayMs + 17 * 3600000).toISOString(),
    event_end_date: new Date(now + 1 * dayMs + 19 * 3600000).toISOString(),
    max_capacity: 350,
    registered_count: 195,
    is_registered: false,
    category: "Refreshments",
    icon_color: "#F59E0B",
    friends_attending: ["Simran Kaur", "Ananya Sharma"],
    itinerary: [
      { time: "05:00 PM", activity: "Dhol & Percussion Procession Call" },
      { time: "05:20 PM", activity: "Street Play 1: 'Parchhaiyan' (Mental Wellness)" },
      { time: "06:00 PM", activity: "Street Play 2: 'Digital Kaal' (Tech Addiction)" },
      { time: "06:40 PM", activity: "Open Audience Discussion & Refreshments" },
    ],
  },
]

const SEED_POSTS = [
  {
    id: 1,
    society_name: "CCS",
    category: "Tech",
    categories: ["Tech", "Hackathon", "Prize Pool", "Certificate"],
    title: "HackThapar 2025 — Registration Open 🚀",
    description:
      "India's biggest 36-hour hackathon is back! Team size 2-4. Prizes worth ₹5L+ across 6 tracks. Cloud, AI/ML, Web3, and more. Register by Sep 20th.",
    upvotes: 142,
    comment_count: 24,
    created_at: new Date(now - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    society_name: "Mudra",
    category: "Non-Tech",
    categories: ["Non-Tech", "Cultural", "Free Entry"],
    title: "Battle of Bands this Saturday 🎸",
    description:
      "Mudra presents Battle of Bands — 8 bands competing for the trophy. Venue: Open Air Theatre. Starts 6 PM. Entry free for all Thapar students.",
    upvotes: 89,
    comment_count: 15,
    created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    society_name: "Mess Committee",
    category: "Refreshments",
    categories: ["Refreshments", "Free Entry"],
    title: "Free Special Biryani & Dessert Day — All Hostels",
    description:
      "To celebrate Thapar's Foundation Day, the mess committee is serving unlimited biryani & gulab jamun at all hostel dining halls. Lunch only (12:30–2 PM). No coupon needed.",
    upvotes: 511,
    comment_count: 87,
    created_at: new Date(now - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 4,
    society_name: "Trident",
    category: "Prize Pool",
    categories: ["Tech", "Prize Pool", "Overnight"],
    title: "₹25,000 Prize — Startup Idea Competition",
    description:
      "Trident and EDC jointly present the Annual Startup Idea Pitch. Top 3 teams win seed funding + mentorship from industry experts. Submit your deck by Monday.",
    upvotes: 203,
    comment_count: 31,
    created_at: new Date(now - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 5,
    society_name: "FAP",
    category: "Hackathon",
    categories: ["Hackathon", "Non-Tech", "Workshop"],
    title: "SIH Internal Hackathon — Problem Statements Released",
    description:
      "Smart India Hackathon internal round problem statements are live. 48 hours. 3 domains: Agriculture, Healthcare, Smart Cities. Teams of 6.",
    upvotes: 67,
    comment_count: 9,
    created_at: new Date(now - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 6,
    society_name: "Literary Club",
    category: "Non-Tech",
    categories: ["Non-Tech", "Cultural", "Free Entry"],
    title: "Annual Poetry Slam — Open Mic Night",
    description:
      "Express yourself at TU's first open mic of the semester. Any language. Any genre. 3 minutes per performer. Venue: A-Block Lawn. 7 PM Friday.",
    upvotes: 44,
    comment_count: 6,
    created_at: new Date(now - 22 * 3600 * 1000).toISOString(),
  },
  {
    id: 7,
    society_name: "E-Cell",
    category: "Tech",
    categories: ["Tech", "Certificate", "Workshop"],
    title: "Full-Stack Dev Bootcamp — 5 Days, Free Certification",
    description:
      "E-Cell is hosting a 5-day intensive MERN stack bootcamp for beginners. Completely free. Certificate on completion. Register on the portal before seats fill up.",
    upvotes: 78,
    comment_count: 19,
    created_at: new Date(now - 36 * 3600 * 1000).toISOString(),
  },
]

const SEED_SOCIETIES = [
  {
    name: "CCS",
    tagline: "Computer Club Society — Code, Innovate, Excel",
    category: "Tech",
    icon_color: "#9D4EDD",
    description:
      "The premier computer science and software development student body at Thapar Institute. Organizers of HackThapar, ACM ICPC training, and algorithmic meetups.",
    follower_count: 2840,
    hub_location: "F-Block CS Lab 301",
    meeting_schedule: "Wednesdays & Fridays @ 5:30 PM",
    post_count: 14,
    event_count: 2,
  },
  {
    name: "Mudra",
    tagline: "Music & Cultural Society",
    category: "Non-Tech",
    icon_color: "#FF2D78",
    description:
      "The musical heartbeat of Thapar. Bringing instrumentalists, vocalists, and producers together across rock, classical, metal, and indie music.",
    follower_count: 1920,
    hub_location: "Nirvana Amphitheatre Room B",
    meeting_schedule: "Daily Jam Sessions @ 6:00 PM",
    post_count: 9,
    event_count: 1,
  },
  {
    name: "FAP",
    tagline: "Fine Arts & Photography Club",
    category: "Non-Tech",
    icon_color: "#00F5FF",
    description:
      "Visual artists, digital illustrators, cinematographers, and street photographers capturing the spirit and aesthetic of campus life.",
    follower_count: 1430,
    hub_location: "LHC Studio 104",
    meeting_schedule: "Tuesdays & Saturdays @ 4:00 PM",
    post_count: 6,
    event_count: 1,
  },
  {
    name: "Trident",
    tagline: "Robotics & Hardware Innovators",
    category: "Tech",
    icon_color: "#FF9500",
    description:
      "Building combat bots, automated drones, IoT micro-controllers, and autonomous rovers for national robotic championships.",
    follower_count: 1650,
    hub_location: "Workshop Block Mechanical Lab",
    meeting_schedule: "Thursdays & Sundays @ 5:00 PM",
    post_count: 8,
    event_count: 1,
  },
  {
    name: "E-Cell",
    tagline: "Entrepreneurship & Startup Cell",
    category: "Tech",
    icon_color: "#10B981",
    description:
      "Fostering student ventures, pitch competitions, angel networking, and venture capital incubators at Thapar's EDC Step Building.",
    follower_count: 2150,
    hub_location: "EDC Step Building 2nd Floor",
    meeting_schedule: "Mondays @ 6:00 PM",
    post_count: 11,
    event_count: 1,
  },
  {
    name: "Aagaaz",
    tagline: "Dramatics & Street Theater Guild",
    category: "Refreshments",
    icon_color: "#F59E0B",
    description:
      "Stage plays, mono-acts, and high-intensity nukkad nataks championing socio-cultural awareness and cinematic student production.",
    follower_count: 1280,
    hub_location: "Open Air Theatre Stage Backroom",
    meeting_schedule: "Weekdays @ 6:30 PM",
    post_count: 7,
    event_count: 1,
  },
  {
    name: "Rotaract",
    tagline: "Youth Social Action & Community Service",
    category: "Non-Tech",
    icon_color: "#EC4899",
    description:
      "Student volunteers leading university blood donation drives, orphanage education initiatives, eco-drives, and humanitarian relief.",
    follower_count: 1100,
    hub_location: "Main Dispensary Conference Room",
    meeting_schedule: "Sundays @ 11:00 AM",
    post_count: 5,
    event_count: 0,
  },
  {
    name: "Quiz Club",
    tagline: "Campus Quizzing & Trivia Society",
    category: "Prizes Only",
    icon_color: "#6366F1",
    description:
      "Hosting intense trivia championships, general quizzes, pop culture battles, and inter-university intellectual tournaments.",
    follower_count: 890,
    hub_location: "LHC Room 102",
    meeting_schedule: "Fridays @ 6:00 PM",
    post_count: 4,
    event_count: 0,
  },
]

const SEED_FRIENDS = [
  {
    id: 101,
    name: "Ananya Sharma",
    email: "ananya.s@thapar.edu",
    bio: "COE '26 | Web Dev & Design",
    branch: "COE '26",
    is_close_friend: true,
  },
  {
    id: 102,
    name: "Kabir Singh",
    email: "kabir.s@thapar.edu",
    bio: "ENC '25 | Music & Robotics",
    branch: "ENC '25",
    is_close_friend: true,
  },
  {
    id: 103,
    name: "Rohan Verma",
    email: "rohan.v@thapar.edu",
    bio: "CSBS '26 | AI Research & Hackathons",
    branch: "CSBS '26",
    is_close_friend: true,
  },
  {
    id: 104,
    name: "Priya Patel",
    email: "priya.p@thapar.edu",
    bio: "ELE '25 | Fine Arts & Photo",
    branch: "ELE '25",
    is_close_friend: false,
  },
  {
    id: 105,
    name: "Tanmay Roy",
    email: "tanmay.r@thapar.edu",
    bio: "MECH '26 | Drone Racing",
    branch: "MECH '26",
    is_close_friend: false,
  },
  {
    id: 106,
    name: "Simran Kaur",
    email: "simran.k@thapar.edu",
    bio: "COE '26 | Street Play & Dramatics",
    branch: "COE '26",
    is_close_friend: false,
  },
]

const DEFAULT_USER = {
  id: 1,
  name: "CCS (Computer Club Society)",
  society_name: "CCS",
  account_type: "society",
  logo_url: null,
  email: "ccs@thapar.edu",
  default_calendar_privacy: "CLOSE_FRIENDS",
  bio: "Official Computer Club Society | HackThapar Organizers",
}

class MockStore {
  constructor() {
    this.init()
  }

  init() {
    try {
      const stored = localStorage.getItem("cp_mock_store")
      if (stored) {
        const parsed = JSON.parse(stored)
        this.pins = parsed.pins || SEED_PINS
        this.events = parsed.events || SEED_EVENTS
        this.posts = parsed.posts || SEED_POSTS
        this.societies = parsed.societies || SEED_SOCIETIES
        this.friends = parsed.friends || SEED_FRIENDS
        this.user = parsed.user || DEFAULT_USER
        return
      }
    } catch {
      // ignore
    }
    this.pins = [...SEED_PINS]
    this.events = [...SEED_EVENTS]
    this.posts = [...SEED_POSTS]
    this.societies = [...SEED_SOCIETIES]
    this.friends = [...SEED_FRIENDS]
    this.user = { ...DEFAULT_USER }
    this.persist()
  }

  persist() {
    try {
      localStorage.setItem(
        "cp_mock_store",
        JSON.stringify({
          pins: this.pins,
          events: this.events,
          posts: this.posts,
          societies: this.societies,
          friends: this.friends,
          user: this.user,
        })
      )
    } catch {
      // ignore
    }
  }

  getPosts(params = {}) {
    let list = [...this.posts]
    if (params.category && params.category !== "All") {
      const target = params.category.toLowerCase()
      list = list.filter((p) => {
        if (Array.isArray(p.categories)) {
          return p.categories.some((c) => c.toLowerCase() === target)
        }
        return (p.category || "").toLowerCase() === target
      })
    }
    if (params.society_name) {
      list = list.filter((p) => p.society_name.toLowerCase() === params.society_name.toLowerCase())
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  createPost(data) {
    const rawCategories = Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories
      : (data.category ? [data.category] : ["Tech"])
    
    const newPost = {
      id: Date.now(),
      society_name: data.society_name || this.user?.society_name || this.user?.name || "Campus Society",
      categories: rawCategories,
      category: rawCategories[0],
      logo_url: data.logo_url || this.user?.logo_url || null,
      title: data.title,
      description: data.description,
      upvotes: 1,
      comment_count: 0,
      created_at: new Date().toISOString(),
    }
    this.posts.unshift(newPost)
    this.persist()
    return newPost
  }

  upvotePost(id) {
    const post = this.posts.find((p) => p.id === Number(id))
    if (post) {
      post.upvotes += 1
      this.persist()
      return { success: true, upvotes: post.upvotes }
    }
    return { success: true, upvotes: 1 }
  }

  getEvents(params = {}) {
    let list = [...this.events]
    if (params.category && params.category !== "All") {
      list = list.filter((e) => e.category === params.category)
    }
    if (params.society_name) {
      list = list.filter((e) => e.society_name.toLowerCase() === params.society_name.toLowerCase())
    }
    return list.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
  }

  toggleEventRegistration(id, register = true) {
    const ev = this.events.find((e) => e.id === Number(id))
    if (ev) {
      ev.is_registered = register
      ev.registered_count = register
        ? ev.registered_count + 1
        : Math.max(0, ev.registered_count - 1)
      this.persist()
      return ev
    }
    return null
  }

  getSocieties() {
    return this.societies
  }

  getSociety(name) {
    const soc = this.societies.find(
      (s) => s.name.toLowerCase() === (name || "").toLowerCase()
    )
    if (soc) return soc
    return {
      name: name,
      tagline: `Official ${name} Student Society`,
      category: "Tech",
      icon_color: "#9D4EDD",
      description: `Official student organization for ${name} at Thapar Institute.`,
      follower_count: 450,
      hub_location: "Central Student Activity Centre",
      meeting_schedule: "Weekly on Fridays",
      post_count: 2,
      event_count: 1,
    }
  }

  getPins() {
    return this.pins
  }

  login(email, password, name, account_type, society_name, logo_url) {
    const isSociety = account_type === "society" || email?.includes("society") || (society_name && society_name.trim().length > 0)
    const socName = society_name || (isSociety ? (name || "Official Society") : null)
    
    const u = {
      ...this.user,
      email: email || "society@thapar.edu",
      name: name || (socName ? `${socName} Official` : (email ? email.split("@")[0] : "Campus User")),
      account_type: isSociety ? "society" : "student",
      society_name: socName || this.user?.society_name || "CCS",
      logo_url: logo_url || this.user?.logo_url || null,
    }
    this.user = u
    this.persist()
    return {
      access_token: "demo_fallback_jwt_token_" + Date.now(),
      token_type: "bearer",
      user: u,
    }
  }

  register(name, email, account_type, society_name, logo_url) {
    const isSociety = account_type === "society" || Boolean(society_name)
    const socName = society_name || (isSociety ? name : null)

    const u = {
      id: Date.now(),
      name: name || (socName ? `${socName} Official` : "Campus User"),
      email: email || "society@thapar.edu",
      account_type: isSociety ? "society" : "student",
      society_name: socName || "CCS",
      logo_url: logo_url || null,
      default_calendar_privacy: "CLOSE_FRIENDS",
      bio: isSociety ? `Official ${socName || name} Society Account` : "Thapar Institute Student",
    }
    this.user = u
    this.persist()
    return {
      access_token: "demo_fallback_jwt_token_" + Date.now(),
      token_type: "bearer",
      user: u,
    }
  }

  createEvent(data) {
    const newEvent = {
      id: Date.now(),
      society_name: data.society_name || "Campus Community",
      title: data.title,
      description: data.description,
      tagline: data.tagline || `${data.society_name || "Campus"} Event`,
      venue: data.venue || "Campus Grounds",
      event_date: data.event_date || new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
      event_end_date: data.event_end_date || null,
      max_capacity: Number(data.max_capacity) || 150,
      registered_count: 1,
      is_registered: true,
      category: data.category || "Tech",
      icon_color: data.icon_color || "#9D4EDD",
      friends_attending: ["You"],
      itinerary: data.itinerary || [
        { time: "10:00 AM", activity: "Opening & Welcome" },
        { time: "11:30 AM", activity: "Keynote & Main Session" },
        { time: "02:00 PM", activity: "Networking & Conclusion" },
      ],
      created_at: new Date().toISOString(),
    }
    this.events.unshift(newEvent)
    this.persist()
    return newEvent
  }

  getFriends() {
    return this.friends || []
  }

  addFriend(data) {
    const rawName = (data.username || (data.email ? data.email.split("@")[0] : "Campus Friend")).trim()
    const rawEmail = (data.email || `${rawName.toLowerCase().replace(/\s+/g, ".")}@thapar.edu`).trim()

    // Check if already in list
    const existing = this.friends.find(
      (f) =>
        (data.friend_id && f.id === Number(data.friend_id)) ||
        f.email.toLowerCase() === rawEmail.toLowerCase() ||
        f.name.toLowerCase() === rawName.toLowerCase()
    )

    if (existing) {
      existing.is_close_friend = data.is_close_friend ?? existing.is_close_friend
      this.persist()
      return existing
    }

    const newFriend = {
      id: data.friend_id ? Number(data.friend_id) : Date.now(),
      name: rawName,
      email: rawEmail,
      bio: `COE '26 | ${rawName}`,
      branch: "COE '26",
      is_close_friend: Boolean(data.is_close_friend),
    }
    this.friends.unshift(newFriend)
    this.persist()
    return newFriend
  }

  removeFriend(id) {
    this.friends = this.friends.filter((f) => f.id !== Number(id))
    this.persist()
    return { success: true, message: "Friend removed successfully" }
  }

  updateProfile(data) {
    this.user = {
      ...this.user,
      ...data,
    }
    this.persist()
    return this.user
  }
}

export const mockStore = new MockStore()

