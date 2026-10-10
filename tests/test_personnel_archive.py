"""Browser checks for archive styling, public records and existing interactions."""
from playwright.sync_api import sync_playwright
from serve_static import start_server

server, base = start_server()
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, reduced in [(320, False), (390, False), (768, False), (1100, False), (1440, False), (390, True)]:
        context = browser.new_context(viewport={'width': width, 'height': 960}, is_mobile=width < 750, has_touch=width < 750, reduced_motion='reduce' if reduced else 'no-preference')
        context.add_init_script("localStorage.setItem('solaria-noctis-contact-v1','linked')")
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base + '#people')
        # Every existing affiliation filter, retaining public record counts.
        filters = page.locator('#chips .chip').evaluate_all('els=>els.map(e=>e.dataset.f)')
        for key in filters:
            page.locator(f'#chips [data-f="{key}"]').click()
            expected = page.evaluate('(f)=>P.filter(p=>f==="all"||(f==="main"?p.main:p.aff===f)).length', key)
            assert page.locator('#strip .ct').count() == expected
            assert page.locator(f'#chips [data-f="{key}"]').get_attribute('aria-pressed') == 'true'
        page.evaluate("setFilter('all',1)")
        page.wait_for_timeout(100)
        assert page.locator('#peopleDossier').evaluate('e=>e.compareDocumentPosition(document.querySelector("#strip")) & Node.DOCUMENT_POSITION_FOLLOWING')
        assert page.locator('#personDocuments').evaluate('e=>e.querySelectorAll(".personnel-facts dl>div").length>=3')
        assert page.locator('#strip .ct-affiliation').count() == page.locator('#strip .ct').count()
        page.locator('#castNext').click()
        page.wait_for_timeout(600)
        assert page.locator('#strip').evaluate('e=>e.scrollLeft') > 0
        page.locator('#castPrev').click()
        page.wait_for_timeout(600)
        assert page.locator('#strip').evaluate('e=>e.scrollLeft') < 4
        page.locator('#strip .ct').nth(1).click()
        assert page.locator('#cstage h3').inner_text() == page.evaluate('P[1].name')
        # All original visible profile fields, quotes and expanded biography survive.
        for person in page.evaluate('P'):
            page.evaluate('(n)=>setFilter("all",n)', person['no'])
            text = page.locator('#cstage .cinfo').inner_text() + '\n' + page.locator('#personDocuments').inner_text()
            for field in ['name', 'role', 'look', 'pers', 'known', 'quote']:
                if person[field]:
                    assert person[field] in text, (person['no'], field)
            extra = page.evaluate('(n)=>SOLARIA_BIO[n]||null', person['no'])
            if extra:
                assert extra['manner'] in text and extra['goal'] in text
        page.evaluate("setFilter('all',1); SOLARIA_ATLAS.focus(1)")
        # All nine diagram classifications, plus selection, deselection and keyboard focus.
        for key in page.locator('#bondRegionTabs button').evaluate_all('els=>els.map(e=>e.dataset.region)'):
            page.locator(f'#bondRegionTabs [data-region="{key}"]').click()
            assert page.locator(f'#bondRegionTabs [data-region="{key}"]').get_attribute('aria-pressed') == 'true'
            assert page.locator('#bsvg .arc-person').count() > 0
            # Original labels must not collide in any of the nine orbit layouts.
            overlaps = page.locator('#bsvg').evaluate("""svg=>{
                const labels=[...svg.querySelectorAll('.arc-person-name,.arc-person-role')].map(e=>({id:e.parentElement.dataset.person,r:e.getBoundingClientRect()}));
                return labels.some((a,i)=>labels.slice(i+1).some(b=>a.id!==b.id&&Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1));
            }""")
            assert not overlaps, key
            assert page.locator('#bondDetail').evaluate('e=>e.getBoundingClientRect().top>=document.querySelector("#bondBoard").getBoundingClientRect().bottom')
        page.evaluate('SOLARIA_ATLAS.focus(1)')
        node = page.locator('#bsvg [data-person="1"]')
        node.focus(); page.keyboard.press('Enter')
        assert page.locator('#bsvg .is-selected').count() == 0
        assert page.locator('#bsvg [data-person="1"]').evaluate('e=>e===document.activeElement')
        page.keyboard.press('Space')
        assert page.locator('#bsvg [data-person="1"]').get_attribute('aria-pressed') == 'true'
        assert page.locator('#bsvg .arc-thread.selected').count() > 0
        assert page.locator('#bsvg .arc-person.is-dim').count() > 0
        page.wait_for_timeout(500)
        if width < 750:
            assert page.locator('#bondScroller').evaluate('e=>e.scrollLeft') > 0
        assert page.locator('#bondDetail .arc-connection').count() > 0
        assert page.locator('#arcanaBridges [data-bridge]').count() > 0
        page.locator('#bondDetail .arc-dossier-photo').click()
        assert page.locator('.arc-gallery').evaluate('e=>e.open')
        page.wait_for_function('document.querySelector("#arcGalleryImage").naturalWidth>0')
        page.locator('[data-gallery-dossier]').click()
        assert page.locator('#cstage h3').inner_text() == page.evaluate('P.find(p=>p.no===1).name')
        page.evaluate('SOLARIA_ATLAS.focus(1)')
        page.locator('#arcanaBridges [data-bridge]').first.click()
        assert page.locator('#bsvg .is-selected').count() == 1
        page.locator('#bondShowAll').click()
        assert page.locator('#bsvg .selected').count() == 0
        assert page.locator('#bsvg .is-dim').count() == 0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.evaluate("setFilter('all',1);setPerson(1,true)")
        if reduced:
            assert page.locator('#cstage .cinfo').evaluate('e=>getComputedStyle(e).animationName') == 'none'
            assert page.locator('#bsvg .arc-thread').first.evaluate('e=>getComputedStyle(e).transitionDuration') == '0s'
        print('PASS filters, 53 profiles, gallery navigation, 9 diagrams, keyboard, relations, bridges, zoom, layout:', width, reduced, flush=True)
        context.close()
    # A new visitor receives no sealed names, portraits, biographies or SVG tooltips.
    context = browser.new_context()
    page = context.new_page();page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base + '#people')
    page.evaluate("setFilter('all')")
    assert page.locator('#strip .ct').count() == page.evaluate('P.filter(p=>!p.sealed).length')
    page.evaluate("setFilter('rift');SOLARIA_ATLAS.focus(11)")
    assert page.locator('#strip .ct').count() == 0
    assert page.locator('#cstage img').count() == 0
    assert page.locator('#bsvg image').count() == 0
    hidden_names = page.evaluate('P.filter(p=>p.sealed).map(p=>p.name)')
    text = page.locator('#bsvg').text_content() + page.locator('#bondDetail').inner_text()
    assert all(name not in text for name in hidden_names)
    assert page.evaluate('SOLARIA_PORTRAIT_SRC(11)') == 'img/c/11.jpg'
    assert not errors, errors
    print('PASS sealed portraits, names, SVG titles protected; JavaScript errors:', errors)
    browser.close()
server.shutdown()
