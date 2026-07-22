import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ศัพท์เทคนิค (Glossary)","description":"","frontmatter":{"type":"system-doc","id":"glossary","last_updated":"2026-07-21T00:00:00.000Z"},"headers":[],"relativePath":"system/glossary.md","filePath":"system/glossary.md","lastUpdated":null}');
const _sfc_main = { name: "system/glossary.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="ศัพท์เทคนิค-glossary" tabindex="-1">ศัพท์เทคนิค (Glossary) <a class="header-anchor" href="#ศัพท์เทคนิค-glossary" aria-label="Permalink to &quot;ศัพท์เทคนิค (Glossary)&quot;">​</a></h1><table tabindex="0"><thead><tr><th>คำศัพท์</th><th>ความหมาย</th></tr></thead><tbody><tr><td><strong>OKF</strong></td><td>Open Knowledge Framework — รูปแบบเอกสาร YAML frontmatter + Markdown body สำหรับ project docs</td></tr><tr><td><strong>Agent</strong></td><td>AI coding agent ที่มีบุคลิกภาพ (personality), triggers และกฎกำหนดไว้ชัดเจน</td></tr><tr><td><strong>Project</strong></td><td>โค้ดเบสที่ถูกจัดการใน workspace นี้</td></tr><tr><td><strong>KB</strong></td><td>Knowledge Base — ระบบเอกสารรวมศูนย์ของทั้ง workspace</td></tr><tr><td><strong>Goblin</strong></td><td>บุคลิกภาพ agent ใน workspace นี้ — แต่ละตัวมีความคลั่งไคล้เฉพาะทาง</td></tr><tr><td><strong>wrap-day</strong></td><td>ทบทวน diff วันนี้, เขียน changelog, อัปเดตสถานะ, commit</td></tr><tr><td><strong>cleanup</strong></td><td>สแกน dependency/ไฟล์ที่ไม่ใช้, ตรวจสุขภาพ, นำเสนอผล, อัปเดต KB</td></tr><tr><td><strong>OKF format</strong></td><td>YAML frontmatter + Markdown body — รูปแบบมาตรฐานของไฟล์ KB</td></tr><tr><td><strong>LIFF</strong></td><td>LINE Frontend Framework — แพลตฟอร์มเว็บแอปของ LINE</td></tr><tr><td><strong>PWA</strong></td><td>Progressive Web App — เว็บแอปที่ติดตั้งได้</td></tr><tr><td><strong>SPA</strong></td><td>Single Page Application — แอปที่โหลดหน้าเดียว</td></tr><tr><td><strong>SSR</strong></td><td>Server-Side Rendering — การเรนเดอร์ฝั่งเซิร์ฟเวอร์</td></tr><tr><td><strong>RLS</strong></td><td>Row-Level Security (Supabase) — ความปลอดภัยระดับแถว</td></tr><tr><td><strong>Drizzle</strong></td><td>TypeScript ORM สำหรับฐานข้อมูล SQL</td></tr><tr><td><strong>JWT</strong></td><td>JSON Web Token — โทเคนยืนยันตัวตน</td></tr><tr><td><strong>cva</strong></td><td>Class Variance Authority — สำหรับจัด variant ของ component</td></tr><tr><td><strong>D1</strong></td><td>Cloudflare D1 — SQLite database บน edge</td></tr><tr><td><strong>R2</strong></td><td>Cloudflare R2 — object storage (ไม่มี egress fee)</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("system/glossary.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const glossary = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  glossary as default
};
