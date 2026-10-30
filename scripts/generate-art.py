"""Generate the portfolio's original vector artwork. Python standard library only."""
from pathlib import Path
import math

OUT = Path(__file__).resolve().parents[1] / 'public' / 'artwork'
OUT.mkdir(parents=True, exist_ok=True)

def vadd(a,b): return tuple(x+y for x,y in zip(a,b))
def vmul(a,s): return tuple(x*s for x in a)
def vsub(a,b): return tuple(x-y for x,y in zip(a,b))
def norm(a):
    l=math.sqrt(sum(x*x for x in a))
    return tuple(x/l for x in a)
def cross(a,b): return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def center(t): return ((2+.62*math.cos(3*t))*math.cos(2*t), (2+.62*math.cos(3*t))*math.sin(2*t), .7*math.sin(3*t))
def rotate(a):
    x,y,z=a
    x,z=x*math.cos(.3)+z*math.sin(.3),-x*math.sin(.3)+z*math.cos(.3)
    return (x,y*math.cos(.8)-z*math.sin(.8),y*math.sin(.8)+z*math.cos(.8))
def tube(t,s):
    c=center(t)
    tangent=norm(vsub(center(t+.001),center(t-.001)))
    n=norm(cross(tangent,(0,0,1)))
    b=cross(tangent,n)
    normal=vadd(vmul(n,math.cos(s)),vmul(b,math.sin(s)))
    return rotate(vadd(c,vmul(normal,.34))),rotate(normal)

def knot_svg():
    faces=[]
    steps,radials=180,18
    light=norm((-1,-1,2))
    for i in range(steps):
        for j in range(radials):
            pts=[tube(2*math.pi*(i+di)/steps,2*math.pi*(j+dj)/radials)[0] for di,dj in [(0,0),(1,0),(1,1),(0,1)]]
            _,normal=tube(2*math.pi*(i+.5)/steps,2*math.pi*(j+.5)/radials)
            illumination=.52+.48*max(0,sum(a*b for a,b in zip(normal,light)))
            color=tuple(round(c*illumination) for c in (157,181,126))
            col='#%02x%02x%02x'%color
            coords=' '.join(f'{280+p[0]*75:.1f},{221+p[1]*75:.1f}' for p in pts)
            faces.append((sum(p[2] for p in pts),f'<polygon points="{coords}" fill="{col}" stroke="{col}" stroke-width=".55" stroke-linejoin="round"/>'))
    faces.sort()
    return '<svg xmlns="http://www.w3.org/2000/svg" width="560" height="490" viewBox="0 0 560 490"><defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0v36" fill="none" stroke="#dce1d2" stroke-width=".6"/></pattern><radialGradient id="fade"><stop offset=".2" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="mask"><ellipse cx="280" cy="240" rx="270" ry="225" fill="url(#fade)"/></mask><radialGradient id="shadow"><stop stop-color="#51693e" stop-opacity=".12"/><stop offset="1" stop-color="#51693e" stop-opacity="0"/></radialGradient></defs><rect x="5" y="8" width="550" height="460" fill="url(#grid)" mask="url(#mask)"/><ellipse cx="280" cy="411" rx="170" ry="27" fill="url(#shadow)"/><ellipse cx="280" cy="260" rx="239" ry="168" fill="none" stroke="#9aa88d" stroke-opacity=".5" stroke-dasharray="3 7" transform="rotate(-19 280 260)"/>'+''.join(f[1] for f in faces)+'<g stroke="#7b8e6e" stroke-width="1"><path d="M67 92h12m-6-6v12M465 361h12m-6-6v12"/></g><circle cx="466" cy="166" r="4" fill="#315c3d"/><circle cx="93" cy="349" r="3" fill="#315c3d"/></svg>'

(OUT/'loop.svg').write_text(knot_svg())

