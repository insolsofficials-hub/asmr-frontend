import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronDown, GraduationCap, FileText, Image, Mail, MapPin, Phone, Upload, User, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { submitEventRegistration } from '../services/eventRegistrationService';


const initial = { fullName: '', designation: '', institution: '', country: '', gender: '', email: '', phone: '', address: '', cv: null };

function Field({ icon: Icon, label, name, error, children, ...props }) {
  return <label className={`field ${error ? 'field--error' : ''}`}><span>{label}<em>*</em></span><div className="input-wrap">{Icon && <Icon size={19} />} {children || <input name={name} {...props} />}</div>{error && <small>{error}</small>}</label>;
}

function UploadField({ label, name, accept, file, icon: Icon, hint, error, onChange, onClear, required = true }) {
  return <div className={`field upload-field ${error ? 'field--error' : ''}`}><span>{label}{required && <em>*</em>}</span><label className={file ? 'upload-box has-file' : 'upload-box'}><input type="file" name={name} accept={accept} onChange={onChange} /><span className="upload-icon">{file ? <Icon size={22} /> : <Upload size={22} />}</span><span className="upload-copy">{file ? <><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></> : <><strong>Choose a file</strong><small>{hint}</small></>}</span>{file && <button type="button" className="upload-clear" onClick={e => { e.preventDefault(); onClear(); }} aria-label={`Remove ${label}`}><X size={17} /></button>}</label>{error && <small>{error}</small>}</div>;
}

export default function EventRegisterPage() {
  const [form, setForm] = useState(initial); const [errors, setErrors] = useState({}); const [status, setStatus] = useState('idle'); const [submitError, setSubmitError] = useState('');
  const change = e => { const { name, value } = e.target; setForm(v => ({ ...v, [name]: value })); setErrors(v => ({ ...v, [name]: undefined })); };
  const selectFile = (name, file) => { if (!file) return; setForm(v => ({ ...v, [name]: file })); setErrors(v => ({ ...v, [name]: undefined })); };
  const validate = () => { const next = {};['fullName', 'designation', 'institution', 'country', 'gender', 'email', 'phone', 'address', 'cv'].forEach(k => { if (!form[k]) next[k] = 'This field is required.' }); if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'; if (form.phone && !/^\d{11}$/.test(form.phone)) next.phone = 'Enter exactly 11 digits for your phone number.';if (form.cv && form.cv.type !== 'application/pdf') next.cv = 'Use a PDF file.'; if (form.cv?.size > 10 * 1024 * 1024) next.cv = 'CV must be 10 MB or smaller.'; return next; };
  const submit = async e => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) { document.querySelector('.field--error, .choice-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setStatus('loading');
    setSubmitError('');
    try {
      await submitEventRegistration(form);

      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const fieldErrors = Object.fromEntries(Object.entries(error.errors || {}).filter(([key]) => Object.hasOwn(initial, key)));
      setErrors(fieldErrors);
      setSubmitError(error.message || 'We couldn’t submit your application. Please try again.');
      setStatus('error');
      if (Object.keys(fieldErrors).length) requestAnimationFrame(() => document.querySelector('.field--error, .choice-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    }
  };
  if (status === 'success') return <><Header light /><main className="success-page"><div className="success-card"><div className="success-icon"><Check /></div><p className="eyebrow eyebrow--blue">Event registration received</p><h1>Your registration has been submitted.</h1><p>Thank you, {form.fullName}. Your event registration has been saved and is pending review.</p><Link className="button" to="https://ibt.asmmr.org/">Back to home <ArrowRight size={18} /></Link></div></main></>;
  return <div className="join-page"><Header light /><main className="join-layout container"><Link to="/join" className="page-back-link"><ArrowLeft size={17} /> Back to home</Link><section className="form-card">
    <div className="form-panel"><div className="form-heading"><span>Event registration</span><h2>Tell us about yourself</h2><p>Complete the details below to register for the event. Fields marked with an asterisk are required.</p></div>
    <form onSubmit={submit} noValidate>
      <div className="form-section"><div className="section-title"><span>01</span><div><h3>Professional details</h3><p>Your current role and affiliation.</p></div></div><div className="form-grid"><Field icon={User} label="Full name" name="fullName" placeholder="e.g. Ayesha Khan" value={form.fullName} onChange={change} error={errors.fullName} /><Field icon={BriefcaseBusiness} label="Designation" name="designation" placeholder="e.g. Assistant Professor" value={form.designation} onChange={change} error={errors.designation} /><Field icon={GraduationCap} label="University / institution" name="institution" placeholder="Institution name" value={form.institution} onChange={change} error={errors.institution} /><Field icon={MapPin} label="Country" name="country" placeholder="Pakistan" value={form.country} onChange={change} error={errors.country} /></div></div>
      <div className="form-section"><div className="section-title"><span>02</span><div><h3>Personal information</h3><p>A little more about you.</p></div></div><div className="form-grid">
      <UploadField label="Upload CV" name="cv" required={true} accept="application/pdf" file={form.cv} icon={FileText} hint="PDF, max 10 MB" error={errors.cv} onChange={e => selectFile('cv', e.target.files[0])} onClear={() => setForm(v => ({ ...v, cv: null }))} />
      <Field icon={Users} label="Gender" error={errors.gender}><select name="gender" value={form.gender} onChange={change}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select><ChevronDown className="select-chevron" size={18} /></Field></div></div>
      <div className="form-section"><div className="section-title"><span>03</span><div><h3>Contact details</h3><p>How we can reach you.</p></div></div><div className="form-grid"><Field icon={Mail} label="Email address" name="email" type="email" value={form.email} onChange={change} error={errors.email} /><Field icon={Phone} label="Phone number"  minLength={11} maxLength={11} pattern="[0-9]{11}" inputMode="numeric" name="phone" type="tel" placeholder="03001234567" value={form.phone} onChange={change} error={errors.phone}/><Field icon={MapPin} label="Permanent postal address" name="address" placeholder="Street, city and postal code" value={form.address} onChange={change} error={errors.address} /></div></div>
      {status === 'error' && <div className="api-error" role="alert">{submitError}</div>}<div className="form-footer"><p>By submitting, you agree to be contacted about your event registration.</p><button className="button" disabled={status === 'loading'}>{status === 'loading' ? 'Submitting…' : 'Submit registration'}<ArrowRight size={18} /></button></div>
    </form></div></section></main></div>;
}
