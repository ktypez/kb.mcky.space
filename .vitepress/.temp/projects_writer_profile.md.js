import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"โปรไฟล์โปรเจกต์: writer","description":"","frontmatter":{"type":"project-profile","id":"writer-profile","project":"writer","last_updated":"2026-07-21T00:00:00.000Z","status":"active","stack":{"language":"Markdown","framework":"AI agent system","ui":"none","database":"none","storage":"file-based","state":"none","auth":"none","testing":"none","deployment":"none","ci":"none"},"agent_personality":"word goblin","links":{"agent":"writer-agent"}},"headers":[],"relativePath":"projects/writer/profile.md","filePath":"projects/writer/profile.md","lastUpdated":null}');
const _sfc_main = { name: "projects/writer/profile.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="โปรไฟล์โปรเจกต์-writer" tabindex="-1">โปรไฟล์โปรเจกต์: writer <a class="header-anchor" href="#โปรไฟล์โปรเจกต์-writer" aria-label="Permalink to &quot;โปรไฟล์โปรเจกต์: writer&quot;">​</a></h1><h2 id="ข้อมูลตัวตน-identity" tabindex="-1">ข้อมูลตัวตน (Identity) <a class="header-anchor" href="#ข้อมูลตัวตน-identity" aria-label="Permalink to &quot;ข้อมูลตัวตน (Identity)&quot;">​</a></h2><ul><li><strong>Name:</strong> writer</li><li><strong>Display Name:</strong> Writer Agent</li><li><strong>Description:</strong> ผู้เขียนคอนเทนต์และสรุปเนื้อหาให้โปรเจกต์ทั้งหมด</li><li><strong>Purpose:</strong> จัดการการเขียนแบบกระชับ, สรุป, changelog และเอกสาร</li><li><strong>Repository:</strong> ไม่มี</li></ul><h2 id="เทคโนโลยี-technology" tabindex="-1">เทคโนโลยี (Technology) <a class="header-anchor" href="#เทคโนโลยี-technology" aria-label="Permalink to &quot;เทคโนโลยี (Technology)&quot;">​</a></h2><ul><li><strong>Languages:</strong> Markdown, YAML</li><li><strong>Frameworks:</strong> ไม่มี</li><li><strong>Runtime:</strong> ไม่มี (AI tool)</li></ul><h2 id="เอกสาร-documentation" tabindex="-1">เอกสาร (Documentation) <a class="header-anchor" href="#เอกสาร-documentation" aria-label="Permalink to &quot;เอกสาร (Documentation)&quot;">​</a></h2><ul><li><strong>Agent Context:</strong> <a href="./agent">agent.md</a></li></ul><h2 id="สถานะ-status" tabindex="-1">สถานะ (Status) <a class="header-anchor" href="#สถานะ-status" aria-label="Permalink to &quot;สถานะ (Status)&quot;">​</a></h2><ul><li><strong>State:</strong> active</li><li><strong>Documentation Completeness:</strong> สูง (High)</li><li><strong>Confidence Level:</strong> สูง (High)</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("projects/writer/profile.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  profile as default
};
