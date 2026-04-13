// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

/* Simple SPA navigation: intercept links with class 'spa-link', fetch pages and replace <main class="site-main"> content */
(function(){
    function selectMain(doc){
        return doc.querySelector('main.site-main') || doc.querySelector('main');
    }

    async function loadUrl(url, push){
        try{
            const res = await fetch(url, { headers: { 'X-Requested-With':'XMLHttpRequest' } });
            if(!res.ok){ window.location.href = url; return; }
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMain = selectMain(doc);
            const curMain = document.querySelector('main.site-main') || document.querySelector('main');
            if(newMain && curMain){
                curMain.innerHTML = newMain.innerHTML;
                if(doc.title) document.title = doc.title;
                if(push) history.pushState({ url: url }, '', url);
                window.scrollTo(0,0);
            } else {
                window.location.href = url;
            }
        } catch(e){
            console.error('SPA load failed', e);
            window.location.href = url;
        }
    }

    function onLinkClick(e){
        // only handle left-click without modifier keys
        if(e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest('a.spa-link');
        if(!a) return;
        const href = a.getAttribute('href');
        if(!href || href.indexOf('http')===0 || href.indexOf('mailto:')===0) return;
        e.preventDefault();
        closeNavOverlay();
        loadUrl(href, true);
    }

    function openNavOverlay(){
        const o = document.getElementById('nav-overlay');
        if(!o) return;
        o.classList.add('open');
        o.setAttribute('aria-hidden','false');
    }
    function closeNavOverlay(){
        const o = document.getElementById('nav-overlay');
        if(!o) return;
        o.classList.remove('open');
        o.setAttribute('aria-hidden','true');
    }

    document.addEventListener('click', function(e){
        const toggle = e.target.closest('#nav-toggle');
        if(toggle){ openNavOverlay(); return; }
        const close = e.target.closest('#nav-close');
        if(close){ closeNavOverlay(); return; }
        onLinkClick(e);
    });

    window.addEventListener('popstate', function(ev){
        const url = location.pathname + location.search;
        loadUrl(url, false);
    });

})();
