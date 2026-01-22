(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();function I(e){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(e)}function ee(e){return new Date(e).toLocaleDateString("pt-BR")}function Be(e){return{ativo:"badge-success",potencial:"badge-info",em_negociacao:"badge-warning",inativo:"badge-neutral",planejamento:"badge-info",em_execucao:"badge-warning",pausado:"badge-neutral",concluido:"badge-success",cancelado:"badge-danger",pendente:"badge-warning",pago:"badge-success",atrasado:"badge-danger"}[e]||"badge-neutral"}function Le(e){return{ativo:"Ativo",potencial:"Potencial",em_negociacao:"Em Negociação",inativo:"Inativo",planejamento:"Planejamento",em_execucao:"Em Execução",pausado:"Pausado",concluido:"Concluído",cancelado:"Cancelado",pendente:"Pendente",pago:"Pago",atrasado:"Atrasado",recebimento:"Recebimento",pagamento:"Pagamento"}[e]||e}let Y=null;function v(e,t="success"){Y||(Y=document.createElement("div"),Y.className="toast-container",document.body.appendChild(Y));const a=document.createElement("div");a.className=`toast ${t}`,a.textContent=e,Y.appendChild(a),setTimeout(()=>{a.remove()},3e3)}const ue={};function M(e,t){ue[e]=t}function oe(e){window.history.pushState({},"",e),we()}function we(){const e=window.location.pathname,t=ue[e]||ue["/"];t&&t()}window.addEventListener("popstate",we);const Oe="/api";class qe extends Error{constructor(t,a){super(a),this.status=t,this.name="ApiError"}}async function g(e,t={}){const a=await fetch(`${Oe}${e}`,{...t,credentials:"include",cache:"no-store",headers:{"Content-Type":"application/json",...t.headers}});if(!a.ok){const r=await a.json().catch(()=>({detail:"Erro desconhecido"}));throw new qe(a.status,r.detail||"Erro na requisição")}if(a.status!==204)return a.json()}const U={login:e=>g("/auth/login",{method:"POST",body:JSON.stringify(e)}),logout:()=>g("/auth/logout",{method:"POST"}),me:()=>g("/auth/me"),register:e=>g("/auth/register",{method:"POST",body:JSON.stringify(e)}),updateProfile:(e,t)=>g(`/auth/users/${e}`,{method:"PUT",body:JSON.stringify(t)})},T={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/clientes${t}`)},get:e=>g(`/clientes/${e}`),create:e=>g("/clientes",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/clientes/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/clientes/${e}`,{method:"DELETE"}),addInteracao:(e,t)=>g(`/clientes/${e}/interacoes`,{method:"POST",body:JSON.stringify(t)})},ie={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/projetos${t}`)},get:e=>g(`/projetos/${e}`),create:e=>g("/projetos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/projetos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/projetos/${e}`,{method:"DELETE"}),addEntregavel:(e,t)=>g(`/projetos/${e}/entregaveis`,{method:"POST",body:JSON.stringify(t)}),updateEntregavel:(e,t,a)=>g(`/projetos/${e}/entregaveis/${t}`,{method:"PUT",body:JSON.stringify(a)})},ne={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/contratos${t}`)},alertas:(e=30)=>g(`/contratos/alertas?dias=${e}`),get:e=>g(`/contratos/${e}`),create:e=>g("/contratos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/contratos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/contratos/${e}`,{method:"DELETE"})},J={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/financeiro${t}`)},create:e=>g("/financeiro",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/financeiro/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/financeiro/${e}`,{method:"DELETE"}),fluxoCaixa:(e=6)=>g(`/financeiro/fluxo-caixa?meses=${e}`),dashboard:()=>g("/financeiro/dashboard"),atividades:(e=10)=>g(`/financeiro/atividades?limit=${e}`)},re={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/agendamentos${t}`)},create:e=>g("/agendamentos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/agendamentos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/agendamentos/${e}`,{method:"DELETE"})},V={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return g(`/orcamentos${t}`)},get:e=>g(`/orcamentos/${e}`),create:e=>g("/orcamentos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>g(`/orcamentos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>g(`/orcamentos/${e}`,{method:"DELETE"}),calculate:e=>g("/orcamentos/calculate",{method:"POST",body:JSON.stringify(e)})},K={list:()=>g("/config/"),get:e=>g(`/config/${e}`),update:(e,t)=>g(`/config/${e}`,{method:"PUT",body:JSON.stringify(t)})};let te=null;function ke(){return te}async function Te(){try{return te=await U.me(),!0}catch{return te=null,!1}}function le(e){var a;e.innerHTML=`
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">🚀 CRM MVP</h1>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-input" id="password" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Entrar</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--color-text-muted)">
          Primeiro acesso? <a href="#" id="register-link">Criar conta</a>
        </p>
      </div>
    </div>
  `,document.getElementById("login-form").addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("email").value,i=document.getElementById("password").value;try{te=(await U.login({email:o,password:i})).user,v("Login realizado com sucesso!","success"),oe("/dashboard")}catch(s){v(s.message||"Erro ao fazer login","error")}}),(a=document.getElementById("register-link"))==null||a.addEventListener("click",r=>{r.preventDefault(),Re(e)})}function Re(e){var a;e.innerHTML=`
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">🚀 Criar Conta</h1>
        <form id="register-form">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input type="text" class="form-input" id="name" required placeholder="Seu nome">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-input" id="password" required placeholder="••••••••" minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Criar Conta</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--color-text-muted)">
          Já tem conta? <a href="#" id="login-link">Entrar</a>
        </p>
      </div>
    </div>
  `,document.getElementById("register-form").addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("name").value,i=document.getElementById("email").value,s=document.getElementById("password").value;try{await U.register({name:o,email:i,password:s}),v("Conta criada! Faça login.","success"),le(e)}catch(f){v(f.message||"Erro ao criar conta","error")}}),(a=document.getElementById("login-link"))==null||a.addEventListener("click",r=>{r.preventDefault(),le(e)})}async function Ne(){try{await U.logout(),te=null,v("Logout realizado","success"),oe("/")}catch{v("Erro ao fazer logout","error")}}/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 8v8"}],["path",{d:"m8 12 4 4 4-4"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m16 12-4-4-4 4"}],["path",{d:"M12 16V8"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m15 9-6 6"}],["path",{d:"m9 9 6 6"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}],["path",{d:"M12 11h4"}],["path",{d:"M12 16h4"}],["path",{d:"M8 11h.01"}],["path",{d:"M8 16h.01"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["line",{x1:"12",x2:"12",y1:"2",y2:"22"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"m11 17 2 2a1 1 0 1 0 3-3"}],["path",{d:"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"}],["path",{d:"m21 3 1 11h-2"}],["path",{d:"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"}],["path",{d:"M3 4h8"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["path",{d:"m16 17 5-5-5-5"}],["path",{d:"M21 12H9"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["path",{d:"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"}],["path",{d:"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"}],["path",{d:"M8 6v8"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M4 5h16"}],["path",{d:"M4 12h16"}],["path",{d:"M4 19h16"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"M5.8 11.3 2 22l10.7-3.79"}],["path",{d:"M4 3h.01"}],["path",{d:"M22 8h.01"}],["path",{d:"M15 2h.01"}],["path",{d:"M22 20h.01"}],["path",{d:"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"}],["path",{d:"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"}],["path",{d:"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"}],["path",{d:"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{cx:"9",cy:"7",r:"4"}]],vt={rocket:dt,dashboard:at,users:ut,filter:et,calendar:Fe,"file-text":Ke,clipboard:Xe,folder:Qe,dollar:Ye,settings:ct,edit:st,trash:pt,party:nt,alert:mt,megaphone:rt,handshake:tt,briefcase:He,file:We,"arrow-down":Je,"arrow-up":Ve,"folder-open":Ze,check:Ue,x:Ge,logout:ot,menu:it,plus:lt};function E(e,t=""){const a=vt[e];if(!a)return console.warn(`Icon '${e}' not found.`),"";const r={xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:`lucide lucide-${e} ${t}`.trim()},o=Object.entries(r).map(([s,f])=>`${s}="${f}"`).join(" ");let i="";return Array.isArray(a)&&(i=a.map(([s,f])=>{const b=Object.entries(f).map(([h,y])=>`${h}="${y}"`).join(" ");return`<${s} ${b}></${s}>`}).join("")),`<svg ${o}>${i}</svg>`}const Me=document.createElement("style");Me.textContent=`
    .icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        stroke-width: 2px;
    }
    .icon-sm {
        width: 16px;
        height: 16px;
    }
    .icon-lg {
        width: 24px;
        height: 24px;
    }
