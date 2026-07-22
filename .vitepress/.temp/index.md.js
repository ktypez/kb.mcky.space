import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"OKF","text":"Knowledge Base","tagline":"Open Knowledge Framework — structured context for every project","image":{"src":"/favicon.svg","alt":"OKF"},"actions":[{"theme":"brand","text":"Browse Projects","link":"/projects/truck/profile"},{"theme":"alt","text":"System Docs","link":"/system/conventions"},{"theme":"alt","text":"Full Workspace Index","link":"/workspace"}]},"features":[{"title":"truck","details":"React 19 + Vite 8 · Supabase · TanStack Query","link":"/projects/truck/profile"},{"title":"data.mcky.space","details":"Vite 8 + React 19 · Tailwind 4 · Cloudflare D1/R2","link":"/projects/data-mcky-space/profile"},{"title":"habby","details":"Vite 8 + Express 5 · Redis · Vitest","link":"/projects/habby/profile"},{"title":"mcky.space","details":"Astro 7 · Vanilla JS · Supabase · Vercel","link":"/projects/mcky-space/profile"},{"title":"collage","details":"Express 4 + sharp · Cloudflare R2 · LINE Bot SDK","link":"/projects/collage/profile"},{"title":"receipts-dms","details":"Vite 8 + React 19 · Radix UI · Cloudflare D1/R2","link":"/projects/receipts-dms/profile"},{"title":"writer","details":"Markdown + AI agent system","link":"/projects/writer/profile"},{"title":"System Docs","details":"Conventions · Glossary · Personalities · TODOs","link":"/system/conventions"}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1784695462000}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="about-okf" tabindex="-1">About OKF <a class="header-anchor" href="#about-okf" aria-label="Permalink to &quot;About OKF&quot;">​</a></h2><p>Open Knowledge Framework (OKF) is a portable knowledge base that stores project context as markdown files with YAML frontmatter — profiles, agents, status, system docs, and more. Every project has consistent documentation that AI agents can read and update.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
