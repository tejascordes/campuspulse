import json
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from database import engine, AsyncSessionLocal, Base
from models import (
    User, Post, MapPin, CalendarEvent, Event, Friendship,
    PostCategory as PostCategoryEnum,
    CalendarPrivacy as CalendarPrivacyEnum,
)
from routers import auth, posts, map_pins, calendar, events, friends
from routers.auth import hash_password

app = FastAPI(title="CampusPulse API", version="1.0.0")

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(map_pins.router)
app.include_router(calendar.router)
app.include_router(events.router)
app.include_router(friends.router)


# ── Seed Data ─────────────────────────────────────────────────────────────────
SEED_PINS = [
    dict(name="EDC STEP & Venture Lab", category="Society Hub", latitude=365.0, longitude=735.0,
         rating=4.8, distance_metric="East Campus near CS Block", description="Entrepreneurship Development Cell, Venture Lab & TIFAC-CORE — startup incubators and pitch venues.", icon_color="#9D4EDD"),
    dict(name="Central Park & Nirvana", category="Recreational", latitude=205.0, longitude=475.0,
         rating=4.9, distance_metric="Central Campus", description="The iconic green heart of campus, serene lake and Kravings Food Court hangout circle.", icon_color="#00F5FF"),
    dict(name="LT & LP Lecture Complex", category="Academic", latitude=290.0, longitude=660.0,
         rating=4.5, distance_metric="Central Academic Zone", description="Main Lecture Theatres (LT) & LP 101-103 hosting major multi-batch university lectures.", icon_color="#FF2D78"),
    dict(name="CS Block (CSED Labs)", category="Academic", latitude=330.0, longitude=660.0,
         rating=4.6, distance_metric="Next to LP 110-111", description="Computer Science and Engineering Department. Home to advanced computing labs and CCS.", icon_color="#9D4EDD"),
    dict(name="Thapar Central Library", category="Academic", latitude=260.0, longitude=690.0,
         rating=4.9, distance_metric="Adjacent to LT & LP", description="Multi-storey architectural library with 24-hr study zones, digital archives and reading halls.", icon_color="#00F5FF"),
    dict(name="Kravings Food Court & Canteen", category="Food", latitude=220.0, longitude=530.0,
         rating=4.7, distance_metric="Near Central Park", description="Central dining hub featuring Kravings Food Court, Canteen, Aahar, juice bars, and quick bites.", icon_color="#FF9500"),
    dict(name="Open Air Theatre (OAT) & COS", category="Society Hub", latitude=305.0, longitude=300.0,
         rating=4.9, distance_metric="West Sports Zone", description="Iconic open-air amphitheatre & COS complex hosting Battle of the Bands, dramatic plays, and fests.", icon_color="#FF385C"),
    dict(name="Synthetic Track & Cricket Field", category="Sports", latitude=305.0, longitude=235.0,
         rating=4.8, distance_metric="West Campus Sports Zone", description="All-weather Olympic synthetic track, cricket stadium, tennis courts, and fete grounds.", icon_color="#10B981"),
    dict(name="Main Auditorium & Entrance", category="Landmark", latitude=105.0, longitude=705.0,
         rating=4.6, distance_metric="Nabha Road Entry", description="Main Auditorium, CLIP, Post Office, and the primary university gateway on Nabha Road.", icon_color="#FF2D78"),
    dict(name="Hostel J (Tejas) & Hostel H (Vyan)", category="Recreational", latitude=185.0, longitude=365.0,
         rating=4.6, distance_metric="South-West Residential Zone", description="Major student residential halls near Shiv Mandir, Gurudwara, and Central Park.", icon_color="#EC4899"),
    dict(name="Sports Complex & Swimming Pool", category="Sports", latitude=310.0, longitude=465.0,
         rating=4.7, distance_metric="Central Sports Area", description="Indoor sports arena, badminton courts, basketball courts, and Olympic swimming pool.", icon_color="#10B981"),
    dict(name="C, D, E & F Academic Blocks", category="Academic", latitude=210.0, longitude=755.0,
         rating=4.5, distance_metric="South-East Academic Zone", description="Core engineering academic blocks (B, C, D, E, F, G Blocks), Directorate, and Mechanical Workshop.", icon_color="#F59E0B"),
]

