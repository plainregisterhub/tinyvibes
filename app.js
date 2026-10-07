const STORAGE = 'recipebounty_mvp_v2';

const starterRecipes = [
  {id:'r1', title:'Miso Butter Noodles', creator:'Ari Tan', initials:'AT', category:'Comfort', cuisine:'Japanese-inspired', occasion:'Weeknight', origin:'Japan', pp:120, validations:84, saves:192, emoji:'🍜', tone:'pink', status:'Listed', supply:24, description:'Silky noodles, umami butter and a soft egg. Built for a weeknight that still feels like a little restaurant moment.'},
  {id:'r2', title:'Lemon Herb Chicken', creator:'Nora Vale', initials:'NV', category:'Main', cuisine:'Mediterranean', occasion:'Family', origin:'Greece', pp:95, validations:61, saves:144, emoji:'🍋', tone:'cream', status:'Listed', supply:42, description:'Bright citrus, herbs and a crisp edge. A practical everyday recipe with enough personality to remember.'},
  {id:'r3', title:'Strawberry Milk Cloud', creator:'Mina Park', initials:'MP', category:'Dessert', cuisine:'Korean-inspired', occasion:'Treat', origin:'Seoul', pp:150, validations:112, saves:238, emoji:'🍓', tone:'blue', status:'Listed', supply:12, description:'Cold strawberry milk, a soft cream cap and a tiny bit of drama. Designed for visual impact and easy home execution.'},
  {id:'r4', title:'Sunday Curry Pot', creator:'Leo Fernandes', initials:'LF', category:'Main', cuisine:'Indian', occasion:'Gathering', origin:'Goa', pp:180, validations:146, saves:302, emoji:'🍛', tone:'gold', status:'Listed', supply:9, description:'A slow, aromatic curry built for sharing, adapting and getting better every time it is cooked.'},
  {id:'r5', title:'Tomato Peach Toast', creator:'Sora Quinn', initials:'SQ', category:'Breakfast', cuisine:'Modern', occasion:'Brunch', origin:'California', pp:80, validations:44, saves:98, emoji:'🍑', tone:'sun', status:'Listed', supply:55, description:'Sweet peach, tomato acidity and whipped ricotta on a crisp base.'},
  {id:'r6', title:'Black Sesame Tiramisu', creator:'Jules Kim', initials:'JK', category:'Dessert', cuisine:'Fusion', occasion:'Dinner', origin:'Tokyo', pp:210, validations:203, saves:388, emoji:'🍰', tone:'dark', status:'Listed', supply:5, description:'Classic tiramisu structure with roasted black sesame for a deeper finish.'},
  {id:'r7', title:'Coconut Laksa Shortcut', creator:'Rin Das', initials:'RD', category:'Main', cuisine:'Southeast Asian', occasion:'Weeknight', origin:'Penang', pp:140, validations:73, saves:170, emoji:'🥥', tone:'mint', status:'Listed', supply:31, description:'A focused laksa shortcut that keeps the soul of the dish without turning dinner into an all-day project.'},
  {id:'r8', title:'Brown Butter Apple Cake', creator:'Theo Wells', initials:'TW', category:'Baking', cuisine:'European', occasion:'Weekend', origin:'Paris', pp:160, validations:95, saves:261, emoji:'🍎', tone:'rose', status:'Listed', supply:18, description:'Soft apple cake, nutty brown butter and a crackly sugar top.'}
];

const starterState = {
  route:'home', recipes:starterRecipes, saved:['r3','r6'], owned:['r2'],
  pp:640, pts:18750, rank:{masterValidator:1320, topCreator:810, topPatron:420, topCatalyst:260},
  vvip:false, chatUsed:2, purchasedWords:0, globalMessages:[
    {name:'Ayla', flag:'🇬🇧', initials:'AY', text:'Anyone cooking something with miso tonight?', time:'now'},
    {name:'Mateo', flag:'🇪🇸', initials:'MA', text:'Just validated a recipe I found here. The sauce was ridiculous (in a good way).', time:'2m'},
    {name:'Sena', flag:'🇯🇵', initials:'SE', text:'Looking for an easy dessert under 30 minutes.', time:'5m'},
    {name:'Luca', flag:'🇮🇹', initials:'LU', text:'The Discovery feed keeps finding me things I actually want to cook 😂', time:'7m'}
  ],
  dms:[{name:'Ari Tan', initials:'AT', last:'I can share the next version tomorrow.', time:'12m', unread:1}],
  createDraft:{title:'', description:'', category:'Main', cuisine:'', occasion:'', origin:'', ingredients:'', steps:'', price:120}
};