orbit='''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
<defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0v36" fill="none" stroke="#c7d4ba" stroke-width=".5"/></pattern><linearGradient id="chart" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d5e4c9"/><stop offset="1" stop-color="#f9fbf6"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#263b1b" flood-opacity=".12"/></filter></defs>
<rect width="900" height="640" fill="#e3ebd9"/><rect width="900" height="640" fill="url(#grid)"/><circle cx="830" cy="0" r="310" fill="none" stroke="#c4d3b6"/><circle cx="830" cy="0" r="350" fill="none" stroke="#c4d3b6"/>
<g transform="translate(65 80) rotate(-4 385 240)" font-family="Arial,sans-serif"><rect width="770" height="480" rx="11" fill="#fff" filter="url(#shadow)"/><path d="M11 0h139v480H11a11 11 0 0 1-11-11V11A11 11 0 0 1 11 0" fill="#1e3025"/><g fill="#edf2e9"><circle cx="27" cy="34" r="9" fill="none" stroke="#d0e4ad" stroke-width="3"/><text x="45" y="40" font-size="22" font-weight="600">orbit</text></g><text x="21" y="80" fill="#a3b49c" font-size="10">YOUR WORKSPACE</text><rect x="12" y="100" width="126" height="34" rx="5" fill="#3b4b37"/><g fill="#cfd9c8" font-size="11"><text x="40" y="122">Overview</text><text x="40" y="167">Assets</text><text x="40" y="210">Activity</text><text x="40" y="253">Settings</text></g><g stroke="#c5d4b8" fill="none" stroke-width="1.2"><rect x="23" y="112" width="9" height="9" rx="2"/><path d="M24 157h8v8h-8zM24 207l3-7 4 7M23 247h10m-10-4h10"/></g><circle cx="27" cy="443" r="12" fill="#bdd09d"/><text x="23" y="447" fill="#20301d" font-size="11">K</text><text x="46" y="447" fill="#d3dfcc" font-size="10">Concept account</text>
<text x="179" y="40" font-size="16" fill="#24321f" font-weight="600">Your portfolio</text><text x="179" y="60" font-size="10" fill="#74816f">A little clarity for your onchain world.</text><rect x="640" y="23" width="103" height="29" rx="15" fill="#f0f4ea"/><circle cx="656" cy="37" r="3" fill="#6d8c53"/><text x="667" y="41" font-size="9" fill="#506342">Sample data</text>
<rect x="179" y="84" width="564" height="226" rx="8" fill="#f8faf5"/><text x="199" y="108" font-size="10" fill="#78866f">Total balance</text><text x="199" y="143" font-size="30" fill="#23331e" font-weight="600">$24,580.46</text><rect x="199" y="155" width="87" height="19" rx="10" fill="#e5efd9"/><text x="209" y="168" fill="#52723b" font-size="9">↗ 8.24% this month</text>
<g stroke="#e6eadf"><path d="M199 194h520M199 228h520M199 262h520"/></g><path d="M199 273 228 270 248 278 271 252 301 258 328 246 351 253 373 221 401 228 424 200 450 213 478 190 501 201 529 172 552 187 580 166 609 178 635 157 663 166 692 144 720 151V287H199Z" fill="url(#chart)"/><path d="m199 273 29-3 20 8 23-26 30 6 27-12 23 7 22-32 28 7 23-28 26 13 28-23 23 11 28-29 23 15 28-21 29 12 26-21 28 9 29-22 28 7" fill="none" stroke="#67874c" stroke-width="2.3" stroke-linejoin="round"/>
<text x="179" y="340" font-size="12" fill="#2d3b28" font-weight="600">Your assets</text><text x="688" y="340" font-size="10" fill="#73806a">View all ↗</text><g fill="#87917e" font-size="9"><text x="215" y="363">Asset</text><text x="475" y="363">Price</text><text x="579" y="363">24h change</text><text x="688" y="363">Balance</text></g>
<g stroke="#edf0e8"><path d="M179 374h564M179 418h564M179 463h564"/></g><circle cx="194" cy="396" r="12" fill="#e9eaf1"/><path d="m194 386-5 10 5 3 5-3zM189 398l5 7 5-7-5 3z" fill="#7076a5"/><g font-size="10" fill="#35422e"><text x="215" y="399">Ethereum</text><text x="475" y="399">$3,245.20</text><text x="688" y="399">$16,226</text></g><text x="579" y="399" font-size="10" fill="#5c7d42">+2.64%</text><circle cx="194" cy="440" r="12" fill="#dee9f9"/><circle cx="194" cy="440" r="7" fill="#6686b9"/><g font-size="10" fill="#35422e"><text x="215" y="444">USD Coin</text><text x="475" y="444">$1.00</text><text x="688" y="444">$8,354</text></g><text x="579" y="444" font-size="10" fill="#5c7d42">+0.01%</text></g></svg>'''
(OUT/'orbit.svg').write_text(orbit)

