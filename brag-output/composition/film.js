document.fonts.ready.then(() => {
const tl = gsap.timeline({paused:true});
// Registry primitive: text-stagger, adapted to brand typography and no shimmer.
function title(selector, at){tl.fromTo(selector+' .hf-transition-text-stagger>span',{opacity:0,y:48},{opacity:1,y:0,duration:.54,stagger:.09,ease:'power3.out'},at);}
function enter(selector, at){tl.fromTo(selector,{opacity:0,y:55},{opacity:1,y:0,duration:.6,ease:'power3.out'},at);}
enter('.scene-1 .logo',0);enter('.hook-small',.1);tl.fromTo('.strike',{scaleX:0},{scaleX:1,duration:.3,ease:'power2.out'},.6);title('.scene-1',.8);enter('.s1-description',1.05);
tl.fromTo('.hero-island',{opacity:0,y:150,rotation:5},{opacity:1,y:0,rotation:0,duration:.8,ease:'power3.out'},.2);
tl.fromTo('.hero-tuki',{opacity:0,y:100,scale:.8},{opacity:1,y:0,scale:1,duration:.7,ease:'back.out(1.3)'},.6);
tl.fromTo('.mini-island',{opacity:0,y:50},{opacity:1,y:0,duration:.7},.5);enter('.scene-1 .label',1.1);
tl.to('.hero-tuki',{y:-14,duration:.8,yoyo:true,repeat:1,ease:'sine.inOut'},1.35);
enter('.scene-2 .headline',3.5);title('.scene-2',3.65);tl.fromTo('.battle-ui',{opacity:0,x:180,rotation:3},{opacity:1,x:0,rotation:0,duration:.7,ease:'power3.out'},3.6);enter('.s2-note',4.2);
tl.fromTo('.hero-idle',{x:0},{x:-2016,duration:.96,ease:'steps(7)',repeat:5},3.5);
tl.fromTo('.enemy-sheet',{x:0},{x:-1192.5,duration:.64,ease:'steps(3)',repeat:9},3.5);
tl.fromTo('.hero-attack',{opacity:0},{opacity:1,duration:.01},6);
tl.fromTo('.hero-attack-sheet',{x:0},{x:-2016,duration:.64,ease:'steps(7)',repeat:1},6);
tl.to('.hero-sprite',{x:271,duration:.35,ease:'power2.in'},6);tl.to('.hero-sprite',{x:0,duration:.5,ease:'power2.out'},6.6);tl.to('.hero-attack',{opacity:0,duration:.01},7.15);
tl.fromTo('.cursor',{opacity:0,x:0,y:0},{opacity:1,x:-130,y:-65,duration:.6,ease:'power2.out'},4.6);tl.to('.cursor',{scale:.8,duration:.12,yoyo:true,repeat:1},5.3);tl.to('.correct-option',{backgroundColor:'#164a3a',borderColor:'#2dd4bf',duration:.2},5.35);tl.to('.cursor',{opacity:0,duration:.3},5.7);
tl.fromTo('.impact',{opacity:0,scale:.3},{opacity:1,scale:1.6,duration:.17},6.32);tl.to('.impact',{opacity:0,scale:2.2,duration:.35},6.49);
tl.to('.enemy-sprite',{x:14,duration:.06,repeat:5,yoyo:true},6.35);tl.to('.hp-fill',{scaleX:.8,duration:.3},6.4);tl.to('.hp-number',{innerText:4,duration:.01,snap:{innerText:1}},6.4);tl.to('.xp-number',{innerText:50,duration:.4,snap:{innerText:1}},6.4);
tl.fromTo('.xp-pop',{opacity:0,y:20,scale:.6},{opacity:1,y:0,scale:1,duration:.35,ease:'back.out(1.4)'},6.4);tl.to('.xp-pop',{opacity:0,y:-40,duration:.4},8.5);
tl.fromTo('.success-feedback',{opacity:0},{opacity:1,duration:.3},6.7);tl.to('.initial-feedback',{opacity:0,duration:.1},6.6);
enter('.scene-3 .headline',10);title('.scene-3',10.1);enter('.chat',10.3);enter('.live',10.5);tl.fromTo('.message.user',{opacity:0,x:30},{opacity:1,x:0,duration:.4},10.75);tl.fromTo('.message.bot',{opacity:0,y:25},{opacity:1,y:0,duration:.5},11.6);tl.fromTo('.live-options',{opacity:0,y:20},{opacity:1,y:0,duration:.4},12);tl.to('.live-correct',{backgroundColor:'#b9e77d',borderColor:'#497a31',duration:.3},13.5);tl.fromTo('.live-orbit',{scale:.9,opacity:.6},{scale:1.15,opacity:.1,duration:1.3,repeat:3,ease:'sine.out'},10.5);tl.to('.live-tuki',{y:-9,duration:.9,repeat:4,yoyo:true,ease:'sine.inOut'},10.5);
enter('.scene-4 .headline',16);title('.scene-4',16.1);enter('.generator',16.3);tl.to('.generate-cta',{scale:.96,duration:.12,yoyo:true,repeat:1},17.1);tl.fromTo('.generation-initial',{opacity:1},{opacity:0,duration:.25},17.7);tl.fromTo('.result',{opacity:0,y:30},{opacity:1,y:0,duration:.5},17.9);tl.fromTo('.block',{opacity:0,x:25},{opacity:1,x:0,duration:.35,stagger:.16},18.1);enter('.result-footer',18.7);
enter('.outro-copy .kicker',21.5);title('.scene-5',21.7);enter('.outro-copy .small',22.2);tl.fromTo('.outro-island',{opacity:0,y:130},{opacity:1,y:0,duration:.7,ease:'power3.out'},21.6);tl.fromTo('.outro-tuki',{opacity:0,y:50,scale:.8},{opacity:1,y:0,scale:1,duration:.6,ease:'back.out(1.3)'},21.9);enter('.outro-badge',22.3);tl.to('.outro-tuki',{y:-15,duration:.8,yoyo:true,repeat:2,ease:'sine.inOut'},22.5);
window.__timelines['tiuk-promo']=tl;
});
