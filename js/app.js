(() => {
 const slotButtons=[...document.querySelectorAll(".slot")], storage=document.getElementById("storage"), settings=document.getElementById("settingsPanel"), toast=document.getElementById("toast"), cats=[...document.querySelectorAll(".category")];
 let selected=1, toastTimer;
 const say=m=>{toast.textContent=m;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),1800)};
 function selectSlot(n){selected=n;slotButtons.forEach((b,i)=>{b.classList.toggle("active",i+1===n);b.setAttribute("aria-label",`Slot ${i+1}${i+1===n?", selected":""}`)});document.getElementById("chip").textContent=`Slot ${n}`;document.getElementById("slotText").textContent=n}
 function openStorage(){storage.classList.add("open");storage.setAttribute("aria-hidden","false")}
 function closeStorage(){storage.classList.remove("open");storage.setAttribute("aria-hidden","true")}
 function openSettings(){settings.classList.add("open");settings.setAttribute("aria-hidden","false")}
 function closeSettings(){settings.classList.remove("open");settings.setAttribute("aria-hidden","true")}
 slotButtons.forEach((b,i)=>b.addEventListener("click",()=>selectSlot(i+1)));
 document.getElementById("open").addEventListener("click",openStorage);document.getElementById("back").addEventListener("click",closeStorage);document.getElementById("done").addEventListener("click",closeStorage);
 document.getElementById("settings").addEventListener("click",openSettings);document.getElementById("closeSettings").addEventListener("click",closeSettings);settings.addEventListener("click",e=>{if(e.target===settings)closeSettings()});
 cats.forEach(b=>b.addEventListener("click",()=>{cats.forEach(c=>c.classList.toggle("active",c===b));say(`${b.dataset.category}: no assets added yet`)}));
 async function fullscreen(){const target=document.getElementById("shell");try{if(!document.fullscreenElement&&target.requestFullscreen){await target.requestFullscreen();say("Fullscreen enabled")}else if(document.fullscreenElement&&document.exitFullscreen){await document.exitFullscreen()}else say("Fullscreen isn't supported here")}catch(e){say("Fullscreen request was blocked by the browser")}}
 document.getElementById("fullscreen").addEventListener("click",fullscreen);document.getElementById("settingsFullscreen").addEventListener("click",()=>{closeSettings();fullscreen()});
 document.addEventListener("fullscreenchange",()=>document.getElementById("fullscreen").setAttribute("aria-label",document.fullscreenElement?"Exit fullscreen":"Enter fullscreen"));
 selectSlot(1);
})();
