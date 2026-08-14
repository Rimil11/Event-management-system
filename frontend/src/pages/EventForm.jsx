import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, SERVER_URL } from "../api";
import Message from "../components/Message";

const empty={name:"",description:"",date:"",time:"",venue:"",maximumCapacity:""};

export default function EventForm(){
  const {id}=useParams(), navigate=useNavigate(), editing=Boolean(id);
  const [form,setForm]=useState(empty),[image,setImage]=useState(null),[currentImage,setCurrentImage]=useState("");
  const [error,setError]=useState(""),[loading,setLoading]=useState(false);

  useEffect(()=>{ if(editing) api.getEvent(id).then(e=>{
    setForm({name:e.name,description:e.description,date:e.date,time:e.time,venue:e.venue,maximumCapacity:e.maximumCapacity});
    setCurrentImage(e.imageUrl||"");
  }).catch(e=>setError(e.message)); },[editing,id]);

  const update=(k,v)=>setForm({...form,[k]:v});
  const selectImage=e=>{
    const f=e.target.files[0]; if(!f)return;
    if(!f.type.startsWith("image/")) return setError("Please select an image file.");
    if(f.size>5*1024*1024) return setError("Image must be 5 MB or smaller.");
    setError(""); setImage(f);
  };

  async function submit(e){
    e.preventDefault(); setError("");
    if(Object.values(form).some(v=>!v)) return setError("Please fill all event fields.");
    if(Number(form.maximumCapacity)<1) return setError("Maximum capacity must be at least 1.");
    try{
      setLoading(true); const data=new FormData();
      Object.entries(form).forEach(([k,v])=>data.append(k,k==="maximumCapacity"?Number(v):v));
      if(image)data.append("image",image);
      editing?await api.updateEvent(id,data):await api.createEvent(data);
      navigate("/admin-events");
    }catch(e){setError(e.message)}finally{setLoading(false)}
  }

  return <section className="form-page">
    <Link className="back-link" to="/admin-events">← Back to events</Link>
    <div className="form-card">
      <div className="page-heading compact"><div><span className="eyebrow">ADMIN / ORGANIZER</span><h1>{editing?"Edit Event":"Create Event"}</h1><p>{editing?"Update the event information.":"Add a new event for users."}</p></div></div>
      {error&&<Message>{error}</Message>}
      <form className="form event-form" onSubmit={submit}>
        <div className="form-grid">
          <div className="field full"><label>Event name</label><input value={form.name} onChange={e=>update("name",e.target.value)}/></div>
          <div className="field full"><label>Description</label><textarea rows="5" value={form.description} onChange={e=>update("description",e.target.value)}/></div>
          <div className="field"><label>Date</label><input type="date" value={form.date} onChange={e=>update("date",e.target.value)}/></div>
          <div className="field"><label>Time</label><input type="time" value={form.time} onChange={e=>update("time",e.target.value)}/></div>
          <div className="field"><label>Venue</label><input value={form.venue} onChange={e=>update("venue",e.target.value)}/></div>
          <div className="field"><label>Maximum capacity</label><input type="number" min="1" value={form.maximumCapacity} onChange={e=>update("maximumCapacity",e.target.value)}/></div>
          <div className="field full">
            <label>Event image</label><input type="file" accept="image/*" onChange={selectImage}/>
            <small className="field-help">High-quality JPG, PNG, or WEBP up to 5 MB.</small>
            {currentImage&&!image&&<img className="image-preview" src={`${SERVER_URL}${currentImage}`} alt="Current event"/>}
            {image&&<img className="image-preview" src={URL.createObjectURL(image)} alt="Selected event"/>}
          </div>
        </div>
        <div className="form-actions"><Link className="button secondary" to="/admin-events">Cancel</Link><button className="button primary" disabled={loading}>{loading?"Saving...":editing?"Update Event":"Create Event"}</button></div>
      </form>
    </div>
  </section>;
}
