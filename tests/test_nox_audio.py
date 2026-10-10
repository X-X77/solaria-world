import sys
from playwright.sync_api import sync_playwright
from serve_static import start_server
server, BASE = start_server()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);mobile='--mobile' in sys.argv;page=b.new_page(viewport={'width':390 if mobile else 1440,'height':844},has_touch=mobile,is_mobile=mobile);errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.add_init_script('crypto.getRandomValues=a=>{a[0]=0;return a};window.originalAudio=[];const Original=window.Audio;window.Audio=function(...args){const a=new Original(...args);originalAudio.push(a);return a}')
 page.goto(BASE+'?opening=1',wait_until='domcontentloaded');page.locator('#opStart').click();page.wait_for_function('originalAudio.find(a=>a.src.endsWith("op-v2.mp3"))?.currentTime>.1')
 page.evaluate('SND.openingTime=()=>22.40');page.locator('#riftAwakening').wait_for(state='visible');page.wait_for_function('!document.getElementById("riftFilmAudio").paused')
 assert page.evaluate('originalAudio.every(a=>a.paused)');assert page.locator('#riftFilmAudio').evaluate('a=>Math.abs(a.duration-22.392)<.1')
 for t,cut,line in [(4.5,'2',''),(9.4,'3','누가 침묵을 깨뜨렸느냐?'),(14.8,'3','눈을 돌리지 마라.'),(16.9,'4','')]:
  page.locator('#riftFilmAudio').evaluate('(a,t)=>a.currentTime=t',t);page.wait_for_timeout(350);print('cue',t,page.locator('#riftAwakening').get_attribute('data-cut'),page.locator('#riftFilmKorean').inner_text(),page.locator('#riftFilmAudio').evaluate('a=>({time:a.currentTime,paused:a.paused,ended:a.ended})'));assert page.locator('#riftAwakening').get_attribute('data-cut')==cut;assert page.locator('#riftFilmKorean').inner_text()==line
 page.locator('#riftFilmSound').click();assert page.locator('#riftFilmAudio').evaluate('a=>a.muted')
 page.evaluate('window.testHidden=true;Object.defineProperty(document,"hidden",{get:()=>testHidden,configurable:true});document.dispatchEvent(new Event("visibilitychange"))');assert page.locator('#riftFilmAudio').evaluate('a=>a.paused')
 page.evaluate('testHidden=false;document.dispatchEvent(new Event("visibilitychange"))');page.wait_for_timeout(100);assert page.locator('#riftFilmAudio').evaluate('a=>a.muted&&!a.paused')
 page.locator('#riftFilmAudio').evaluate('a=>a.currentTime=22.30');page.locator('#riftFilmResult').wait_for(state='visible');assert page.evaluate('SOLARIA_RIFT_UNLOCKED');assert page.evaluate('originalAudio.every(a=>a.paused)')
 page.locator('#riftAwakeningContinue').click();page.wait_for_function('!originalAudio.find(a=>a.src.endsWith("bgm.mp3")).paused');assert page.locator('#riftFilmAudio').evaluate('a=>a.paused');assert page.evaluate('originalAudio.find(a=>a.src.endsWith("op-v2.mp3")).paused')
 print('PASS audio playback-clock cues, original audio isolation, mute persistence across visibility pause, completion and background restoration; JS errors:',errs);assert not errs
 b.close()

server.shutdown()
