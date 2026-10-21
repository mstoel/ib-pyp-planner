import { useEffect, useState } from 'react';
import { Cloud, RefreshCw, FolderOpen, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CloudRow = { id:string; title:string; year_group:string|null; transdisciplinary_theme:string|null; updated_at:string; plan:Record<string,unknown>; lessons:unknown[] };
type Props = { onClose:()=>void; onLoad:(row:CloudRow)=>void };

export default function CloudDrafts({onClose,onLoad}:Props) {
 const [rows,setRows]=useState<CloudRow[]>([]); const [busy,setBusy]=useState(true); const [error,setError]=useState('');
 async function refresh(){
  if(!supabase){setError('Cloud connection is not configured.');setBusy(false);return;}
  setBusy(true);setError('');
  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user){setRows([]);setError('Please sign in to see your cloud drafts.');setBusy(false);return;}
  const {data,error:queryError}=await supabase.from('unit_drafts').select('id,title,year_group,transdisciplinary_theme,updated_at,plan,lessons').eq('owner_id',user.id).order('updated_at',{ascending:false});
  if(queryError){setError(queryError.message);setRows([]);}else setRows((data||[]) as CloudRow[]);
  setBusy(false);
 }
 useEffect(()=>{void refresh();},[]);
 return <div className="overlay" onClick={onClose}><section className="modal cloudDraftModal" onClick={e=>e.stopPropagation()} style={{maxWidth:680,maxHeight:'85vh',overflow:'auto'}}><button className="close" onClick={onClose}><X size={20}/></button><div className="eyebrow">YOUR ACCOUNT</div><h2><Cloud size={21} style={{verticalAlign:'middle',marginRight:8}}/>My cloud drafts</h2><p>These drafts are stored in your Supabase account. Only drafts your account is permitted to read will appear here.</p><div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}><button className="btn light" onClick={()=>void refresh()} disabled={busy}><RefreshCw size={14}/> Refresh</button></div>{busy?<p>Loading your drafts…</p>:error?<p role="alert" style={{color:'#a34b35'}}>{error}</p>:rows.length===0?<div className="note"><FolderOpen/><div><b>No cloud drafts yet</b><p>Open a unit and press “Save draft” while signed in to create your first cloud copy.</p></div></div>:<div style={{display:'grid',gap:9}}>{rows.map(row=><article key={row.id} style={{border:'1px solid #e2e8e8',borderRadius:10,padding:14,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><div><b style={{fontSize:13}}>{row.title||'Untitled unit'}</b><p style={{fontSize:11,color:'#71808a',margin:'5px 0'}}>{[row.year_group,row.transdisciplinary_theme].filter(Boolean).join(' · ')||'Unit details not set'}</p><small style={{color:'#87939a'}}>Updated {new Date(row.updated_at).toLocaleString()}</small></div><button className="btn primary" onClick={()=>onLoad(row)}><FolderOpen size={14}/> Open draft</button></article>)}</div>}</section></div>;
}
