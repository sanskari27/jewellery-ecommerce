import{E as G,o as u,j as e,q as p,p as C,v as I,G as O,t as A,B as W,b as B,S as F,r as f,H as D,J as z,F as x,D as H,N as w,u as P,a as M,K as V,M as $,P as U,I as q,C as J,O as K}from"./index-c8a2b0d9.js";import{c as Q}from"./chunk-2ZHRCML3-aa9a930f.js";import{a as X,b as Y}from"./index.esm-c7a3e4c3.js";import{u as Z}from"./useFilteredList-06053df3.js";import{a as ee}from"./index-af3e4ce2.js";import{E as te}from"./Each-bea6588f.js";import{c as se,T as j}from"./chunk-2OOHT3W5-e661ad39.js";import{V as re}from"./chunk-NTCQBYKE-2ca16325.js";import{H as N}from"./chunk-3ASUQ6PA-a2d24c74.js";import{m as ae}from"./chunk-ZHMYA64R-dc276fff.js";import{H as E}from"./chunk-7OLJDQMT-e46d341f.js";import{B as oe}from"./chunk-PULVB27S-5c8c41c1.js";import{S as ie}from"./chunk-VTV6N5LE-79a5b92f.js";import{B as R}from"./chunk-UVUR7MCU-52014813.js";import"./iconBase-bb05031b.js";import"./chunk-6CVSDS6C-2aa348d8.js";import"./chunk-56K2BSAJ-c484cfc7.js";import"./index-2842c37b.js";import"./chunk-7D6N5TE5-e13f872c.js";var[ne,k]=G("Card"),de=u(function(t,o){const{className:s,...i}=t,n=k();return e.jsx(p.div,{ref:o,className:C("chakra-card__body",s),__css:n.body,...i})}),le=u(function(t,o){const{className:s,justify:i,...n}=t,l=k();return e.jsx(p.div,{ref:o,className:C("chakra-card__footer",s),__css:{display:"flex",justifyContent:i,...l.footer},...n})}),ce=u(function(t,o){const{className:s,children:i,direction:n="column",justify:l,align:c,...r}=I(t),d=O("Card",t);return e.jsx(p.div,{ref:o,className:C("chakra-card",s),__css:{display:"flex",flexDirection:n,justifyContent:l,alignItems:c,position:"relative",minWidth:0,wordWrap:"break-word",...d.container},...r,children:e.jsx(ne,{value:d,children:i})})}),_=u(function(t,o){const{templateAreas:s,gap:i,rowGap:n,columnGap:l,column:c,row:r,autoFlow:d,autoRows:m,templateRows:h,autoColumns:g,templateColumns:v,...y}=t,b={display:"grid",gridTemplateAreas:s,gridGap:i,gridRowGap:n,gridColumnGap:l,gridAutoColumns:g,gridColumn:c,gridRow:r,gridAutoFlow:d,gridAutoRows:m,gridTemplateRows:h,gridTemplateColumns:v};return e.jsx(p.div,{ref:o,__css:b,...y})});_.displayName="Grid";function S(a){return ae(a,t=>t==="auto"?"auto":`span ${t}/span ${t}`)}var L=u(function(t,o){const{area:s,colSpan:i,colStart:n,colEnd:l,rowEnd:c,rowSpan:r,rowStart:d,...m}=t,h=se({gridArea:s,gridColumn:S(i),gridRow:S(r),gridColumnStart:n,gridColumnEnd:l,gridRowStart:d,gridRowEnd:c});return e.jsx(p.div,{ref:o,__css:h,...m})});L.displayName="GridItem";var T=u(function(t,o){const{borderLeftWidth:s,borderBottomWidth:i,borderTopWidth:n,borderRightWidth:l,borderWidth:c,borderStyle:r,borderColor:d,...m}=A("Divider",t),{className:h,orientation:g="horizontal",__css:v,...y}=I(t),b={vertical:{borderLeftWidth:s||l||c||"1px",height:"100%"},horizontal:{borderBottomWidth:i||n||c||"1px",width:"100%"}};return e.jsx(p.hr,{ref:o,"aria-orientation":g,...y,__css:{...m,border:"0",borderColor:d,borderStyle:r,...b[g],...v},className:C("chakra-divider",h)})});T.displayName="Divider";var me=Q({displayName:"EditIcon",path:e.jsxs("g",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeWidth:"2",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})});const Te=()=>{const a=W(),{list:t}=B(s=>s[F.COLLECTIONS]);f.useEffect(()=>(D({title:"Collections",icon:Y,link:w.COLLECTIONS,actions:e.jsx(N,{children:e.jsx(ee,{})})}),()=>{z()}),[]);const o=Z(t,{name:1});return e.jsxs(x,{direction:"column",padding:"1rem",justifyContent:"start",children:[e.jsx(E,{color:"black",children:e.jsxs(x,{width:"98%",justifyContent:"space-between",alignItems:"flex-end",children:["Collections",e.jsx(H,{to:w.COLLECTIONS+"/new",children:e.jsx(R,{variant:"outline",size:"sm",colorScheme:"green",leftIcon:e.jsx(X,{}),children:"Create Collection"})})]})}),e.jsxs(oe,{marginTop:"1rem",width:"98%",pb:"5rem",children:[e.jsxs(j,{textAlign:"right",color:"black",children:[o.length," records found."]}),e.jsx(_,{alignItems:"flex-start",templateColumns:"repeat(3, 1fr)",gap:6,children:e.jsx(te,{items:o,render:s=>e.jsx(L,{children:e.jsx(ue,{collection:s})})})})]}),a]})};function ue({collection:a}){const t=P(),o=M(),[s,i]=f.useState(0),[n,l]=f.useState(null);f.useEffect(()=>{V.get(`${$}media/${a.image}`,{responseType:"blob",onDownloadProgress:r=>{r.total?i(Math.round(r.loaded*100/r.total)):i(-1)}}).then(r=>{const{data:d}=r,m=window.URL.createObjectURL(d);l(m)})},[a]);function c(r,d){J.updateVisibility(r,d),o(K({id:r,visible:d}))}return e.jsxs(ce,{size:"sm",rounded:"2xl",children:[e.jsx(de,{children:n?e.jsx(q,{src:n,aspectRatio:"16/9",borderRadius:"lg"}):e.jsxs(e.Fragment,{children:[e.jsx(j,{textAlign:"center",className:"animate-pulse",children:"loading..."}),e.jsx(U,{mt:"0.25rem",isIndeterminate:s===-1,value:s,size:"xs",colorScheme:"green",rounded:"lg"})]})}),e.jsx(T,{}),e.jsx(le,{children:e.jsxs(re,{alignItems:"stretch",width:"full",children:[e.jsxs(x,{justifyContent:"space-between",mt:"3",children:[e.jsx(E,{size:"md",children:a.name}),e.jsxs(N,{alignItems:"center",children:[e.jsx(j,{children:"Home Collection"}),e.jsx(ie,{size:"md",isChecked:a.visibleAtHome,onChange:r=>{c(a.id,r.target.checked)}})]})]}),e.jsx(x,{gap:"0.5rem",alignItems:"center",children:e.jsxs(j,{children:["Tags : ",e.jsx("span",{style:{fontWeight:"500"},children:a.tags.join(", ")})]})}),e.jsx(x,{gap:"2",children:e.jsx(R,{flexGrow:1,leftIcon:e.jsx(me,{}),variant:"solid",colorScheme:"green",onClick:()=>t(w.COLLECTIONS+"/edit/"+a.id),children:"Edit"})})]})})]})}export{Te as default};
