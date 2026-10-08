"use strict";
document.getElementById('year').textContent = new Date().getFullYear();
fetch('release.json', {cache:'no-cache'}).then(r => {if(!r.ok)throw Error('Release unavailable');return r.json();}).then(release => {
  document.querySelectorAll('[data-version]').forEach(el=>el.textContent=release.version);
  document.querySelectorAll('[data-download-size]').forEach(el=>el.textContent=`${(release.bytes/1048576).toFixed(1)} MB`);
  document.getElementById('release-hash').textContent=release.sha256;
  const url=new URL(release.file,location.href);
  if(url.origin===location.origin || (url.protocol==='https:' && url.hostname==='github.com' && url.pathname.startsWith('/hansvdm968/wildreserve-website/releases/download/'))) {
    document.querySelectorAll('.download-link').forEach(el=>el.href=url.href);
  }
}).catch(()=>{});
const fragment=new URLSearchParams(location.hash.slice(1));
const invitation=fragment.get('invite');
const notice=document.getElementById('account-notice');
if(invitation && /^[a-fA-F0-9]{64}$/.test(invitation)) {
  notice.hidden=false;
  document.getElementById('account-title').textContent='Your reserve invitation';
  document.getElementById('account-message').textContent='Install WildReserve below. For a guest invitation without an email address, paste the code into Guest invitation on the Android sign-in screen. Employees should sign in with the invited email, then choose Reserve tools → Create or join a reserve and paste the code.';
  const copy=document.getElementById('copy-invite');copy.hidden=false;
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(invitation);copy.textContent='Code copied';}catch{document.getElementById('account-message').textContent+=' Invitation code: '+invitation;}};
  notice.scrollIntoView();
} else if(fragment.has('access_token') || fragment.has('error_description') || new URLSearchParams(location.search).has('code')) {
  history.replaceState(null,'',location.pathname);
  notice.hidden=false;
  document.getElementById('account-title').textContent='Return to the Android app';
  document.getElementById('account-message').textContent='Open WildReserve and sign in with your email and password. If sign-in still asks for confirmation, request a new confirmation email.';
}
