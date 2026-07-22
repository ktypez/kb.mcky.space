import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"กระบวนการ TODOs (TODOs Convention)","description":"","frontmatter":{"type":"system-doc","id":"todos-convention","last_updated":"2026-07-21T00:00:00.000Z"},"headers":[],"relativePath":"system/TODOS.md","filePath":"system/TODOS.md","lastUpdated":1784695462000}');
const _sfc_main = { name: "system/TODOS.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="กระบวนการ-todos-todos-convention" tabindex="-1">กระบวนการ TODOs (TODOs Convention) <a class="header-anchor" href="#กระบวนการ-todos-todos-convention" aria-label="Permalink to &quot;กระบวนการ TODOs (TODOs Convention)&quot;">​</a></h1><p>TODO ระดับโปรเจกต์อยู่ใน <code>TODOS.md</code> ที่รากโปรเจกต์ (<code>~/&amp;lt;project&amp;gt;/TODOS.md</code>)</p><h2 id="todos-ทํางานยังไง" tabindex="-1">TODOs ทำงานยังไง <a class="header-anchor" href="#todos-ทํางานยังไง" aria-label="Permalink to &quot;TODOs ทำงานยังไง&quot;">​</a></h2><ul><li>แต่ละ TODO คือ checklist item (<code>- [ ]</code>) ใน <code>TODOS.md</code></li><li>Agent profile ของโปรเจกต์ (<code>agent.md</code>) อธิบายขั้นตอนการตรวจสอบ</li></ul><h2 id="การตรวจสอบตอนเริ่ม-global" tabindex="-1">การตรวจสอบตอนเริ่ม (GLOBAL) <a class="header-anchor" href="#การตรวจสอบตอนเริ่ม-global" aria-label="Permalink to &quot;การตรวจสอบตอนเริ่ม (GLOBAL)&quot;">​</a></h2><p>Agent <strong>ต้อง</strong> รันสิ่งนี้ในทุก session ใหม่ ก่อนเริ่มงานใดๆ:</p><ol><li>เช็ค <code>./TODOS.md</code> ที่รากโปรเจกต์ถ้ามี</li><li>ถ้ามี: อ่านและแจ้งผู้ใช้ &quot;Open TODOs: N items&quot;</li><li>ถาม: ทำ TODO หรือดำเนินเรื่องที่ขอมาต่อ</li></ol><h2 id="agent-md-ระดับโปรเจกต์" tabindex="-1">agent.md ระดับโปรเจกต์ <a class="header-anchor" href="#agent-md-ระดับโปรเจกต์" aria-label="Permalink to &quot;agent.md ระดับโปรเจกต์&quot;">​</a></h2><p><code>agent.md</code> ของแต่ละโปรเจกต์ควรมีหมวด <code>## TODOs</code>:</p><ul><li>อธิบายขั้นตอนการตรวจสอบตอนเริ่ม</li><li>ลิงก์ไปยังเอกสารระบบนี้ (<code>todos-convention</code>)</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system/TODOS.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TODOS = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  TODOS as default
};
