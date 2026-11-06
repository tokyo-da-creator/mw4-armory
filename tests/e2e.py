"""
End-to-end checks against the static build, in real Chrome.
Run:  python3 -m http.server 4173 -d out &   then   python3 tests/e2e.py
Set BASE=https://... to run against a deployed site.
"""
import os, sys
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("BASE", "http://localhost:4173")
SHOTS = os.environ.get("SHOTS")
ROUTES = ["/", "/unlocks/", "/weapons/", "/weapons/han-86/", "/camos/", "/attachments/", "/equipment/", "/operators/",
          "/prestige/", "/mastery/", "/challenges/", "/sources/"]
ARGS = ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
results = []

def check(name, fn):
    try:
        fn()
        results.append((name, True))
        print(f"  PASS  {name}")
    except Exception as e:  # noqa
        results.append((name, False))
        print(f"  FAIL  {name}: {str(e).splitlines()[0][:300]}")

def loaded(page):
    page.wait_for_selector("#main h1", timeout=15000)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=ARGS)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(f"{page.url} :: {str(e)[:60]}"))
    page.on("console", lambda m: m.type == "error" and errors.append(f"{page.url} :: {m.text[:160]}"))

    def all_routes():
        for r in ROUTES:
            page.goto(BASE + r)
            loaded(page)
            if SHOTS:
                page.wait_for_timeout(900)
                page.screenshot(path=f"{SHOTS}/desk{r.strip('/').replace('/', '_') or 'home'}.png")
        assert not errors, errors[:3]
    check("Every route renders with no errors", all_routes)

    def nav():
        page.goto(BASE + "/")
        loaded(page)
        hrefs = page.eval_on_selector_all("aside nav a", "els => els.map(e => e.getAttribute('href'))")
        assert len(hrefs) == 11, hrefs
        for h in hrefs:
            page.goto(BASE + h)
            loaded(page)
    check("All 11 sidebar links work", nav)

    def no_tracking():
        for r in ["/", "/weapons/han-86/", "/camos/", "/equipment/", "/prestige/"]:
            page.goto(BASE + r)
            loaded(page)
            for word in ["Mark complete", "Track", "Export progress", "Completion"]:
                expect(page.get_by_role("button", name=word, exact=True)).to_have_count(0)
        dbs = page.evaluate("indexedDB.databases ? indexedDB.databases().then(d => d.map(x => x.name)) : []")
        assert "mw4-armory" not in (dbs or []), dbs
    check("No progress tracking or stored data anywhere", no_tracking)

    def weapon_page():
        page.goto(BASE + "/weapons/kg-7-vulcan/")
        loaded(page)
        expect(page.get_by_text("Player Level 4", exact=True)).to_be_visible()
        expect(page.get_by_text("KG-7 Drillcharge", exact=True)).to_be_visible()
        expect(page.locator("dd", has_text="75").first).to_be_visible()
        page.goto(BASE + "/weapons/vel-46/")
        loaded(page)
        expect(page.get_by_text("weapon card says level 13", exact=False).first).to_be_visible()
    check("Weapon page shows official unlock, max level, Apex, and flags disputed levels", weapon_page)

    def howto():
        page.goto(BASE + "/weapons/han-86/")
        loaded(page)
        page.get_by_role("button", name="Gold for Han 86 — how to unlock").click()
        dlg = page.get_by_role("dialog")
        expect(dlg.get_by_text("Unlock all 8 Military and all 3 Special camos on this weapon")).to_be_visible()
        expect(dlg.get_by_text("15 kills in a single match")).to_be_visible()
        page.keyboard.press("Escape")
        page.get_by_role("button", name="Smoke for Han 86 — how to unlock").click()
        expect(page.get_by_role("dialog").get_by_text("Reach Han 86 weapon level 25")).to_be_visible()
        expect(page.get_by_role("dialog").get_by_text("20 kills while mounted")).to_be_visible()
        expect(page.get_by_role("dialog").get_by_text("75 kills while mounted")).to_be_visible()
        link = page.get_by_role("dialog").get_by_role("link", name="See it in game", exact=False)
        expect(link).to_have_attribute("href", "https://www.youtube.com/results?search_query=Modern%20Warfare%204%20Han%2086%20Smoke%20camo")
        expect(link).to_have_attribute("target", "_blank")
        page.keyboard.press("Escape")
        expect(page.get_by_role("dialog")).to_have_count(0)
    check("Camo sheets explain exactly how to unlock (steps + MP/DMZ)", howto)

    def unlock_path():
        page.goto(BASE + "/unlocks/")
        loaded(page)
        expect(page.get_by_role("link", name="Air Lockdown", exact=False)).to_be_visible()
        expect(page.get_by_text("or 13", exact=True)).to_be_visible()
        page.get_by_role("button", name="Killstreaks", exact=False).click()
        expect(page.get_by_role("link", name="Han 86", exact=False)).to_have_count(0)
        expect(page.get_by_role("link", name="UAV", exact=False).first).to_be_visible()
    check("Level path lists every unlock 1–55 and filters by type", unlock_path)

    def search():
        page.goto(BASE + "/")
        loaded(page)
        page.keyboard.press("Control+k")
        page.get_by_label("Search query").fill("striga")
        page.keyboard.press("Enter")
        page.wait_for_url("**/weapons/wz55-striga/")
        loaded(page)
        page.keyboard.press("Control+k")
        page.get_by_label("Search query").fill("uav")
        expect(page.get_by_role("option").first).to_contain_text("UAV")
        page.keyboard.press("Enter")
        page.wait_for_url("**/equipment/**")
        page.goto(BASE + "/")
        loaded(page)
        page.get_by_role("button", name="Search any weapon, camo, perk or operator").click()
        page.get_by_label("Search query").fill("price")
        expect(page.get_by_role("option").first).to_contain_text("Price")
        page.keyboard.press("Escape")
    check("Search reaches weapons, gear and operators", search)

    def inspector():
        page.goto(BASE + "/weapons/han-86/")
        loaded(page)
        page.wait_for_selector("canvas", timeout=20000)
        box = page.locator("canvas").bounding_box()
        assert box["width"] > 300, box
        for name in ["Zoom in", "Zoom out", "Exploded view", "Assemble", "Reset view"]:
            page.get_by_role("button", name=name).click()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.mouse.down(); page.mouse.move(box["x"] + box["width"] / 2 + 120, box["y"] + box["height"] / 2, steps=8); page.mouse.up()
        page.get_by_role("button", name="Inspect fullscreen").click()
        expect(page.get_by_role("dialog", name="Inspect · Han 86")).to_be_visible()
        page.keyboard.press("Escape")
        page.goto(BASE + "/weapons/")
        loaded(page)
        page.get_by_role("button", name="Inspect M4 in 3D").click()
        expect(page.get_by_role("dialog", name="Inspect · M4")).to_be_visible()
        page.get_by_role("button", name="Close inspection").click()
        assert page.url.rstrip("/").endswith("/weapons"), page.url
        assert not errors, errors[:3]
    check("3D inspector: rotate, zoom, explode, fullscreen, grid Inspect", inspector)

    m = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    mp = m.new_page()
    mp.on("pageerror", lambda e: errors.append(f"{mp.url} :: {str(e)[:60]}"))

    def mobile():
        for r in ROUTES:
            mp.goto(BASE + r)
            loaded(mp)
            sw = mp.evaluate("document.documentElement.scrollWidth")
            assert sw <= 390, f"horizontal overflow on {r}: {sw}px"
            if SHOTS:
                mp.wait_for_timeout(900)
                mp.screenshot(path=f"{SHOTS}/mob{r.strip('/').replace('/', '_') or 'home'}.png")
        mp.goto(BASE + "/")
        loaded(mp)
        mp.get_by_role("navigation", name="Primary").get_by_text("Weapons").click()
        mp.wait_for_url("**/weapons/")
        mp.get_by_role("button", name="More").click(force=True)
        mp.get_by_role("link", name="Equipment & Perks").click()
        mp.wait_for_url("**/equipment/")
        assert not errors, errors[:3]
    check("Mobile: every page fits, bottom nav + More menu work", mobile)
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
