import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Plan: Rose Pine Theme Switch","description":"","frontmatter":{"id":"plan-rose-pine-theme-switch","version":4,"status":"superseded","created":"2026-07-09T00:00:00.000Z","updated":"2026-07-13T00:00:00.000Z","superseded-by":"expo-theme"},"headers":[],"relativePath":"plans/rose-pine-theme-switch.md","filePath":"plans/rose-pine-theme-switch.md","lastUpdated":1784695462000}');
const _sfc_main = { name: "plans/rose-pine-theme-switch.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="plan-rose-pine-theme-switch" tabindex="-1">Plan: Rose Pine Theme Switch <a class="header-anchor" href="#plan-rose-pine-theme-switch" aria-label="Permalink to &quot;Plan: Rose Pine Theme Switch&quot;">​</a></h1><h2 id="goal" tabindex="-1">Goal <a class="header-anchor" href="#goal" aria-label="Permalink to &quot;Goal&quot;">​</a></h2><p>Replace custom neobrutalist theme with starlight-theme-rose-pine plugin</p><h2 id="steps" tabindex="-1">Steps <a class="header-anchor" href="#steps" aria-label="Permalink to &quot;Steps&quot;">​</a></h2><ul><li>[x] Install starlight-theme-rose-pine package</li><li>[x] Update astro.config.mjs — add plugin, remove customCss</li><li>[x] Update content.config.ts — revert schema extend</li><li>[x] Update index.mdx — remove lucode-specific hero.layout</li><li>[x] Remove lucode-starlight and starlight-sidebar-topics from package.json</li><li>[x] Commit and push</li><li>[x] Verify deploy at kb.mcky.space</li></ul><h2 id="files" tabindex="-1">Files <a class="header-anchor" href="#files" aria-label="Permalink to &quot;Files&quot;">​</a></h2><ul><li>site/astro.config.mjs</li><li>site/package.json</li><li>site/src/content.config.ts</li><li>site/src/content/docs/index.mdx</li></ul><h2 id="verification" tabindex="-1">Verification <a class="header-anchor" href="#verification" aria-label="Permalink to &quot;Verification&quot;">​</a></h2><ul><li>[x] Site loads at kb.mcky.space with Rose Pine palette</li><li>[x] Dark/light/auto theme toggle works</li><li>[x] Sidebar groups collapse correctly</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("plans/rose-pine-theme-switch.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const rosePineThemeSwitch = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  rosePineThemeSwitch as default
};
