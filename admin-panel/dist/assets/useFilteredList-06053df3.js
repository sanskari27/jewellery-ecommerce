import{ay as i,r as o}from"./index-c8a2b0d9.js";function u(t,e){const{searchText:s}=i();return o.useMemo(()=>t.filter(a=>{for(const r in e)if(r in a&&e[r]===1&&a[r].toLowerCase().startsWith(s.toLowerCase()))return!0;return!1}),[t,s,e])}export{u};
