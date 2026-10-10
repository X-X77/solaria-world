from playwright.sync_api import sync_playwright
from serve_static import start_server
server, BASE = start_server()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);errors=[]
 def new(roll=0,mobile=False,linked=False):
  ctx=b.new_context(viewport={'width':390 if mobile else 1440,'height':844 if mobile else 1000},has_touch=mobile,is_mobile=mobile)
  page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script(f'window.drawCount=0;crypto.getRandomValues=a=>{{window.drawCount++;a[0]={roll};return a}};'+("localStorage.setItem('solaria-noctis-contact-v1','linked');" if linked else ''))
  return page
 def silent_intro(page):
  page.goto(BASE+'?opening=1',wait_until='domcontentloaded');page.clock.install();page.locator('#opSilent').click();page.clock.fast_forward(22450);page.clock.run_for(500)
 # Skip never draws.
 page=new();page.goto(BASE+'?opening=1',wait_until='domcontentloaded');page.clock.install();page.locator('#opSilent').click();page.locator('#opSkip').click();page.clock.fast_forward(26000);assert page.evaluate('drawCount')==0;assert page.locator('#riftAwakening').is_hidden();print('PASS skipped opening: no draw, no event');page.context.close()
 # No opening from deep link.
 page=new();page.goto(BASE+'#people',wait_until='domcontentloaded');assert page.locator('#intro').count()==0;assert page.evaluate('drawCount')==0;print('PASS deep link: no event');page.context.close()
 # Threshold miss (exact 10%) remains locked.
 page=new(429496730);silent_intro(page);assert page.locator('#riftAwakening').is_hidden();assert page.evaluate('drawCount')==1;assert not page.evaluate('SOLARIA_RIFT_UNLOCKED');print('PASS 10% boundary miss');page.context.close()
 # Win runs entire original opening; captions and unlock follow virtual silent clock.
 for mobile in [False,True]:
  page=new(mobile=mobile);silent_intro(page);assert page.locator('#riftAwakening').is_visible();assert page.evaluate('drawCount')==1;assert not page.evaluate('SOLARIA_RIFT_UNLOCKED');assert page.locator('#riftFilmAudio').evaluate('a=>a.paused')
  assert page.locator('#riftAwakening').get_attribute('data-cut')=='1'
  page.clock.run_for(4500);assert page.locator('#riftAwakening').get_attribute('data-cut')=='2'
  page.clock.run_for(4800);assert page.locator('#riftAwakening').get_attribute('data-cut')=='3';assert page.locator('#riftFilmKorean').inner_text()=='누가 침묵을 깨뜨렸느냐?'
  page.clock.run_for(5600);assert page.locator('#riftFilmKorean').inner_text()=='눈을 돌리지 마라.'
  page.clock.run_for(2000);assert page.locator('#riftAwakening').get_attribute('data-cut')=='4';assert not page.evaluate('SOLARIA_RIFT_UNLOCKED')
  page.clock.run_for(6200);assert page.evaluate('SOLARIA_RIFT_UNLOCKED');assert page.evaluate("localStorage.getItem('solaria-noctis-contact-v1')")=='linked'
  assert page.locator('#riftFilmResult').is_visible();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert page.locator('.rift-cut').evaluate_all('imgs=>imgs.every(i=>i.naturalWidth>0)')
  page.locator('#riftAwakeningExplore').click();assert page.locator('#riftAwakening').is_hidden();assert page.locator('#chips [data-f="rift"].on').count()==1;assert page.locator('#cstage .cpor img').get_attribute('src')=='img/c/11.jpg';assert page.locator('#cstage .cpor.sealed').count()==0;page.evaluate('SOLARIA_ATLAS.focus(11)');assert page.locator('#bsvg .arc-person.is-sealed').count()==0
  assert page.locator('#bsvg [data-person="11"]').count()==1;assert '움브라' not in page.locator('#bondDetail').inner_text();assert page.locator('#bsvg [data-person="53"]').count()==0
  page.evaluate("setFilter('rift',11)");assert '녹스' in page.locator('#cstage').inner_text();assert page.locator('#strip .ct').count()==6
  for no in [11,12,49,50,51,52]:
   page.evaluate('(n)=>setFilter("rift",n)',no);page.wait_for_function('document.querySelector("#cstage .cpor img")?.naturalWidth>0');assert page.locator('#cstage .cpor').evaluate('e=>!e.classList.contains("sealed")');assert page.locator('#cstage .cpor img').evaluate('e=>getComputedStyle(e).filter')=='none'
  page.reload(wait_until='domcontentloaded');assert page.evaluate('SOLARIA_RIFT_UNLOCKED');page.evaluate("setFilter('rift',11)");assert '녹스' in page.locator('#cstage').inner_text()
  print('PASS', 'mobile' if mobile else 'desktop','silent full opening, 4 cuts, subtitles, completion-only unlock, persistence, public-only records');page.context.close()
 # Escape during hidden film aborts without granting new unlock.
 page=new();silent_intro(page);page.keyboard.press('Escape');assert page.locator('#riftAwakening').is_hidden();assert not page.evaluate('SOLARIA_RIFT_UNLOCKED');assert page.evaluate("localStorage.getItem('solaria-noctis-contact-v1')") is None;assert not page.locator('header').evaluate('e=>e.inert');print('PASS early hidden close: no unlock, inert restored');page.context.close()
 # An existing unlock does not become a pity system or force a replay result.
 page=new(429496730,linked=True);silent_intro(page);assert page.evaluate('drawCount')==1;assert page.evaluate('SOLARIA_RIFT_UNLOCKED');assert page.locator('#riftAwakening').is_hidden();print('PASS existing unlock preserved; still independent draw');page.context.close()
 # Playback denial must preserve the silent timeline and completion rules.
 page=new();silent_intro(page);page.locator('#riftFilmAudio').evaluate('a=>a.play=()=>Promise.reject(new Error("test autoplay block"))');page.locator('#riftFilmSound').click();assert page.locator('#riftFilmSound').get_attribute('aria-pressed')=='false';page.clock.run_for(23000);assert page.locator('#riftFilmResult').is_visible();assert page.evaluate('SOLARIA_RIFT_UNLOCKED');print('PASS blocked playback: silent fallback completes');page.context.close()
 assert not errors,errors
 print('All silent flow checks passed; JS errors:',errors)
 b.close()

server.shutdown()