let state = loadState();
let activeSearch = '';
let activeFilter = 'All';
let marketMode = 'discover';
let chatMode = 'global';
let reelIndex = 0;

function loadState(){
  try { return {...starterState, ...JSON.parse(localStorage.getItem(STORAGE) || '{}')}; }
  catch { return {...starterState}; }
}
function saveState(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
function money(n){ return `${n.toLocaleString()} PP`; }
function esc(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function getRecipe(id){ return state.recipes.find(r=>r.id===id); }
function initials(name){ return name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase(); }
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(window._toast); window._toast=setTimeout(()=>el.classList.remove('show'),2200); }
function navigate(route){ state.route=route; saveState(); render(); window.scrollTo({top:0,behavior:'smooth'}); }

function recipeCard(r){
  const saved = state.saved.includes(r.id);
  return `<article class="recipe-card" data-open-recipe="${r.id}">
    <div class="recipe-image ${r.tone}"><div class="food-art">${r.emoji}</div><button class="save-btn" data-save="${r.id}" aria-label="Save">${saved?'♥':'♡'}</button></div>
    <div class="card-body">
      <div class="meta-row"><span class="tag">${esc(r.category)}</span><span class="price">${money(r.pp)}</span></div>
      <h3>${esc(r.title)}</h3>
      <div class="creator-line"><span class="mini-avatar">${esc(r.initials)}</span><span>${esc(r.creator)}</span><span>·</span><span>${esc(r.cuisine)}</span></div>
      <div class="validation"><strong>🍴 ${r.validations} validations</strong><span>${r.supply} available</span></div>
    </div>
  </article>`;
}

function renderHome(){
  const featured = [...state.recipes].sort((a,b)=>b.validations-a.validations).slice(0,4);
  const fresh = [...state.recipes].sort((a,b)=>b.id.localeCompare(a.id)).slice(0,4);
  return `<div class="section hero">
    <div class="hero-copy">
      <span class="eyebrow">✦ Real food · real validation · real value</span>
      <h1>What is worth cooking today?</h1>
      <p>Discover recipes with a trackable journey from creator idea to real-world experience, ownership and commercial possibility.</p>
      <div class="hero-actions"><button class="primary" data-route="discover">Explore Discover</button><button class="secondary" data-route="create">Create a Recipe</button></div>
    </div>
    <div class="hero-art"><span class="floating-pill pill-a">🍴 50% spill / 50% hide</span><span class="floating-pill pill-b">✓ validated in the real world</span><span class="floating-pill pill-c">120 PP · owned</span><div class="planet"></div></div>
  </div>
  <section class="section"><div class="section-head"><div><h2>People are actually cooking these</h2><p>Validation-first discovery, not a follower leaderboard.</p></div><button class="link-btn" data-route="discover">See all</button></div><div class="grid recipe-grid">${featured.map(recipeCard).join('')}</div></section>
  <section class="section"><div class="section-head"><div><h2>Fresh Bounties</h2><p>New ideas waiting for their first real-world experience.</p></div><span class="small">Discovery ≠ marketplace duplicates</span></div><div class="grid recipe-grid">${fresh.map(recipeCard).join('')}</div></section>
  <section class="section"><div class="section-head"><div><h2>Your Bounty snapshot</h2><p>A small view of the economy underneath the product.</p></div><button class="link-btn" data-route="treasure">Open Treasure</button></div><div class="stats">
    <div class="stat"><div class="kicker">PP balance</div><div class="value">${state.pp.toLocaleString()}</div><div class="sub">Marketplace currency</div></div>
    <div class="stat"><div class="kicker">Bounty Pts</div><div class="value">${state.pts.toLocaleString()}</div><div class="sub">Contribution, not wallet balance</div></div>
    <div class="stat"><div class="kicker">Owned recipes</div><div class="value">${state.owned.length}</div><div class="sub">Ownership assets</div></div>
    <div class="stat"><div class="kicker">Global Chat</div><div class="value">${state.vvip?'∞':'5/day'}</div><div class="sub">Communication entitlement</div></div>
  </div></section>`;
}

function renderDiscover(){
  let list = [...state.recipes];
  if(activeSearch.trim()) list = list.filter(r => `${r.title} ${r.creator} ${r.category} ${r.cuisine} ${r.origin}`.toLowerCase().includes(activeSearch.toLowerCase()));
  if(activeFilter !== 'All') list = list.filter(r=>r.category===activeFilter || r.cuisine===activeFilter);
  if(marketMode==='market') list=list.filter(r=>r.status==='Listed' && r.supply>0);
  const filters=['All','Main','Dessert','Breakfast','Baking','Mediterranean','Japanese-inspired','Southeast Asian'];
  return `<div class="page-title"><h1>${marketMode==='discover'?'Discover':'Marketplace'}</h1><p>${marketMode==='discover'?'Find, evaluate and rediscover canonical Master Recipes.':'Buy current supply or open a recipe to inspect resale context.'}</p></div>
  <div class="section inline" style="justify-content:space-between"><div class="market-tabs"><button class="${marketMode==='discover'?'active':''}" data-market="discover">Discover</button><button class="${marketMode==='market'?'active':''}" data-market="market">Marketplace</button></div><span class="small">${list.length} canonical recipes</span></div>
  <div class="section"><div class="chips">${filters.map(f=>`<button class="chip ${activeFilter===f?'active':''}" data-filter="${f}">${f}</button>`).join('')}</div></div>
  <div class="section"><div class="grid recipe-grid">${list.length?list.map(recipeCard).join(''):`<div class="empty">Nothing matched this view yet.<br><span class="small">Try another category or search phrase.</span></div>`}</div></div>`;
}

function renderDetail(r){
  const owned = state.owned.includes(r.id);
  return `<div class="section inline"><button class="secondary" data-route="discover">← Back</button><span class="small">Canonical Master Recipe · ${r.id.toUpperCase()}</span></div>
  <div class="recipe-detail">
    <div class="detail-hero ${r.tone}"><div>${r.emoji}</div></div>
    <div class="detail-copy">
      <div class="detail-meta"><span class="tag">${esc(r.category)}</span><span class="tag">${esc(r.cuisine)}</span><span class="tag">${esc(r.occasion)}</span><span class="tag">${esc(r.origin)}</span></div>
      <h1>${esc(r.title)}</h1>
      <p class="lead">${esc(r.description)}</p>
      <div class="creator-card"><div class="creator-ident"><div class="big-avatar">${esc(r.initials)}</div><div><strong>${esc(r.creator)}</strong><div class="small">Creator · not necessarily the current owner</div></div></div><button class="secondary" data-dm="${esc(r.creator)}">Message</button></div>
      <div class="panel"><div class="section-head"><div><h2 style="font-size:16px">Preview</h2><p>50% Spill / 50% Hide — meaningful value without exposing the full recipe.</p></div><span class="status">${r.status}</span></div>
        <div class="spill"><div><h4>What you can see</h4><p>Cover, creator, category, cuisine, occasion, origin, selected ingredients, validation signals, supply, price and rights summary.</p></div><div><h4>Held back until access</h4><p>Complete quantities, full method, preparation flow and other protected recipe sections.</p></div></div>
      </div>
      <div class="inline" style="margin-top:15px"><span class="small">🍴 ${r.validations} real-world validations</span><span class="small">·</span><span class="small">♡ ${r.saves} saves</span><span class="small">·</span><span class="small">${r.supply} available</span></div>
      <div class="buy-bar"><div><div class="small">${owned?'Owned asset':'Current supply'}</div><strong style="font-size:20px;color:var(--navy)">${owned?'Already owned':money(r.pp)}</strong></div>${owned?`<button class="primary" data-read="${r.id}">Read Full Recipe</button>`:`<button class="primary" data-buy="${r.id}">Buy Ownership Asset</button>`}</div>
    </div>
  </div>`;
}

function renderReels(){
  const reels=[
    {r:'r3', creator:'Mina Park', text:'Cold strawberry milk + cloud cream. This one disappeared from the fridge suspiciously fast.'},
    {r:'r6', creator:'Jules Kim', text:'Black sesame tiramisu with the tiniest bitter edge. Dessert people: please.'},
    {r:'r1', creator:'Ari Tan', text:'Miso butter noodles. Five ingredients, zero patience required.'}
  ];
  const cur=reels[reelIndex%reels.length], recipe=getRecipe(cur.r);
  return `<div class="page-title"><h1>Reels</h1><p>Short-form food context attached to existing recipes — not a social graph.</p></div>
  <div class="reels">
    <div class="reel-stage"><div class="inline"><span class="tag">REEL ${reelIndex+1}/${reels.length}</span><span class="small">${recipe.validations} validations</span></div><div class="reel-visual">${recipe.emoji}</div><div class="reel-copy"><h2>${esc(recipe.title)}</h2><p>${esc(cur.text)}</p><div class="inline"><button class="primary" data-open-recipe="${recipe.id}">Open Recipe</button><button class="secondary" data-next-reel>Next</button></div></div></div>
    <div class="reel-side">${reels.map((x,i)=>{const rr=getRecipe(x.r); return `<div class="reel-item" data-reel-index="${i}"><div class="reel-thumb">${rr.emoji}</div><div><h3>${esc(rr.title)}</h3><p>${esc(x.creator)} · ${rr.validations} validations</p></div></div>`}).join('')}</div>
  </div>`;
}

function renderCreate(){
  const d=state.createDraft;
  return `<div class="page-title"><h1>Create a Recipe</h1><p>Build → Publish → List. Publication and marketplace listing remain separate states.</p></div>
  <div class="stepper section"><span class="step current">01 Setup</span><span class="step current">02 Recipe Asset</span><span class="step">03 Metadata</span><span class="step">04 Publish</span><span class="step">05 Listing</span></div>
  <div class="two-col">
    <form id="createForm" class="panel form">
      <div class="form-grid"><div class="field"><label>Recipe title</label><input name="title" value="${esc(d.title)}" placeholder="e.g. Chili Crisp Butter Rice" required></div><div class="field"><label>Category</label><select name="category">${['Main','Dessert','Breakfast','Baking','Snack','Drink'].map(x=>`<option ${d.category===x?'selected':''}>${x}</option>`).join('')}</select></div></div>
      <div class="form-grid"><div class="field"><label>Cuisine</label><input name="cuisine" value="${esc(d.cuisine)}" placeholder="e.g. Japanese-inspired"></div><div class="field"><label>Occasion</label><input name="occasion" value="${esc(d.occasion)}" placeholder="e.g. Weeknight"></div></div>
      <div class="form-grid"><div class="field"><label>Origin</label><input name="origin" value="${esc(d.origin)}" placeholder="e.g. Osaka"></div><div class="field"><label>Listing price (PP)</label><input name="price" type="number" min="1" value="${Number(d.price)||120}"></div></div>
      <div class="field"><label>Description / preview narrative</label><textarea name="description" placeholder="What makes this recipe worth discovering?">${esc(d.description)}</textarea></div>
      <div class="field"><label>Ingredients</label><textarea name="ingredients" placeholder="One line per ingredient">${esc(d.ingredients)}</textarea></div>
      <div class="field"><label>Steps</label><textarea name="steps" placeholder="One line per step">${esc(d.steps)}</textarea></div>
      <div class="inline"><button class="secondary" type="button" id="saveDraft">Save Draft</button><button class="primary" type="submit">Publish & Create Listing</button></div>
    </form>
    <aside class="panel"><div class="section-head"><div><h2>Creation contract</h2><p>Locked MVP logic reflected in this front-end.</p></div></div>
      <div class="note">Create Recipe = 1,200 Pts base. Listing Recipe = 500 Pts base. Publish ≠ Listing.</div>
      <hr class="soft">
      <div class="inline"><span class="tag">Master Recipe</span><span class="tag">Recipe Version</span><span class="tag">Ownership Asset</span></div>
      <p class="small" style="line-height:1.6">A version evolves the same canonical recipe identity. Listing exposes an Ownership Asset; it does not create a second Discovery card.</p>
      <div class="panel" style="background:#fbfcfe"><strong style="font-size:13px">25 PP listing fee</strong><p class="small">Primary listing fee is separate from the 88% / 6% / 6% marketplace purchase distribution.</p></div>
    </aside>
  </div>`;
}

function renderIndustry(){
  return `<div class="page-title"><h1>Industry</h1><p>Commercial extension for recipes that can travel beyond the marketplace.</p></div>
  <div class="industry-grid section">
    <div class="business-card"><div class="inline" style="justify-content:space-between"><span class="tag">ACTIVE</span><span class="status">Business</span></div><h2 style="margin:18px 0 8px;color:var(--navy)">Business Recipe</h2><p class="muted">Submit an existing recipe with business context, intended commercial usage, evidence and rights configuration.</p><div class="inline" style="margin-top:17px"><button class="primary" data-industry-create>Create Business Recipe</button><button class="secondary" data-route="profile">View your work</button></div></div>
    <div class="panel"><h3 style="margin:0;color:var(--navy)">Review flow</h3><div class="rank-row"><div class="rank-icon">01</div><div><strong>Draft → Submitted</strong><span>Editable until submitted.</span></div><div class="small">✓</div></div><div class="rank-row"><div class="rank-icon">02</div><div><strong>Under Review</strong><span>Rights, evidence and business context.</span></div><div class="small">✓</div></div><div class="rank-row"><div class="rank-icon">03</div><div><strong>Approved</strong><span>Handoff eligible to Industry.</span></div><div class="small">→</div></div></div>
  </div>
  <section class="section"><div class="section-head"><div><h2>Coming Soon</h2><p>Inactive modules stay intentionally shallow in the MVP.</p></div></div><div class="three-col"><div class="panel"><span class="status soon">COMING SOON</span><h3>Food R&amp;D</h3><p class="small">Future recipe development and evaluation workflows.</p></div><div class="panel"><span class="status soon">COMING SOON</span><h3>Partnerships</h3><p class="small">Future commercial collaboration layer.</p></div><div class="panel"><span class="status soon">COMING SOON</span><h3>Enterprise</h3><p class="small">Future business-grade access and tools.</p></div></div></section>`;
}

function renderTreasure(){
  const ranks=[['🐺','Master Validator',state.rank.masterValidator],['🦉','Top Creator',state.rank.topCreator],['🦁','Top Patron',state.rank.topPatron],['🐎','Top Catalyst',state.rank.topCatalyst]];
  return `<div class="page-title"><h1>Treasure</h1><p>Your private economy, contribution and recognition dashboard.</p></div>
  <div class="stats section"><div class="stat"><div class="kicker">PP</div><div class="value">${state.pp.toLocaleString()}</div><div class="sub">Marketplace currency</div></div><div class="stat"><div class="kicker">Bounty Pts</div><div class="value">${state.pts.toLocaleString()}</div><div class="sub">Contribution ledger</div></div><div class="stat"><div class="kicker">VVIP</div><div class="value">${state.vvip?'ON':'OFF'}</div><div class="sub">RM5.90 / month</div></div><div class="stat"><div class="kicker">Chat words</div><div class="value">${state.purchasedWords}</div><div class="sub">Paid balance across DMs</div></div></div>
  <div class="two-col section"><div class="panel"><div class="section-head"><div><h2>My Rank</h2><p>Season length: 21 days</p></div><span class="tag">CURRENT SEASON</span></div>${ranks.map(r=>`<div class="rank-row"><div class="rank-icon">${r[0]}</div><div><strong>${r[1]}</strong><span>Seasonal recognition category</span></div><div class="rank-score">${r[2].toLocaleString()}</div></div>`).join('')}<div class="rank-row"><div class="rank-icon">🔥</div><div><strong>Top Bounty</strong><span>Lifetime participation / early recognition — not seasonal Rank Score.</span></div><div class="rank-score">${state.pts.toLocaleString()}</div></div></div>
  <div class="panel"><div class="section-head"><div><h2>Communication</h2><p>VVIP is independent from PP.</p></div></div><div class="note">Global Chat: ${state.vvip?'Unlimited':'5 uses/day'} · DM: ${state.vvip?'Unlimited':'50 free words per new DM'}</div><div style="margin-top:13px"><strong style="color:var(--navy)">Chat words</strong><p class="small">10 PP = 120 additional words. Purchased words carry across DMs. A qualifying paid purchase credits 3 PP to the recipient.</p></div><div class="inline"><button class="secondary" id="buyWords">Buy 120 words · 10 PP</button><button class="primary" id="buyVvip">${state.vvip?'VVIP Active':'Activate VVIP · RM5.90'}</button></div></div></div>
  <section class="section"><div class="panel"><div class="section-head"><div><h2>Boosters</h2><p>Booster affects eligible Pts only. It does not change Rank Score or Discovery placement.</p></div></div><div class="three-col">${[['2×7D','$0.99'],['2×30D','$2.49'],['3×30D','$4.99'],['3×90D','$9.99']].map(x=>`<div class="panel" style="background:#fbfcfe"><strong>${x[0]}</strong><div class="small">${x[1]}</div><button class="secondary" style="margin-top:10px" data-toast="Booster purchased. It activates only when you use it.">Buy</button></div>`).join('')}</div></div></section>`;
}

function renderProfile(){
  const own=state.owned.map(getRecipe).filter(Boolean);
  const authored=state.recipes.filter(r=>r.creator==='You');
  return `<div class="profile-hero section"><div class="profile-id"><div class="profile-avatar">HS</div><div><h1>Hafiz</h1><p>Participant · Creator · Buyer · Validator</p><p>🌐 Global profile · Language: English</p></div></div><div class="inline"><span class="tag">Top Bounty</span><button class="secondary" data-route="treasure">My Rank</button></div></div>
  <div class="stats section"><div class="stat"><div class="kicker">Recipes</div><div class="value">${authored.length}</div><div class="sub">Published by you</div></div><div class="stat"><div class="kicker">Owned</div><div class="value">${own.length}</div><div class="sub">Ownership assets</div></div><div class="stat"><div class="kicker">Validated</div><div class="value">7</div><div class="sub">Real-world experiences</div></div><div class="stat"><div class="kicker">Bounty Pts</div><div class="value">${state.pts.toLocaleString()}</div><div class="sub">Private dashboard value</div></div></div>
  <div class="two-col section"><div class="panel"><div class="section-head"><div><h2>Your published recipes</h2><p>Creator identity remains attached through resale.</p></div><button class="link-btn" data-route="create">Create</button></div>${authored.length?`<div class="grid">${authored.map(recipeCard).join('')}</div>`:`<div class="empty">No published recipes yet.<br><button class="link-btn" data-route="create">Create your first recipe →</button></div>`}</div><div class="panel"><div class="section-head"><div><h2>Owned collection</h2><p>Ownership ≠ copyright ≠ commercial rights.</p></div></div>${own.length?`<div class="grid">${own.map(recipeCard).join('')}</div>`:`<div class="empty">Your collection is empty.</div>`}</div></div>`;
}

function renderChat(){
  const global = state.globalMessages.map(m=>`<div class="chat-msg"><div class="chat-avatar">${esc(m.initials)}</div><div><div class="msg-top"><strong>${esc(m.name)} ${m.flag}</strong><time>${esc(m.time)}</time></div><p>${esc(m.text)}</p></div></div>`).join('');
  const dms=state.dms.map((m,i)=>`<div class="chat-msg" data-open-dm="${i}"><div class="chat-avatar">${esc(m.initials)}</div><div><div class="msg-top"><strong>${esc(m.name)}</strong><time>${esc(m.time)}</time></div><p>${esc(m.last)}${m.unread?` <strong style="color:var(--pink)">· ${m.unread}</strong>`:''}</p></div></div>`).join('');
  return `<div class="page-title"><h1>Messages</h1><p>Global Chat is public; DMs are private one-to-one conversations.</p></div><div class="chat-shell">
    <aside class="chat-list"><div class="chat-list-head"><div class="chat-tabs"><button class="chat-tab ${chatMode==='global'?'active':''}" data-chat-mode="global">Global</button><button class="chat-tab ${chatMode==='dms'?'active':''}" data-chat-mode="dms">Messages</button></div></div><div class="chat-feed">${chatMode==='global'?global:dms}</div></aside>
    <section class="chat-window"><div class="chat-window-head"><strong style="color:var(--navy)">${chatMode==='global'?'Global Chat':'DM Inbox'}</strong><div class="small">${chatMode==='global'?(state.vvip?'Unlimited':'5 uses/day'):'Private one-to-one'}</div></div>${chatMode==='global'?`<div class="chat-feed">${global}</div><form class="chat-compose" id="globalChatForm"><input id="chatText" maxlength="200" placeholder="Say something about food…"><button class="primary">Send</button></form>`:`<div class="empty" style="margin:18px">Select a DM to continue. New DMs start with 50 free words.</div>`}</section>
  </div>`;
}

function render(){
  const screen=document.getElementById('screen');
  if(state.route.startsWith('recipe/')){ const r=getRecipe(state.route.split('/')[1]); screen.innerHTML=r?renderDetail(r):renderHome(); }
  else if(state.route==='home') screen.innerHTML=renderHome();
  else if(state.route==='discover') screen.innerHTML=renderDiscover();
  else if(state.route==='reels') screen.innerHTML=renderReels();
  else if(state.route==='create') screen.innerHTML=renderCreate();
  else if(state.route==='industry') screen.innerHTML=renderIndustry();
  else if(state.route==='treasure') screen.innerHTML=renderTreasure();
  else if(state.route==='profile') screen.innerHTML=renderProfile();
  else if(state.route==='messages') screen.innerHTML=renderChat();
  else screen.innerHTML=renderHome();
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route || (state.route.startsWith('recipe/')&&b.dataset.route==='discover')));
}