forma='''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640"><defs><filter id="shadow"><feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#28303c" flood-opacity=".17"/></filter><linearGradient id="purple" x2="1" y2="1"><stop stop-color="#c3aff2"/><stop offset=".5" stop-color="#8872c2"/><stop offset="1" stop-color="#3f365f"/></linearGradient><linearGradient id="pink" x2=".8" y2="1"><stop stop-color="#f4c9af"/><stop offset="1" stop-color="#a4616b"/></linearGradient><linearGradient id="green" x2="1" y2=".8"><stop stop-color="#c5d890"/><stop offset="1" stop-color="#6b8558"/></linearGradient></defs><rect width="900" height="640" fill="#e8e7ec"/><g fill="none" stroke="#d1d0d7" stroke-width=".7"><path d="m0 540 900-400M0 580 900 180M0 620 900 220M0 500 900 100M0 460 900 60M0 420 900 20"/></g><g transform="translate(64 74) rotate(4 386 246)" font-family="Arial,sans-serif"><rect width="772" height="492" rx="11" fill="#1b1b1e" filter="url(#shadow)"/><text x="28" y="42" fill="#eeece9" font-size="24" font-weight="600">forma<tspan fill="#bbaaed">*</tspan></text><g fill="#adacb2" font-size="10"><text x="278" y="38">Explore</text><text x="348" y="38">Collections</text><text x="438" y="38">About</text></g><rect x="638" y="20" width="105" height="29" rx="15" fill="#bbaaed"/><text x="660" y="39" font-size="10" fill="#282333">Gallery concept ↗</text><path d="M28 68h716" stroke="#343438"/><text x="28" y="114" fill="#f2f0ed" font-size="35" font-weight="500">A different kind</text><text x="28" y="154" fill="#f2f0ed" font-size="35" font-weight="500">of collection.</text><text x="535" y="123" fill="#a9a6ae" font-size="10">New perspectives. Digital originals.</text><text x="535" y="141" fill="#a9a6ae" font-size="10">An exploration in form and feeling.</text>
<rect x="28" y="187" width="229" height="232" rx="5" fill="#29262f"/><rect x="272" y="187" width="229" height="232" rx="5" fill="#342a2a"/><rect x="516" y="187" width="229" height="232" rx="5" fill="#292e25"/>
<g transform="translate(143 299)"><ellipse cy="83" rx="62" ry="10" fill="#121016" opacity=".45"/><g fill="url(#purple)" stroke="#d1bdfa" stroke-width=".3"><path d="M-69-40-3-78 64-40 0 0Z"/><path d="m-69-40 1 68 68 40V0Z"/><path d="M0 0 64-40v68L0 68Z"/><path d="M-45-26 0-52 42-27 0-2Z" fill="#29262f"/><path d="M-45-26v49L0 50V-2Z" fill="#53466f"/><path d="M0-2 42-27v50L0 50Z" fill="#8a74b2"/></g></g>
<g transform="translate(387 300)"><ellipse cy="82" rx="65" ry="10" fill="#201719" opacity=".5"/><g fill="url(#pink)" stroke="#e5b49e" stroke-width=".4"><path d="m0-78 68 39v78L0 78l-68-39v-78Z"/><path d="M0-78v78L68 39V-39Z" fill="#d7a094"/><path d="M0 0-68-39v78L0 78Z" fill="#a66c73"/><path d="M0-78-68-39 0 0l68-39Z" fill="#f0beaa"/></g><circle cy="-2" r="35" fill="#342a2a"/><ellipse cy="-2" rx="20" ry="35" fill="#5f4144"/><path d="M0-37c23 0 36 13 36 35S23 33 0 33C13 14 13-18 0-37" fill="#c78880"/></g>
<g transform="translate(630 300)"><ellipse cy="82" rx="66" ry="10" fill="#12180d" opacity=".5"/><g fill="url(#green)" stroke="#d0dfaa" stroke-width=".4"><path d="M0-84 71 42 0 81-71 42Z"/><path d="M0-84V81l71-39Z" fill="#8caa68"/><path d="M0-84-71 42 0 81Z" fill="#bdcf94"/><path d="M0-35 30 26 0 44-30 26Z" fill="#292e25"/><path d="M0-35V44l30-18Z" fill="#4b5d37"/></g></g>
<g fill="#e4e1e6" font-size="12"><text x="28" y="447">Folded space</text><text x="272" y="447">Soft geometry</text><text x="516" y="447">New horizons</text></g><g fill="#928e99" font-size="9"><text x="28" y="466">Form study / 001</text><text x="272" y="466">Form study / 002</text><text x="516" y="466">Form study / 003</text></g><g fill="#bbb3cb" font-size="11"><text x="239" y="451">↗</text><text x="483" y="451">↗</text><text x="727" y="451">↗</text></g></g></svg>'''
(OUT/'forma.svg').write_text(forma)
print('Generated loop.svg, orbit.svg, forma.svg')
