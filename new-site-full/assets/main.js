// LACSOCE 新版官网 · 前端小脚本（无框架）
// 汉堡菜单、下拉菜单点击展开、未开发入口提示、首页滚动后导航变实底。
(function () {
  var header = document.getElementById('siteHeader');
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobileNav');
  var toast = document.getElementById('toast');
  var timer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  // 未开发入口：只提示，不跳转
  document.querySelectorAll('[data-pending]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('「' + el.getAttribute('data-pending') + '」即将上线，敬请期待。');
    });
  });

  // 汉堡菜单
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 下拉菜单：点击展开（触屏可用），悬停由 CSS 处理；回车/空格由 button 原生触发 click
  document.querySelectorAll('.nav-item > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = btn.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(function (n) {
        n.classList.remove('open');
        var b = n.querySelector(':scope > button');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-item.open').forEach(function (n) {
      n.classList.remove('open');
      var b = n.querySelector(':scope > button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  // 键盘：Esc 关闭已打开的下拉菜单与手机菜单（焦点在菜单内时回到汉堡按钮）
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var focusWasInMobileNav = mobileNav && mobileNav.contains(document.activeElement);
    document.querySelectorAll('.nav-item.open').forEach(function (n) {
      n.classList.remove('open');
      var b = n.querySelector(':scope > button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (mobileNav && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      if (focusWasInMobileNav && burger) burger.focus();
    }
  });

  // 首页首屏：滚动后导航变实底（只在有 .hero 的首页生效，内页始终实底）
  var hasHero = !!document.querySelector('.hero');
  function onScroll() {
    if (!header || !hasHero) return;
    if (window.scrollY > 40) {
      header.classList.remove('over-hero');
      header.classList.add('solid');
    } else {
      header.classList.add('over-hero');
      header.classList.remove('solid');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