function openModal(title,body){
  document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><div class="modal"><div class="modal-head"><h3>${title}</h3><button class="close" id="closeModal">×</button></div><div class="modal-body">${body}</div></div></div>`;
  document.getElementById('closeModal').onclick=()=>document.getElementById('modalRoot').innerHTML='';
  document.getElementById('modalBackdrop').addEventListener('click',e=>{ if(e.target.id==='modalBackdrop')document.getElementById('modalRoot').innerHTML=''; });
}

function buyRecipe(id){
  const r=getRecipe(id); if(!r) return;
  if(state.owned.includes(id)){ toast('You already own this asset.'); return; }
  if(state.pp<r.pp){ toast('Not enough PP for this purchase.'); return; }
  if(r.supply<=0){ toast('This supply is no longer available.'); return; }
  state.pp-=r.pp; state.owned.push(id); r.supply-=1; state.pts+=4000; saveState();
  toast(`Owned ${r.title}. +4,000 Bounty Pts base.`); render();
}

function saveRecipe(id){
  const idx=state.saved.indexOf(id); if(idx>=0)state.saved.splice(idx,1); else state.saved.push(id); saveState(); render(); toast(idx>=0?'Removed from saves':'Saved to your collection');
}

function getFormDraft(form){ const fd=new FormData(form); return {title:fd.get('title')||'',description:fd.get('description')||'',category:fd.get('category')||'Main',cuisine:fd.get('cuisine')||'',occasion:fd.get('occasion')||'',origin:fd.get('origin')||'',ingredients:fd.get('ingredients')||'',steps:fd.get('steps')||'',price:Number(fd.get('price'))||120}; }

function publishRecipe(form){
  const d=getFormDraft(form); if(!d.title.trim()){toast('Add a recipe title first.');return;}
  const r={id:'r'+Date.now(),title:d.title,creator:'You',initials:'YO',category:d.category,cuisine:d.cuisine||'Your cuisine',occasion:d.occasion||'Anytime',origin:d.origin||'Global',pp:d.price,validations:0,saves:0,emoji:['🍳','🥘','🍜','🍰','🥗'][Math.floor(Math.random()*5)],tone:['pink','cream','mint','rose'][Math.floor(Math.random()*4)],status:'Listed',supply:20,description:d.description||'A new RecipeBounty creation ready for discovery and real-world validation.'};
  state.recipes.unshift(r); state.createDraft=d; state.pts+=1700; state.route='profile'; saveState(); render(); toast('Recipe published and listed. +1,700 Pts base combined.');
}

function buyWords(){ if(state.pp<10){toast('Not enough PP.');return;} state.pp-=10; state.purchasedWords+=120; saveState(); render(); toast('120 purchased chat words added.'); }
function buyVvip(){ if(state.vvip){toast('VVIP is already active.');return;} state.vvip=true; saveState(); render(); toast('VVIP active: unlimited Global Chat + DM.'); }

function bind(){
  const screen = document.getElementById('screen');
  if(screen.dataset.bound) return;
  screen.dataset.bound='1';
  screen.addEventListener('click', e=>{
    const route=e.target.closest('[data-route]'); if(route){ navigate(route.dataset.route); return; }
    const save=e.target.closest('[data-save]'); if(save){ e.stopPropagation(); saveRecipe(save.dataset.save); return; }
    const card=e.target.closest('[data-open-recipe]'); if(card){ navigate('recipe/'+card.dataset.openRecipe); return; }
    const filter=e.target.closest('[data-filter]'); if(filter){ activeFilter=filter.dataset.filter; render(); return; }
    const market=e.target.closest('[data-market]'); if(market){ marketMode=market.dataset.market; render(); return; }
    const buy=e.target.closest('[data-buy]'); if(buy){ buyRecipe(buy.dataset.buy); return; }
    const read=e.target.closest('[data-read]'); if(read){
      const r=getRecipe(read.dataset.read); if(!r)return;
      openModal('Full Recipe — '+r.title, `<div class="note">Read access is simulated in this browser MVP. In production, access is server-authoritative and rights-aware.</div><h3 style="margin-top:18px">Ingredients</h3><p class="small">Seasoned ingredients · measured components · optional garnish</p><h3>Method</h3><p class="small" style="line-height:1.6">Prepare · combine · cook · finish · serve</p><hr class="soft"><span class="tag">Ownership Asset: OWNED</span>`);
      return;
    }
    const dm=e.target.closest('[data-dm]'); if(dm){ navigate('messages'); toast(`Opening DM with ${dm.dataset.dm}`); return; }
    const next=e.target.closest('[data-next-reel]'); if(next){ reelIndex=(reelIndex+1)%3; render(); return; }
    const reel=e.target.closest('[data-reel-index]'); if(reel){ reelIndex=Number(reel.dataset.reelIndex); render(); return; }
    const simpleToast=e.target.closest('[data-toast]'); if(simpleToast){ toast(simpleToast.dataset.toast); return; }
    const chatModeBtn=e.target.closest('[data-chat-mode]'); if(chatModeBtn){ chatMode=chatModeBtn.dataset.chatMode; render(); return; }
    const openDm=e.target.closest('[data-open-dm]'); if(openDm){
      const dmInfo=state.dms[Number(openDm.dataset.openDm)];
      openModal('DM — '+dmInfo.name, `<div class="note">New DMs start with 50 free words. Purchased words carry across DMs. VVIP is unlimited.</div><div class="chat-feed" style="max-height:none"><div class="chat-msg"><div class="chat-avatar">${esc(dmInfo.initials)}</div><div><div class="msg-top"><strong>${esc(dmInfo.name)}</strong><time>${esc(dmInfo.time)}</time></div><p>${esc(dmInfo.last)}</p></div></div></div><form class="chat-compose" id="dmForm"><input id="dmText" maxlength="120" placeholder="Write a message…"><button class="primary">Send</button></form>`);
      return;
    }
    if(e.target.closest('[data-industry-create]')){
      openModal('Create Business Recipe',`<div class="note">Business is the active Industry path. Contracts, Industry Chat, Professional Requests and advanced Commercial Access are intentionally not implemented in this MVP.</div><div class="form" style="margin-top:15px"><div class="field"><label>Business name</label><input id="bizName" placeholder="e.g. North Table Foods"></div><div class="field"><label>Commercial usage</label><select id="bizUsage"><option>Menu development</option><option>Product development</option><option>Commercial adaptation</option></select></div><div class="field"><label>Evidence / rights context</label><textarea id="bizEvidence" placeholder="Explain intended use and rights configuration…"></textarea></div><button class="primary" type="button" id="saveBiz">Save Business Draft</button></div>`);
      return;
    }
    if(e.target.closest('#saveDraft')){
      const cf=document.getElementById('createForm'); state.createDraft=getFormDraft(cf); saveState(); toast('Draft saved locally.'); return;
    }
    if(e.target.closest('#buyWords')){ buyWords(); return; }
    if(e.target.closest('#buyVvip')){ buyVvip(); return; }
    if(e.target.closest('#saveBiz')){ document.getElementById('modalRoot').innerHTML=''; toast('Business Recipe draft saved.'); return; }
  });

  screen.addEventListener('submit', e=>{
    if(e.target.id==='createForm'){ e.preventDefault(); publishRecipe(e.target); return; }
    if(e.target.id==='globalChatForm'){
      e.preventDefault(); const input=document.getElementById('chatText'); const text=input?.value.trim(); if(!text)return;
      if(!state.vvip && state.chatUsed>=5){toast('Daily Global Chat allowance used.');return;}
      state.chatUsed++; state.globalMessages.push({name:'You',flag:'🌐',initials:'YO',text,time:'now'}); saveState(); render(); toast('Message posted.'); return;
    }
    if(e.target.id==='dmForm'){ e.preventDefault(); toast('DM sent in demo mode.'); document.getElementById('modalRoot').innerHTML=''; return; }
  });
}


document.addEventListener('click', e=>{
  const route=e.target.closest('[data-route]'); if(route && route.tagName==='BUTTON') return;
});

document.getElementById('globalSearch').addEventListener('keydown', e=>{ if(e.key==='Enter'){activeSearch=e.target.value;activeFilter='All';navigate('discover');} });
document.getElementById('chatBtn').addEventListener('click',()=>navigate('messages'));
document.getElementById('messagesBtn').addEventListener('click',()=>navigate('messages'));
document.getElementById('avatarBtn').addEventListener('click',()=>navigate('profile'));


// Initial render + delegated click binding refresh after every screen render.
render();
bind();
