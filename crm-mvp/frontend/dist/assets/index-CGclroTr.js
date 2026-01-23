(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();function C(e){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(e)}function te(e){return new Date(e).toLocaleDateString("pt-BR")}function Be(e){return{ativo:"badge-success",potencial:"badge-info",em_negociacao:"badge-warning",inativo:"badge-neutral",planejamento:"badge-info",em_execucao:"badge-warning",pausado:"badge-neutral",concluido:"badge-success",cancelado:"badge-danger",pendente:"badge-warning",pago:"badge-success",atrasado:"badge-danger"}[e]||"badge-neutral"}function Le(e){return{ativo:"Ativo",potencial:"Potencial",em_negociacao:"Em Negociação",inativo:"Inativo",planejamento:"Planejamento",em_execucao:"Em Execução",pausado:"Pausado",concluido:"Concluído",cancelado:"Cancelado",pendente:"Pendente",pago:"Pago",atrasado:"Atrasado",recebimento:"Recebimento",pagamento:"Pagamento"}[e]||e}let Y=null;function g(e,t="success"){Y||(Y=document.createElement("div"),Y.className="toast-container",document.body.appendChild(Y));const a=document.createElement("div");a.className=`toast ${t}`,a.textContent=e,Y.appendChild(a),setTimeout(()=>{a.remove()},3e3)}const ve={};function z(e,t){ve[e]=t}function re(e){window.history.pushState({},"",e),we()}function we(){const e=window.location.pathname,t=ve[e]||ve["/"];t&&t()}window.addEventListener("popstate",we);const Oe="/api";class qe extends Error{constructor(t,a){super(a),this.status=t,this.name="ApiError"}}async function b(e,t={}){const a=await fetch(`${Oe}${e}`,{...t,credentials:"include",cache:"no-store",headers:{"Content-Type":"application/json",...t.headers}});if(!a.ok){const r=await a.json().catch(()=>({detail:"Erro desconhecido"}));throw new qe(a.status,r.detail||"Erro na requisição")}if(a.status!==204)return a.json()}const U={login:e=>b("/auth/login",{method:"POST",body:JSON.stringify(e)}),logout:()=>b("/auth/logout",{method:"POST"}),me:()=>b("/auth/me"),register:e=>b("/auth/register",{method:"POST",body:JSON.stringify(e)}),updateProfile:(e,t)=>b(`/auth/users/${e}`,{method:"PUT",body:JSON.stringify(t)})},M={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/clientes${t}`)},get:e=>b(`/clientes/${e}`),create:e=>b("/clientes",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/clientes/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/clientes/${e}`,{method:"DELETE"}),addInteracao:(e,t)=>b(`/clientes/${e}/interacoes`,{method:"POST",body:JSON.stringify(t)})},ne={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/projetos${t}`)},get:e=>b(`/projetos/${e}`),create:e=>b("/projetos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/projetos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/projetos/${e}`,{method:"DELETE"}),addEntregavel:(e,t)=>b(`/projetos/${e}/entregaveis`,{method:"POST",body:JSON.stringify(t)}),updateEntregavel:(e,t,a)=>b(`/projetos/${e}/entregaveis/${t}`,{method:"PUT",body:JSON.stringify(a)})},K={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/contratos${t}`)},alertas:(e=30)=>b(`/contratos/alertas?dias=${e}`),get:e=>b(`/contratos/${e}`),create:e=>b("/contratos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/contratos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/contratos/${e}`,{method:"DELETE"}),preview:e=>b("/contratos/preview",{method:"POST",body:JSON.stringify(e)})},J={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/financeiro${t}`)},create:e=>b("/financeiro",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/financeiro/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/financeiro/${e}`,{method:"DELETE"}),fluxoCaixa:(e=6)=>b(`/financeiro/fluxo-caixa?meses=${e}`),dashboard:()=>b("/financeiro/dashboard"),atividades:(e=10)=>b(`/financeiro/atividades?limit=${e}`)},ie={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/agendamentos${t}`)},create:e=>b("/agendamentos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/agendamentos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/agendamentos/${e}`,{method:"DELETE"})},V={list:e=>{const t=e?"?"+new URLSearchParams(e).toString():"";return b(`/orcamentos${t}`)},get:e=>b(`/orcamentos/${e}`),create:e=>b("/orcamentos",{method:"POST",body:JSON.stringify(e)}),update:(e,t)=>b(`/orcamentos/${e}`,{method:"PUT",body:JSON.stringify(t)}),delete:e=>b(`/orcamentos/${e}`,{method:"DELETE"}),calculate:e=>b("/orcamentos/calculate",{method:"POST",body:JSON.stringify(e)})},W={list:()=>b("/config/"),get:e=>b(`/config/${e}`),update:(e,t)=>b(`/config/${e}`,{method:"PUT",body:JSON.stringify(t)})};let ae=null;function ke(){return ae}async function Te(){try{return ae=await U.me(),!0}catch{return ae=null,!1}}function de(e){var a;e.innerHTML=`
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
  `,document.getElementById("login-form").addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("email").value,i=document.getElementById("password").value;try{ae=(await U.login({email:o,password:i})).user,g("Login realizado com sucesso!","success"),re("/dashboard")}catch(s){g(s.message||"Erro ao fazer login","error")}}),(a=document.getElementById("register-link"))==null||a.addEventListener("click",r=>{r.preventDefault(),Re(e)})}function Re(e){var a;e.innerHTML=`
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
  `,document.getElementById("register-form").addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("name").value,i=document.getElementById("email").value,s=document.getElementById("password").value;try{await U.register({name:o,email:i,password:s}),g("Conta criada! Faça login.","success"),de(e)}catch(h){g(h.message||"Erro ao criar conta","error")}}),(a=document.getElementById("login-link"))==null||a.addEventListener("click",r=>{r.preventDefault(),de(e)})}async function Ne(){try{await U.logout(),ae=null,g("Logout realizado","success"),re("/")}catch{g("Erro ao fazer logout","error")}}/**
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
 */const ut=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{cx:"9",cy:"7",r:"4"}]],vt={rocket:dt,dashboard:at,users:ut,filter:et,calendar:Fe,"file-text":Ke,clipboard:Xe,folder:Qe,dollar:Ye,settings:ct,edit:st,trash:pt,party:nt,alert:mt,megaphone:rt,handshake:tt,briefcase:He,file:We,"arrow-down":Je,"arrow-up":Ve,"folder-open":Ze,check:Ue,x:Ge,logout:ot,menu:it,plus:lt};function _(e,t=""){const a=vt[e];if(!a)return console.warn(`Icon '${e}' not found.`),"";const r={xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:`lucide lucide-${e} ${t}`.trim()},o=Object.entries(r).map(([s,h])=>`${s}="${h}"`).join(" ");let i="";return Array.isArray(a)&&(i=a.map(([s,h])=>{const y=Object.entries(h).map(([x,v])=>`${x}="${v}"`).join(" ");return`<${s} ${y}></${s}>`}).join("")),`<svg ${o}>${i}</svg>`}const Me=document.createElement("style");Me.textContent=`
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
          ${_("rocket","w-6 h-6")} CRM MVP
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item ${t==="dashboard"?"active":""}" data-page="dashboard">
            <span class="nav-item-icon">${_("dashboard")}</span>
            Dashboard
          </div>
          <div class="nav-item ${t==="clientes"?"active":""}" data-page="clientes">
            <span class="nav-item-icon">${_("users")}</span>
            Clientes e Parceiros
          </div>
          <div class="nav-item ${t==="funil"?"active":""}" data-page="funil">
            <span class="nav-item-icon">${_("filter")}</span>
            Funil de Negociações
          </div>
          <div class="nav-item ${t==="agendamento"?"active":""}" data-page="agendamento">
            <span class="nav-item-icon">${_("calendar")}</span>
            Agendamento
          </div>
          <div class="nav-item ${t==="orcamento"?"active":""}" data-page="orcamento">
            <span class="nav-item-icon">${_("file-text")}</span>
            Orçamento
          </div>
          <div class="nav-item ${t==="contratos"?"active":""}" data-page="contratos">
            <span class="nav-item-icon">${_("clipboard")}</span>
            Contratos
          </div>
          <div class="nav-item ${t==="projetos"?"active":""}" data-page="projetos">
            <span class="nav-item-icon">${_("folder")}</span>
            Projetos
          </div>
          <div class="nav-item ${t==="financeiro"?"active":""}" data-page="financeiro">
            <span class="nav-item-icon">${_("dollar")}</span>
            Financeiro
          </div>
          <div class="nav-item ${t==="configuracoes"?"active":""}" data-page="configuracoes">
            <span class="nav-item-icon">${_("settings")}</span>
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
  `,document.querySelectorAll(".nav-item[data-page]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.page;re(`/${s}`)})}),(o=document.getElementById("logout-btn"))==null||o.addEventListener("click",Ne),document.getElementById("page-content")}async function bt(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const t=await J.dashboard(),r=new Date().toLocaleString("pt-BR",{month:"long"}),o=[],i=[{titulo:"Janeiro Branco e Roxo",desc:"Saúde mental e hanseníase"},{titulo:"Confraternização Universal",desc:"",data:"01/01"}];e.innerHTML=`
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
              <span style="display: flex; align-items: center; color: var(--color-primary);">${_("calendar","w-6 h-6")}</span> Próximos Agendamentos
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
              <span style="display: flex; align-items: center; color: var(--color-warning);">${_("party","w-6 h-6")}</span> Aniversariantes de ${r}
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
              <span style="display: flex; align-items: center; color: var(--color-danger);">${_("alert","w-6 h-6")}</span> Lembretes Financeiros
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
              <span style="display: flex; align-items: center; color: var(--color-info);">${_("megaphone","w-6 h-6")}</span> Datas de janeiro
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
        ${H("Total de Clientes",t.clientes_ativos+t.clientes_potenciais,"Clientes cadastrados no sistema",_("users"))}
        ${H("Total de Parceiros",0,"Parceiros cadastrados no sistema",_("handshake"))}
        ${H("Colaboradores",1,"Membros na sua equipe",_("briefcase"))}
        ${H("Orçamentos Criados",2,"Orçamentos gerados no sistema",_("file-text"))}
        ${H("Contratos Salvos",t.contratos_ativos,"Contratos salvos no sistema",_("file"))}
        ${H("Total de Projetos",t.projetos_em_andamento+t.projetos_concluidos,"Projetos cadastrados no total",_("rocket"))}
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
  `}let ce=[];async function ge(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{ce=await M.list(),yt(e)}catch{e.innerHTML='<div class="empty-state">Erro ao carregar clientes</div>'}}function yt(e){e.innerHTML=`
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
    
        ${ce.length===0?`<div class="empty-state"><div class="empty-state-icon">${_("users","w-12 h-12")}</div>Nenhum cliente cadastrado</div>`:`<div class="table-container" style="margin-top: var(--spacing-md);">
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
            ${ce.map(ft).join("")}
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
                <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}" title="Editar" style="padding: 6px; background: transparent; border: 1px solid var(--color-border);">${_("edit","w-4 h-4")}</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}" title="Excluir" style="padding: 6px; background: transparent; border: 1px solid var(--color-danger); color: var(--color-danger);">${_("trash","w-4 h-4")}</button>
            </div>
        </td>
    </tr>
    `}function ht(e){var v,m;const t=document.getElementById("cliente-modal"),a=document.getElementById("cliente-form"),r=document.getElementById("new-cadastro-select");r==null||r.addEventListener("change",()=>{if(r.value){x();const n=document.getElementById("tipo-pessoa");n.value="pf",n.dispatchEvent(new Event("change")),t.classList.add("active"),r.value=""}});const o=document.getElementById("tipo-pessoa"),i=document.getElementById("fields-pf"),s=document.getElementById("fields-pj"),h=document.getElementById("label-dados-basicos");o==null||o.addEventListener("change",()=>{o.value==="pf"?(i.style.display="block",s.style.display="none",h.textContent="1. Dados Pessoais",y("nome_pf",!0),y("cpf",!0),y("razao_social",!1),y("nome_fantasia",!1),y("cnpj",!1)):(i.style.display="none",s.style.display="block",h.textContent="1. Dados Básicos da Empresa",y("nome_pf",!1),y("cpf",!1),y("razao_social",!0),y("nome_fantasia",!0),y("cnpj",!0))});function y(n,w){const l=document.getElementById(n);l&&(w?l.setAttribute("required","true"):l.removeAttribute("required"))}(v=document.getElementById("close-modal"))==null||v.addEventListener("click",()=>t.classList.remove("active")),(m=document.getElementById("cancel-btn"))==null||m.addEventListener("click",()=>t.classList.remove("active")),t.addEventListener("click",n=>{n.target===t&&t.classList.remove("active")}),document.querySelectorAll(".edit-btn").forEach(n=>{n.addEventListener("click",()=>{const w=n.dataset.id,l=ce.find(c=>c.id===w);if(l){x(),document.getElementById("cliente-id").value=l.id,document.getElementById("modal-title").textContent="Editar Cadastro";const c=l.documento_tipo==="cnpj",f=document.getElementById("tipo-pessoa");f.value=c?"pj":"pf",f.dispatchEvent(new Event("change")),c?(document.getElementById("nome_fantasia").value=l.nome,document.getElementById("cnpj").value=l.documento,document.getElementById("inscricao_estadual").value=l.inscricao_estadual||"",document.getElementById("razao_social").value=l.razao_social||""):(document.getElementById("nome_pf").value=l.nome,document.getElementById("cpf").value=l.documento),document.getElementById("email").value=l.email||"",document.getElementById("telefone").value=l.telefone||"",document.getElementById("endereco").value=l.endereco||"",document.getElementById("setor").value=l.setor||"",document.getElementById("status").value=l.status||"potencial",document.getElementById("observacoes").value=l.observacoes||"",t.classList.add("active")}})}),document.querySelectorAll(".delete-btn").forEach(n=>{n.addEventListener("click",async()=>{const w=n.dataset.id;if(confirm("Tem certeza que deseja excluir este cadastro?"))try{await M.delete(w),g("Cadastro excluído com sucesso","success"),ge(e)}catch(l){g(l.message||"Erro ao excluir","error")}})}),a.addEventListener("submit",async n=>{n.preventDefault();const w=document.getElementById("cliente-id").value,c=document.getElementById("tipo-pessoa").value==="pf",f={nome:c?document.getElementById("nome_pf").value:document.getElementById("nome_fantasia").value,documento:c?document.getElementById("cpf").value:document.getElementById("cnpj").value,documento_tipo:c?"cpf":"cnpj",email:document.getElementById("email").value||void 0,telefone:document.getElementById("telefone").value||void 0,endereco:document.getElementById("endereco").value||void 0,setor:document.getElementById("setor").value||void 0,status:document.getElementById("status").value,observacoes:document.getElementById("observacoes").value||void 0},E={};if(c?(E.sexo=document.getElementById("sexo").value,E.data_nascimento=document.getElementById("data_nascimento").value,E.profissao=document.getElementById("profissao").value):(E.razao_social=document.getElementById("razao_social").value,E.inscricao_estadual=document.getElementById("inscricao_estadual").value,E.ramo_atividade=document.getElementById("ramo_atividade").value,E.porte_empresa=document.getElementById("porte_empresa").value,E.num_funcionarios=document.getElementById("num_funcionarios").value,E.faturamento_anual=document.getElementById("faturamento_anual").value),Object.keys(E).forEach(I=>!E[I]&&delete E[I]),Object.assign(f,E),Object.keys(E).length>0){const I=Object.entries(E).map(([$,k])=>`${$.replace(/_/g," ").toUpperCase()}: ${k}`).join(`
`);f.observacoes=f.observacoes?`${f.observacoes}

[DADOS ADICIONAIS]
${I}`:`[DADOS ADICIONAIS]
${I}`}try{w?(await M.update(w,f),g("Atualizado com sucesso","success")):(await M.create(f),g("Criado com sucesso","success")),t.classList.remove("active"),ge(e)}catch(I){g(I.message||"Erro ao salvar","error")}});function x(){a.reset(),document.querySelectorAll("details").forEach(n=>n.open=!1),document.querySelector("details").open=!0}}let A=[],$e=[],F=null;async function xt(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{[A,$e]=await Promise.all([ne.list(),M.list()]),Et(e)}catch(t){e.innerHTML='<div class="empty-state">Erro ao carregar projetos</div>',console.error(t)}}function Et(e){e.innerHTML=`
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
                        ${be()}
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
                     <h2 class="form-title" style="margin:0; display:flex; align-items:center; gap:8px;">${_("folder")} Lista de Projetos</h2>
                     <p class="form-subtitle" style="margin:0;">Gerencie seus projetos e acompanhe prazos.</p>
                </div>
            </div>

            <div id="projects-list-container">
                ${ye()}
            </div>
        </div>
    </div>
    `,_t(e)}function be(){return $e.map(e=>`<option value="${e.id}">${e.nome}</option>`).join("")}function ye(){return A.length===0?`<div class="empty-state"><div class="empty-state-icon">${_("folder-open","w-12 h-12")}</div>Nenhum projeto cadastrado ainda.</div>`:`
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
                        <td>${e.prazo_inicio?te(e.prazo_inicio):"-"}</td>
                        <td><span class="badge ${Be(e.status)}">${Le(e.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}" title="Editar">${_("edit","w-4 h-4")}</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}" title="Excluir">${_("trash","w-4 h-4")}</button>
                            </div>
                        </td>
                    </tr>
                  `}).join("")}
            </tbody>
          </table>
        </div>
    `}function _t(e){const t=document.getElementById("projeto-form"),a=document.getElementById("save-btn"),r=document.getElementById("cancel-btn"),o=document.getElementById("form-title"),i=document.getElementById("cliente_id");document.querySelectorAll('input[name="entity_type"]').forEach(s=>{s.addEventListener("change",h=>{h.target.value==="cliente"?(i.innerHTML='<option value="">Selecione...</option>'+be(),i.disabled=!1):(i.innerHTML='<option value="placeholder">Parceiro Exemplo (Mock)</option>',i.disabled=!0)})}),e.addEventListener("click",s=>{var x,v;const y=s.target.closest(".edit-btn");if(y){const m=y.dataset.id,n=A.find(w=>w.id===m);n&&(F=m,document.getElementById("projeto-id").value=n.id,document.getElementById("nome").value=n.nome,document.querySelector('input[name="entity_type"][value="cliente"]').checked=!0,i.innerHTML='<option value="">Selecione...</option>'+be(),i.value=n.cliente_id,document.getElementById("descricao").value=n.descricao||"",document.getElementById("prazo_inicio").value=((x=n.prazo_inicio)==null?void 0:x.split("T")[0])||"",document.getElementById("prazo_final").value=((v=n.prazo_final)==null?void 0:v.split("T")[0])||"",document.getElementById("status").value=n.status,o.textContent="Editar Projeto",a.textContent="Atualizar Projeto",r.style.display="block",window.scrollTo({top:0,behavior:"smooth"}))}}),e.addEventListener("click",async s=>{const y=s.target.closest(".delete-btn");if(y&&confirm("Tem certeza que deseja excluir este projeto?")){const x=y.dataset.id;try{await ne.delete(x),g("Projeto excluído","success"),A=A.filter(v=>v.id!==x),document.getElementById("projects-list-container").innerHTML=ye()}catch{g("Erro ao excluir projeto","error")}}}),r.addEventListener("click",()=>{Ce(t,a,r,o)}),t.addEventListener("submit",async s=>{if(s.preventDefault(),document.querySelector('input[name="entity_type"]:checked').value==="parceiro"){g("Cadastro de parcerias estará disponível em breve.","warning");return}const y={nome:document.getElementById("nome").value,cliente_id:document.getElementById("cliente_id").value,descricao:document.getElementById("descricao").value||void 0,prazo_inicio:document.getElementById("prazo_inicio").value||void 0,prazo_final:document.getElementById("prazo_final").value||void 0,status:document.getElementById("status").value};a.disabled=!0,a.textContent="Salvando...";try{if(F){const x=await ne.update(F,y);g("Projeto atualizado!","success");const v=A.findIndex(m=>m.id===F);v!==-1&&(A[v]=x)}else{const x=await ne.create(y);g("Projeto criado!","success"),A.push(x)}document.getElementById("projects-list-container").innerHTML=ye(),Ce(t,a,r,o)}catch(x){g(x.message||"Erro ao salvar","error")}finally{a.disabled=!1,a.textContent=F?"Atualizar Projeto":"Adicionar Projeto"}})}function Ce(e,t,a,r){F=null,e.reset(),r.textContent="Cadastrar Projeto",t.textContent="Adicionar Projeto",a.style.display="none";const o=document.querySelector('input[name="entity_type"][value="cliente"]');o&&(o.checked=!0,o.dispatchEvent(new Event("change")))}let pe=[],oe=[],se=[];async function le(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{[pe,oe,se]=await Promise.all([K.list(),M.list(),V.list()]),se||(se=[]),wt(e)}catch(t){console.error("Erro ao carregar dados:",t),e.innerHTML='<div class="empty-state">Erro ao carregar dados. Tente novamente.</div>'}}function wt(e){e.innerHTML=`
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
                            ${oe.map(t=>`<option value="${t.id}">${t.nome}</option>`).join("")}
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <select class="form-input form-select" id="gerador_orcamento_id" required style="width: 100%; padding: 0.75rem;">
                            <option value="">Selecione um orçamento...</option>
                            ${se.map(t=>`<option value="${t.id}">${t.titulo} [${t.status.toUpperCase()}] (${C(t.valor_total)})</option>`).join("")}
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
                ${oe.map(t=>`<option value="${t.id}">${t.nome}</option>`).join("")}
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
    `,Ct(),St(e)}function $t(){return pe.length===0?'<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum contrato cadastrado</div>':`
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
          ${pe.map(It).join("")}
        </tbody>
      </table>
    </div>`}function It(e){const t=oe.find(s=>s.id===e.cliente_id),a=new Date,r=new Date(e.data_termino),o=Math.ceil((r.getTime()-a.getTime())/(1e3*60*60*24));let i="badge-success";return o<=0?i="badge-danger":o<=30&&(i="badge-warning"),`
    <tr>
      <td><strong>${e.numero}</strong></td>
      <td>${(t==null?void 0:t.nome)||"-"}</td>
      <td>${C(e.valor)}</td>
      <td>${te(e.data_inicio)}</td>
      <td>
        ${te(e.data_termino)}
        <span class="badge ${i}" style="margin-left: 0.5rem;">
          ${o<=0?"Vencido":o+" dias"}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${e.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}">Excluir</button>
      </td>
    </tr>
  `}function Ct(){const e=document.querySelectorAll(".tab-btn"),t=document.querySelectorAll(".tab-content");e.forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.tab;e.forEach(o=>{o.style.borderBottom="2px solid transparent",o.style.color="#666",o.classList.remove("active")}),a.style.borderBottom="2px solid var(--primary-color)",a.style.color="inherit",a.classList.add("active"),t.forEach(o=>{o.style.display="none"}),document.getElementById(`tab-content-${r}`).style.display="block"})})}function St(e){var s,h,y,x;const t=document.getElementById("contrato-modal"),a=document.getElementById("contrato-form");(s=document.getElementById("add-contrato-btn"))==null||s.addEventListener("click",()=>{a.reset(),document.getElementById("contrato-id").value="",document.getElementById("modal-title").textContent="Novo Contrato",t.classList.add("active")});const r=()=>t.classList.remove("active");(h=document.getElementById("close-modal"))==null||h.addEventListener("click",r),(y=document.getElementById("cancel-btn"))==null||y.addEventListener("click",r),document.querySelectorAll(".edit-btn").forEach(v=>{v.addEventListener("click",()=>{const m=v.dataset.id,n=pe.find(w=>w.id===m);n&&(document.getElementById("contrato-id").value=n.id,document.getElementById("numero").value=n.numero,document.getElementById("cliente_id").value=n.cliente_id,document.getElementById("valor").value=n.valor.toString(),document.getElementById("data_inicio").value=n.data_inicio.split("T")[0],document.getElementById("data_termino").value=n.data_termino.split("T")[0],document.getElementById("condicoes").value=n.condicoes||"",document.getElementById("modal-title").textContent="Editar Contrato",t.classList.add("active"))})}),document.querySelectorAll(".delete-btn").forEach(v=>{v.addEventListener("click",async()=>{const m=v.dataset.id;if(confirm("Tem certeza?"))try{await K.delete(m),g("Contrato excluído","success"),le(e)}catch(n){g(n.message,"error")}})}),a.addEventListener("submit",async v=>{v.preventDefault();const m=document.getElementById("contrato-id").value,n={numero:document.getElementById("numero").value,cliente_id:document.getElementById("cliente_id").value,valor:parseFloat(document.getElementById("valor").value),data_inicio:document.getElementById("data_inicio").value,data_termino:document.getElementById("data_termino").value,condicoes:document.getElementById("condicoes").value||void 0};try{m?(await K.update(m,n),g("Contrato atualizado","success")):(await K.create(n),g("Contrato criado","success")),t.classList.remove("active"),le(e)}catch(w){g(w.message,"error")}});const o=document.querySelectorAll('input[name="tipo_entidade"]'),i=document.getElementById("gerador_entidade_id");o.forEach(v=>{v.addEventListener("change",m=>{m.target.value==="cliente"?i.innerHTML='<option value="">Selecione o Cliente...</option>'+oe.map(w=>`<option value="${w.id}">${w.nome}</option>`).join(""):i.innerHTML='<option value="">Selecione o Parceiro...</option><option value="p1">Parceiro Exemplo Ltda</option>'})}),(x=document.getElementById("btn-gerar-preview"))==null||x.addEventListener("click",async()=>{var l,c;const v=document.getElementById("btn-gerar-preview"),m=document.getElementById("gerador_entidade_id").value,n=document.getElementById("gerador_orcamento_id").value;if(!m||!n){g("Selecione o Cliente e o Orçamento","warning");return}const w=v.innerHTML;v.innerHTML="Gerando...",v.disabled=!0;try{const f=await K.preview({orcamento_id:n,cliente_id:m}),E=document.getElementById("tab-content-gerador");E.innerHTML=`
            <div style="max-width: 210mm; margin: 0 auto; padding: 20px; background: #525659;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; color: white;">
                    <button class="btn btn-secondary" id="btn-voltar-gerador">← Voltar</button>
                    <div>
                        <button class="btn btn-primary" id="btn-imprimir-contrato">🖨️ Imprimir / Salvar PDF</button>
                    </div>
                </div>
                <div id="contract-preview-paper" style="background: white; padding: 0; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                    ${f.html_content}
                </div>
            </div>
        `,(l=document.getElementById("btn-voltar-gerador"))==null||l.addEventListener("click",()=>{le(document.getElementById("app-container")||document.body)}),(c=document.getElementById("btn-imprimir-contrato"))==null||c.addEventListener("click",()=>{var k;const I=(k=document.getElementById("contract-preview-paper"))==null?void 0:k.innerHTML,$=window.open("","","height=700,width=900");$&&($.document.write("<html><head><title>Contrato</title>"),$.document.write("<style>@page { size: A4; margin: 0; } body { margin: 0; }</style>"),$.document.write("</head><body>"),$.document.write(I||""),$.document.write("</body></html>"),$.document.close(),$.focus(),$.print())})}catch(f){console.error(f),g(f.message||"Erro ao gerar minuta","error")}finally{v.innerHTML=w,v.disabled=!1}})}let ee=[],Ie=[],Z=null,Q=null;async function fe(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const[t,a,r]=await Promise.all([J.list(),M.list(),J.fluxoCaixa(6).catch(()=>null)]);ee=t,Ie=a,Q=r,Bt(e)}catch(t){e.innerHTML='<div class="empty-state">Erro ao carregar dados financeiros</div>',console.error(t)}}function Bt(e){e.innerHTML=`
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
                            <div class="type-option" data-value="recebimento">${_("arrow-down","w-4 h-4")} Receita</div>
                        </label>
                        <label>
                            <input type="radio" name="tipo_movimento" value="pagamento">
                            <div class="type-option" data-value="pagamento">${_("arrow-up","w-4 h-4")} Despesa</div>
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
            ${Q?Lt(Q):""}
            
            <!-- CHART AREA (Visual Placeholder for logic) -->
            ${Q?kt(Q):""}

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
                    ${ze(ee)}
                </div>
            </div>
        </div>
    </div>
    `,Tt(e)}function Lt(e){return`
    <div class="dashboard-grid">
        <div class="kpi-card">
            <span class="kpi-label">Receita Realizada</span>
            <span class="kpi-value" style="color: var(--color-success);">${C(e.total_recebimentos)}</span>
            <span class="kpi-sub">Total recebido no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Despesas Realizadas</span>
            <span class="kpi-value" style="color: var(--color-danger);">${C(e.total_pagamentos)}</span>
             <span class="kpi-sub">Total pago no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Saldo Líquido</span>
            <span class="kpi-value" style="color: ${e.saldo_total>=0?"var(--color-primary-light)":"var(--color-danger)"};">
                ${C(e.saldo_total)}
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
                        <span>Receitas: ${C(e.total_recebimentos)}</span>
                    </div>
                    <div class="tooltip-row">
                        <div class="dot" style="background: var(--color-danger)"></div>
                        <span>Despesas: ${C(e.total_pagamentos)}</span>
                    </div>
                     <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px; font-weight:600; color: ${e.saldo_total>=0?"#34d399":"#f87171"}">
                        Saldo: ${C(e.saldo_total)}
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
                            ${t.tipo==="recebimento"?"+":"-"} ${C(t.valor)}
                        </td>
                        <td>${te(t.data_vencimento)}</td>
                        <td><span class="badge ${Be(t.status)}">${Le(t.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${t.id}" title="Editar">${_("edit","w-4 h-4")}</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}" title="Excluir">${_("trash","w-4 h-4")}</button>
                            </div>
                        </td>
                    </tr>
                `}).join("")}
            </tbody>
        </table>
    </div>`}function Tt(e){var i;const t=document.getElementById("financeiro-form"),a=document.getElementById("save-btn"),r=document.getElementById("cancel-btn"),o=document.getElementById("form-title");(i=document.getElementById("filter-type"))==null||i.addEventListener("change",async s=>{const h=s.target.value,y=h?ee.filter(x=>x.tipo===h):ee;document.getElementById("finance-list-container").innerHTML=ze(y)}),e.addEventListener("click",s=>{const h=s.target,y=h.closest(".edit-btn"),x=h.closest(".delete-btn");if(y){const v=y.dataset.id,m=ee.find(n=>n.id===v);if(m){Z=v,document.getElementById("movimento-id").value=m.id,document.getElementById("descricao").value=m.descricao||"",document.getElementById("valor").value=m.valor.toString(),document.getElementById("data_vencimento").value=m.data_vencimento.split("T")[0],m.data_pagamento&&(document.getElementById("data_pagamento").value=m.data_pagamento.split("T")[0]),document.getElementById("cliente_id").value=m.cliente_id||"",document.getElementById("status").value=m.status;const n=document.querySelector(`input[name="tipo_movimento"][value="${m.tipo}"]`);n&&(n.checked=!0),o.textContent="Editar Lançamento",a.textContent="Atualizar Lançamento",r.style.display="block",window.scrollTo({top:0,behavior:"smooth"})}}if(x&&confirm("Tem certeza que deseja excluir?")){const v=x.dataset.id;J.delete(v).then(()=>{g("Excluído com sucesso","success"),fe(e)}).catch(()=>g("Erro ao excluir","error"))}}),r.addEventListener("click",()=>{Mt(t,a,r,o)}),t.addEventListener("submit",async s=>{s.preventDefault();const h=document.getElementById("status").value;let y=document.getElementById("data_pagamento").value;const x=document.getElementById("data_vencimento").value;h==="pago"&&!y&&(y=x);const v={tipo:document.querySelector('input[name="tipo_movimento"]:checked').value,descricao:document.getElementById("descricao").value,valor:parseFloat(document.getElementById("valor").value),data_vencimento:x,data_pagamento:y||void 0,cliente_id:document.getElementById("cliente_id").value||void 0,status:h},m=a.textContent;a.disabled=!0,a.textContent="Salvando...";try{Z?(await J.update(Z,v),g("Atualizado com sucesso!","success")):(await J.create(v),g("Lançamento criado!","success")),Z=null,fe(e)}catch(n){g(n.message||"Erro ao salvar","error"),a.disabled=!1,a.textContent=m}})}function Mt(e,t,a,r){Z=null,e.reset(),document.querySelector('input[name="tipo_movimento"][value="recebimento"]').checked=!0,r.textContent="Novo Lançamento",t.textContent="Salvar Lançamento",t.disabled=!1,a.style.display="none"}const je=[{id:"potencial",label:"Potencial",color:"#64748b"},{id:"contato",label:"Contato Realizado",color:"#3b82f6"},{id:"demonstracao",label:"Demonstração",color:"#8b5cf6"},{id:"orcamento",label:"Orçamento",color:"#eab308"},{id:"negociacao",label:"Negociação",color:"#f97316"},{id:"assinatura",label:"Assinatura",color:"#06b6d4"},{id:"fechado",label:"Fechado",color:"#22c55e"},{id:"encerrado",label:"Encerrado",color:"#ef4444"}];async function zt(e){e.innerHTML=`
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
    `;try{const t=await M.list();jt(t),At()}catch(t){console.error("Erro ao carregar funil:",t),g("Erro ao carregar funil de vendas","error")}}function jt(e){je.forEach(a=>{const r=document.getElementById(`stage-${a.id}`);r&&(r.innerHTML=""),he(a.id,0)});const t={};e.forEach(a=>{const r=a.pipeline_stage||"potencial",o=document.getElementById(`stage-${r}`);if(o){const i=Pt(a);o.appendChild(i),t[r]=(t[r]||0)+1}}),Object.keys(t).forEach(a=>he(a,t[a]))}function Pt(e){const t=document.createElement("div");t.className="kanban-card",t.draggable=!0,t.dataset.id=e.id,t.style.cssText=`
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
    `,t.addEventListener("dragstart",i=>{i.dataTransfer.setData("text/plain",e.id),i.dataTransfer.effectAllowed="move",t.style.opacity="0.5"}),t.addEventListener("dragend",()=>{t.style.opacity="1"}),t}function he(e,t){const a=document.getElementById(`count-${e}`);a&&(a.textContent=t.toString())}function At(){document.querySelectorAll(".kanban-body").forEach(t=>{t.addEventListener("dragover",a=>{a.preventDefault(),a.dataTransfer.dropEffect="move",t.style.background="rgba(0,0,0,0.05)"}),t.addEventListener("dragleave",()=>{t.style.background="transparent"}),t.addEventListener("drop",async a=>{a.preventDefault(),t.style.background="transparent";const r=a.dataTransfer.getData("text/plain"),o=t.id.replace("stage-",""),i=document.querySelector(`div[data-id="${r}"]`);if(i&&i.parentElement!==t){const s=i.parentElement;s.removeChild(i),Se(s),t.appendChild(i),Se(t);try{await M.update(r,{pipeline_stage:o}),g("Estágio atualizado","success")}catch(h){console.error(h),g("Erro ao atualizar estágio","error"),window.location.reload()}}})})}function Se(e){const t=e.id.replace("stage-",""),a=e.children.length;he(t,a)}const B={reuniao:"#6366f1",call:"#10b981",visita:"#f59e0b",outro:"#94a3b8"};async function Dt(e){e.innerHTML=`
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
                    ${["dom","seg","ter","qua","qui","sex","sáb"].map(u=>`
                        <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase;">${u}</div>
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
    `;const t=document.getElementById("agendamentos-list"),a=document.getElementById("agendamento-modal"),r=document.getElementById("agendamento-form"),o=document.getElementById("cliente-select"),i=document.getElementById("calendar-days"),s=document.getElementById("calendar-month-year"),h=document.getElementById("list-title"),y=document.getElementById("clear-filter"),x=document.querySelectorAll(".type-option"),v=document.getElementById("tipo-hidden");let m=new Date,n=null,w=[],l=null;async function c(){try{const[u,d]=await Promise.all([ie.list(),M.list()]);w=u,f(),q(d)}catch{g("Erro ao carregar dados","error")}}function f(){I(),E()}function E(){let u=[...w].sort((d,p)=>new Date(d.data_hora).getTime()-new Date(p.data_hora).getTime());if(n){const d=n.toISOString().split("T")[0];u=u.filter(p=>p.data_hora.startsWith(d)),h.innerHTML=`Compromissos - <span style="color: var(--color-primary);">${n.toLocaleDateString("pt-BR")}</span>`,y.style.display="block"}else{h.textContent="Próximos Compromissos",y.style.display="none";const d=new Date().toISOString();u=u.filter(p=>p.data_hora>=d.split("T")[0])}if(u.length===0){const d=n?"Nenhum compromisso para esta data.":"Nenhum compromisso agendado.";t.innerHTML=`<tr><td colspan="5" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);">
                <div style="font-size: 1.5rem; margin-bottom: 8px;">📅</div>
                ${d}
            </td></tr>`;return}t.innerHTML=u.map(d=>`
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
                    <div style="font-size: 0.75rem; color: var(--color-text-secondary);">${k(d.tipo)}</div>
                </td>
                <td>${d.cliente_nome||"N/A"}</td>
                <td>
                    <span class="badge ${$(d.status)}">${d.status.toUpperCase()}</span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${d.id}">✏️</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${d.id}">🗑️</button>
                </td>
            </tr>
        `).join(""),t.querySelectorAll(".edit-btn").forEach(d=>{d.addEventListener("click",()=>G(w.find(p=>p.id===d.dataset.id)))}),t.querySelectorAll(".delete-btn").forEach(d=>{d.addEventListener("click",async()=>{if(confirm("Deseja excluir este agendamento?"))try{await ie.delete(d.dataset.id),g("Agendamento excluído"),c()}catch{g("Erro ao excluir","error")}})})}function I(){const u=m.getFullYear(),d=m.getMonth(),p=["janeiro","fevereiro","março","abril","maio","julho","agosto","setembro","outubro","novembro","dezembro"];s.textContent=`${p[d]} ${u}`;const T=new Date(u,d,1).getDay(),L=new Date(u,d+1,0).getDate();i.innerHTML="";const O=new Date(u,d,0).getDate();for(let S=T-1;S>=0;S--)i.innerHTML+=`<div class="calendar-day disabled" style="padding: 10px; text-align: center; color: var(--color-text-muted); opacity: 0.3; font-size: 0.85rem;">${O-S}</div>`;for(let S=1;S<=L;S++){const N=new Date(u,d,S),Pe=`${u}-${String(d+1).padStart(2,"0")}-${String(S).padStart(2,"0")}`,Ae=w.filter(ue=>ue.data_hora.startsWith(Pe)),X=n&&n.toDateString()===N.toDateString(),me=new Date().toDateString()===N.toDateString(),P=document.createElement("div");P.className=`calendar-day ${X?"selected":""} ${me?"today":""}`,P.style.cssText=`
                padding: 10px 5px;
                text-align: center;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                border-radius: 8px;
                position: relative;
                transition: all 0.2s;
                ${X?"background: var(--color-primary); color: white;":""}
                ${!X&&me?"color: var(--color-primary); font-weight: 700;":""}
                ${!X&&!me?"color: var(--color-text);":""}
            `,X||(P.onmouseover=()=>P.style.background="var(--color-bg-tertiary)",P.onmouseout=()=>P.style.background="transparent");const De=Ae.slice(0,4).map(ue=>`
                <div style="width: 5px; height: 5px; background: ${B[ue.tipo]||B.outro}; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);"></div>
            `).join("");P.innerHTML=`
                <div style="position: relative; z-index: 1;">${S}</div>
                <div style="display: flex; gap: 2px; justify-content: center; position: absolute; bottom: 4px; left: 0; right: 0;">
                    ${De}
                </div>
            `,P.addEventListener("click",()=>{n=N,f()}),i.appendChild(P)}}function $(u){switch(u){case"realizado":return"badge-success";case"cancelado":return"badge-danger";default:return"badge-warning"}}function k(u){return{reuniao:"Reunião",call:"Call",visita:"Visita",outro:"Outro"}[u]||u}function q(u){o.innerHTML='<option value="">Selecione um cliente...</option>'+u.map(d=>`<option value="${d.id}">${d.nome}</option>`).join("")}function j(u){v.value=u,x.forEach(d=>{const p=d;p.dataset.value===u?(p.style.borderColor=B[u],p.style.background=`${B[u]}15`):(p.style.borderColor="var(--color-border)",p.style.background="transparent")})}function G(u){if(l=(u==null?void 0:u.id)||null,document.getElementById("modal-title").textContent=u?"Editar Agendamento":"Novo Agendamento",u)r.cliente_id.value=u.cliente_id,r.titulo.value=u.titulo,r.data_hora.value=u.data_hora.substring(0,16),r.duracao_minutos.value=u.duracao_minutos,r.status.value=u.status,r.descricao.value=u.descricao||"",j(u.tipo);else{r.reset();const d=n?new Date(n):new Date;n?d.setHours(new Date().getHours()+1,0,0,0):d.setMinutes(d.getMinutes()+30),r.data_hora.value=new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().substring(0,16),j("reuniao")}a.classList.add("active")}function R(){a.classList.remove("active"),l=null}document.getElementById("prev-month").addEventListener("click",()=>{m.setMonth(m.getMonth()-1),I()}),document.getElementById("next-month").addEventListener("click",()=>{m.setMonth(m.getMonth()+1),I()}),y.addEventListener("click",()=>{n=null,f()}),x.forEach(u=>{u.addEventListener("click",()=>{j(u.dataset.value)})}),document.getElementById("new-agendamento-btn").addEventListener("click",()=>G()),document.getElementById("close-modal").addEventListener("click",R),document.getElementById("cancel-btn").addEventListener("click",R),r.addEventListener("submit",async u=>{u.preventDefault();const d=new FormData(r),p={cliente_id:d.get("cliente_id"),titulo:d.get("titulo"),data_hora:d.get("data_hora"),duracao_minutos:parseInt(d.get("duracao_minutos")),tipo:v.value,status:d.get("status"),descricao:d.get("descricao")};try{l?(await ie.update(l,p),g("Agendamento atualizado")):(await ie.create(p),g("Agendamento criado")),R(),c()}catch{g("Erro ao salvar agendamento","error")}}),c()}let xe=null;async function Ot(e){var r;e.innerHTML=`
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
    `,await qt(document.getElementById("tab-content-calculator")),await Ee(document.getElementById("orcamentos-list-container"));const t=document.querySelectorAll(".tab-btn"),a=document.querySelectorAll(".tab-content");t.forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.tab;t.forEach(s=>{s.style.borderBottom="2px solid transparent",s.style.color="#666",s.classList.remove("active")}),o.style.borderBottom="2px solid var(--primary-color)",o.style.color="inherit",o.classList.add("active"),a.forEach(s=>s.style.display="none"),document.getElementById(`tab-content-${i}`).style.display="block",i==="history"&&Ee(document.getElementById("orcamentos-list-container"))})}),(r=document.getElementById("btn-config-pricing"))==null||r.addEventListener("click",()=>{re("/configuracoes")})}async function qt(e){var $,k,q,j,G,R,u,d;let t={};try{const p=await W.get("pricing_config?_t="+Date.now());p&&p.value&&(t=JSON.parse(p.value))}catch{console.warn("Using default pricing (fetch error)"),t={setup_base:2499,mensal_servidor:119.99,mensal_suporte:899.99,modulos:{crm:1500,erp:2e3,ai:2500}}}let a={premissas:{setup_base:t.setup_base||2499,mensal_servidor:t.mensal_servidor||119.99,mensal_suporte:t.mensal_suporte||899.99},custom_prices:{modulo_crm:(($=t.modulos)==null?void 0:$.crm)||1500,modulo_erp:((k=t.modulos)==null?void 0:k.erp)||2e3,modulo_ai_wa:((q=t.modulos)==null?void 0:q.ai)||2500,interpreta_texto:((j=t.customizacoes)==null?void 0:j.interpreta_texto)||199.99,interpreta_audio:((G=t.customizacoes)==null?void 0:G.interpreta_audio)||299.99,responde_texto:((R=t.customizacoes)==null?void 0:R.responde_texto)||199.99,responde_audio:((u=t.customizacoes)==null?void 0:u.responde_audio)||499.99,envio_email:((d=t.customizacoes)==null?void 0:d.envio_email)||199.99},modulos:{crm:!1,erp:!1,agente_ia_whatsapp:!0},integracoes:{agente_crm:!1,agente_erp:!1},customizacoes:{interpreta_texto:!1,interpreta_audio:!1,responde_texto:!1,responde_audio:!1,envio_email:!1},api_ia:{requisicoes_mes:0,custo_por_requisicao:.09}},r=null;e.innerHTML=`
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
    `;const o=document.getElementById("calc-form-v2"),i=document.querySelectorAll(".calc-trigger"),s=document.getElementById("disp-setup"),h=document.getElementById("disp-mensal"),y=document.getElementById("setup-items"),x=document.getElementById("mensal-items"),v=document.getElementById("final-cliente-id"),m=document.getElementById("save-budget-btn"),n=document.getElementById("cancel-edit-btn"),w=document.getElementById("editing-badge"),l=document.getElementById("validation-msg"),c=document.getElementById("final-titulo"),f=document.getElementById("final-status");try{const p=await M.list();v.innerHTML='<option value="">Selecione um cliente...</option>'+p.map(T=>`<option value="${T.id}">${T.nome}</option>`).join("")}catch(p){console.error(p)}async function E(){const p=new FormData(o);a={premissas:a.premissas,custom_prices:a.custom_prices,modulos:{crm:p.get("module_crm")==="on",erp:p.get("module_erp")==="on",agente_ia_whatsapp:p.get("module_ai_wa")==="on"},integracoes:{agente_crm:p.get("int_ag_crm")==="on",agente_erp:p.get("int_ag_erp")==="on"},customizacoes:{interpreta_texto:p.get("cust_text_in")==="on",interpreta_audio:p.get("cust_audio_in")==="on",responde_texto:p.get("cust_text_out")==="on",responde_audio:p.get("cust_audio_out")==="on",envio_email:p.get("cust_email")==="on"},api_ia:{requisicoes_mes:parseInt(p.get("api_reqs"))||0,custo_por_requisicao:parseFloat(p.get("api_cost"))||.09}};try{const L=await V.calculate({configuracao:a});s.textContent=C(L.valor_setup),h.textContent=C(L.valor_mensal),y.innerHTML=Object.entries(L.detalhes.setup||{}).map(([O,S])=>`
                <div class="item-row"><span>${O}</span><span>${C(S)}</span></div>
            `).join("")+`<div class="item-row subtotal"><span>Total Setup</span><span>${C(L.valor_setup)}</span></div>`,x.innerHTML=Object.entries(L.detalhes.mensal||{}).map(([O,S])=>`
                <div class="item-row"><span>${O}</span><span>${C(S)}</span></div>
            `).join("")+`<div class="item-row subtotal"><span>Total Mensal</span><span>${C(L.valor_mensal)}</span></div>`}catch(L){console.error("Calc error",L)}}xe=p=>{var T;r=p.id,a=p.configuracao,o.querySelector('[name="module_crm"]').checked=a.modulos.crm,o.querySelector('[name="module_erp"]').checked=a.modulos.erp,o.querySelector('[name="module_ai_wa"]').checked=a.modulos.agente_ia_whatsapp,o.querySelector('[name="int_ag_crm"]').checked=a.integracoes.agente_crm,o.querySelector('[name="int_ag_erp"]').checked=a.integracoes.agente_erp,o.querySelector('[name="cust_text_in"]').checked=a.customizacoes.interpreta_texto,o.querySelector('[name="cust_audio_in"]').checked=a.customizacoes.interpreta_audio,o.querySelector('[name="cust_text_out"]').checked=a.customizacoes.responde_texto,o.querySelector('[name="cust_audio_out"]').checked=a.customizacoes.responde_audio,o.querySelector('[name="cust_email"]').checked=a.customizacoes.envio_email,o.querySelector('[name="api_reqs"]').value=String(a.api_ia.requisicoes_mes),o.querySelector('[name="api_cost"]').value=String(a.api_ia.custo_por_requisicao),o.querySelector('[name="descricao"]').value=p.descricao||"",v.value=p.cliente_id,c.value=p.titulo,f.value=p.status,f.disabled=!1,w.style.display="block",n.style.display="block",m.innerHTML="💾 Atualizar Orçamento",E(),(T=document.querySelector('[data-tab="calculator"]'))==null||T.click()};function I(){r=null,o.reset(),c.value="",v.value="",f.value="rascunho",f.disabled=!0,w.style.display="none",n.style.display="none",m.innerHTML="💾 Salvar Orçamento",E()}n.addEventListener("click",I),i.forEach(p=>{p.addEventListener("change",E),p.addEventListener("input",E)}),m.addEventListener("click",async()=>{var S;const p=v.value,T=c.value||"Novo Orçamento v2",L=o.querySelector('textarea[name="descricao"]').value;if(!p){l.style.display="block";return}l.style.display="none";const O=m.innerHTML;m.innerHTML="Salvando...",m.disabled=!0;try{if(r){const N=f.value;await V.update(r,{titulo:T,descricao:L,configuracao:a,status:N}),g("Orçamento atualizado!","success")}else await V.create({cliente_id:p,titulo:T,descricao:L,configuracao:a}),g("Orçamento salvo!","success");I(),confirm("Deseja ver o histórico agora?")&&((S=document.querySelector('[data-tab="history"]'))==null||S.click())}catch{g("Erro ao salvar","error")}finally{m.innerHTML=O,m.disabled=!1}}),E()}async function Ee(e){e.innerHTML='<div class="loading"><div class="spinner"></div></div>';try{const t=await V.list();if(t.length===0){e.innerHTML='<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum orçamento salvo</div>';return}e.innerHTML=`
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
                            <td>${te(a.created_at)}</td>
                            <td><strong>${a.titulo}</strong></td>
                            <td>${a.cliente_nome||"-"}</td>
                            <td>${C(a.valor_setup)}</td>
                            <td>${C(a.valor_mensal)}</td>
                            <td>${C(a.valor_total)}</td>
                            <td><span class="badge badge-${Rt(a.status)}">${a.status.toUpperCase()}</span></td>
                            <td>
                                <button class="btn btn-secondary btn-sm view-orc-btn">👁️</button>
                                <button class="btn btn-danger btn-sm delete-orc-btn" data-id="${a.id}">🗑️</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `,document.querySelectorAll(".view-orc-btn").forEach(a=>{a.addEventListener("click",r=>{const o=r.target.closest("tr");if(o&&o.dataset.json){const i=JSON.parse(o.dataset.json);xe&&xe(i)}})}),document.querySelectorAll(".delete-orc-btn").forEach(a=>{a.addEventListener("click",async r=>{var i;const o=r.target.dataset.id||((i=r.target.parentElement)==null?void 0:i.dataset.id);if(o&&confirm("Tem certeza que deseja excluir este orçamento?"))try{await V.delete(o),g("Orçamento excluído","success"),Ee(e)}catch{g("Erro ao excluir","error")}})})}catch{e.innerHTML='<div class="empty-state">Erro ao carregar histórico.</div>'}}function Rt(e){switch(e){case"aprovado":return"success";case"rejeitado":return"danger";case"enviado":return"info";default:return"warning"}}async function Nt(e){var r,o,i,s,h,y,x,v,m,n,w;e.innerHTML=`
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
    `;const t=ke();t&&(document.getElementById("user-name").value=t.name,document.getElementById("user-email").value=t.email,document.getElementById("user-role").value=t.role.toUpperCase());try{const l=await W.get("pricing_config?_t="+Date.now());if(l&&l.value){const c=JSON.parse(l.value);document.getElementById("setup_base").value=c.setup_base??2499,document.getElementById("mensal_servidor").value=c.mensal_servidor??119.99,document.getElementById("mensal_suporte").value=c.mensal_suporte??899.99,document.getElementById("modulo_crm").value=((r=c.modulos)==null?void 0:r.crm)??1500,document.getElementById("modulo_erp").value=((o=c.modulos)==null?void 0:o.erp)??2e3,document.getElementById("modulo_ai_wa").value=((i=c.modulos)==null?void 0:i.ai)??2500,document.getElementById("cust_interpreta_texto").value=((s=c.customizacoes)==null?void 0:s.interpreta_texto)??199.99,document.getElementById("cust_interpreta_audio").value=((h=c.customizacoes)==null?void 0:h.interpreta_audio)??299.99,document.getElementById("cust_responde_texto").value=((y=c.customizacoes)==null?void 0:y.responde_texto)??199.99,document.getElementById("cust_responde_audio").value=((x=c.customizacoes)==null?void 0:x.responde_audio)??499.99,document.getElementById("cust_envio_email").value=((v=c.customizacoes)==null?void 0:v.envio_email)??199.99}else a()}catch{a()}function a(){document.getElementById("setup_base").value="2499.00",document.getElementById("mensal_servidor").value="119.99",document.getElementById("mensal_suporte").value="899.99",document.getElementById("modulo_crm").value="1500.00",document.getElementById("modulo_erp").value="2000.00",document.getElementById("modulo_ai_wa").value="2500.00",document.getElementById("cust_interpreta_texto").value="199.99",document.getElementById("cust_interpreta_audio").value="299.99",document.getElementById("cust_responde_texto").value="199.99",document.getElementById("cust_responde_audio").value="499.99",document.getElementById("cust_envio_email").value="199.99"}(m=document.getElementById("profile-form"))==null||m.addEventListener("submit",async l=>{l.preventDefault();try{if(!t)return;const c=document.getElementById("user-name").value,f=document.getElementById("user-email").value,E=document.getElementById("user-password").value,I={name:c,email:f};E&&(I.password=E),await U.updateProfile(t.id,I);const $=await U.me();localStorage.setItem("crm_user",JSON.stringify($)),g("Perfil atualizado com sucesso!","success"),setTimeout(()=>window.location.reload(),1e3)}catch(c){g(c.message||"Erro ao atualizar perfil","error")}}),(n=document.getElementById("btn-save-prices"))==null||n.addEventListener("click",async()=>{try{const l=document.getElementById("btn-save-prices"),c=l.textContent;l.textContent="Salvando...",l.disabled=!0;const f=(I,$)=>{const k=document.getElementById(I);if(!k)return $;const q=k.value.replace(",","."),j=parseFloat(q);return isNaN(j)?$:j},E={setup_base:f("setup_base",2499),mensal_servidor:f("mensal_servidor",119.99),mensal_suporte:f("mensal_suporte",899.99),modulos:{crm:f("modulo_crm",1500),erp:f("modulo_erp",2e3),ai:f("modulo_ai_wa",2500)},customizacoes:{interpreta_texto:f("cust_interpreta_texto",199.99),interpreta_audio:f("cust_interpreta_audio",299.99),responde_texto:f("cust_responde_texto",199.99),responde_audio:f("cust_responde_audio",499.99),envio_email:f("cust_envio_email",199.99)}};await W.update("pricing_config",{value:JSON.stringify(E),description:"Global Pricing Config"}),g("Preços atualizados com sucesso!","success"),setTimeout(()=>{l.textContent=c,l.disabled=!1},1e3)}catch(l){console.error("Save error:",l),g(l.message||"Erro ao salvar preços","error");const c=document.getElementById("btn-save-prices");c.textContent="Salvar Preços",c.disabled=!1}}),(w=document.getElementById("btn-diag"))==null||w.addEventListener("click",async()=>{const l=document.getElementById("diag-result");l.textContent="⏳ Iniciando diagnóstico...",l.style.color="blue";try{const c=50+Math.floor(Math.random()*10);l.textContent+=`
1. Tentando salvar valor teste: ${c}...`;const f={setup_base:2499,mensal_servidor:119.99,mensal_suporte:899.99,modulos:{crm:1500,erp:2e3,ai:2500},customizacoes:{interpreta_texto:c,interpreta_audio:c,responde_texto:c,responde_audio:c,envio_email:c}};await W.update("pricing_config",{value:JSON.stringify(f),description:"DIAGNOSTIC TEST"}),l.textContent+=`
2. Save OK (Request success).`,l.textContent+=`
3. Buscando valor do servidor...`;const E=await W.get("pricing_config?_t="+Date.now()),$=JSON.parse(E.value).customizacoes.interpreta_texto;l.textContent+=`
4. Valor retornado: ${$}`,$==c?(l.textContent+=`
✅ SUCESSO! O sistema está salvando corretamente.`,l.style.color="green",alert(`Diagnóstico: SUCESSO!
Valor salvo: ${c}
Valor lido: ${$}

Conclusão: O sistema funciona. O problema pode ser cache local. Recarregue a página.`)):(l.textContent+=`
❌ FALHA! O valor lido é diferente do salvo.`,l.style.color="red",alert(`Diagnóstico: FALHA!
Enviado: ${c}
Recebido: ${$}

Conclusão: O servidor ignorou a mudança.`))}catch(c){l.textContent+=`
❌ ERRO TÉCNICO: ${c.message}`,l.style.color="red",alert(`Diagnóstico: ERRO DE REQUEST
${c.message}`)}})}const _e=document.getElementById("app");async function D(e,t){if(!await Te()){de(_e);return}const r=gt(_e,e);await t(r)}z("/",async()=>{await Te()?re("/dashboard"):de(_e)});z("/dashboard",()=>D("dashboard",bt));z("/clientes",()=>D("clientes",ge));z("/funil",()=>D("funil",zt));z("/agendamento",()=>D("agendamento",Dt));z("/orcamento",()=>D("orcamento",Ot));z("/contratos",()=>D("contratos",le));z("/projetos",()=>D("projetos",xt));z("/financeiro",()=>D("financeiro",fe));z("/configuracoes",()=>D("configuracoes",Nt));we();