SEED_POSTS = [
    dict(society_name="CCS", category=PostCategoryEnum.TECH, title="HackThapar 2024 — Registration Open 🚀",
         description="India's biggest 36-hour hackathon is back! Team size 2-4. Prizes worth ₹5L+ across 6 tracks. Cloud, AI/ML, Web3, and more. Register by Sep 20th.", upvotes=142),
    dict(society_name="Mudra", category=PostCategoryEnum.NON_TECH, title="Battle of Bands this Saturday 🎸",
         description="Mudra presents Battle of Bands — 8 bands competing for the trophy. Venue: Open Air Theatre. Starts 6 PM. Entry free for all Thapar students.", upvotes=89),
    dict(society_name="FAP", category=PostCategoryEnum.HACKATHONS, title="SIH Internal Hackathon — Problem Statements Released",
         description="Smart India Hackathon internal round problem statements are live. 48 hours. 3 domains: Agriculture, Healthcare, Smart Cities. Teams of 6.", upvotes=67),
    dict(society_name="Trident", category=PostCategoryEnum.PRIZES_ONLY, title="₹25,000 Prize — Startup Idea Competition",
         description="Trident and EDC jointly present the Annual Startup Idea Pitch. Top 3 teams win seed funding + mentorship from industry experts. Submit your deck by Monday.", upvotes=203),
    dict(society_name="Literary Club", category=PostCategoryEnum.NON_TECH, title="Annual Poetry Slam — Open Mic Night",
         description="Express yourself at TU's first open mic of the semester. Any language. Any genre. 3 minutes per performer. Venue: A-Block Lawn. 7 PM Friday.", upvotes=44),
    dict(society_name="Mess Committee", category=PostCategoryEnum.REFRESHMENTS, title="Free Biryani Day — All Hostels",
         description="To celebrate Thapar's Foundation Day, the mess committee is serving unlimited biryani at all hostel mess facilities. Lunch only (12:30–2 PM). No coupon needed.", upvotes=511),
    dict(society_name="E-Cell", category=PostCategoryEnum.TECH, title="Web Dev Bootcamp — 5 Days, Free Certification",
         description="E-Cell is hosting a 5-day intensive MERN stack bootcamp for beginners. Completely free. Certificate on completion. Register on the portal before seats fill up.", upvotes=78),
    dict(society_name="Rotaract", category=PostCategoryEnum.NON_TECH, title="Blood Donation Camp — Sept 15th",
         description="Rotaract TU in partnership with PGI Chandigarh is organizing a blood donation camp. Donors get complimentary refreshments and a certificate from the university.", upvotes=93),
    dict(society_name="Quiz Club", category=PostCategoryEnum.PRIZES_ONLY, title="₹10,000 Inter-College Quiz Championship",
         description="Open to all colleges in Punjab & Haryana. Topics: Science, Pop Culture, History, Sports. Teams of 2. Online prelims Sept 18. Finals on campus Sept 25.", upvotes=55),
    dict(society_name="Aagaaz", category=PostCategoryEnum.REFRESHMENTS, title="Cultural Fest Food Stalls — Opening Week",
         description="Aagaaz Cultural Fest kicks off with 30+ food stalls from around India. Momos, chaat, pasta, waffles — all campus areas. Open 11 AM to 10 PM, all week.", upvotes=187),
]

now = datetime.utcnow()

