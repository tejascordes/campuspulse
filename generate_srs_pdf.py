import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas

# Output directory & path
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(OUTPUT_DIR, "CampusPulse_SRS_Document.pdf")
IMG_DIR = os.path.join(OUTPUT_DIR, "assets", "srs_diagrams")
os.makedirs(IMG_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. Generate Figures using Matplotlib for clean academic look
# -------------------------------------------------------------

def generate_figure_1_1():
    """Entire workflow diagram"""
    fig, ax = plt.subplots(figsize=(6, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Draw nodes as clean rounded boxes/ovals
    def draw_oval(x, y, w, h, text):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.2",
                                     ec="black", fc="#fcfcfc", lw=1.2)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=10, fontweight='medium')

    draw_oval(5, 8.8, 3.0, 0.9, "Student")
    draw_oval(7.5, 6.2, 3.2, 0.9, "Events & Feed")
    draw_oval(5, 3.8, 3.0, 0.9, "Society Leads")
    draw_oval(2.2, 6.2, 3.2, 0.9, "Campus Map")
    draw_oval(5, 1.2, 3.2, 0.9, "Admin & Moderation")

    # Arrows
    arrow_props = dict(arrowstyle="->", color="black", lw=1.1, mutation_scale=12)
    ax.annotate("", xy=(6.5, 6.7), xytext=(5.3, 8.3), arrowprops=arrow_props)
    ax.text(6.4, 7.7, "RSVP & Save", fontsize=8, style='italic')

    ax.annotate("", xy=(3.5, 6.7), xytext=(4.7, 8.3), arrowprops=arrow_props)
    ax.text(2.6, 7.7, "Navigate & Filter", fontsize=8, style='italic')

    ax.annotate("", xy=(7.0, 5.7), xytext=(5.8, 4.3), arrowprops=arrow_props)
    ax.text(6.8, 4.8, "Publish", fontsize=8, style='italic')

    ax.annotate("", xy=(3.0, 5.7), xytext=(4.2, 4.3), arrowprops=arrow_props)
    ax.text(2.4, 4.8, "Tag Venues", fontsize=8, style='italic')

    ax.annotate("", xy=(5, 3.3), xytext=(5, 1.7), arrowprops=arrow_props)
    ax.text(5.2, 2.5, "Verify Leads", fontsize=8, style='italic')

    path = os.path.join(IMG_DIR, "fig1_1_workflow.png")
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close()
    return path

def generate_figure_2_1():
    """User hierarchy diagram"""
    fig, ax = plt.subplots(figsize=(6, 2.8), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')

    def draw_box(x, y, w, h, text, is_parent=False):
        fc = "#eef2f6" if is_parent else "#ffffff"
        box = patches.Rectangle((x - w/2, y - h/2), w, h, ec="black", fc=fc, lw=1.2)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=9, fontweight='bold' if is_parent else 'normal')

    draw_box(5, 4.8, 2.4, 0.9, "CampusPulse Users", is_parent=True)
    draw_box(2.0, 2.0, 2.5, 0.9, "Students")
    draw_box(5.0, 2.0, 2.8, 0.9, "Society Leads / Coords")
    draw_box(8.0, 2.0, 2.5, 0.9, "Campus Admins")

    # Connecting lines
    ax.plot([5, 5], [4.3, 3.4], color='black', lw=1.1)
    ax.plot([2.0, 8.0], [3.4, 3.4], color='black', lw=1.1)
    ax.annotate("", xy=(2.0, 2.5), xytext=(2.0, 3.4), arrowprops=dict(arrowstyle="->", color="black", lw=1.1))
    ax.annotate("", xy=(5.0, 2.5), xytext=(5.0, 3.4), arrowprops=dict(arrowstyle="->", color="black", lw=1.1))
    ax.annotate("", xy=(8.0, 2.5), xytext=(8.0, 3.4), arrowprops=dict(arrowstyle="->", color="black", lw=1.1))

    path = os.path.join(IMG_DIR, "fig2_1_users.png")
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close()
    return path

def generate_figure_2_2():
    """Entity relationship / Data flow diagram"""
    fig, ax = plt.subplots(figsize=(7, 4.2), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    def draw_table(x, y, w, h, title, fields):
        # Header
        box_hdr = patches.Rectangle((x, y + h - 0.5), w, 0.5, ec="black", fc="#333333", lw=1)
        ax.add_patch(box_hdr)
        ax.text(x + w/2, y + h - 0.25, title, ha='center', va='center', color='white', fontsize=8, fontweight='bold')
        # Body
        box_bdy = patches.Rectangle((x, y), w, h - 0.5, ec="black", fc="#fafafa", lw=1)
        ax.add_patch(box_bdy)
        for i, fld in enumerate(fields):
            ax.text(x + 0.15, y + h - 0.8 - (i * 0.35), fld, fontsize=7.2, va='center')

    draw_table(0.5, 2.0, 3.0, 4.8, "Users", [
        "user_id (PK)", "roll_number", "full_name", "email",
        "password_hash", "role", "branch_year", "created_at"
    ])

    draw_table(4.5, 3.2, 3.2, 4.2, "Events", [
        "event_id (PK)", "title", "category", "society_id (FK)",
        "venue_id (FK)", "event_time", "has_food / prize"
    ])

    draw_table(8.5, 4.5, 3.0, 3.0, "Venues", [
        "venue_id (PK)", "venue_name", "latitude", "longitude", "category"
    ])

    draw_table(8.5, 0.8, 3.0, 3.2, "RSVPs", [
        "rsvp_id (PK)", "user_id (FK)", "event_id (FK)",
        "privacy_tier", "timestamp"
    ])

    draw_table(4.5, 0.5, 3.2, 2.3, "Societies", [
        "society_id (PK)", "name", "category", "logo_url"
    ])

    # Connectors
    ax.plot([3.5, 4.5], [5.0, 5.0], color='black', lw=1.1, linestyle='--')
    ax.plot([7.7, 8.5], [5.5, 5.5], color='black', lw=1.1, linestyle='--')
    ax.plot([6.1, 8.5], [3.2, 2.5], color='black', lw=1.1, linestyle='--')
    ax.plot([6.1, 6.1], [3.2, 2.8], color='black', lw=1.1, linestyle='--')

    path = os.path.join(IMG_DIR, "fig2_2_entities.png")
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close()
    return path

def generate_figure_2_3():
    """Student Activities Workflow"""
    fig, ax = plt.subplots(figsize=(6.5, 2.2), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 3.5)
    ax.axis('off')

    steps = [
        ("Step 1: Auth", "Roll Number Login\n& Verification"),
        ("Step 2: Discovery", "Event Feed Filter\n& Map Directions"),
        ("Step 3: Calendar", "RSVP & 3-Tier\nPrivacy Sync")
    ]

    for i, (st, desc) in enumerate(steps):
        x = 1.0 + i * 3.4
        box_hdr = patches.Rectangle((x, 2.2), 2.7, 0.6, ec="black", fc="#444444", lw=1)
        ax.add_patch(box_hdr)
        ax.text(x + 1.35, 2.5, st, ha='center', va='center', color='white', fontsize=8, fontweight='bold')

        box_bdy = patches.Rectangle((x, 0.6), 2.7, 1.6, ec="black", fc="#ffffff", lw=1)
        ax.add_patch(box_bdy)
        ax.text(x + 1.35, 1.4, desc, ha='center', va='center', fontsize=7.8)

        if i < 2:
            ax.annotate("", xy=(x + 3.2, 1.7), xytext=(x + 2.8, 1.7),
                        arrowprops=dict(arrowstyle="->", color="black", lw=1.2))

    path = os.path.join(IMG_DIR, "fig2_3_student_activity.png")
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close()
    return path

def generate_figure_2_4():
    """Society Lead & Admin Activities"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(6.5, 2.6), dpi=300)
    for ax in (ax1, ax2):
        ax.set_xlim(0, 6)
        ax.set_ylim(0, 6)
        ax.axis('off')

    # Society Lead
    b1 = patches.Rectangle((0.5, 0.5), 5, 4.8, ec="black", fc="#fbfbfb", lw=1.2)
    ax1.add_patch(b1)
    bh1 = patches.Rectangle((0.5, 4.5), 5, 0.8, ec="black", fc="#222222")
    ax1.add_patch(bh1)
    ax1.text(3.0, 4.9, "Society Lead Activities", ha='center', va='center', color='white', fontsize=8.5, fontweight='bold')
    activities_lead = ["• Create / Edit Event", "• Tag Venue Pin Coordinates", "• Post Society Stories / Reels", "• Track RSVPs & Headcount"]
    for i, act in enumerate(activities_lead):
        ax1.text(0.9, 3.8 - i * 0.9, act, fontsize=7.8)

    # Admin
    b2 = patches.Rectangle((0.5, 0.5), 5, 4.8, ec="black", fc="#fbfbfb", lw=1.2)
    ax2.add_patch(b2)
    bh2 = patches.Rectangle((0.5, 4.5), 5, 0.8, ec="black", fc="#222222")
    ax2.add_patch(bh2)
    ax2.text(3.0, 4.9, "Campus Admin Activities", ha='center', va='center', color='white', fontsize=8.5, fontweight='bold')
    activities_admin = ["• Verify Society Coordinators", "• Moderate & Audit Posts", "• Update Campus Map CMS", "• Monitor System Telemetry"]
    for i, act in enumerate(activities_admin):
        ax2.text(0.9, 3.8 - i * 0.9, act, fontsize=7.8)

    path = os.path.join(IMG_DIR, "fig2_4_lead_admin.png")
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close()
    return path

# -------------------------------------------------------------
# 2. Numbered Canvas for Footer Page Numbers
# -------------------------------------------------------------

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Times-Roman", 10)
        # Center page number on every page
        page_text = f"{self._pageNumber}"
        self.drawCentredString(letter[0] / 2.0, 36, page_text)
        self.restoreState()

# -------------------------------------------------------------
# 3. Build Document Flowables
# -------------------------------------------------------------

def build_pdf():
    # Generate diagrams
    fig1 = generate_figure_1_1()
    fig2 = generate_figure_2_1()
    fig3 = generate_figure_2_2()
    fig4 = generate_figure_2_3()
    fig5 = generate_figure_2_4()

    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography matching classic academic LaTeX layout
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=19,
        leading=24,
        alignment=1, # Center
        spaceAfter=14
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=13,
        leading=16,
        alignment=1,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        fontName='Times-Bold',
        fontSize=15,
        leading=19,
        spaceBefore=12,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        fontName='Times-Bold',
        fontSize=12,
        leading=15,
        spaceBefore=9,
        spaceAfter=5
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        fontName='Times-Roman',
        fontSize=10,
        leading=14.5,
        spaceAfter=6,
        alignment=4 # Justify
    )

    caption_style = ParagraphStyle(
        'Caption_Custom',
        fontName='Times-Italic',
        fontSize=9,
        leading=12,
        alignment=1,
        spaceBefore=4,
        spaceAfter=10
    )

    toc_item_style = ParagraphStyle(
        'TOC_Item',
        fontName='Times-Roman',
        fontSize=10,
        leading=18
    )

    toc_sub_style = ParagraphStyle(
        'TOC_SubItem',
        fontName='Times-Roman',
        fontSize=10,
        leading=18,
        leftIndent=18
    )

    story = []

    # ==================== PAGE 1: TITLE PAGE ====================
    story.append(Spacer(1, 40))
    story.append(HRFlowable(width="100%", thickness=3.5, color=colors.black, spaceAfter=50))
    story.append(Spacer(1, 25))
    story.append(Paragraph("SOFTWARE REQUIREMENTS<br/>SPECIFICATION", title_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph("for", subtitle_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("CAMPUSPULSE WEBSITE", title_style))
    story.append(Spacer(1, 35))
    story.append(Paragraph("Version 1.0", subtitle_style))
    story.append(Spacer(1, 70))

    prep_data = [
        [Paragraph("<b>Prepared by :</b>", body_style), Paragraph("<b>1. Tejas Korde</b> (1024240034)<br/><b>2. Daanish Narang</b> (1024240054)<br/><b>3. Harshit Garg</b> (1024240138)", body_style)],
        [Paragraph("<b>Submitted to :</b>", body_style), Paragraph("<b>Software Engineering Course Instructor</b><br/>Department of Computer Science & Engineering<br/>Thapar Institute of Eng. & Tech.", body_style)],
        [Paragraph("<b>Date :</b>", body_style), Paragraph("October 9, 2026", body_style)]
    ]
    prep_table = Table(prep_data, colWidths=[110, 280])
    prep_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(prep_table)
    story.append(PageBreak())

    # ==================== PAGE 2: CONTENTS ====================
    story.append(Spacer(1, 15))
    story.append(Paragraph("Contents", title_style))
    story.append(Spacer(1, 15))

    toc_data = [
        [Paragraph("<b>1 &nbsp; Introduction</b>", toc_item_style), Paragraph("<b>3</b>", toc_item_style)],
        [Paragraph("1.1 &nbsp; Purpose . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("3", toc_item_style)],
        [Paragraph("1.2 &nbsp; Intended Audience and Reading Suggestions . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("3", toc_item_style)],
        [Paragraph("1.3 &nbsp; Project Scope . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("3", toc_item_style)],
        [Paragraph("<b>2 &nbsp; Overall Description</b>", toc_item_style), Paragraph("<b>5</b>", toc_item_style)],
        [Paragraph("2.1 &nbsp; Product Perspective . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("5", toc_item_style)],
        [Paragraph("2.2 &nbsp; User Classes and Characteristics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("5", toc_item_style)],
        [Paragraph("2.3 &nbsp; Product Functions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("6", toc_item_style)],
        [Paragraph("2.4 &nbsp; Operating Environment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("7", toc_item_style)],
        [Paragraph("2.5 &nbsp; Design . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("7", toc_item_style)],
        [Paragraph("<b>3 &nbsp; System Features</b>", toc_item_style), Paragraph("<b>9</b>", toc_item_style)],
        [Paragraph("3.1 &nbsp; Description and Priority . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("9", toc_item_style)],
        [Paragraph("3.2 &nbsp; Functional Requirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("9", toc_item_style)],
        [Paragraph("<b>4 &nbsp; Other Nonfunctional Requirements</b>", toc_item_style), Paragraph("<b>10</b>", toc_item_style)],
        [Paragraph("4.1 &nbsp; Performance Requirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("10", toc_item_style)],
        [Paragraph("4.2 &nbsp; Security Requirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("10", toc_item_style)],
        [Paragraph("4.3 &nbsp; Software Quality Attributes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("10", toc_item_style)],
        [Paragraph("4.4 &nbsp; Business Rules . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_sub_style), Paragraph("10", toc_item_style)],
        [Paragraph("<b>5 &nbsp; Other Requirements</b>", toc_item_style), Paragraph("<b>11</b>", toc_item_style)],
    ]
    toc_table = Table(toc_data, colWidths=[450, 30])
    toc_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # ==================== PAGE 3: 1 INTRODUCTION ====================
    story.append(Paragraph("1 &nbsp; Introduction", h1_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("1.1 &nbsp; Purpose", h2_style))
    story.append(Paragraph(
        "In large academic institutions such as Thapar Institute of Engineering & Technology, "
        "maintaining and disseminating event information, club announcements, and workshop schedules through physical "
        "noticeboards or fragmented chat groups is highly error-prone and inefficient. Any event schedule, venue, or speaker "
        "can be changed, postponed, or added at any time. Freshmen and general students routinely face navigation confusion and "
        "miss out on important academic and extra-curricular opportunities. So, \"CAMPUSPULSE WEBSITE\" is the solution. "
        "\"CAMPUSPULSE WEBSITE\" is an official campus-wide web platform based on interactive event discovery, spatial map navigation, "
        "and 3-tier privacy calendar management authorized for TIET. The main concept of \"CAMPUSPULSE WEBSITE\" is to centralize "
        "all student societies, events, campus buildings, and peer schedules into an interconnected digital layer.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("1.2 &nbsp; Intended Audience and Reading Suggestions", h2_style))
    story.append(Paragraph(
        "This SRS is for developers, project managers, student coordinators, faculty evaluators, and software testers. "
        "Further the discussion will provide all the internal, external, functional, architectural, and also non-functional "
        "specifications about \"CAMPUSPULSE WEBSITE\". Developers should focus on the data schema and API specs, while project "
        "evaluators should inspect the scope, feature priorities, and user activity flows.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("1.3 &nbsp; Project Scope", h2_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" creates an integrated digital space for Students, Society Coordinators, and Campus Administrators "
        "for maintaining campus-wide social and academic interactions.",
        body_style
    ))
    story.append(Paragraph(
        "After registering on the platform using university credentials (roll number, email), a student can enter their personalized "
        "dashboard. The student can explore live upcoming events categorized by tags (Tech, Cultural, Sports, Hackathons, Free Food, "
        "Cash Prize), view exact geolocation pins on an interactive Leaflet campus map, and open sliding bottom drawers for walking "
        "directions. The student can RSVP to events and assign privacy tiers (Public, Friends Only, Private) to sync with their personal "
        "and friend group calendar.",
        body_style
    ))
    story.append(Paragraph(
        "Society Coordinators create official society profiles, post new event cards with date, time, venue pins, and incentive tags, "
        "and broadcast high-priority story reels. They also track real-time RSVP counts and attendee headcount.",
        body_style
    ))
    story.append(Paragraph(
        "Administrators oversee the integrity of the platform. Their main work is to verify society accounts, moderate event posts, "
        "manage campus landmark coordinates, and monitor system performance logs.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 4: WORKFLOW ====================
    story.append(Spacer(1, 10))
    story.append(Image(fig1, width=380, height=220))
    story.append(Paragraph("Figure 1.1: Entire work-flow", caption_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "Figure 1.1 (Entire work-flow) is the overview of the project. Connection of all the entities are dependable on each other. "
        "This gives a clear and simple overview of the functional activities of the project.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Student cycle:</b> In Figure 1.1, \"Student\" discovers \"Events & Feed\"; \"Events\" are linked to \"Campus Map\" "
        "landmarks; student RSVPs and synchronizes them to their \"Social Calendar\" with 3-tier privacy.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Society Lead cycle:</b> \"Society Leads\" create and publish \"Events\"; tag specific geo-coordinates on \"Campus Map\"; "
        "broadcast announcement stories; and analyze live attendee metrics.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Administrator cycle:</b> \"Admin\" audits submitted society events; moderates inappropriate content; maintains campus "
        "coordinate databases; and ensures system stability.",
        body_style
    ))
    story.append(Paragraph(
        "So, every entity is highly interactive and coupled in real-time with each other.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 5: 2 OVERALL DESCRIPTION ====================
    story.append(Paragraph("2 &nbsp; Overall Description", h1_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("2.1 &nbsp; Product Perspective", h2_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" is the replacement of manual paper posters, chaotic WhatsApp group blasts, and fragmented society notifications. "
        "All historical and upcoming event data, venue coordinates, and student schedules are stored centrally in a high-performance database. "
        "The main goal of this project is to minimize student friction, avoid schedule collisions, and maximize student participation in "
        "campus activities.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("2.2 &nbsp; User Classes and Characteristics", h2_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" has basically 3 primary types of users with distinct privileges:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Students</b>: Undergraduate and postgraduate campus students exploring events, syncing calendars, and navigating campus.<br/>"
        "• <b>Society Leads / Coordinators</b>: Authorized club representatives creating events, broadcasts, and managing registrations.<br/>"
        "• <b>Campus Administrators</b>: University authority maintaining map data, moderating posts, and approving society roles.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Image(fig2, width=380, height=140))
    story.append(Paragraph("Figure 2.1: Type of users", caption_style))
    story.append(PageBreak())

    # ==================== PAGE 6: 2.3 PRODUCT FUNCTIONS ====================
    story.append(Paragraph("2.3 &nbsp; Product Functions", h2_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" stores and indexes all campus events, society broadcasts, venues, and student RSVPs. "
        "Before using the core features of the software, users must be registered and authenticated.",
        body_style
    ))
    story.append(Spacer(1, 6))
    story.append(Image(fig3, width=420, height=200))
    story.append(Paragraph("Figure 2.2: Data Flow and Entity Relationship Diagram", caption_style))

    story.append(Paragraph(
        "All users have standard attributes: <code>user_id</code>, <code>roll_number</code>, <code>full_name</code>, "
        "<code>email</code>, <code>role</code>, <code>branch_year</code>, <code>password_hash</code>, and <code>created_at</code>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Events table</b> contains: <code>event_id</code>, <code>title</code>, <code>description</code>, <code>category</code> "
        "(Tech, Cultural, Sports, Hackathon), <code>society_id</code>, <code>venue_id</code>, <code>event_time</code>, "
        "<code>has_food</code>, <code>has_prize</code>, and <code>status</code>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Venues table</b> contains: <code>venue_id</code>, <code>venue_name</code>, <code>latitude</code>, <code>longitude</code>, "
        "<code>category</code> (Academic, Hostel, Sports, Cafeteria), and <code>description</code>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>RSVP table</b> is the core coordination bridge: <code>rsvp_id</code>, <code>user_id</code>, <code>event_id</code>, "
        "<code>privacy_tier</code> (Public, Friends Only, Private), and <code>timestamp</code>.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 7: 2.4 & 2.5 DESIGN (STUDENT) ====================
    story.append(Paragraph("2.4 &nbsp; Operating Environment", h2_style))
    story.append(Paragraph(
        "The website will operate smoothly in any modern Operating Environment and Web Browser — Windows, macOS, Linux, "
        "Android, iOS, Google Chrome, Safari, Mozilla Firefox, and Microsoft Edge.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("2.5 &nbsp; Design", h2_style))
    story.append(Paragraph(
        "Student activities follow 3 sequential steps:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Authentication & Profile</b>: Student enters roll number credentials and personal preferences.<br/>"
        "• <b>Discovery & Navigation</b>: Student filters events by tags and selects map landmarks for directions.<br/>"
        "• <b>RSVP & Privacy Sync</b>: Student saves events and assigns privacy tiers to coordinate with friends.",
        body_style
    ))
    story.append(Spacer(1, 15))
    story.append(Image(fig4, width=420, height=130))
    story.append(Paragraph("Figure 2.3: Student Activities", caption_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Every student profile displays their personal info, saved upcoming events, society memberships, and personalized friend feed. "
        "Notice and Story reels present urgent announcements and live registrations across Thapar.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 8: DESIGN (LEAD & ADMIN) ====================
    story.append(Paragraph("Society Lead and Admin activities are structured as follows:", body_style))
    story.append(Spacer(1, 10))
    story.append(Image(fig5, width=430, height=160))
    story.append(Paragraph("Figure 2.4: Society Coordinator and Campus Admin Activities", caption_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "<b>Society Coordinators:</b> Authorized leads can create new events, specify exact campus coordinates, publish priority "
        "broadcasts/stories, and inspect live RSVP counts.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Campus Administrators:</b> Administrators verify society leads, moderate all publicly posted events, manage landmark "
        "data on the map engine, and audit system security.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 9: 3 SYSTEM FEATURES ====================
    story.append(Paragraph("3 &nbsp; System Features", h1_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" is a campus-wide event discovery and social calendar software. The core purpose of this product "
        "is to discover events, navigate campus spaces, and coordinate schedules effortlessly.",
        body_style
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("3.1 &nbsp; Description and Priority", h2_style))
    story.append(Paragraph("The features with priority from highest to lowest:", body_style))
    story.append(Paragraph(
        "1. <b>Interactive Event Feed</b>: Goal feature. Browse upcoming events, filter by categories, and search.<br/>"
        "2. <b>Campus Geo-Spatial Map</b>: Interactive map with building markers and sliding bottom sheet navigation.<br/>"
        "3. <b>3-Tier Privacy Calendar</b>: Personal schedule manager with Public, Friends Only, and Private tiers.<br/>"
        "4. <b>Society Stories & Broadcasts</b>: Urgent announcement reel operated by verified club coordinators.<br/>"
        "5. <b>Role-Based Authentication</b>: Secure JWT login and personal user profile management.<br/>"
        "6. <b>Administrative Moderation</b>: Reviewing posts and managing campus landmark coordinates.",
        body_style
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("3.2 &nbsp; Functional Requirements & Tech Stack", h2_style))
    story.append(Paragraph(
        "The \"CAMPUSPULSE WEBSITE\" is built on modern high-performance web technologies:<br/>"
        "• <b>Front-End</b>: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Leaflet.js.<br/>"
        "• <b>Back-End</b>: Python 3.11+, FastAPI framework, SQLAlchemy 2.0 (Async), Uvicorn.<br/>"
        "• <b>Database</b>: SQLite (development) and PostgreSQL (production).<br/>"
        "• <b>UI Theme</b>: Dark Y2K Neon aesthetic (#07070b dark canvas with cyan & purple accents).",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 10: 4 OTHER NONFUNCTIONAL REQUIREMENTS ====================
    story.append(Paragraph("4 &nbsp; Other Nonfunctional Requirements", h1_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("4.1 &nbsp; Performance Requirements", h2_style))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" is engineered for high-concurrency peak usage during fest registrations and hackathons. "
        "First Contentful Paint (FCP) shall be &lt; 1.5 seconds on 4G networks. Core API responses shall be served under 100ms.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("4.2 &nbsp; Security Requirements", h2_style))
    story.append(Paragraph(
        "No unregistered or unauthorized user can create events or modify campus landmarks. Passwords must be hashed using bcrypt "
        "before database storage. Communication is enforced over HTTPS/TLS.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("4.3 &nbsp; Software Quality Attributes", h2_style))
    story.append(Paragraph(
        "During all development phases, continuous automated unit tests, API integration tests, and UI component testing are maintained. "
        "The system maintains 99.5% uptime availability during active academic terms.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("4.4 &nbsp; Business Rules", h2_style))
    story.append(Paragraph(
        "• <b>Verification</b>: Only verified society coordinator accounts can publish official events.<br/>"
        "• <b>Privacy Default</b>: New RSVPs default to Friends Only visibility.<br/>"
        "• <b>Archival</b>: Expired events automatically transition to the archive state 24 hours after completion.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== PAGE 11: 5 OTHER REQUIREMENTS ====================
    story.append(Paragraph("5 &nbsp; Other Requirements", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "\"CAMPUSPULSE WEBSITE\" needs ongoing maintenance as it is a multi-semester evolving software system. "
        "It features a modular code architecture to support continuous refactoring as new university requirements and campus buildings emerge.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>Future Enhancements:</b><br/>"
        "• <b>Turn-by-turn Campus Pathfinding</b>: Integration of Dijkstra/A* pathfinding algorithms for walking paths between hostels, academic blocks, and food courts.<br/>"
        "• <b>Push Notifications</b>: Real-time service worker notifications for registered event reminders and schedule updates.<br/>"
        "• <b>Multi-Campus Expansion</b>: Modular schema extension allowing multi-tenant deployment across other universities.",
        body_style
    ))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SRS PDF successfully generated at: {PDF_PATH}")

if __name__ == "__main__":
    build_pdf()
