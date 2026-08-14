const bundleUrl = "/assets/index-BLlUwwMG.js";
const searchText = 'const[,t]=Xm("/historias/:slug"),i=t?.slug?t_[t.slug]:void 0;';
const replacementText = 'const[,t]=Xm("/historias/:slug"),[i,o]=j.useState(t?.slug?t_[t.slug]:void 0);j.useEffect(()=>{let l=!1;if(i||!t?.slug)return;const u=String(t.slug),m=window.__arteniaPublishedProfilesPromise||fetch("/api/public-profiles.php",{credentials:"same-origin"}).then(f=>{if(!f.ok)throw new Error("No se pudieron cargar los perfiles publicados");return f.json()}).then(f=>Array.isArray(f?.items)?f.items:[]);return m.then(f=>{if(l||!Array.isArray(f))return;const x=f.find(v=>String(v?.slug||"")===u);if(!x)return;const w=window.__arteniaProfileToStory?window.__arteniaProfileToStory(x):null;if(!w)return;const _=t_["adriana-machado"]||Object.values(t_||{})[0]||{};const b={..._,...w,craftHeritage:{...(_?.craftHeritage||{}),...(w?.craftHeritage||{}),origin:{...(_?.craftHeritage?.origin||{}),...(w?.craftHeritage?.origin||{})}},origin:{...(_?.origin||{}),...(w?.origin||{})},location:{...(_?.location||{}),...(w?.location||{})},visit:{...(_?.visit||{}),...(w?.visit||{})},chapters:Array.isArray(w?.chapters)&&w.chapters.length?w.chapters:(Array.isArray(_?.chapters)?_.chapters:[]),gallery:Array.isArray(w?.gallery)&&w.gallery.length?w.gallery:(Array.isArray(_?.gallery)?_.gallery:[]),timeline:Array.isArray(w?.timeline)&&w.timeline.length?w.timeline:(Array.isArray(_?.timeline)?_.timeline:[]),services:Array.isArray(w?.services)?w.services:(Array.isArray(_?.services)?_.services:[]),howItWorks:Array.isArray(w?.howItWorks)?w.howItWorks:(Array.isArray(_?.howItWorks)?_.howItWorks:[]),highlights:Array.isArray(w?.highlights)?w.highlights:(Array.isArray(_?.highlights)?_.highlights:[]),projects:Array.isArray(w?.projects)?w.projects:(Array.isArray(_?.projects)?_.projects:[]),testimonials:Array.isArray(w?.testimonials)?w.testimonials:(Array.isArray(_?.testimonials)?_.testimonials:[]),links:Array.isArray(w?.links)?w.links:(Array.isArray(_?.links)?_.links:[]),materials:Array.isArray(w?.materials)?w.materials:(Array.isArray(_?.materials)?_.materials:[])};t_[u]=b,o(b)}).catch(()=>{}),()=>{l=!0}},[i,t?.slug]);';

const isStoryRoute = /^\/historias\/(?:[^/?#]+)/.test(window.location.pathname);

async function loadMainBundle(moduleUrl) {
  try {
    await import(moduleUrl);
  } catch (error) {
    console.error("ARTENIA: no se pudo cargar el bundle principal", error);
    const isPublicRoute = /^(?:\/(?:$|mapa$|territorios(?:\/|$)|artesanos(?:\/|$)|oficios(?:\/|$)|rutas(?:\/|$)|historias(?:\/|$)|sobre-artenia$))/.test(window.location.pathname);
    if (isPublicRoute) {
      document.documentElement.classList.add("artenia-bundle-load-failed");
      if (!document.getElementById("seo-indexable-content")) {
        const fallback = document.createElement("main");
        fallback.id = "seo-indexable-content";
        fallback.innerHTML = '<h1 id="seo-indexable-h1">ARTENIA</h1><p id="seo-indexable-intro">No se pudo cargar la aplicación en este momento. Inténtalo de nuevo.</p>';
        document.body.appendChild(fallback);
      }
    }
  }
}

if (!isStoryRoute) {
  await loadMainBundle(bundleUrl);
} else {
  const response = await fetch(bundleUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el bundle principal: ${response.status}`);
  }

  const source = await response.text();
  const patchedSource = source.includes(searchText) ? source.replace(searchText, replacementText) : source;
  const moduleUrl = URL.createObjectURL(new Blob([patchedSource], { type: "text/javascript" }));

  try {
    await loadMainBundle(moduleUrl);
  } finally {
    URL.revokeObjectURL(moduleUrl);
  }
}