SEED_EVENTS = [
    dict(
        society_name="CCS",
        title="HackThapar 2024: 36-Hour Hackathon",
        description="The flagship hackathon of Thapar Institute. Build groundbreaking software, AI systems, or hardware prototypes over 36 hours. Mentors from top tech giants, delicious catering, and massive swag packs!",
        tagline="Innovate. Build. Deploy.",
        venue="LHC Auditorium & CS Labs",
        event_date=now + timedelta(days=5, hours=9),
        event_end_date=now + timedelta(days=6, hours=21),
        max_capacity=250,
        registered_count=184,
        category=PostCategoryEnum.TECH,
        icon_color="#9D4EDD",
        itinerary_json=json.dumps([
            {"time": "09:00 AM", "activity": "Check-in & Team Registration"},
            {"time": "10:30 AM", "activity": "Keynote & Problem Statement Release"},
            {"time": "12:00 PM", "activity": "Hacking Commences"},
            {"time": "08:00 PM", "activity": "Mentorship Round 1 & Midnight Pizza"},
            {"time": "09:00 AM (Day 2)", "activity": "Breakfast & Code Freeze Check"},
            {"time": "03:00 PM (Day 2)", "activity": "Grand Pitching & Prize Distribution"}
        ]),
    ),
    dict(
        society_name="Mudra",
        title="Battle of the Bands: Campus Sonic War",
        description="8 high-octane college bands clash live at the Open Air Theatre. Live rock, fusion, metal, and indie beats under the starry Patiala sky.",
        tagline="Feel the sonic rhythm.",
        venue="Open Air Theatre (OAT)",
        event_date=now + timedelta(days=2, hours=18),
        event_end_date=now + timedelta(days=2, hours=22),
        max_capacity=500,
        registered_count=320,
        category=PostCategoryEnum.NON_TECH,
        icon_color="#FF2D78",
        itinerary_json=json.dumps([
            {"time": "06:00 PM", "activity": "Gates Open & Opening Acoustic Act"},
            {"time": "06:45 PM", "activity": "Round 1: Original Compositions (4 Bands)"},
            {"time": "08:15 PM", "activity": "Intermission & DJ Guest Set"},
            {"time": "08:45 PM", "activity": "Round 2: Covers & Fusion (4 Bands)"},
            {"time": "10:00 PM", "activity": "Judges Decision & Trophy Handover"}
        ]),
    ),
    dict(
        society_name="FAP",
        title="Frames '24: Annual Photo Exhibition & Workshop",
        description="Master the art of visual storytelling. Learn light manipulation, portrait aesthetics, and street photography from award-winning national photographers.",
        tagline="Through the Lens of Creativity.",
        venue="Nirvana Park Exhibition Tent",
        event_date=now + timedelta(days=4, hours=14),
        event_end_date=now + timedelta(days=4, hours=19),
        max_capacity=80,
        registered_count=55,
        category=PostCategoryEnum.NON_TECH,
        icon_color="#00F5FF",
        itinerary_json=json.dumps([
            {"time": "02:00 PM", "activity": "Exhibition Gallery Walkthrough"},
            {"time": "03:30 PM", "activity": "DSLR & Mobile Cinematography Masterclass"},
            {"time": "05:00 PM", "activity": "Golden Hour Photo Walk in Nirvana Park"},
            {"time": "06:30 PM", "activity": "Live Photo Critique & Best Shot Awards"}
        ]),
    ),
    dict(
        society_name="Trident",
        title="RoboWars & Autonomous Drone Race",
        description="High-voltage combat robotics in a bulletproof arena alongside high-speed FPV drone obstacle courses. Watch 15kg spinners destroy opponents!",
        tagline="Metal Meets Mayhem.",
        venue="Sports Ground Complex",
        event_date=now + timedelta(days=7, hours=11),
        event_end_date=now + timedelta(days=7, hours=17),
        max_capacity=300,
        registered_count=210,
        category=PostCategoryEnum.TECH,
        icon_color="#FF9500",
        itinerary_json=json.dumps([
            {"time": "11:00 AM", "activity": "Bot Inspection & Safety Briefing"},
            {"time": "11:30 AM", "activity": "FPV Drone Agility Qualifier"},
            {"time": "01:30 PM", "activity": "15kg RoboWars Prelims (Deathmatches)"},
            {"time": "03:45 PM", "activity": "Obstacle Drone Grand Finals"},
            {"time": "04:45 PM", "activity": "RoboWars Championship Final & Crowning"}
        ]),
    ),
    dict(
        society_name="E-Cell",
        title="VenturePulse: Campus Shark Tank & Pitch Fest",
        description="Pitch your early-stage startup or tech idea to prominent angel investors and TU alumni founders. ₹1,00,000 direct equity-free grant pool!",
        tagline="Turn your vision into a venture.",
        venue="EDC Step Building Auditorium",
        event_date=now + timedelta(days=9, hours=10),
        event_end_date=now + timedelta(days=9, hours=16),
        max_capacity=120,
        registered_count=88,
        category=PostCategoryEnum.TECH,
        icon_color="#10B981",
        itinerary_json=json.dumps([
            {"time": "10:00 AM", "activity": "Founder Registration & Networking Mixer"},
            {"time": "11:00 AM", "activity": "Top 10 Pitches (5 mins pitch + 5 mins Q&A)"},
            {"time": "01:00 PM", "activity": "Networking Lunch with Venture Capitalists"},
            {"time": "02:30 PM", "activity": "Keynote: From Campus Project to Series A"},
            {"time": "03:45 PM", "activity": "Grant Announcements & Term Sheet Signings"}
        ]),
    ),
    dict(
        society_name="Rotaract",
        title="Youth Impact Summit & Blood Drive",
        description="Annual blood donation camp in partnership with PGI Chandigarh along with social entrepreneurship keynote talks and tree plantation drive across campus.",
        tagline="Service Above Self.",
        venue="Main Dispensary & Library Lawn",
        event_date=now + timedelta(days=3, hours=9),
        event_end_date=now + timedelta(days=3, hours=15),
        max_capacity=200,
        registered_count=134,
        category=PostCategoryEnum.NON_TECH,
        icon_color="#EC4899",
        itinerary_json=json.dumps([
            {"time": "09:00 AM", "activity": "Inauguration & Medical Health Checkups"},
            {"time": "09:30 AM", "activity": "Blood Donation Drive Commences"},
            {"time": "11:30 AM", "activity": "Tree Plantation Drive at Nirvana Park"},
            {"time": "01:30 PM", "activity": "Refreshments & Certificate Distribution"},
            {"time": "02:30 PM", "activity": "Closing Social Impact Panel"}
        ]),
    ),
    dict(
        society_name="Quiz Club",
        title="MindBender: The Grand Campus Trivia League",
        description="The ultimate battle of wits across pop culture, anime, geopolitical trivia, tech history, and sports. 4 rigorous rounds with buzzer playoffs!",
        tagline="Knowledge is your only weapon.",
        venue="LHC Room 102",
        event_date=now + timedelta(days=6, hours=16),
        event_end_date=now + timedelta(days=6, hours=20),
        max_capacity=100,
        registered_count=72,
        category=PostCategoryEnum.PRIZES_ONLY,
        icon_color="#6366F1",
        itinerary_json=json.dumps([
            {"time": "04:00 PM", "activity": "Written Prelims (25 Questions)"},
            {"time": "05:00 PM", "activity": "Evaluation & Top 6 Teams Selected"},
            {"time": "05:30 PM", "activity": "Stage Finals: Audio-Visual & Infinite Pounce"},
            {"time": "07:15 PM", "activity": "Rapid Fire Buzzer Round & Prize Awards"}
        ]),
    ),
    dict(
        society_name="Aagaaz",
        title="Nukkad Natak: Street Play Showcase",
        description="Experience the raw energy of street theater addressing burning social issues, digital culture, and university life with live percussion beats.",
        tagline="Voice of the Unheard.",
        venue="Cafeteria Central Circle",
        event_date=now + timedelta(days=1, hours=17),
        event_end_date=now + timedelta(days=1, hours=19),
        max_capacity=350,
        registered_count=195,
        category=PostCategoryEnum.REFRESHMENTS,
        icon_color="#F59E0B",
        itinerary_json=json.dumps([
            {"time": "05:00 PM", "activity": "Dhol & Percussion Procession Call"},
            {"time": "05:20 PM", "activity": "Street Play 1: 'Parchhaiyan' (Mental Wellness)"},
            {"time": "06:00 PM", "activity": "Street Play 2: 'Digital Kaal' (Tech Addiction)"},
            {"time": "06:40 PM", "activity": "Open Audience Discussion & Refreshments"}
        ]),
    ),
]


