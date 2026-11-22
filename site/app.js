import { marked } from './vendor/marked.esm.js';

const page = document.querySelector('#page');
const root = new URL('../', import.meta.url);
const sections = {map:'Course map', lessons:'Lessons', lab:'Sky Lab', quiz:'Family quiz'};

function el(tag, text) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
}
function link(text, href) {
  const a = el('a', text);
  a.href = href;
  return a;
}
async function read(path, emptyOnMissing = false) {
  const response = await fetch(new URL(path, root));
  if (emptyOnMissing && response.status === 404) return '';
  if (!response.ok) throw new Error('Could not load ' + path);
  return response.text();
}
// Python's local server lists content directories, including new units as they land.
async function entries(dir, pattern) {
  const doc = new DOMParser().parseFromString(await read(dir, true), 'text/html');
  return [...doc.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
    .filter(name => pattern.test(name)).sort().map(name => dir + name);
}
function lessonTitle(path) {
  return decodeURIComponent(path.split('/').pop()).replace(/\.md$/, '').replaceAll('-', ' ');
}
async function lessons(view) {
  const units = await entries('lessons/', /^u\d+-[^/]+\/$/);
  const lists = await Promise.all(units.map(dir => entries(dir, /^[^/]+\.md$/)));
  const list = el('ul');
  for (const path of lists.flat()) {
    const item = el('li');
    item.append(link(lessonTitle(path), '#lesson/' + path));
    list.append(item);
  }
  view.append(list.children.length ? list : el('p','Lessons will appear here as they are added.'));
}
async function lesson(view, path) {
  if (!/^lessons\/u\d+-[\w%-]+\/[\w%. -]+\.md$/.test(path) || decodeURIComponent(path).includes('..')) throw Error('Unknown lesson');
  const source = (await read(path)).replace(/\r\n/g,'\n');
  const front = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  view.append(link('Back to lessons','#lessons'));
  if (front) {
    const info = el('details');
    info.append(el('summary','Lesson information'),el('pre',front[1]));
    view.append(info);
  }
  const article = el('article');
  article.innerHTML = marked.parse(source.slice(front?.[0].length || 0));
  for (const [selector,attr] of [['img[src], iframe[src]','src'],['a[href]','href']]) {
    for (const node of article.querySelectorAll(selector)) {
      const value = node.getAttribute(attr);
      const url = new URL(value,new URL(path,root));
      if (url.origin === root.origin && /^lessons\/u\d+-[^/]+\/[^/]+\.md$/.test(url.pathname.slice(root.pathname.length)) && !url.hash) {
        node.setAttribute(attr,'#lesson/'+url.pathname.slice(root.pathname.length));
      } else node.setAttribute(attr,url.href);
    }
  }
  view.append(article);
}
window.addEventListener('message', event => {
  const data = event.data;
  if (event.origin !== location.origin || data?.type !== 'lesson-widget-height' ||
      !Number.isFinite(data.height) || data.height <= 0) return;
  for (const frame of page.querySelectorAll('article iframe')) {
    if (frame.contentWindow === event.source) {
      frame.style.height = Math.ceil(data.height) + 'px';
      break;
    }
  }
});

async function map(view) {
  const source = await read('course/progress.md');
  const next = source.match(/^\*\*Next:\*\*\s*(.+)$/m)?.[1] || '';
  view.append(el('p','Up next: ' + next.replaceAll('*','')));
  let list;
  for (const line of (source.split(/^## Checklist\s*$/m)[1] || '').split(/^## /m)[0].split('\n')) {
    if (line.startsWith('### ')) {
      const card = el('section');
      card.append(el('h2',line.slice(4)));
      list = el('ul'); card.append(list); view.append(card);
      continue;
    }
    if (!list) continue;
    const row = line.match(/^- \[([ xX])\] (.+)/);
    if (!row) { if (line.trim()) list.parentElement.append(el('p',line)); continue; }
    const id = row[2].match(/^(\d+)\.(\d+)\s/);
    const isNext = id ? new RegExp('Unit '+id[1]+',? Lesson '+id[2]+'\\b','i').test(next)
      : /Unit 0\b/.test(next) && list.parentElement.querySelector('h2').textContent.startsWith('Unit 0:');
    const state = row[1].trim() ? 'Done' : isNext ? 'Next' : 'Not started';
    list.append(el('li',row[2].replaceAll('*','')+' · '+state));
  }
}
function filter(label, values) {
  const wrapper = el('label',label);
  const select = el('select');
  select.add(new Option('All',''));
  values.forEach(([value,title]) => select.add(new Option(title,value)));
  wrapper.append(select);
  return {wrapper, select};
}
async function quiz(view) {
  const paths = await entries('trivia/', /^[^/]+\.json$/);
  const banks = await Promise.all(paths.map(async path => JSON.parse(await read(path))));
  const all = banks.flatMap(bank => bank.items.map(q => ({...q, unit:String(bank.unit)})));
  if (!all.length) { view.append(el('p','Family questions will appear here when a trivia bank is added.')); return; }
  const unit = filter('Unit',banks.map(b=>[String(b.unit),b.title]));
  const lessonFilter = filter('Lesson',[]);
  const tier = filter('Difficulty',['starter','explorer','challenger'].map(t=>[t,t]));
  const choices = el('div'); choices.className='choices';
  choices.append(unit.wrapper,lessonFilter.wrapper,tier.wrapper);
  const card = el('section'); card.setAttribute('aria-live','polite');
  view.append(choices,card);
  function updateLessons() {
    const ids = [...new Set(all.filter(q=>!unit.select.value || unit.select.value===q.unit).map(q=>q.lesson))];
    lessonFilter.select.replaceChildren(new Option('All',''),...ids.map(id=>new Option(id,id)));
  }
  function show(index=0) {
    card.replaceChildren();
    const rows = all.filter(q=>[unit,lessonFilter,tier].every((f,i)=>!f.select.value || f.select.value===[q.unit,q.lesson,q.tier][i]));
    if (!rows.length) {card.append(el('p','No questions match these filters.'));return;}
    const q=rows[index];
    const reveal=el('button','Reveal answer'), pass=el('button','Pass to next player');
    const answer=el('div'); answer.hidden=true;
    answer.append(el('p',q.answer),el('p','Why: '+q.why));
    reveal.onclick=()=>{answer.hidden=false;reveal.hidden=true;};
    pass.onclick=()=>show((index+1)%rows.length);
    card.append(el('small',q.lesson+' · '+q.tier),el('h2',q.question));
    if(q.choices) card.append(el('p',q.choices.join(' / ')));
    if(q.materials) card.append(el('p','Materials: '+q.materials.join(', ')));
    card.append(reveal,answer,pass);
  }
  unit.select.onchange=()=>{updateLessons();show();};
  lessonFilter.select.onchange=tier.select.onchange=()=>show();
  updateLessons();show();
}
async function render() {
  const route = location.hash.slice(1) || 'home';
  const view = el('div');
  page.replaceChildren(view);
  try {
    if(route.startsWith('lesson/')) {await lesson(view,route.slice(7));return;}
    view.append(el('h1',sections[route] || 'Family astronomy'));
    if(route==='map') await map(view);
    else if(route==='lessons') await lessons(view);
    else if(route==='quiz') await quiz(view);
    else if(route==='lab') view.append(el('p','Manor Sunrise is the first planned Sky Lab activity.'));
    else {
      const grid=el('div');grid.className='grid';
      for(const [id,title] of Object.entries(sections)) {
        const a=link(title,'#'+id);a.className='tile';grid.append(a);
      }
      view.append(grid);
    }
  } catch(error) {view.append(el('p',error.message+'. Check the course files and reload.'));}
}
addEventListener('hashchange',render);
render();
