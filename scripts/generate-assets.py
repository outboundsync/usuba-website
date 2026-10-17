"""Regenerates the mascot, brand and icon SVGs in this folder.
Run from this directory: python3 _generate.py
Edit geometry here, not in the output files, so all poses stay consistent."""

INK = "#4a2a3f"


def spark(x, y, r, fill="#ffe69a"):
    return (f'  <path d="M{x},{y-r} Q{x},{y} {x+r},{y} Q{x},{y} {x},{y+r} Q{x},{y} {x-r},{y} '
            f'Q{x},{y} {x},{y-r} Z" fill="{fill}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>\n')


def body(face, extra_back="", extra_front="", vb="0 0 320 200", label="Usu-chan, the Usuba mascot"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{label}">
  <ellipse cx="170" cy="188" rx="120" ry="10" fill="#f7b3cb"/>
{extra_back}  <rect x="20" y="78" width="112" height="42" rx="21" fill="#e9b98a" stroke="{INK}" stroke-width="5"/>
  <path d="M42,90 L42,108 M60,90 L60,108" stroke="#c99566" stroke-width="4" stroke-linecap="round"/>
  <rect x="118" y="70" width="20" height="58" rx="7" fill="#d9ccff" stroke="{INK}" stroke-width="5"/>
  <rect x="136" y="28" width="168" height="124" rx="28" fill="#eef1f8" stroke="{INK}" stroke-width="5"/>
  <path d="M160,48 L280,48" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <path d="M156,132 L284,132" stroke="#ccd3e6" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="180" cy="104" rx="12" ry="7" fill="#ff9cbf"/>
  <ellipse cx="260" cy="104" rx="12" ry="7" fill="#ff9cbf"/>
{face}{extra_front}</svg>
'''


EYES_OPEN = f'''  <ellipse cx="196" cy="84" rx="8" ry="10" fill="{INK}"/>
  <ellipse cx="244" cy="84" rx="8" ry="10" fill="{INK}"/>
  <circle cx="198.5" cy="79.5" r="3" fill="#ffffff"/>
  <circle cx="246.5" cy="79.5" r="3" fill="#ffffff"/>
'''
SMILE = f'  <path d="M212,100 Q220,109 228,100" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>\n'

poses = {
    "default": body(EYES_OPEN + SMILE),
    "celebrate": body(
        f'''  <path d="M188,88 Q196,76 204,88" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
  <path d="M236,88 Q244,76 252,88" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
  <path d="M209,98 Q220,116 231,98 Z" fill="#ff7aa8" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>
''',
        extra_front=spark(118, 30, 14) + spark(316, 22, 10, "#bdeed8") + spark(310, 176, 12, "#d9ccff")
        + spark(20, 40, 9, "#ff9cbf") + f'''  <g stroke="{INK}" stroke-width="2">
    <rect x="70" y="20" width="10" height="10" rx="2" fill="#bdeed8" transform="rotate(20 75 25)"/>
    <rect x="96" y="150" width="9" height="9" rx="2" fill="#ffe69a" transform="rotate(-15 100 154)"/>
    <circle cx="300" cy="80" r="5" fill="#ff9cbf"/>
    <circle cx="40" cy="150" r="5" fill="#d9ccff"/>
  </g>
''',
        vb="0 0 330 200", label="Usu-chan celebrating"),
    "sleep": body(
        f'''  <path d="M188,84 Q196,92 204,84" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M236,84 Q244,92 252,84" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>
  <ellipse cx="220" cy="104" rx="4" ry="5" fill="{INK}"/>
''',
        extra_front=f'''  <g font-family="'M PLUS Rounded 1c', 'Arial Rounded MT Bold', sans-serif" font-weight="800" fill="{INK}">
    <text x="290" y="16" font-size="18">z</text>
    <text x="306" y="-6" font-size="26">z</text>
  </g>
''',
        vb="0 -30 340 230", label="Usu-chan sleeping"),
    "oops": body(
        f'''  <path d="M186,72 L203,66 M254,72 L237,66" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="196" cy="88" r="10" fill="#ffffff" stroke="{INK}" stroke-width="4"/>
  <circle cx="244" cy="88" r="10" fill="#ffffff" stroke="{INK}" stroke-width="4"/>
  <circle cx="196" cy="90" r="4" fill="{INK}"/>
  <circle cx="244" cy="90" r="4" fill="{INK}"/>
  <path d="M208,108 q6,-6 12,0 q6,6 12,0" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
''',
        extra_front=f'  <path d="M292,44 q10,14 0,22 q-10,-8 0,-22 Z" fill="#bfe3ff" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>\n',
        label="Usu-chan looking worried"),
    "wave": body(
        EYES_OPEN + f'  <path d="M209,98 Q220,112 231,98" fill="#ff7aa8" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>\n',
        extra_back=f'''  <path d="M300,96 Q326,88 334,62" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="335" cy="54" r="10" fill="#eef1f8" stroke="{INK}" stroke-width="5"/>
  <path d="M354,40 q7,9 0,20 M366,32 q10,15 0,34" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
''',
        vb="0 0 380 200", label="Usu-chan waving"),
}

HERO = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 260" role="img" aria-label="A smiling little usuba knife saying let's cook">
  <ellipse cx="190" cy="236" rx="120" ry="11" fill="#f7b3cb"/>
  <rect x="20" y="14" width="152" height="50" rx="25" fill="#ffffff" stroke="{INK}" stroke-width="4"/>
  <path d="M118,62 L128,84 L142,61" fill="#ffffff" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>
  <rect x="116" y="56" width="30" height="7" fill="#ffffff"/>
  <text x="96" y="46" text-anchor="middle" font-family="'M PLUS Rounded 1c', 'Arial Rounded MT Bold', sans-serif" font-size="19" font-weight="800" fill="{INK}">Let's cook!</text>
  <g transform="translate(20,50)">
    <rect x="20" y="78" width="112" height="42" rx="21" fill="#e9b98a" stroke="{INK}" stroke-width="5"/>
    <path d="M42,90 L42,108 M60,90 L60,108" stroke="#c99566" stroke-width="4" stroke-linecap="round"/>
    <rect x="118" y="70" width="20" height="58" rx="7" fill="#d9ccff" stroke="{INK}" stroke-width="5"/>
    <rect x="136" y="28" width="168" height="124" rx="28" fill="#eef1f8" stroke="{INK}" stroke-width="5"/>
    <path d="M160,48 L280,48" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M156,132 L284,132" stroke="#ccd3e6" stroke-width="5" stroke-linecap="round"/>
{EYES_OPEN.replace("  <", "    <")}    <path d="M212,100 Q220,109 228,100" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="180" cy="104" rx="12" ry="7" fill="#ff9cbf"/>
    <ellipse cx="260" cy="104" rx="12" ry="7" fill="#ff9cbf"/>
  </g>
{spark(330, 34, 12)}{spark(200, 30, 8)}{spark(30, 204, 12)}{spark(340, 216, 10)}</svg>
'''

MARK_INNER = f'''<rect x="4" y="8" width="32" height="24" rx="8" fill="#eef1f8" stroke="{INK}" stroke-width="3"/>
  <circle cx="15" cy="19" r="2.4" fill="{INK}"/>
  <circle cx="25" cy="19" r="2.4" fill="{INK}"/>
  <ellipse cx="11" cy="24" rx="3" ry="1.8" fill="#ff9cbf"/>
  <ellipse cx="29" cy="24" rx="3" ry="1.8" fill="#ff9cbf"/>'''

brand = {
    "logo-mark": f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="Usuba">\n  {MARK_INNER}\n</svg>\n',
    "logo-lockup": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 44" role="img" aria-label="usuba">
  <g transform="translate(0,2)">
  {MARK_INNER}
  </g>
  <text x="50" y="33" font-family="'M PLUS Rounded 1c', 'Arial Rounded MT Bold', sans-serif" font-size="30" font-weight="800" letter-spacing="-0.3" fill="{INK}">usuba</text>
</svg>
''',
    "favicon": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#ffe1ec"/>
  <rect x="3" y="6" width="26" height="20" rx="7" fill="#eef1f8" stroke="{INK}" stroke-width="2.5"/>
  <circle cx="12" cy="15" r="2.2" fill="{INK}"/>
  <circle cx="20" cy="15" r="2.2" fill="{INK}"/>
  <ellipse cx="8.5" cy="20" rx="2.4" ry="1.5" fill="#ff7aa8"/>
  <ellipse cx="23.5" cy="20" rx="2.4" ry="1.5" fill="#ff7aa8"/>
</svg>
''',
    "sparkle": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">\n' + spark(16, 16, 13) + '</svg>\n',
}


def icon(inner):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>\n')


icons = {
    "seedling": '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>',
    "heart": '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    "gift": '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M3 10h18M12 10v10"/><path d="M12 10c-2 0-5-1-5-3.5S10 5 12 10c2-5 5-6 5-3.5S14 10 12 10z"/>',
    "github": '<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    "terminal": '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l3 3-3 3M13 15h4"/>',
    "book": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>',
    "copy": '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7"/>',
    # Added for the site (Oct 17, 2026), same 24px grid and 2.2 stroke as the set above.
    "download": '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    "laptop": '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19.5h20"/>',
    "bug": '<rect x="8" y="8" width="8" height="12" rx="4"/><path d="M12 8V5M10 5.5 9 4M14 5.5l1-1.5M8 12H4.5M8 16H5M16 12h3.5M16 16h3"/>',
    "alert": '<path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17h.01"/>',
    "chart": '<path d="M4 20V11M10 20V5M16 20v-6M3 20.5h18"/>',
    "sparkles": '<path d="M11 3.5l1.7 4.3 4.3 1.7-4.3 1.7L11 15.5l-1.7-4.3L5 9.5l4.3-1.7z"/><path d="M18.5 14.5v5M16 17h5"/>',
    "question": '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.4c-.7.3-1.1.9-1.1 1.6v.6M12 17h.01"/>',
    "loop": '<path d="M4.5 11a7.5 7.5 0 0 1 13.2-4.3L19.5 8.5"/><path d="M19.5 4v4.5H15"/><path d="M19.5 13a7.5 7.5 0 0 1-13.2 4.3L4.5 15.5"/><path d="M4.5 20v-4.5H9"/>',
}

if __name__ == "__main__":
    for k, v in poses.items():
        open(f"mascot/usu-chan-{k}.svg", "w").write(v)
    open("mascot/usu-chan-hero.svg", "w").write(HERO)
    for k, v in brand.items():
        open(f"brand/{k}.svg", "w").write(v)
    for k, v in icons.items():
        open(f"icons/{k}.svg", "w").write(icon(v))
    print("generated", len(poses) + 1 + len(brand) + len(icons), "files")