async def seed_db():
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        result = await db.execute(select(MapPin))
        if result.scalars().first():
            return

        print("[SEED] Seeding database...")

        # Demo user
        demo = User(
            name="Demo Student",
            email="demo@thapar.edu",
            hashed_password=hash_password("demo1234"),
            default_calendar_privacy=CalendarPrivacyEnum.CLOSE_FRIENDS,
            bio="CSE '26 | Hackathon enthusiast | Coffee addict",
        )
        db.add(demo)
        await db.flush()

        # Classmate friends
        classmates = [
            User(name="Ananya Sharma", email="ananya.s@thapar.edu", hashed_password=hash_password("thapar123"), bio="COE '26 | Web Dev & Design"),
            User(name="Kabir Singh", email="kabir.s@thapar.edu", hashed_password=hash_password("thapar123"), bio="ENC '25 | Music & Robotics"),
            User(name="Rohan Verma", email="rohan.v@thapar.edu", hashed_password=hash_password("thapar123"), bio="CSBS '26 | AI Research & Hackathons"),
            User(name="Priya Patel", email="priya.p@thapar.edu", hashed_password=hash_password("thapar123"), bio="ELE '25 | Fine Arts & Photo"),
            User(name="Tanmay Roy", email="tanmay.r@thapar.edu", hashed_password=hash_password("thapar123"), bio="MECH '26 | Drone Racing"),
            User(name="Simran Kaur", email="simran.k@thapar.edu", hashed_password=hash_password("thapar123"), bio="COE '26 | Street Play & Dramatics"),
        ]
        for cm in classmates:
            db.add(cm)
        await db.flush()

        # Connect initial friendships
        for i, cm in enumerate(classmates):
            db.add(Friendship(
                user_id=demo.id,
                friend_id=cm.id,
                is_close_friend=(i < 3),
            ))

        # Map pins
        for p in SEED_PINS:
            db.add(MapPin(**p))

        # Posts
        for p in SEED_POSTS:
            db.add(Post(**p, created_at=datetime.utcnow()))

        # Events
        for e in SEED_EVENTS:
            db.add(Event(**e, created_at=datetime.utcnow()))

        await db.commit()
        print("[SEED] Seed complete!")


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_db()


@app.get("/")
async def root():
    return {"message": "CampusPulse API is running!", "docs": "/docs"}