`;document.head.appendChild(Me);function gt(e,t){var r,o;const a=ke();return e.innerHTML=`
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar-logo">
          ${E("rocket","w-6 h-6")} CRM MVP
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item ${t==="dashboard"?"active":""}" data-page="dashboard">
            <span class="nav-item-icon">${E("dashboard")}</span>
            Dashboard
          </div>
          <div class="nav-item ${t==="clientes"?"active":""}" data-page="clientes">
            <span class="nav-item-icon">${E("users")}</span>
            Clientes e Parceiros
          </div>
          <div class="nav-item ${t==="funil"?"active":""}" data-page="funil">
            <span class="nav-item-icon">${E("filter")}</span>
            Funil de Negociações
          </div>
          <div class="nav-item ${t==="agendamento"?"active":""}" data-page="agendamento">
            <span class="nav-item-icon">${E("calendar")}</span>
            Agendamento
          </div>
          <div class="nav-item ${t==="orcamento"?"active":""}" data-page="orcamento">
            <span class="nav-item-icon">${E("file-text")}</span>
            Orçamento
          </div>
          <div class="nav-item ${t==="contratos"?"active":""}" data-page="contratos">
            <span class="nav-item-icon">${E("clipboard")}</span>
            Contratos
          </div>
          <div class="nav-item ${t==="projetos"?"active":""}" data-page="projetos">
            <span class="nav-item-icon">${E("folder")}</span>
            Projetos
          </div>
          <div class="nav-item ${t==="financeiro"?"active":""}" data-page="financeiro">
            <span class="nav-item-icon">${E("dollar")}</span>
            Financeiro
          </div>
          <div class="nav-item ${t==="configuracoes"?"active":""}" data-page="configuracoes">
            <span class="nav-item-icon">${E("settings")}</span>
            Configurações
          </div>
        </nav>
        <div style="margin-top: auto; padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
          <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 600;">
              ${((r=a==null?void 0:a.name)==null?void 0:r.charAt(0).toUpperCase())||"U"}
            </div>
            <div>
              <div style="font-weight: 500;">${(a==null?void 0:a.name)||"Usuário"}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${(a==null?void 0:a.role)||""}</div>
            </div>
          </div>
          <button class="btn btn-secondary" style="width: 100%;" id="logout-btn">
            Sair
          </button>
        </div>
      </aside>
      <main class="main-content" id="page-content">
        <div class="loading"><div class="spinner"></div></div>
      </main>
    </div>
  `,document.querySelectorAll(".nav-item[data-page]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.page;oe(`/${s}`)})}),(o=document.getElementById("logout-btn"))==null||o.addEventListener("click",Ne),document.getElementById("page-content")}async function bt(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const t=await J.dashboard(),r=new Date().toLocaleString("pt-BR",{month:"long"}),o=[],i=[{titulo:"Janeiro Branco e Roxo",desc:"Saúde mental e hanseníase"},{titulo:"Confraternização Universal",desc:"",data:"01/01"}];e.innerHTML=`
      <div class="page-header" style="margin-bottom: var(--spacing-lg);">
        <div>
          <h1 class="page-title" style="margin-bottom: 0.5rem;">Bem-vindo ao CRM</h1>
          <p style="color: var(--color-text-secondary);">Aqui está um resumo das suas atividades.</p>
        </div>
      </div>

      <!-- Activity Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
        
        <!-- Próximos Agendamentos -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-primary);">${E("calendar","w-6 h-6")}</span> Próximos Agendamentos
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm); color: var(--color-text-muted);">
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">Compromissos para hoje e amanhã.</p>
            <div style="text-align: center; color: var(--color-text-muted);">
              Nenhum agendamento para hoje ou amanhã.
            </div>
          </div>
        </div>

        <!-- Aniversariantes -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-warning);">${E("party","w-6 h-6")}</span> Aniversariantes de ${r}
            </h2>
          </div>
          <div style="padding-top: var(--spacing-xl);">
            ${o.length===0?'<p style="text-align: center; color: var(--color-text-muted);">Nenhum aniversariante neste mês.</p>':o.map(s=>`
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div>
                  <span style="font-weight: 500;">${s.nome}</span>
                  <span style="color: var(--color-text-muted); font-size: 0.875rem;">(${s.cargo})</span>
                </div>
                <div style="color: var(--color-text-muted);">${s.data}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Lembretes Financeiros -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-danger);">${E("alert","w-6 h-6")}</span> Lembretes Financeiros
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm);">
             <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">Contas pendentes vencidas ou com vencimento nos próximos 5 dias.</p>
             <div style="text-align: center; color: var(--color-text-muted);">
              Nenhum lançamento pendente para os próximos dias.
            </div>
          </div>
        </div>

        <!-- Datas do Mês -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-info);">${E("megaphone","w-6 h-6")}</span> Datas de janeiro
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm);">
             <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">Feriados e campanhas importantes.</p>
             
             ${i.map(s=>`
                <div style="margin-bottom: var(--spacing-md);">
                  ${s.desc?`
                    <div style="background: var(--color-bg); padding: var(--spacing-md); border-radius: var(--radius-md); border-left: 4px solid var(--color-info);">
                      <div style="font-weight: 600; color: var(--color-info);">${s.titulo}</div>
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${s.desc}</div>
                    </div>
                  `:`
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                       <span style="font-weight: 500;">${s.titulo}</span>
                       <span style="color: var(--color-text-muted);">${s.data}</span>
                    </div>
                  `}
                </div>
             `).join("")}
          </div>
        </div>

      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        ${H("Total de Clientes",t.clientes_ativos+t.clientes_potenciais,"Clientes cadastrados no sistema",E("users"))}
        ${H("Total de Parceiros",0,"Parceiros cadastrados no sistema",E("handshake"))}
        ${H("Colaboradores",1,"Membros na sua equipe",E("briefcase"))}
        ${H("Orçamentos Criados",2,"Orçamentos gerados no sistema",E("file-text"))}
        ${H("Contratos Salvos",t.contratos_ativos,"Contratos salvos no sistema",E("file"))}
        ${H("Total de Projetos",t.projetos_em_andamento+t.projetos_concluidos,"Projetos cadastrados no total",E("rocket"))}
      </div>

    `}catch(t){console.error(t),e.innerHTML='<div class="empty-state">Erro ao carregar dashboard</div>'}}function H(e,t,a,r){return`
    <div class="card" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-sm);">
        <span style="font-weight: 600; font-size: 1rem;">${e}</span>
        <span style="color: var(--color-text-muted); display: flex; align-items: center;">${r}</span>
      </div>
      <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-text); line-height: 1; margin-bottom: var(--spacing-xs);">
        ${t}
      </div>
      <div style="font-size: 0.875rem; color: var(--color-text-muted);">
        ${a}
      </div>
    </div>
  `}let de=[];async function ve(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{de=await T.list(),yt(e)}catch{e.innerHTML='<div class="empty-state">Erro ao carregar clientes</div>'}}function yt(e){e.innerHTML=`
    <div class="card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header" style="border-bottom: none; padding-bottom: var(--spacing-xs);">
            <h2 class="card-title" style="font-size: 1.25rem;">Cadastro</h2>
        </div>
        <div style="padding-top: 0; color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
            Selecione o tipo para iniciar o cadastro.
        </div>

        <div class="form-group" style="max-width: 100%;">
            <label class="form-label" style="font-weight: 500;">Qual o tipo de cadastro?</label>
            <select class="form-input form-select" id="new-cadastro-select" style="background-color: var(--color-bg); border: 2px solid var(--color-primary);">
                <option value="" selected disabled>Selecione...</option>
                <option value="cliente">Cliente</option>
                <option value="parceiro">Parceiro</option>
                <option value="fornecedor">Fornecedor</option>
            </select>
        </div>
    </div>

    <!-- List Card -->
    <div class="card">
        <div class="card-header" style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-xs); border-bottom: none;">
            <h2 class="card-title" style="font-size: 1.25rem;">Lista de Clientes e Parceiros</h2>
            <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Visualize e gerencie seus cadastros.</div>
        </div>
    
        ${de.length===0?`<div class="empty-state"><div class="empty-state-icon">${E("users","w-12 h-12")}</div>Nenhum cliente cadastrado</div>`:`<div class="table-container" style="margin-top: var(--spacing-md);">
        <table class="table" id="clientes-table">
            <thead>
            <tr>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Nome Fantasia/Nome</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Tipo</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Entidade</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Email</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Telefone</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Ações</th>
            </tr>
            </thead>
            <tbody>
            ${de.map(ft).join("")}
            </tbody>
        </table>
        </div>`}
    </div>

    <!-- Modal Layout Updated -->
    <div class="modal-overlay" id="cliente-modal">
        <div class="modal" style="max-width: 600px; width: 95%;">
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title">Novo Cadastro</h3>
                <button class="modal-close" id="close-modal">&times;</button>
            </div>
            <form id="cliente-form">
                <div class="modal-body">
                    <input type="hidden" id="cliente-id">
                    
                    <!-- Top Type Selector -->
                    <div class="form-group">
                        <label class="form-label" style="font-weight: 600;">Pessoa Física ou Jurídica?</label>
                        <select class="form-input form-select" id="tipo-pessoa" required>
                            <option value="pf">Pessoa Física</option>
                            <option value="pj">Pessoa Jurídica</option>
                        </select>
                    </div>

                    <!-- Accordion 1: Dados Básicos -->
                    <details open style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            <span id="label-dados-basicos">1. Dados Pessoais</span>
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md);">
                            <!-- PF Fields -->
                            <div id="fields-pf">
                                <div class="form-group">
                                    <label class="form-label">Nome Completo *</label>
                                    <input type="text" class="form-input" id="nome_pf">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CPF *</label>
                                    <input type="text" class="form-input" id="cpf" placeholder="000.000.000-00">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Sexo</label>
                                    <select class="form-input form-select" id="sexo">
                                        <option value="">Selecione...</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Data de Nascimento</label>
                                    <input type="date" class="form-input" id="data_nascimento">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Profissão</label>
                                    <input type="text" class="form-input" id="profissao">
                                </div>
                            </div>

                            <!-- PJ Fields -->
                            <div id="fields-pj" style="display: none;">
                                <div class="form-group">
                                    <label class="form-label">Razão Social *</label>
                                    <input type="text" class="form-input" id="razao_social">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nome Fantasia *</label>
                                    <input type="text" class="form-input" id="nome_fantasia">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CNPJ *</label>
                                    <input type="text" class="form-input" id="cnpj" placeholder="00.000.000/0000-00">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Inscrição Estadual/Municipal</label>
                                    <input type="text" class="form-input" id="inscricao_estadual">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Ramo de Atividade</label>
                                    <input type="text" class="form-input" id="ramo_atividade">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Porte da Empresa</label>
                                    <select class="form-input form-select" id="porte_empresa">
                                        <option value="">Selecione...</option>
                                        <option value="mei">MEI</option>
                                        <option value="me">ME</option>
                                        <option value="epp">EPP</option>
                                        <option value="empresa_medio_porte">Médio Porte</option>
                                        <option value="grande_empresa">Grande Empresa</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nº de Funcionários</label>
                                    <input type="number" class="form-input" id="num_funcionarios">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Faturamento Anual (R$)</label>
                                    <input type="text" class="form-input" id="faturamento_anual">
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- Accordion 2: Contato e Endereço -->
                    <details style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            2. Dados de Contato e Endereço
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md); display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" id="email">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Telefone</label>
                                <input type="tel" class="form-input" id="telefone">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Endereço</label>
                                <input type="text" class="form-input" id="endereco">
                            </div>
                        </div>
                    </details>

                    <!-- Accordion 3: Informações Comerciais -->
                    <details style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            3. Informações Comerciais
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md);">
                            <div class="form-group">
                                <label class="form-label">Setor</label>
                                <input type="text" class="form-input" id="setor" placeholder="Ex: Tecnologia, Varejo...">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Status do Cliente</label>
                                <select class="form-input form-select" id="status">
                                    <option value="potencial">Potencial</option>
                                    <option value="em_negociacao">Em Negociação</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-top: var(--spacing-md);">
                                <label class="form-label">Observações</label>
                                <textarea class="form-input" id="observacoes" rows="3"></textarea>
                            </div>
                        </div>
                    </details>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Adicionar</button>
                </div>
            </form>
        </div>
    </div>
    `,ht(e)}function ft(e){const t=e.documento_tipo==="cnpj"?"P. Jurídica":"P. Física";return`
    <tr data-id="${e.id}" style="border-bottom: 1px solid var(--color-border);">
        <td style="font-weight: 600; color: var(--color-text);">${e.nome}</td>
        <td><span style="background: rgba(59, 130, 246, 0.1); color: var(--color-info); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">Cliente</span></td>
        <td>${t}</td>
        <td style="color: var(--color-text-secondary);">${e.email||"-"}</td>
        <td style="color: var(--color-text-secondary);">${e.telefone||"-"}</td>
        <td>
            <div style="display: flex; gap: var(--spacing-sm);">
                <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}" title="Editar" style="padding: 6px; background: transparent; border: 1px solid var(--color-border);">${E("edit","w-4 h-4")}</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}" title="Excluir" style="padding: 6px; background: transparent; border: 1px solid var(--color-danger); color: var(--color-danger);">${E("trash","w-4 h-4")}</button>
            </div>
        </td>
    </tr>
    `}function ht(e){var y,u;const t=document.getElementById("cliente-modal"),a=document.getElementById("cliente-form"),r=document.getElementById("new-cadastro-select");r==null||r.addEventListener("change",()=>{if(r.value){h();const n=document.getElementById("tipo-pessoa");n.value="pf",n.dispatchEvent(new Event("change")),t.classList.add("active"),r.value=""}});const o=document.getElementById("tipo-pessoa"),i=document.getElementById("fields-pf"),s=document.getElementById("fields-pj"),f=document.getElementById("label-dados-basicos");o==null||o.addEventListener("change",()=>{o.value==="pf"?(i.style.display="block",s.style.display="none",f.textContent="1. Dados Pessoais",b("nome_pf",!0),b("cpf",!0),b("razao_social",!1),b("nome_fantasia",!1),b("cnpj",!1)):(i.style.display="none",s.style.display="block",f.textContent="1. Dados Básicos da Empresa",b("nome_pf",!1),b("cpf",!1),b("razao_social",!0),b("nome_fantasia",!0),b("cnpj",!0))});function b(n,w){const l=document.getElementById(n);l&&(w?l.setAttribute("required","true"):l.removeAttribute("required"))}(y=document.getElementById("close-modal"))==null||y.addEventListener("click",()=>t.classList.remove("active")),(u=document.getElementById("cancel-btn"))==null||u.addEventListener("click",()=>t.classList.remove("active")),t.addEventListener("click",n=>{n.target===t&&t.classList.remove("active")}),document.querySelectorAll(".edit-btn").forEach(n=>{n.addEventListener("click",()=>{const w=n.dataset.id,l=de.find(p=>p.id===w);if(l){h(),document.getElementById("cliente-id").value=l.id,document.getElementById("modal-title").textContent="Editar Cadastro";const p=l.documento_tipo==="cnpj",x=document.getElementById("tipo-pessoa");x.value=p?"pj":"pf",x.dispatchEvent(new Event("change")),p?(document.getElementById("nome_fantasia").value=l.nome,document.getElementById("cnpj").value=l.documento,document.getElementById("inscricao_estadual").value=l.inscricao_estadual||"",document.getElementById("razao_social").value=l.razao_social||""):(document.getElementById("nome_pf").value=l.nome,document.getElementById("cpf").value=l.documento),document.getElementById("email").value=l.email||"",document.getElementById("telefone").value=l.telefone||"",document.getElementById("endereco").value=l.endereco||"",document.getElementById("setor").value=l.setor||"",document.getElementById("status").value=l.status||"potencial",document.getElementById("observacoes").value=l.observacoes||"",t.classList.add("active")}})}),document.querySelectorAll(".delete-btn").forEach(n=>{n.addEventListener("click",async()=>{const w=n.dataset.id;if(confirm("Tem certeza que deseja excluir este cadastro?"))try{await T.delete(w),v("Cadastro excluído com sucesso","success"),ve(e)}catch(l){v(l.message||"Erro ao excluir","error")}})}),a.addEventListener("submit",async n=>{n.preventDefault();const w=document.getElementById("cliente-id").value,p=document.getElementById("tipo-pessoa").value==="pf",x={nome:p?document.getElementById("nome_pf").value:document.getElementById("nome_fantasia").value,documento:p?document.getElementById("cpf").value:document.getElementById("cnpj").value,documento_tipo:p?"cpf":"cnpj",email:document.getElementById("email").value||void 0,telefone:document.getElementById("telefone").value||void 0,endereco:document.getElementById("endereco").value||void 0,setor:document.getElementById("setor").value||void 0,status:document.getElementById("status").value,observacoes:document.getElementById("observacoes").value||void 0},_={};if(p?(_.sexo=document.getElementById("sexo").value,_.data_nascimento=document.getElementById("data_nascimento").value,_.profissao=document.getElementById("profissao").value):(_.razao_social=document.getElementById("razao_social").value,_.inscricao_estadual=document.getElementById("inscricao_estadual").value,_.ramo_atividade=document.getElementById("ramo_atividade").value,_.porte_empresa=document.getElementById("porte_empresa").value,_.num_funcionarios=document.getElementById("num_funcionarios").value,_.faturamento_anual=document.getElementById("faturamento_anual").value),Object.keys(_).forEach($=>!_[$]&&delete _[$]),Object.assign(x,_),Object.keys(_).length>0){const $=Object.entries(_).map(([C,z])=>`${C.replace(/_/g," ").toUpperCase()}: ${z}`).join(`
`);x.observacoes=x.observacoes?`${x.observacoes}

[DADOS ADICIONAIS]
${$}`:`[DADOS ADICIONAIS]
${$}`}try{w?(await T.update(w,x),v("Atualizado com sucesso","success")):(await T.create(x),v("Criado com sucesso","success")),t.classList.remove("active"),ve(e)}catch($){v($.message||"Erro ao salvar","error")}});function h(){a.reset(),document.querySelectorAll("details").forEach(n=>n.open=!1),document.querySelector("details").open=!0}}let A=[],$e=[],F=null;async function xt(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{[A,$e]=await Promise.all([ie.list(),T.list()]),Et(e)}catch(t){e.innerHTML='<div class="empty-state">Erro ao carregar projetos</div>',console.error(t)}}function Et(e){e.innerHTML=`
    <style>
        .projects-layout {
            display: grid;
            grid-template-columns: 420px 1fr; /* Aumentado para dar mais respiro aos inputs duplos */
            gap: 2rem;
            align-items: start;
        }
        @media (max-width: 900px) {
            .projects-layout {
                grid-template-columns: 1fr;
            }
        }
        .form-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 2rem; /* Mais padding interno */
            position: sticky;
            top: 1rem;
        }
        .list-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 1.5rem;
        }
        .form-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--color-text);
        }
        .form-subtitle {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        /* Alinhamento do Form */
        #projeto-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem; /* Gap consistente entre form-groups */
        }
        .form-group {
            margin-bottom: 0; /* Zerar margin inferior padrão para usar gap do flex pai */
        }
        .form-input, .form-select {
            width: 100%;
            background: var(--color-bg);
            border-color: var(--color-border);
        }
        textarea.form-input {
            resize: vertical;
            min-height: 80px;
        }
        /* Date Grid Alignment */
        .date-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            width: 100%;
        }
        .radio-group {
            display: flex;
            gap: 1.5rem;
            margin-top: 0.5rem;
        }
        .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
        }
        .radio-label input[type="radio"] {
            accent-color: var(--color-primary);
            width: 1.2rem;
            height: 1.2rem;
        }
    </style>

    <div class="page-header">
      <h1 class="page-title">Projetos</h1>
    </div>

    <div class="projects-layout">
        <!-- LEFT COLUMN: FORM -->
        <div class="form-card">
            <h2 class="form-title" id="form-title">Cadastrar Projeto</h2>
            <p class="form-subtitle">Preencha os dados para adicionar um novo projeto.</p>
            
            <form id="projeto-form">
                <input type="hidden" id="projeto-id">
                
                <div class="form-group">
                    <label class="form-label">Nome do Projeto</label>
                    <input type="text" class="form-input" id="nome" required placeholder="Ex: Novo App de Vendas">
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de Entidade</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="entity_type" value="cliente" checked> Cliente
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="entity_type" value="parceiro"> Parceiro
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Cliente / Parceiro</label>
                    <select class="form-input form-select" id="cliente_id" required>
                        <option value="">Selecione...</option>
                        ${ge()}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-input" id="descricao" rows="3" placeholder="Descreva o escopo principal do projeto..."></textarea>
                </div>

                <div class="date-row">
                    <div class="form-group">
                        <label class="form-label">Data de Início</label>
                        <input type="date" class="form-input" id="prazo_inicio">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Previsão de Término</label>
                        <input type="date" class="form-input" id="prazo_final">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-input form-select" id="status">
                        <option value="planejamento">Planejamento</option>
                        <option value="em_execucao">Em Execução</option>
                        <option value="pausado">Pausado</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" id="save-btn" style="width: 100%;">Adicionar Projeto</button>
                    <button type="button" class="btn btn-secondary" id="cancel-btn" style="width: 100%; display: none;">Cancelar Edição</button>
                </div>
            </form>
        </div>

        <!-- RIGHT COLUMN: LIST -->
        <div class="list-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                     <h2 class="form-title" style="margin:0; display:flex; align-items:center; gap:8px;">${E("folder")} Lista de Projetos</h2>
                     <p class="form-subtitle" style="margin:0;">Gerencie seus projetos e acompanhe prazos.</p>
                </div>
            </div>

            <div id="projects-list-container">
                ${be()}
            </div>
        </div>
    </div>
    `,_t(e)}function ge(){return $e.map(e=>`<option value="${e.id}">${e.nome}</option>`).join("")}function be(){return A.length===0?`<div class="empty-state"><div class="empty-state-icon">${E("folder-open","w-12 h-12")}</div>Nenhum projeto cadastrado ainda.</div>`:`
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Cliente/Parceiro</th>
                <th>Data de Início</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${A.map(e=>{const t=$e.find(a=>a.id===e.cliente_id);return`
                    <tr>
                        <td><strong>${e.nome}</strong></td>
                        <td>${(t==null?void 0:t.nome)||"-"}</td>
                        <td>${e.prazo_inicio?ee(e.prazo_inicio):"-"}</td>
                        <td><span class="badge ${Be(e.status)}">${Le(e.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}" title="Editar">${E("edit","w-4 h-4")}</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}" title="Excluir">${E("trash","w-4 h-4")}</button>
                            </div>
                        </td>
                    </tr>
                  `}).join("")}
            </tbody>
          </table>
        </div>
    `}function _t(e){const t=document.getElementById("projeto-form"),a=document.getElementById("save-btn"),r=document.getElementById("cancel-btn"),o=document.getElementById("form-title"),i=document.getElementById("cliente_id");document.querySelectorAll('input[name="entity_type"]').forEach(s=>{s.addEventListener("change",f=>{f.target.value==="cliente"?(i.innerHTML='<option value="">Selecione...</option>'+ge(),i.disabled=!1):(i.innerHTML='<option value="placeholder">Parceiro Exemplo (Mock)</option>',i.disabled=!0)})}),e.addEventListener("click",s=>{var h,y;const b=s.target.closest(".edit-btn");if(b){const u=b.dataset.id,n=A.find(w=>w.id===u);n&&(F=u,document.getElementById("projeto-id").value=n.id,document.getElementById("nome").value=n.nome,document.querySelector('input[name="entity_type"][value="cliente"]').checked=!0,i.innerHTML='<option value="">Selecione...</option>'+ge(),i.value=n.cliente_id,document.getElementById("descricao").value=n.descricao||"",document.getElementById("prazo_inicio").value=((h=n.prazo_inicio)==null?void 0:h.split("T")[0])||"",document.getElementById("prazo_final").value=((y=n.prazo_final)==null?void 0:y.split("T")[0])||"",document.getElementById("status").value=n.status,o.textContent="Editar Projeto",a.textContent="Atualizar Projeto",r.style.display="block",window.scrollTo({top:0,behavior:"smooth"}))}}),e.addEventListener("click",async s=>{const b=s.target.closest(".delete-btn");if(b&&confirm("Tem certeza que deseja excluir este projeto?")){const h=b.dataset.id;try{await ie.delete(h),v("Projeto excluído","success"),A=A.filter(y=>y.id!==h),document.getElementById("projects-list-container").innerHTML=be()}catch{v("Erro ao excluir projeto","error")}}}),r.addEventListener("click",()=>{Ce(t,a,r,o)}),t.addEventListener("submit",async s=>{if(s.preventDefault(),document.querySelector('input[name="entity_type"]:checked').value==="parceiro"){v("Cadastro de parcerias estará disponível em breve.","warning");return}const b={nome:document.getElementById("nome").value,cliente_id:document.getElementById("cliente_id").value,descricao:document.getElementById("descricao").value||void 0,prazo_inicio:document.getElementById("prazo_inicio").value||void 0,prazo_final:document.getElementById("prazo_final").value||void 0,status:document.getElementById("status").value};a.disabled=!0,a.textContent="Salvando...";try{if(F){const h=await ie.update(F,b);v("Projeto atualizado!","success");const y=A.findIndex(u=>u.id===F);y!==-1&&(A[y]=h)}else{const h=await ie.create(b);v("Projeto criado!","success"),A.push(h)}document.getElementById("projects-list-container").innerHTML=be(),Ce(t,a,r,o)}catch(h){v(h.message||"Erro ao salvar","error")}finally{a.disabled=!1,a.textContent=F?"Atualizar Projeto":"Adicionar Projeto"}})}function Ce(e,t,a,r){F=null,e.reset(),r.textContent="Cadastrar Projeto",t.textContent="Adicionar Projeto",a.style.display="none";const o=document.querySelector('input[name="entity_type"][value="cliente"]');o&&(o.checked=!0,o.dispatchEvent(new Event("change")))}let ce=[],ae=[],se=[];async function ye(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{[ce,ae,se]=await Promise.all([ne.list(),T.list(),V.list()]),se||(se=[]),wt(e)}catch(t){console.error("Erro ao carregar dados:",t),e.innerHTML='<div class="empty-state">Erro ao carregar dados. Tente novamente.</div>'}}function wt(e){e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Contratos</h1>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
        <button class="tab-btn active" data-tab="lista" style="padding: 10px 20px; margin-right: 5px; border: none; background: none; border-bottom: 2px solid var(--primary-color); font-weight: bold; cursor: pointer;">Lista de Contratos</button>
        <button class="tab-btn" data-tab="gerador" style="padding: 10px 20px; border: none; background: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer;">Gerador de Contratos</button>
    </div>

    <!-- TABS CONTENT -->
    <div id="tab-content-lista" class="tab-content">
        <!-- Conteúdo Lista (Original) -->
        <div class="card">
            <div class="card-header" style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Contratos Vigentes</h3>
                <button class="btn btn-primary" id="add-contrato-btn">+ Novo Contrato Manual</button>
            </div>
            ${$t()}
        </div>
    </div>

    <div id="tab-content-gerador" class="tab-content" style="display: none;">
        <!-- Conteúdo Gerador (Novo) -->
        <div class="card" style="padding: 2rem;">
            <h2 style="margin-top: 0;">Gerador de Contratos</h2>
            <p style="color: #666; margin-bottom: 2rem;">Selecione um cliente ou parceiro e um orçamento para gerar o contrato.</p>

            <form id="gerador-contrato-form">
                <div style="display: flex; gap: 2rem; margin-bottom: 2rem; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" id="tipo_cliente" name="tipo_entidade" value="cliente" checked>
                        <label for="tipo_cliente" style="cursor: pointer; font-weight: 500;">Cliente</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" id="tipo_parceiro" name="tipo_entidade" value="parceiro">
                        <label for="tipo_parceiro" style="cursor: pointer; font-weight: 500;">Parceiro</label>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                    <div style="flex: 1;">
                        <select class="form-input form-select" id="gerador_entidade_id" required style="width: 100%; padding: 0.75rem;">
                            <option value="">Selecione o Cliente...</option>
                            ${ae.map(t=>`<option value="${t.id}">${t.nome}</option>`).join("")}
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <select class="form-input form-select" id="gerador_orcamento_id" required style="width: 100%; padding: 0.75rem;">
                            <option value="">Selecione um orçamento...</option>
                            ${se.map(t=>`<option value="${t.id}">${t.titulo} [${t.status.toUpperCase()}] (${I(t.valor_total)})</option>`).join("")}
                        </select>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button type="button" id="btn-gerar-preview" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                        Gerar Minuta de Contrato
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Manual (Mantido) -->
    <div class="modal-overlay" id="contrato-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Novo Contrato</h3>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <form id="contrato-form">
          <div class="modal-body">
            <input type="hidden" id="contrato-id">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Número *</label>
                <input type="text" class="form-input" id="numero" required>
              </div>
              <div class="form-group">
                <label class="form-label">Valor *</label>
                <input type="number" step="0.01" class="form-input" id="valor" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cliente *</label>
              <select class="form-input form-select" id="cliente_id" required>
                <option value="">Selecione...</option>
                ${ae.map(t=>`<option value="${t.id}">${t.nome}</option>`).join("")}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Data Início *</label>
                <input type="date" class="form-input" id="data_inicio" required>
              </div>
              <div class="form-group">
                <label class="form-label">Data Término *</label>
                <input type="date" class="form-input" id="data_termino" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Condições</label>
              <textarea class="form-input" id="condicoes" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    `,Ct(),St(e)}function $t(){return ce.length===0?'<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum contrato cadastrado</div>':`
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Início</th>
            <th>Término</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${ce.map(It).join("")}
        </tbody>
      </table>
    </div>`}function It(e){const t=ae.find(s=>s.id===e.cliente_id),a=new Date,r=new Date(e.data_termino),o=Math.ceil((r.getTime()-a.getTime())/(1e3*60*60*24));let i="badge-success";return o<=0?i="badge-danger":o<=30&&(i="badge-warning"),`
    <tr>
      <td><strong>${e.numero}</strong></td>
      <td>${(t==null?void 0:t.nome)||"-"}</td>
      <td>${I(e.valor)}</td>
      <td>${ee(e.data_inicio)}</td>
      <td>
        ${ee(e.data_termino)}
        <span class="badge ${i}" style="margin-left: 0.5rem;">
          ${o<=0?"Vencido":o+" dias"}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}">Excluir</button>
      </td>
    </tr>
  `}function Ct(){const e=document.querySelectorAll(".tab-btn"),t=document.querySelectorAll(".tab-content");e.forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.tab;e.forEach(o=>{o.style.borderBottom="2px solid transparent",o.style.color="#666",o.classList.remove("active")}),a.style.borderBottom="2px solid var(--primary-color)",a.style.color="inherit",a.classList.add("active"),t.forEach(o=>{o.style.display="none"}),document.getElementById(`tab-content-${r}`).style.display="block"})})}function St(e){var s,f,b,h;const t=document.getElementById("contrato-modal"),a=document.getElementById("contrato-form");(s=document.getElementById("add-contrato-btn"))==null||s.addEventListener("click",()=>{a.reset(),document.getElementById("contrato-id").value="",document.getElementById("modal-title").textContent="Novo Contrato",t.classList.add("active")});const r=()=>t.classList.remove("active");(f=document.getElementById("close-modal"))==null||f.addEventListener("click",r),(b=document.getElementById("cancel-btn"))==null||b.addEventListener("click",r),document.querySelectorAll(".edit-btn").forEach(y=>{y.addEventListener("click",()=>{const u=y.dataset.id,n=ce.find(w=>w.id===u);n&&(document.getElementById("contrato-id").value=n.id,document.getElementById("numero").value=n.numero,document.getElementById("cliente_id").value=n.cliente_id,document.getElementById("valor").value=n.valor.toString(),document.getElementById("data_inicio").value=n.data_inicio.split("T")[0],document.getElementById("data_termino").value=n.data_termino.split("T")[0],document.getElementById("condicoes").value=n.condicoes||"",document.getElementById("modal-title").textContent="Editar Contrato",t.classList.add("active"))})}),document.querySelectorAll(".delete-btn").forEach(y=>{y.addEventListener("click",async()=>{const u=y.dataset.id;if(confirm("Tem certeza?"))try{await ne.delete(u),v("Contrato excluído","success"),ye(e)}catch(n){v(n.message,"error")}})}),a.addEventListener("submit",async y=>{y.preventDefault();const u=document.getElementById("contrato-id").value,n={numero:document.getElementById("numero").value,cliente_id:document.getElementById("cliente_id").value,valor:parseFloat(document.getElementById("valor").value),data_inicio:document.getElementById("data_inicio").value,data_termino:document.getElementById("data_termino").value,condicoes:document.getElementById("condicoes").value||void 0};try{u?(await ne.update(u,n),v("Contrato atualizado","success")):(await ne.create(n),v("Contrato criado","success")),t.classList.remove("active"),ye(e)}catch(w){v(w.message,"error")}});const o=document.querySelectorAll('input[name="tipo_entidade"]'),i=document.getElementById("gerador_entidade_id");o.forEach(y=>{y.addEventListener("change",u=>{u.target.value==="cliente"?i.innerHTML='<option value="">Selecione o Cliente...</option>'+ae.map(w=>`<option value="${w.id}">${w.nome}</option>`).join(""):i.innerHTML='<option value="">Selecione o Parceiro...</option><option value="p1">Parceiro Exemplo Ltda</option>'})}),(h=document.getElementById("btn-gerar-preview"))==null||h.addEventListener("click",()=>{v("Funcionalidade de geração em desenvolvimento","info")})}let Q=[],Ie=[],W=null,Z=null;async function fe(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const[t,a,r]=await Promise.all([J.list(),T.list(),J.fluxoCaixa(6).catch(()=>null)]);Q=t,Ie=a,Z=r,Bt(e)}catch(t){e.innerHTML='<div class="empty-state">Erro ao carregar dados financeiros</div>',console.error(t)}}function Bt(e){e.innerHTML=`
    <style>
        .finance-layout {
            display: grid;
            grid-template-columns: 400px 1fr;
            gap: 2rem;
            align-items: start;
        }
        @media (max-width: 1024px) {
            .finance-layout {
                grid-template-columns: 1fr;
            }
        }
        
        /* Left Column: Form */
        .form-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 2rem;
            position: sticky;
            top: 1rem;
            box-shadow: var(--shadow-md);
        }
        
        /* Right Column: Dashboard & List */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .kpi-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .kpi-label { font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 500; }
        .kpi-value { font-size: 2rem; font-weight: 700; color: var(--color-text); line-height: 1.2; }
        .kpi-sub  { font-size: 0.75rem; color: var(--color-text-muted); }

        .chart-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        /* Form Styling */
        .form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text); }
        .form-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 2rem; }
        
        #financeiro-form { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .form-input, .form-select {
            width: 100%;
            background: var(--color-bg);
            border-color: var(--color-border);
            padding: 0.75rem;
            border-radius: 8px;
        }
        
         /* Type Toggle (Segmented Control) */
        .type-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: var(--color-bg);
            padding: 4px;
            border-radius: 8px;
            border: 1px solid var(--color-border);
            gap: 4px;
        }
        .type-option {
            text-align: center;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s;
            color: var(--color-text-secondary);
            border: 1px solid transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .type-option:hover { background: var(--color-bg-tertiary); }
        
        input[name="tipo_movimento"]:checked + .type-option[data-value="recebimento"] {
            background: rgba(16, 185, 129, 0.15);
            color: var(--color-success);
            border-color: rgba(16, 185, 129, 0.3);
        }
        input[name="tipo_movimento"]:checked + .type-option[data-value="pagamento"] {
            background: rgba(239, 68, 68, 0.15);
            color: var(--color-danger);
            border-color: rgba(239, 68, 68, 0.3);
        }
        input[name="tipo_movimento"] { display: none; }

        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* CSS Chart & Tooltips */
        .simple-chart {
            display: flex;
            align-items: flex-end;
            gap: 2rem;
            height: 200px;
            padding-top: 2rem;
            border-bottom: 1px solid var(--color-border);
            position: relative;
            /* Guide Lines (Grid) */
            background: repeating-linear-gradient(
                0deg,
                var(--color-border) 0px,
                var(--color-border) 1px,
                transparent 1px,
                transparent 50px
            );
        }
        
        .chart-bar-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            height: 100%;
            justify-content: flex-end;
            position: relative; /* Context for tooltip */
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .chart-bar-group:hover {
            transform: translateY(-5px);
        }
        
        /* Tooltip Container */
        .chart-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(17, 24, 39, 0.95);
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.75rem;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s, transform 0.2s;
            margin-bottom: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: center;
        }
        
        .tooltip-row { display: flex; align-items: center; gap: 6px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        
        .chart-bar-group:hover .chart-tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
        }

        .bar-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
            height: 100%; /* Important for internal bar scaling */
            width: 60%;
        }
        .bar {
            width: 100%;
            border-radius: 4px 4px 0 0;
            transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy effect */
            min-height: 4px;
            position: relative;
        }
        .bar-rec { background: linear-gradient(180deg, var(--color-success) 0%, rgba(16, 185, 129, 0.6) 100%); }
        .bar-pag { background: linear-gradient(180deg, var(--color-danger) 0%, rgba(239, 68, 68, 0.6) 100%); }
        
        .chart-label { font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary); margin-top: 8px; }

    </style>
    <div class="page-header">
      <h1 class="page-title">Gestão Financeira</h1>
    </div>

    <div class="finance-layout">
        <!-- LEFT: FORM -->
        <div class="form-card">
            <h2 class="form-title" id="form-title">Novo Lançamento</h2>
            <p class="form-subtitle">Registre receitas e despesas para manter o controle.</p>
            
            <form id="financeiro-form">
                <input type="hidden" id="movimento-id">
                
                <div class="form-group">
                    <label class="form-label">Tipo de Lançamento</label>
                    <div class="type-toggle">
                        <label>
                            <input type="radio" name="tipo_movimento" value="recebimento" checked>
                            <div class="type-option" data-value="recebimento">${E("arrow-down","w-4 h-4")} Receita</div>
                        </label>
                        <label>
                            <input type="radio" name="tipo_movimento" value="pagamento">
                            <div class="type-option" data-value="pagamento">${E("arrow-up","w-4 h-4")} Despesa</div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <input type="text" class="form-input" id="descricao" required placeholder="Ex: Pagamento de Fornecedor">
                </div>

                <div class="form-group">
                    <label class="form-label">Valor (R$)</label>
                    <input type="number" step="0.01" class="form-input" id="valor" required placeholder="0,00" style="font-size: 1.2rem; font-weight: 600;">
                </div>

                <div class="date-row">
                    <div class="form-group">
                        <label class="form-label">Vencimento</label>
                        <input type="date" class="form-input" id="data_vencimento" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pagamento</label>
                        <input type="date" class="form-input" id="data_pagamento">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Cliente / Parceiro (Opcional)</label>
                    <select class="form-input form-select" id="cliente_id">
                        <option value="">Selecione...</option>
                        ${Ie.map(t=>`<option value="${t.id}">${t.nome}</option>`).join("")}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-input form-select" id="status">
                        <option value="pendente">Pendente - Aguardando</option>
                        <option value="pago">Confirmado / Pago</option>
                        <option value="atrasado">Atrasado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" id="save-btn" style="width: 100%; padding: 0.8rem;">Salvar Lançamento</button>
                    <button type="button" class="btn btn-secondary" id="cancel-btn" style="width: 100%; display: none;">Cancelar Edição</button>
                </div>
            </form>
        </div>

        <!-- RIGHT: DASHBOARD & LIST -->
        <div style="display: flex; flex-direction: column;">
            
            <!-- KPI CARDS -->
            ${Z?Lt(Z):""}
            
            <!-- CHART AREA (Visual Placeholder for logic) -->
            ${Z?kt(Z):""}

            <!-- LIST -->
            <div class="list-card" style="background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 600;">Últimas Movimentações</h3>
                    <div style="display: flex; gap: 0.5rem;">
                       <select class="form-input form-select" id="filter-type" style="width: auto; padding: 6px 30px 6px 12px; font-size: 0.85rem;">
                           <option value="">Todos os Tipos</option>
                           <option value="recebimento">Receitas</option>
                           <option value="pagamento">Despesas</option>
                       </select>
                    </div>
                </div>
                
                <div id="finance-list-container">
                    ${ze(Q)}
                </div>
            </div>
        </div>
    </div>
    `,Tt(e)}function Lt(e){return`
    <div class="dashboard-grid">
        <div class="kpi-card">
            <span class="kpi-label">Receita Realizada</span>
            <span class="kpi-value" style="color: var(--color-success);">${I(e.total_recebimentos)}</span>
            <span class="kpi-sub">Total recebido no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Despesas Realizadas</span>
            <span class="kpi-value" style="color: var(--color-danger);">${I(e.total_pagamentos)}</span>
             <span class="kpi-sub">Total pago no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Saldo Líquido</span>
            <span class="kpi-value" style="color: ${e.saldo_total>=0?"var(--color-primary-light)":"var(--color-danger)"};">
                ${I(e.saldo_total)}
            </span>
             <span class="kpi-sub">Reserva acumulada</span>
        </div>
    </div>`}function kt(e){const t=Math.max(e.total_recebimentos,e.total_pagamentos,1),a=Math.round(e.total_recebimentos/t*100),r=Math.round(e.total_pagamentos/t*100);return`
    <div class="chart-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <div>
                 <h3 style="font-size: 1rem; font-weight: 600;">Balanço Visual</h3>
                 <p style="font-size: 0.85rem; color: var(--color-text-muted);">Comparativo dinâmico</p>
            </div>
            <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--color-text-secondary);">
                <div style="display:flex; align-items:center; gap:4px;"><div style="width:10px; height:10px; background:var(--color-success); border-radius:2px;"></div> Receitas</div>
                <div style="display:flex; align-items:center; gap:4px;"><div style="width:10px; height:10px; background:var(--color-danger); border-radius:2px;"></div> Despesas</div>
            </div>
        </div>
        
        <div class="simple-chart">
            <div class="chart-bar-group">
                <!-- Tooltip -->
                <div class="chart-tooltip">
                    <span style="font-weight:600; font-size: 0.9rem; margin-bottom:4px; display:block;">Este Mês</span>
                    <div class="tooltip-row">
                        <div class="dot" style="background: var(--color-success)"></div>
                        <span>Receitas: ${I(e.total_recebimentos)}</span>
                    </div>
                    <div class="tooltip-row">
                        <div class="dot" style="background: var(--color-danger)"></div>
                        <span>Despesas: ${I(e.total_pagamentos)}</span>
                    </div>
                     <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px; font-weight:600; color: ${e.saldo_total>=0?"#34d399":"#f87171"}">
                        Saldo: ${I(e.saldo_total)}
                    </div>
                </div>

                <div class="bar-container">
                    <div class="bar bar-rec" style="height: ${a}%;"></div>
                    <div class="bar bar-pag" style="height: ${r}%;"></div>
                </div>
                <span class="chart-label">Total do Período</span>
            </div>
        </div>
    </div>
    `}function ze(e){return e.length===0?'<div class="empty-state">Nenhuma movimentação encontrada.</div>':`
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Movimento</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${e.map(t=>{var a;return`
                    <tr>
                        <td>
                            <div style="font-weight: 600;">${t.descricao||"Sem descrição"}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${t.cliente_id?((a=Ie.find(r=>r.id===t.cliente_id))==null?void 0:a.nome)||"Cliente":"Diversos"}</div>
                        </td>
                        <td style="font-weight: 600; color: ${t.tipo==="recebimento"?"var(--color-success)":"var(--color-danger)"};">
                            ${t.tipo==="recebimento"?"+":"-"} ${I(t.valor)}
                        </td>
                        <td>${ee(t.data_vencimento)}</td>
                        <td><span class="badge ${Be(t.status)}">${Le(t.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${t.id}" title="Editar">${E("edit","w-4 h-4")}</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}" title="Excluir">${E("trash","w-4 h-4")}</button>
                            </div>
                        </td>
                    </tr>
                `}).join("")}
            </tbody>
        </table>
    </div>`}function Tt(e){var i;const t=document.getElementById("financeiro-form"),a=document.getElementById("save-btn"),r=document.getElementById("cancel-btn"),o=document.getElementById("form-title");(i=document.getElementById("filter-type"))==null||i.addEventListener("change",async s=>{const f=s.target.value,b=f?Q.filter(h=>h.tipo===f):Q;document.getElementById("finance-list-container").innerHTML=ze(b)}),e.addEventListener("click",s=>{const f=s.target,b=f.closest(".edit-btn"),h=f.closest(".delete-btn");if(b){const y=b.dataset.id,u=Q.find(n=>n.id===y);if(u){W=y,document.getElementById("movimento-id").value=u.id,document.getElementById("descricao").value=u.descricao||"",document.getElementById("valor").value=u.valor.toString(),document.getElementById("data_vencimento").value=u.data_vencimento.split("T")[0],u.data_pagamento&&(document.getElementById("data_pagamento").value=u.data_pagamento.split("T")[0]),document.getElementById("cliente_id").value=u.cliente_id||"",document.getElementById("status").value=u.status;const n=document.querySelector(`input[name="tipo_movimento"][value="${u.tipo}"]`);n&&(n.checked=!0),o.textContent="Editar Lançamento",a.textContent="Atualizar Lançamento",r.style.display="block",window.scrollTo({top:0,behavior:"smooth"})}}if(h&&confirm("Tem certeza que deseja excluir?")){const y=h.dataset.id;J.delete(y).then(()=>{v("Excluído com sucesso","success"),fe(e)}).catch(()=>v("Erro ao excluir","error"))}}),r.addEventListener("click",()=>{Mt(t,a,r,o)}),t.addEventListener("submit",async s=>{s.preventDefault();const f=document.getElementById("status").value;let b=document.getElementById("data_pagamento").value;const h=document.getElementById("data_vencimento").value;f==="pago"&&!b&&(b=h);const y={tipo:document.querySelector('input[name="tipo_movimento"]:checked').value,descricao:document.getElementById("descricao").value,valor:parseFloat(document.getElementById("valor").value),data_vencimento:h,data_pagamento:b||void 0,cliente_id:document.getElementById("cliente_id").value||void 0,status:f},u=a.textContent;a.disabled=!0,a.textContent="Salvando...";try{W?(await J.update(W,y),v("Atualizado com sucesso!","success")):(await J.create(y),v("Lançamento criado!","success")),W=null,fe(e)}catch(n){v(n.message||"Erro ao salvar","error"),a.disabled=!1,a.textContent=u}})}function Mt(e,t,a,r){W=null,e.reset(),document.querySelector('input[name="tipo_movimento"][value="recebimento"]').checked=!0,r.textContent="Novo Lançamento",t.textContent="Salvar Lançamento",t.disabled=!1,a.style.display="none"}const je=[{id:"potencial",label:"Potencial",color:"#64748b"},{id:"contato",label:"Contato Realizado",color:"#3b82f6"},{id:"demonstracao",label:"Demonstração",color:"#8b5cf6"},{id:"orcamento",label:"Orçamento",color:"#eab308"},{id:"negociacao",label:"Negociação",color:"#f97316"},{id:"assinatura",label:"Assinatura",color:"#06b6d4"},{id:"fechado",label:"Fechado",color:"#22c55e"},{id:"encerrado",label:"Encerrado",color:"#ef4444"}];async function zt(e){e.innerHTML=`
        <div style="display: flex; gap: var(--spacing-md); overflow-x: auto; padding-bottom: var(--spacing-md); height: calc(100vh - 120px); align-items: flex-start;">
            ${je.map(t=>`
                <div class="kanban-column" data-stage="${t.id}" style="min-width: 280px; width: 280px; background: var(--color-bg-card); border-radius: var(--radius-md); display: flex; flex-direction: column; max-height: 100%; border: 1px solid var(--color-border);">
                    <div style="padding: var(--spacing-sm) var(--spacing-md); border-bottom: 3px solid ${t.color}; font-weight: 600; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02);">
                        <span>${t.label}</span>
                        <span class="count-badge" id="count-${t.id}" style="background: var(--color-bg); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; color: var(--color-text-secondary); border: 1px solid var(--color-border);">0</span>
                    </div>
                    <div class="kanban-body" id="stage-${t.id}" style="padding: var(--spacing-sm); overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: var(--spacing-sm); min-height: 100px;">
                        <!-- Cards go here -->
                        <div class="loading-spinner" style="align-self: center; margin-top: var(--spacing-md);"></div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;try{const t=await T.list();jt(t),At()}catch(t){console.error("Erro ao carregar funil:",t),v("Erro ao carregar funil de vendas","error")}}function jt(e){je.forEach(a=>{const r=document.getElementById(`stage-${a.id}`);r&&(r.innerHTML=""),he(a.id,0)});const t={};e.forEach(a=>{const r=a.pipeline_stage||"potencial",o=document.getElementById(`stage-${r}`);if(o){const i=Pt(a);o.appendChild(i),t[r]=(t[r]||0)+1}}),Object.keys(t).forEach(a=>he(a,t[a]))}function Pt(e){const t=document.createElement("div");t.className="kanban-card",t.draggable=!0,t.dataset.id=e.id,t.style.cssText=`
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: var(--spacing-sm);
        cursor: grab;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
    `;const a=e.documento_tipo==="cnpj",r=a?"PJ":"PF",o=a?"#3b82f6":"#10b981";return t.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text); line-height: 1.2;">${e.nome}</span>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                <span style="font-size: 0.65rem; background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 1px 4px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">Cliente</span>
                <span style="font-size: 0.65rem; background: ${o}20; color: ${o}; padding: 1px 4px; border-radius: 4px; font-weight: 500;">${r}</span>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px; margin-top: 4px;">
            ${e.telefone?`<div style="font-size: 0.8rem; color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px;">
                <span style="opacity: 0.7;">📞</span> ${e.telefone}
            </div>`:""}
            ${e.email?`<div style="font-size: 0.8rem; color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px;">
                <span style="opacity: 0.7;">✉️</span> <span style="word-break: break-all;">${e.email}</span>
            </div>`:""}
        </div>
        <div style="margin-top: 10px; font-size: 0.7rem; color: var(--color-text-muted); text-align: right; border-top: 1px solid var(--color-border); padding-top: 6px; opacity: 0.8;">
            📅 ${new Date(e.created_at||Date.now()).toLocaleDateString("pt-BR")}
        </div>
    `,t.addEventListener("dragstart",i=>{i.dataTransfer.setData("text/plain",e.id),i.dataTransfer.effectAllowed="move",t.style.opacity="0.5"}),t.addEventListener("dragend",()=>{t.style.opacity="1"}),t}function he(e,t){const a=document.getElementById(`count-${e}`);a&&(a.textContent=t.toString())}function At(){document.querySelectorAll(".kanban-body").forEach(t=>{t.addEventListener("dragover",a=>{a.preventDefault(),a.dataTransfer.dropEffect="move",t.style.background="rgba(0,0,0,0.05)"}),t.addEventListener("dragleave",()=>{t.style.background="transparent"}),t.addEventListener("drop",async a=>{a.preventDefault(),t.style.background="transparent";const r=a.dataTransfer.getData("text/plain"),o=t.id.replace("stage-",""),i=document.querySelector(`div[data-id="${r}"]`);if(i&&i.parentElement!==t){const s=i.parentElement;s.removeChild(i),Se(s),t.appendChild(i),Se(t);try{await T.update(r,{pipeline_stage:o}),v("Estágio atualizado","success")}catch(f){console.error(f),v("Erro ao atualizar estágio","error"),window.location.reload()}}})})}function Se(e){const t=e.id.replace("stage-",""),a=e.children.length;he(t,a)}const B={reuniao:"#6366f1",call:"#10b981",visita:"#f59e0b",outro:"#94a3b8"};async function Dt(e){e.innerHTML=`
        <div class="page-header">
            <h1 class="page-title">📅 Agendamento</h1>
            <button class="btn btn-primary" id="new-agendamento-btn">
                <span>➕</span> Novo Compromisso
            </button>
        </div>

        <div class="agendamento-layout" style="display: grid; grid-template-columns: 350px 1fr; gap: var(--spacing-lg); align-items: start;">
            
            <!-- Coluna Esquerda: Calendário -->
            <div class="card" style="padding: var(--spacing-md); position: sticky; top: var(--spacing-md);">
                <div style="margin-bottom: var(--spacing-md);">
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 4px;">Calendário</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-secondary);">Filtre seus compromissos por data</p>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <button class="btn btn-secondary btn-sm" id="prev-month" style="padding: 4px 8px;">◀</button>
                    <span id="calendar-month-year" style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;"></span>
                    <button class="btn btn-secondary btn-sm" id="next-month" style="padding: 4px 8px;">▶</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; margin-bottom: 8px;">
                    ${["dom","seg","ter","qua","qui","sex","sáb"].map(m=>`
                        <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase;">${m}</div>
                    `).join("")}
                </div>
                <div id="calendar-days" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
                    <!-- Dias inseridos via JS -->
                </div>

                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
                    <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 12px;">Legenda:</p>
                    <div id="calendar-legend" style="display: flex; flex-wrap: wrap; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${B.reuniao};"></span> Reunião
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${B.call};"></span> Call
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${B.visita};"></span> Visita
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${B.outro};"></span> Outro
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna Direita: Lista de Compromissos -->
            <div class="card">
                <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="list-title" style="font-size: 1.1rem; font-weight: 700;">Próximos Compromissos</h3>
                    <button class="btn btn-secondary btn-sm" id="clear-filter" style="display: none;">Ver Todos</button>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Horário/Data</th>
                                <th>Compromisso</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="agendamentos-list">
                            <tr><td colspan="5" style="text-align:center; padding: 2rem;">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal de Agendamento -->
        <div class="modal-overlay" id="agendamento-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title" id="modal-title">Novo Agendamento</h2>
                    <button class="modal-close" id="close-modal">&times;</button>
                </div>
                <form id="agendamento-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Cliente *</label>
                            <select class="form-input" name="cliente_id" required id="cliente-select">
                                <option value="">Selecione um cliente...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" class="form-input" name="titulo" required placeholder="Ex: Reunião de Alinhamento">
                        </div>
                        <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group">
                                <label class="form-label">Data e Hora *</label>
                                <input type="datetime-local" class="form-input" name="data_hora" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duração (min)</label>
                                <input type="number" class="form-input" name="duracao_minutos" value="60">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tipo de Compromisso</label>
                            <div id="type-selector" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 8px;">
                                <div class="type-option" data-value="reuniao" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${B.reuniao};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">👥 Reunião</span>
                                </div>
                                <div class="type-option" data-value="call" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${B.call};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">📞 Call</span>
                                </div>
                                <div class="type-option" data-value="visita" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${B.visita};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">🚗 Visita</span>
                                </div>
                                <div class="type-option" data-value="outro" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${B.outro};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">📝 Outro</span>
                                </div>
                            </div>
                            <input type="hidden" name="tipo" id="tipo-hidden" value="reuniao">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-input" name="status">
                                <option value="pendente">Pendente</option>
                                <option value="realizado">Realizado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Descrição</label>
                            <textarea class="form-input" name="descricao" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;const t=document.getElementById("agendamentos-list"),a=document.getElementById("agendamento-modal"),r=document.getElementById("agendamento-form"),o=document.getElementById("cliente-select"),i=document.getElementById("calendar-days"),s=document.getElementById("calendar-month-year"),f=document.getElementById("list-title"),b=document.getElementById("clear-filter"),h=document.querySelectorAll(".type-option"),y=document.getElementById("tipo-hidden");let u=new Date,n=null,w=[],l=null;async function p(){try{const[m,d]=await Promise.all([re.list(),T.list()]);w=m,x(),q(d)}catch{v("Erro ao carregar dados","error")}}function x(){$(),_()}function _(){let m=[...w].sort((d,c)=>new Date(d.data_hora).getTime()-new Date(c.data_hora).getTime());if(n){const d=n.toISOString().split("T")[0];m=m.filter(c=>c.data_hora.startsWith(d)),f.innerHTML=`Compromissos - <span style="color: var(--color-primary);">${n.toLocaleDateString("pt-BR")}</span>`,b.style.display="block"}else{f.textContent="Próximos Compromissos",b.style.display="none";const d=new Date().toISOString();m=m.filter(c=>c.data_hora>=d.split("T")[0])}if(m.length===0){const d=n?"Nenhum compromisso para esta data.":"Nenhum compromisso agendado.";t.innerHTML=`<tr><td colspan="5" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);">
                <div style="font-size: 1.5rem; margin-bottom: 8px;">📅</div>
                ${d}
            </td></tr>`;return}t.innerHTML=m.map(d=>`
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 4px; height: 24px; border-radius: 2px; background: ${B[d.tipo]||B.outro};"></div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-text); line-height: 1.1;">${new Date(d.data_hora).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); margin-top: 1px;">${new Date(d.data_hora).toLocaleDateString("pt-BR")}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-weight: 500;">${d.titulo}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-secondary);">${z(d.tipo)}</div>
                </td>
                <td>${d.cliente_nome||"N/A"}</td>
                <td>
                    <span class="badge ${C(d.status)}">${d.status.toUpperCase()}</span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${d.id}">✏️</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${d.id}">🗑️</button>
                </td>
            </tr>
        `).join(""),t.querySelectorAll(".edit-btn").forEach(d=>{d.addEventListener("click",()=>G(w.find(c=>c.id===d.dataset.id)))}),t.querySelectorAll(".delete-btn").forEach(d=>{d.addEventListener("click",async()=>{if(confirm("Deseja excluir este agendamento?"))try{await re.delete(d.dataset.id),v("Agendamento excluído"),p()}catch{v("Erro ao excluir","error")}})})}function $(){const m=u.getFullYear(),d=u.getMonth(),c=["janeiro","fevereiro","março","abril","maio","julho","agosto","setembro","outubro","novembro","dezembro"];s.textContent=`${c[d]} ${m}`;const k=new Date(m,d,1).getDay(),L=new Date(m,d+1,0).getDate();i.innerHTML="";const O=new Date(m,d,0).getDate();for(let S=k-1;S>=0;S--)i.innerHTML+=`<div class="calendar-day disabled" style="padding: 10px; text-align: center; color: var(--color-text-muted); opacity: 0.3; font-size: 0.85rem;">${O-S}</div>`;for(let S=1;S<=L;S++){const N=new Date(m,d,S),Pe=`${m}-${String(d+1).padStart(2,"0")}-${String(S).padStart(2,"0")}`,Ae=w.filter(me=>me.data_hora.startsWith(Pe)),X=n&&n.toDateString()===N.toDateString(),pe=new Date().toDateString()===N.toDateString(),P=document.createElement("div");P.className=`calendar-day ${X?"selected":""} ${pe?"today":""}`,P.style.cssText=`
                padding: 10px 5px;
                text-align: center;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                border-radius: 8px;
                position: relative;
                transition: all 0.2s;
                ${X?"background: var(--color-primary); color: white;":""}
                ${!X&&pe?"color: var(--color-primary); font-weight: 700;":""}
                ${!X&&!pe?"color: var(--color-text);":""}
            `,X||(P.onmouseover=()=>P.style.background="var(--color-bg-tertiary)",P.onmouseout=()=>P.style.background="transparent");const De=Ae.slice(0,4).map(me=>`
                <div style="width: 5px; height: 5px; background: ${B[me.tipo]||B.outro}; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);"></div>
            `).join("");P.innerHTML=`
                <div style="position: relative; z-index: 1;">${S}</div>
                <div style="display: flex; gap: 2px; justify-content: center; position: absolute; bottom: 4px; left: 0; right: 0;">
                    ${De}
                </div>
            `,P.addEventListener("click",()=>{n=N,x()}),i.appendChild(P)}}function C(m){switch(m){case"realizado":return"badge-success";case"cancelado":return"badge-danger";default:return"badge-warning"}}function z(m){return{reuniao:"Reunião",call:"Call",visita:"Visita",outro:"Outro"}[m]||m}function q(m){o.innerHTML='<option value="">Selecione um cliente...</option>'+m.map(d=>`<option value="${d.id}">${d.nome}</option>`).join("")}function j(m){y.value=m,h.forEach(d=>{const c=d;c.dataset.value===m?(c.style.borderColor=B[m],c.style.background=`${B[m]}15`):(c.style.borderColor="var(--color-border)",c.style.background="transparent")})}function G(m){if(l=(m==null?void 0:m.id)||null,document.getElementById("modal-title").textContent=m?"Editar Agendamento":"Novo Agendamento",m)r.cliente_id.value=m.cliente_id,r.titulo.value=m.titulo,r.data_hora.value=m.data_hora.substring(0,16),r.duracao_minutos.value=m.duracao_minutos,r.status.value=m.status,r.descricao.value=m.descricao||"",j(m.tipo);else{r.reset();const d=n?new Date(n):new Date;n?d.setHours(new Date().getHours()+1,0,0,0):d.setMinutes(d.getMinutes()+30),r.data_hora.value=new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().substring(0,16),j("reuniao")}a.classList.add("active")}function R(){a.classList.remove("active"),l=null}document.getElementById("prev-month").addEventListener("click",()=>{u.setMonth(u.getMonth()-1),$()}),document.getElementById("next-month").addEventListener("click",()=>{u.setMonth(u.getMonth()+1),$()}),b.addEventListener("click",()=>{n=null,x()}),h.forEach(m=>{m.addEventListener("click",()=>{j(m.dataset.value)})}),document.getElementById("new-agendamento-btn").addEventListener("click",()=>G()),document.getElementById("close-modal").addEventListener("click",R),document.getElementById("cancel-btn").addEventListener("click",R),r.addEventListener("submit",async m=>{m.preventDefault();const d=new FormData(r),c={cliente_id:d.get("cliente_id"),titulo:d.get("titulo"),data_hora:d.get("data_hora"),duracao_minutos:parseInt(d.get("duracao_minutos")),tipo:y.value,status:d.get("status"),descricao:d.get("descricao")};try{l?(await re.update(l,c),v("Agendamento atualizado")):(await re.create(c),v("Agendamento criado")),R(),p()}catch{v("Erro ao salvar agendamento","error")}}),p()}let xe=null;async function Ot(e){var r;e.innerHTML=`
        <div class="page-header">
            <div>
                <h1 class="page-title">📈 Inteligência de Preços v2</h1>
                <p class="page-subtitle">Gestão de propostas comerciais e cálculo de pricing.</p>
            </div>
             <div class="actions">
                 <button id="btn-config-pricing" class="btn btn-secondary">⚙️ Configurar Preços</button>
            </div>
        </div>

        <!-- TABS -->
        <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
            <button class="tab-btn active" data-tab="calculator" style="padding: 10px 20px; margin-right: 5px; border: none; background: none; border-bottom: 2px solid var(--primary-color); font-weight: bold; cursor: pointer;">Calculadora</button>
            <button class="tab-btn" data-tab="history" style="padding: 10px 20px; border: none; background: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer;">Histórico de Orçamentos</button>
        </div>

        <!-- CONTENT: CALCULATOR -->
        <div id="tab-content-calculator" class="tab-content">
            <!-- Calculator HTML dynamically injected here -->
        </div>

        <!-- CONTENT: HISTORY -->
        <div id="tab-content-history" class="tab-content" style="display: none;">
             <div class="card">
                <div class="table-container" id="orcamentos-list-container">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
        </div>
    `,await qt(document.getElementById("tab-content-calculator")),await Ee(document.getElementById("orcamentos-list-container"));const t=document.querySelectorAll(".tab-btn"),a=document.querySelectorAll(".tab-content");t.forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.tab;t.forEach(s=>{s.style.borderBottom="2px solid transparent",s.style.color="#666",s.classList.remove("active")}),o.style.borderBottom="2px solid var(--primary-color)",o.style.color="inherit",o.classList.add("active"),a.forEach(s=>s.style.display="none"),document.getElementById(`tab-content-${i}`).style.display="block",i==="history"&&Ee(document.getElementById("orcamentos-list-container"))})}),(r=document.getElementById("btn-config-pricing"))==null||r.addEventListener("click",()=>{oe("/configuracoes")})}async function qt(e){var C,z,q,j,G,R,m,d;let t={};try{const c=await K.get("pricing_config?_t="+Date.now());c&&c.value&&(t=JSON.parse(c.value))}catch{console.warn("Using default pricing (fetch error)"),t={setup_base:2499,mensal_servidor:119.99,mensal_suporte:899.99,modulos:{crm:1500,erp:2e3,ai:2500}}}let a={premissas:{setup_base:t.setup_base||2499,mensal_servidor:t.mensal_servidor||119.99,mensal_suporte:t.mensal_suporte||899.99},custom_prices:{modulo_crm:((C=t.modulos)==null?void 0:C.crm)||1500,modulo_erp:((z=t.modulos)==null?void 0:z.erp)||2e3,modulo_ai_wa:((q=t.modulos)==null?void 0:q.ai)||2500,interpreta_texto:((j=t.customizacoes)==null?void 0:j.interpreta_texto)||199.99,interpreta_audio:((G=t.customizacoes)==null?void 0:G.interpreta_audio)||299.99,responde_texto:((R=t.customizacoes)==null?void 0:R.responde_texto)||199.99,responde_audio:((m=t.customizacoes)==null?void 0:m.responde_audio)||499.99,envio_email:((d=t.customizacoes)==null?void 0:d.envio_email)||199.99},modulos:{crm:!1,erp:!1,agente_ia_whatsapp:!0},integracoes:{agente_crm:!1,agente_erp:!1},customizacoes:{interpreta_texto:!1,interpreta_audio:!1,responde_texto:!1,responde_audio:!1,envio_email:!1},api_ia:{requisicoes_mes:0,custo_por_requisicao:.09}},r=null;e.innerHTML=`
        <style>
            .orcamento-v2-container { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; padding: 1rem; }
            .calc-section { background: var(--color-bg-secondary); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid var(--color-border); }
            .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.8rem; }
            .section-number { background: var(--color-primary); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; }
            .module-card { background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-radius: 10px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; transition: all 0.2s; }
            .module-card:hover { border-color: var(--color-primary); transform: translateX(5px); }
            .switch { position: relative; display: inline-block; width: 46px; height: 24px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--color-primary); }
            input:checked + .slider:before { transform: translateX(22px); }
            .summary-sidebar { position: sticky; top: 2rem; background: var(--color-bg-secondary); border-radius: 16px; border: 1px solid var(--color-primary); padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            .price-block { text-align: center; padding: 1rem; background: rgba(var(--color-primary-rgb), 0.1); border-radius: 12px; }
            .price-label { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; }
            .price-value { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
            .item-list { font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 1rem; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--color-text-muted); }
            .item-row.subtotal { color: var(--color-text); font-weight: 700; border-top: 1px dashed var(--color-border); padding-top: 8px; margin-top: 8px; }
            .variable-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
            .checkbox-group { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; cursor: pointer; }
        </style>

        <div class="orcamento-v2-container">
            <div class="calc-main">
                <form id="calc-form-v2">
                    <!-- 1. Módulos -->
                    <div class="calc-section">
                        <div class="section-header"><div class="section-number">1</div><h3 style="margin:0">Módulos do Projeto</h3></div>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Marque os sistemas que o cliente deseja contratar.</p>
                        <div class="module-card">
                            <div style="flex: 1;"><strong>CRM</strong> (Customer Relationship Management)</div>
                            <label class="switch"><input type="checkbox" name="module_crm" class="calc-trigger"><span class="slider"></span></label>
                        </div>
                        <div class="module-card">
                            <div style="flex: 1;"><strong>ERP</strong> (Enterprise Resource Planning)</div>
                            <label class="switch"><input type="checkbox" name="module_erp" class="calc-trigger"><span class="slider"></span></label>
                        </div>
                        <div class="module-card">
                            <div style="flex: 1;"><strong>Agente de IA para WhatsApp</strong></div>
                            <label class="switch"><input type="checkbox" name="module_ai_wa" class="calc-trigger" checked><span class="slider"></span></label>
                        </div>
                    </div>

                    <!-- 2. Integrações -->
                    <div class="calc-section">
                        <div class="section-header"><div class="section-number">2</div><h3 style="margin:0">Integrações</h3></div>
                        <div class="module-card">
                            <div>Integrar Agente de IA com <strong>CRM</strong></div>
                            <label class="switch"><input type="checkbox" name="int_ag_crm" class="calc-trigger"><span class="slider"></span></label>
                        </div>
                        <div class="module-card">
                            <div>Integrar Agente de IA com <strong>ERP</strong></div>
                            <label class="switch"><input type="checkbox" name="int_ag_erp" class="calc-trigger"><span class="slider"></span></label>
                        </div>
                    </div>

                    <!-- 3. Custos Variáveis -->
                    <div class="calc-section">
                        <div class="section-header"><div class="section-number">3</div><h3 style="margin:0">Custos Variáveis</h3></div>
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-size: 0.9rem; margin-bottom: 1rem;">Customizações do Agente (Opcional)</h4>
                            <div class="variable-grid">
                                <label class="checkbox-group"><input type="checkbox" name="cust_text_in" class="calc-trigger"> Agente interpreta texto</label>
                                <label class="checkbox-group"><input type="checkbox" name="cust_audio_in" class="calc-trigger"> Agente interpreta áudio</label>
                                <label class="checkbox-group"><input type="checkbox" name="cust_text_out" class="calc-trigger"> Agente responde em texto</label>
                                <label class="checkbox-group"><input type="checkbox" name="cust_audio_out" class="calc-trigger"> Agente responde em áudio</label>
                                <label class="checkbox-group"><input type="checkbox" name="cust_email" class="calc-trigger"> Envio de e-mail</label>
                            </div>
                        </div>
                        <div>
                            <h4 style="font-size: 0.9rem; margin-bottom: 1rem;">Custo Estimado de API de IA (Mensal)</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Nº de Requisições/mês</label>
                                    <input type="number" name="api_reqs" class="form-input calc-trigger" value="0" min="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Custo por Requisição (R$)</label>
                                    <input type="number" name="api_cost" class="form-input calc-trigger" value="0.09" step="0.01" min="0">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Descrição -->
                    <div class="calc-section">
                        <div class="section-header"><div class="section-number">4</div><h3 style="margin:0">Descrição do Serviço</h3></div>
                        <div class="form-group">
                            <textarea name="descricao" class="form-input" rows="4" placeholder="Ex: Desenvolvimento de um sistema..."></textarea>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Sidebar -->
            <div class="summary-container">
                <div class="summary-sidebar">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">🧾</span><h3 style="margin:0">Orçamento Final</h3>
                    </div>
                     <div id="editing-badge" style="display:none; background: #fffae6; color: #b38b00; padding: 5px; font-size: 0.8rem; border-radius: 4px; text-align: center; border: 1px solid #ffe58f;">
                        ✏️ Modo de Edição
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                        <div class="price-block" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                            <div class="price-label">Setup</div>
                            <div class="price-value" id="disp-setup">R$ 0,00</div>
                        </div>
                        <div class="price-block" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                            <div class="price-label">Mensal</div>
                            <div class="price-value" id="disp-mensal">R$ 0,00</div>
                        </div>
                    </div>
                    <div class="item-list">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px;">Custos de Setup</h4>
                        <div id="setup-items"></div>
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px;">Custos Mensais</h4>
                        <div id="mensal-items"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Selecionar Cliente</label>
                        <select id="final-cliente-id" class="form-input" required><option value="">Selecione...</option></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Título da Proposta</label>
                        <input type="text" id="final-titulo" class="form-input" placeholder="Título Proposta">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="final-status" class="form-input" disabled>
                            <option value="rascunho">Rascunho</option>
                            <option value="enviado">Enviado</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="rejeitado">Rejeitado</option>
                        </select>
                    </div>
                    <button id="save-budget-btn" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700;">💾 Salvar Orçamento</button>
                    <button id="cancel-edit-btn" class="btn btn-secondary" style="width: 100%; padding: 0.5rem; display: none;">Cancelar Edição</button>
                    <div id="validation-msg" style="color: var(--color-warning); font-size: 0.8rem; text-align: center; display: none;">⚠️ Selecione um cliente para poder salvar.</div>
                </div>
            </div>
        </div>
    `;const o=document.getElementById("calc-form-v2"),i=document.querySelectorAll(".calc-trigger"),s=document.getElementById("disp-setup"),f=document.getElementById("disp-mensal"),b=document.getElementById("setup-items"),h=document.getElementById("mensal-items"),y=document.getElementById("final-cliente-id"),u=document.getElementById("save-budget-btn"),n=document.getElementById("cancel-edit-btn"),w=document.getElementById("editing-badge"),l=document.getElementById("validation-msg"),p=document.getElementById("final-titulo"),x=document.getElementById("final-status");try{const c=await T.list();y.innerHTML='<option value="">Selecione um cliente...</option>'+c.map(k=>`<option value="${k.id}">${k.nome}</option>`).join("")}catch(c){console.error(c)}async function _(){const c=new FormData(o);a={premissas:a.premissas,custom_prices:a.custom_prices,modulos:{crm:c.get("module_crm")==="on",erp:c.get("module_erp")==="on",agente_ia_whatsapp:c.get("module_ai_wa")==="on"},integracoes:{agente_crm:c.get("int_ag_crm")==="on",agente_erp:c.get("int_ag_erp")==="on"},customizacoes:{interpreta_texto:c.get("cust_text_in")==="on",interpreta_audio:c.get("cust_audio_in")==="on",responde_texto:c.get("cust_text_out")==="on",responde_audio:c.get("cust_audio_out")==="on",envio_email:c.get("cust_email")==="on"},api_ia:{requisicoes_mes:parseInt(c.get("api_reqs"))||0,custo_por_requisicao:parseFloat(c.get("api_cost"))||.09}};try{const L=await V.calculate({configuracao:a});s.textContent=I(L.valor_setup),f.textContent=I(L.valor_mensal),b.innerHTML=Object.entries(L.detalhes.setup||{}).map(([O,S])=>`
                <div class="item-row"><span>${O}</span><span>${I(S)}</span></div>
            `).join("")+`<div class="item-row subtotal"><span>Total Setup</span><span>${I(L.valor_setup)}</span></div>`,h.innerHTML=Object.entries(L.detalhes.mensal||{}).map(([O,S])=>`
                <div class="item-row"><span>${O}</span><span>${I(S)}</span></div>
            `).join("")+`<div class="item-row subtotal"><span>Total Mensal</span><span>${I(L.valor_mensal)}</span></div>`}catch(L){console.error("Calc error",L)}}xe=c=>{var k;r=c.id,a=c.configuracao,o.querySelector('[name="module_crm"]').checked=a.modulos.crm,o.querySelector('[name="module_erp"]').checked=a.modulos.erp,o.querySelector('[name="module_ai_wa"]').checked=a.modulos.agente_ia_whatsapp,o.querySelector('[name="int_ag_crm"]').checked=a.integracoes.agente_crm,o.querySelector('[name="int_ag_erp"]').checked=a.integracoes.agente_erp,o.querySelector('[name="cust_text_in"]').checked=a.customizacoes.interpreta_texto,o.querySelector('[name="cust_audio_in"]').checked=a.customizacoes.interpreta_audio,o.querySelector('[name="cust_text_out"]').checked=a.customizacoes.responde_texto,o.querySelector('[name="cust_audio_out"]').checked=a.customizacoes.responde_audio,o.querySelector('[name="cust_email"]').checked=a.customizacoes.envio_email,o.querySelector('[name="api_reqs"]').value=String(a.api_ia.requisicoes_mes),o.querySelector('[name="api_cost"]').value=String(a.api_ia.custo_por_requisicao),o.querySelector('[name="descricao"]').value=c.descricao||"",y.value=c.cliente_id,p.value=c.titulo,x.value=c.status,x.disabled=!1,w.style.display="block",n.style.display="block",u.innerHTML="💾 Atualizar Orçamento",_(),(k=document.querySelector('[data-tab="calculator"]'))==null||k.click()};function $(){r=null,o.reset(),p.value="",y.value="",x.value="rascunho",x.disabled=!0,w.style.display="none",n.style.display="none",u.innerHTML="💾 Salvar Orçamento",_()}n.addEventListener("click",$),i.forEach(c=>{c.addEventListener("change",_),c.addEventListener("input",_)}),u.addEventListener("click",async()=>{var S;const c=y.value,k=p.value||"Novo Orçamento v2",L=o.querySelector('textarea[name="descricao"]').value;if(!c){l.style.display="block";return}l.style.display="none";const O=u.innerHTML;u.innerHTML="Salvando...",u.disabled=!0;try{if(r){const N=x.value;await V.update(r,{titulo:k,descricao:L,configuracao:a,status:N}),v("Orçamento atualizado!","success")}else await V.create({cliente_id:c,titulo:k,descricao:L,configuracao:a}),v("Orçamento salvo!","success");$(),confirm("Deseja ver o histórico agora?")&&((S=document.querySelector('[data-tab="history"]'))==null||S.click())}catch{v("Erro ao salvar","error")}finally{u.innerHTML=O,u.disabled=!1}}),_()}async function Ee(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const t=await V.list();if(t.length===0){e.innerHTML='<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum orçamento salvo</div>';return}e.innerHTML=`
            <table class="table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Título</th>
                        <th>Cliente</th>
                        <th>Setup</th>
                        <th>Mensal</th>
                        <th>Total (1º Ano)</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${t.map(a=>`
                        <tr data-json='${JSON.stringify(a).replace(/'/g,"&#39;")}'>
                            <td>${ee(a.created_at)}</td>
                            <td><strong>${a.titulo}</strong></td>
                            <td>${a.cliente_nome||"-"}</td>
                            <td>${I(a.valor_setup)}</td>
                            <td>${I(a.valor_mensal)}</td>
                            <td>${I(a.valor_total)}</td>
                            <td><span class="badge badge-${Rt(a.status)}">${a.status.toUpperCase()}</span></td>
                            <td>
                                <button class="btn btn-secondary btn-sm view-orc-btn">👁️</button>
                                <button class="btn btn-danger btn-sm delete-orc-btn" data-id="${a.id}">🗑️</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `,document.querySelectorAll(".view-orc-btn").forEach(a=>{a.addEventListener("click",r=>{const o=r.target.closest("tr");if(o&&o.dataset.json){const i=JSON.parse(o.dataset.json);xe&&xe(i)}})}),document.querySelectorAll(".delete-orc-btn").forEach(a=>{a.addEventListener("click",async r=>{var i;const o=r.target.dataset.id||((i=r.target.parentElement)==null?void 0:i.dataset.id);if(o&&confirm("Tem certeza que deseja excluir este orçamento?"))try{await V.delete(o),v("Orçamento excluído","success"),Ee(e)}catch{v("Erro ao excluir","error")}})})}catch{e.innerHTML='<div class="empty-state">Erro ao carregar histórico.</div>'}}function Rt(e){switch(e){case"aprovado":return"success";case"rejeitado":return"danger";case"enviado":return"info";default:return"warning"}}async function Nt(e){var r,o,i,s,f,b,h,y,u,n,w;e.innerHTML=`
        <div class="content-header">
            <h1 class="page-title">Configurações</h1>
            <p class="page-subtitle">Gerencie seu perfil e premissas globais do sistema.</p>
        </div>

        <div style="display: grid; gap: 2rem; max-width: 800px;">
            
            <!-- Cards de Configuração -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">👤 Perfil do Usuário</h2>
                </div>
                <form id="profile-form" style="display: grid; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Nome Completo</label>
                        <input type="text" id="user-name" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="user-email" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Senha (Deixe em branco para manter)</label>
                        <input type="password" id="user-password" class="form-input" placeholder="Nova senha...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Função / Cargo</label>
                        <input type="text" id="user-role" class="form-input" disabled style="background: var(--color-bg); opacity: 0.7;">
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="btn btn-primary">Salvar Perfil</button>
                    </div>
                </form>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">💰 Premissas de Preços (Global)</h2>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem;">Esses valores serão usados como padrão em todos os novos orçamentos.</p>
                </div>
                <form id="pricing-form" style="display: grid; gap: 1.5rem;">
                    
                    <div>
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Custos Base</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Setup Base (R$)</label>
                                <input type="text" inputmode="decimal" id="setup_base" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mensal Servidor (R$)</label>
                                <input type="text" inputmode="decimal" id="mensal_servidor" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mensal Suporte (R$)</label>
                                <input type="text" inputmode="decimal" id="mensal_suporte" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem;">
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Preços de Módulos</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Módulo CRM (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_crm" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Módulo ERP (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_erp" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Módulo IA (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_ai_wa" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                        </div>
                    </div>

                    <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem;">
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Customizações do Agente</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Interpreta Texto (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_interpreta_texto" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Interpreta Áudio (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_interpreta_audio" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Responde Texto (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_responde_texto" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Responde Áudio (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_responde_audio" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Envio de Email (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_envio_email" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button type="button" id="btn-save-prices" class="btn btn-primary" style="background-color: var(--color-success); border-color: var(--color-success);">Salvar Preços</button>
                    </div>
                </form>
                
                <div style="margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
                    <button type="button" id="btn-diag" style="background: #333; color: #fff; padding: 0.5rem 1rem; border: none; border-radius: 4px;">🛠️ Rodar Diagnóstico de Salvamento</button>
                    <p id="diag-result" style="margin-top: 0.5rem; font-family: monospace; font-size: 0.9rem;"></p>
                </div>
            </div>
        </div>
    `;const t=ke();t&&(document.getElementById("user-name").value=t.name,document.getElementById("user-email").value=t.email,document.getElementById("user-role").value=t.role.toUpperCase());try{const l=await K.get("pricing_config?_t="+Date.now());if(l&&l.value){const p=JSON.parse(l.value);document.getElementById("setup_base").value=p.setup_base??2499,document.getElementById("mensal_servidor").value=p.mensal_servidor??119.99,document.getElementById("mensal_suporte").value=p.mensal_suporte??899.99,document.getElementById("modulo_crm").value=((r=p.modulos)==null?void 0:r.crm)??1500,document.getElementById("modulo_erp").value=((o=p.modulos)==null?void 0:o.erp)??2e3,document.getElementById("modulo_ai_wa").value=((i=p.modulos)==null?void 0:i.ai)??2500,document.getElementById("cust_interpreta_texto").value=((s=p.customizacoes)==null?void 0:s.interpreta_texto)??199.99,document.getElementById("cust_interpreta_audio").value=((f=p.customizacoes)==null?void 0:f.interpreta_audio)??299.99,document.getElementById("cust_responde_texto").value=((b=p.customizacoes)==null?void 0:b.responde_texto)??199.99,document.getElementById("cust_responde_audio").value=((h=p.customizacoes)==null?void 0:h.responde_audio)??499.99,document.getElementById("cust_envio_email").value=((y=p.customizacoes)==null?void 0:y.envio_email)??199.99}else a()}catch{a()}function a(){document.getElementById("setup_base").value="2499.00",document.getElementById("mensal_servidor").value="119.99",document.getElementById("mensal_suporte").value="899.99",document.getElementById("modulo_crm").value="1500.00",document.getElementById("modulo_erp").value="2000.00",document.getElementById("modulo_ai_wa").value="2500.00",document.getElementById("cust_interpreta_texto").value="199.99",document.getElementById("cust_interpreta_audio").value="299.99",document.getElementById("cust_responde_texto").value="199.99",document.getElementById("cust_responde_audio").value="499.99",document.getElementById("cust_envio_email").value="199.99"}(u=document.getElementById("profile-form"))==null||u.addEventListener("submit",async l=>{l.preventDefault();try{if(!t)return;const p=document.getElementById("user-name").value,x=document.getElementById("user-email").value,_=document.getElementById("user-password").value,$={name:p,email:x};_&&($.password=_),await U.updateProfile(t.id,$);const C=await U.me();localStorage.setItem("crm_user",JSON.stringify(C)),v("Perfil atualizado com sucesso!","success"),setTimeout(()=>window.location.reload(),1e3)}catch(p){v(p.message||"Erro ao atualizar perfil","error")}}),(n=document.getElementById("btn-save-prices"))==null||n.addEventListener("click",async()=>{try{const l=document.getElementById("btn-save-prices"),p=l.textContent;l.textContent="Salvando...",l.disabled=!0;const x=($,C)=>{const z=document.getElementById($);if(!z)return C;const q=z.value.replace(",","."),j=parseFloat(q);return isNaN(j)?C:j},_={setup_base:x("setup_base",2499),mensal_servidor:x("mensal_servidor",119.99),mensal_suporte:x("mensal_suporte",899.99),modulos:{crm:x("modulo_crm",1500),erp:x("modulo_erp",2e3),ai:x("modulo_ai_wa",2500)},customizacoes:{interpreta_texto:x("cust_interpreta_texto",199.99),interpreta_audio:x("cust_interpreta_audio",299.99),responde_texto:x("cust_responde_texto",199.99),responde_audio:x("cust_responde_audio",499.99),envio_email:x("cust_envio_email",199.99)}};await K.update("pricing_config",{value:JSON.stringify(_),description:"Global Pricing Config"}),v("Preços atualizados com sucesso!","success"),setTimeout(()=>{l.textContent=p,l.disabled=!1},1e3)}catch(l){console.error("Save error:",l),v(l.message||"Erro ao salvar preços","error");const p=document.getElementById("btn-save-prices");p.textContent="Salvar Preços",p.disabled=!1}}),(w=document.getElementById("btn-diag"))==null||w.addEventListener("click",async()=>{const l=document.getElementById("diag-result");l.textContent="⏳ Iniciando diagnóstico...",l.style.color="blue";try{const p=50+Math.floor(Math.random()*10);l.textContent+=`
1. Tentando salvar valor teste: ${p}...`;const x={setup_base:2499,mensal_servidor:119.99,mensal_suporte:899.99,modulos:{crm:1500,erp:2e3,ai:2500},customizacoes:{interpreta_texto:p,interpreta_audio:p,responde_texto:p,responde_audio:p,envio_email:p}};await K.update("pricing_config",{value:JSON.stringify(x),description:"DIAGNOSTIC TEST"}),l.textContent+=`
2. Save OK (Request success).`,l.textContent+=`
3. Buscando valor do servidor...`;const _=await K.get("pricing_config?_t="+Date.now()),C=JSON.parse(_.value).customizacoes.interpreta_texto;l.textContent+=`
4. Valor retornado: ${C}`,C==p?(l.textContent+=`
✅ SUCESSO! O sistema está salvando corretamente.`,l.style.color="green",alert(`Diagnóstico: SUCESSO!
Valor salvo: ${p}
Valor lido: ${C}

Conclusão: O sistema funciona. O problema pode ser cache local. Recarregue a página.`)):(l.textContent+=`
❌ FALHA! O valor lido é diferente do salvo.`,l.style.color="red",alert(`Diagnóstico: FALHA!
Enviado: ${p}
Recebido: ${C}

Conclusão: O servidor ignorou a mudança.`))}catch(p){l.textContent+=`
❌ ERRO TÉCNICO: ${p.message}`,l.style.color="red",alert(`Diagnóstico: ERRO DE REQUEST
${p.message}`)}})}const _e=document.getElementById("app");async function D(e,t){if(!await Te()){le(_e);return}const r=gt(_e,e);await t(r)}M("/",async()=>{await Te()?oe("/dashboard"):le(_e)});M("/dashboard",()=>D("dashboard",bt));M("/clientes",()=>D("clientes",ve));M("/funil",()=>D("funil",zt));M("/agendamento",()=>D("agendamento",Dt));M("/orcamento",()=>D("orcamento",Ot));M("/contratos",()=>D("contratos",ye));M("/projetos",()=>D("projetos",xt));M("/financeiro",()=>D("financeiro",fe));M("/configuracoes",()=>D("configuracoes",Nt));we();
