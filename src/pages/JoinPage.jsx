import { ArrowLeft, ArrowRight, BriefcaseBusiness, Calendar, Check, ChevronDown, FileText, Globe2, GraduationCap, Image, Mail, MapPin, Phone, Sparkles, Upload, User, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { submitMembership } from '../services/membershipService';
import { useAuth } from '../context/AuthContext';

const interests = ['Marketing', 'Management', 'Accounting', 'Finance', 'Information Technology', 'Human Resource Management', 'Training & Development', 'Project Management', 'Economics', 'Ethics', 'Other'];
const initial = { fullName:'', designation:'', institution:'', country:'', nationality:'', dateOfBirth:'', gender:'', email:'', phone:'', address:'', interests:[], contribution:'', profilePicture:null, cv:null };

function Field({ icon: Icon, label, name, error, children, ...props }) {
  return <label className={`field ${error ? 'field--error':''}`}><span>{label}<em>*</em></span><div className="input-wrap">{Icon && <Icon size={19}/>} {children || <input name={name} {...props}/>}</div>{error && <small>{error}</small>}</label>;
}

function UploadField({ label, name, accept, file, icon: Icon, hint, error, onChange, onClear }) {
  return <div className={`field upload-field ${error ? 'field--error':''}`}><span>{label}<em>*</em></span><label className={file ? 'upload-box has-file':'upload-box'}><input type="file" name={name} accept={accept} onChange={onChange}/><span className="upload-icon">{file ? <Icon size={22}/>:<Upload size={22}/>}</span><span className="upload-copy">{file ? <><strong>{file.name}</strong><small>{(file.size/1024/1024).toFixed(2)} MB</small></>:<><strong>Choose a file</strong><small>{hint}</small></>}</span>{file&&<button type="button" className="upload-clear" onClick={e=>{e.preventDefault();onClear();}} aria-label={`Remove ${label}`}><X size={17}/></button>}</label>{error&&<small>{error}</small>}</div>;
}

export default function JoinPage() {
  const { user, membership, refresh } = useAuth();
  const [form,setForm]=useState(initial); const [errors,setErrors]=useState({}); const [status,setStatus]=useState('idle'); const [submitError,setSubmitError]=useState('');
  useEffect(()=>{
    if (!user) return;
    setForm(value=>({
      ...value,
      fullName: value.fullName || user.name || '',
      email: user.email || value.email,
    }));
  },[user]);
  const completion=useMemo(()=>Math.round(Object.entries(form).filter(([,v])=>Array.isArray(v)?v.length:v).length/14*100),[form]);
  const change=e=>{const {name,value}=e.target;setForm(v=>({...v,[name]:value}));setErrors(v=>({...v,[name]:undefined}));};
  const toggleInterest=value=>{setForm(v=>({...v,interests:v.interests.includes(value)?v.interests.filter(x=>x!==value):[...v.interests,value]}));setErrors(v=>({...v,interests:undefined}));};
  const selectFile=(name,file)=>{if(!file)return;setForm(v=>({...v,[name]:file}));setErrors(v=>({...v,[name]:undefined}));};
  const validate=()=>{const next={}; ['fullName','designation','institution','country','nationality','dateOfBirth','gender','email','phone','address','contribution','profilePicture','cv'].forEach(k=>{if(!form[k]) next[k]='This field is required.'}); if(!/^\S+@\S+\.\S+$/.test(form.email)) next.email='Enter a valid email address.'; if(!form.interests.length) next.interests='Choose at least one area.'; if(form.profilePicture&&!['image/jpeg','image/png','image/webp'].includes(form.profilePicture.type))next.profilePicture='Use a JPG, PNG, or WebP image.';if(form.profilePicture?.size>5*1024*1024)next.profilePicture='Image must be 5 MB or smaller.';if(form.cv&&form.cv.type!=='application/pdf')next.cv='CV must be a PDF file.';if(form.cv?.size>10*1024*1024)next.cv='PDF must be 10 MB or smaller.'; return next;};
  const submit=async e=>{
    e.preventDefault();
    const next=validate();
    setErrors(next);
    if(Object.keys(next).length){document.querySelector('.field--error, .choice-error')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    setStatus('loading');
    setSubmitError('');
    try{
      await submitMembership(form);
      await refresh();
      setStatus('success');
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(error){
      const fieldErrors=Object.fromEntries(Object.entries(error.errors||{}).filter(([key])=>Object.hasOwn(initial,key)));
      setErrors(fieldErrors);
      setSubmitError(error.message||'We couldn’t submit your application. Please try again.');
      setStatus('error');
      if(Object.keys(fieldErrors).length)requestAnimationFrame(()=>document.querySelector('.field--error, .choice-error')?.scrollIntoView({behavior:'smooth',block:'center'}));
    }
  };
  if(membership && status !== 'success') return <><Header light/><main className="success-page"><div className="success-card"><div className="success-icon"><Check/></div><p className="eyebrow eyebrow--blue">Application already submitted</p><h1>Your application is {membership.status}.</h1><p>You can follow review updates and administrator notes in your portal.</p><Link className="button" to="/portal">Open my portal <ArrowRight size={18}/></Link></div></main></>;
  if(status==='success') return <><Header light/><main className="success-page"><div className="success-card"><div className="success-icon"><Check/></div><p className="eyebrow eyebrow--blue">Application received</p><h1>Your review has started.</h1><p>Thank you, {form.fullName}. Your application is pending and its status is available in your portal.</p><Link className="button" to="/portal">Open my portal <ArrowRight size={18}/></Link></div></main></>;
  return <div className="join-page"><Header light/><main className="join-layout container"><Link to="/" className="page-back-link"><ArrowLeft size={17}/> Back to home</Link><section className="form-card">
    <div className="form-panel"><div className="form-heading"><span>Membership application</span><h2>Tell us about yourself</h2><p>Complete the details below to join the ASMMR community. Fields marked with an asterisk are required.</p></div><div className="form-overview"><div className="benefit-list"><div><Users/><span><strong>A worldwide network</strong>Connect across disciplines and borders.</span></div><div><GraduationCap/><span><strong>Grow your research</strong>Discover insights and opportunities.</span></div><div><Sparkles/><span><strong>Create real impact</strong>Contribute to a better tomorrow.</span></div></div><div className="form-progress"><span><strong>{completion}%</strong> complete</span><div><i style={{width:`${completion}%`}}/></div></div></div><form onSubmit={submit} noValidate>
      <div className="form-section"><div className="section-title"><span>01</span><div><h3>Professional details</h3><p>Your current role and affiliation.</p></div></div><div className="form-grid"><Field icon={User} label="Full name" name="fullName" placeholder="e.g. Ayesha Khan" value={form.fullName} onChange={change} error={errors.fullName}/><Field icon={BriefcaseBusiness} label="Designation" name="designation" placeholder="e.g. Assistant Professor" value={form.designation} onChange={change} error={errors.designation}/><Field icon={GraduationCap} label="University / institution" name="institution" placeholder="Institution name" value={form.institution} onChange={change} error={errors.institution}/><Field icon={MapPin} label="Country" name="country" placeholder="Country of affiliation" value={form.country} onChange={change} error={errors.country}/></div></div>
      <div className="form-section"><div className="section-title"><span>02</span><div><h3>Personal information</h3><p>A little more about you.</p></div></div><div className="form-grid"><UploadField label="Profile picture" name="profilePicture" accept="image/jpeg,image/png,image/webp" file={form.profilePicture} icon={Image} hint="JPG, PNG or WebP · max 5 MB" error={errors.profilePicture} onChange={e=>selectFile('profilePicture',e.target.files[0])} onClear={()=>setForm(v=>({...v,profilePicture:null}))}/><Field icon={Globe2} label="Nationality" name="nationality" placeholder="Your nationality" value={form.nationality} onChange={change} error={errors.nationality}/><Field icon={Calendar} label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={change} error={errors.dateOfBirth}/><Field icon={Users} label="Gender" error={errors.gender}><select name="gender" value={form.gender} onChange={change}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select><ChevronDown className="select-chevron" size={18}/></Field></div></div>
      <div className="form-section"><div className="section-title"><span>03</span><div><h3>Contact details</h3><p>How we can reach you.</p></div></div><div className="form-grid"><Field icon={Mail} label="Email address" name="email" type="email" value={form.email} readOnly aria-readonly="true" error={errors.email}/><Field icon={Phone} label="Phone number" name="phone" type="tel" placeholder="+92 300 0000" value={form.phone} onChange={change} error={errors.phone}/><Field icon={MapPin} label="Permanent postal address" name="address" placeholder="Street, city and postal code" value={form.address} onChange={change} error={errors.address}/></div></div>
      <div className="form-section"><div className="section-title"><span>04</span><div><h3>Research & contribution</h3><p>Where your interests and expertise meet.</p></div></div><UploadField label="Curriculum vitae" name="cv" accept="application/pdf" file={form.cv} icon={FileText} hint="PDF only · max 10 MB" error={errors.cv} onChange={e=>selectFile('cv',e.target.files[0])} onClear={()=>setForm(v=>({...v,cv:null}))}/><fieldset className={errors.interests?'choice-error':''}><legend>Areas of interest <em>*</em></legend><div className="interest-grid">{interests.map(item=><label className={form.interests.includes(item)?'interest is-selected':'interest'} key={item}><input type="checkbox" checked={form.interests.includes(item)} onChange={()=>toggleInterest(item)}/><span>{form.interests.includes(item)&&<Check size={14}/>}</span>{item}</label>)}</div>{errors.interests&&<small>{errors.interests}</small>}</fieldset><Field label="How can you contribute to the development of research in the Asian region?" error={errors.contribution}><textarea name="contribution" rows="5" maxLength="1200" placeholder="Share your experience, ideas, or goals…" value={form.contribution} onChange={change}/><span className="char-count">{form.contribution.length}/1200</span></Field></div>
      {status==='error'&&<div className="api-error" role="alert">{submitError}</div>}<div className="form-footer"><p>By submitting, you agree to be contacted about your application.</p><button className="button" disabled={status==='loading'}>{status==='loading'?'Submitting…':'Submit application'}<ArrowRight size={18}/></button></div>
    </form></div></section></main></div>;
}
