import { CheckCircle2, Eye, FileCheck2, LogOut, Maximize2, ShieldCheck, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { API_URL, api } from '../services/api';

const statusOptions = { membership: ['reviewing', 'approved', 'rejected'] };

export default function AdminPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ memberships: [], publications: [], reviewers: [], eventRegistrations: [] });
  const [tab, setTab] = useState('memberships');
  const [error, setError] = useState('');
  const [reviewTarget, setReviewTarget] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const load = () => api('/admin/overview').then(result => setData(result.data)).catch(issue => setError(issue.message));

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!reviewTarget && !selectedMember && !imagePreview) return;
    const close = event => {
      if (event.key !== 'Escape') return;
      if (imagePreview) setImagePreview(null);
      else if (reviewTarget) setReviewTarget(null);
      else setSelectedMember(null);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [reviewTarget, selectedMember, imagePreview]);

  const openReview = (kind, item, status) => {
    setReason(''); setError('');
    setReviewTarget({ kind, id: item._id, title: kind === 'membership' ? item.fullName : item.title, status });
  };
  const review = async event => {
    event.preventDefault();
    if (reviewTarget.status === 'rejected' && !reason.trim()) return;
    setSaving(true);
    try {
      await api(`/admin/${reviewTarget.kind === 'membership' ? 'memberships' : 'publications'}/${reviewTarget.id}`, { method: 'PATCH', body: JSON.stringify({ status: reviewTarget.status, reason: reason.trim() }) });
      setReviewTarget(null); setReason(''); await load();
    } catch (issue) { setError(issue.message); }
    finally { setSaving(false); }
  };
  const doLogout = async () => { await logout(); navigate('/'); };
  const toggleReviewer = async item => { try { await api(`/admin/memberships/${item._id}/reviewer`, { method: 'PATCH', body: JSON.stringify({ enabled: item.user?.role !== 'reviewer' }) }); await load(); } catch (issue) { setError(issue.message); } };
  const assignReviewer = async (item, reviewerId) => { if (!reviewerId) return; try { await api(`/admin/publications/${item._id}/assign`, { method: 'PATCH', body: JSON.stringify({ reviewerId }) }); await load(); } catch (issue) { setError(issue.message); } };
  const isEventRegistration = tab === 'eventRegistrations';
  const items = isEventRegistration ? (data.eventRegistrations || []) : tab === 'memberships' ? data.memberships : data.publications;
  const fileUrl = path => {
    if (!path) return '';
    const apiOrigin = new URL(API_URL, window.location.origin).origin;
    return new URL(path.replace(/^\/+/, ''), `${apiOrigin}/`).href;
  };
  const formatDate = value => value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided';
  const showMemberImage = member => setImagePreview({ src: fileUrl(member.profilePicture), name: member.fullName });

  return <div className="portal-page admin-page"><Header light /><main className="portal-shell"><header className="portal-welcome"><div><p className="eyebrow eyebrow--blue">Administration</p><h1>Review dashboard</h1><p>Signed in as {user.email}</p></div><button className="portal-logout" onClick={doLogout}><LogOut /> Sign out</button></header>
    <section className="portal-summary"><article><ShieldCheck /><div><span>Pending memberships</span><strong>{data.memberships.filter(x => ['pending', 'reviewing'].includes(x.status)).length}</strong></div></article><article><FileCheck2 /><div><span>Pending publications</span><strong>{data.publications.filter(x => ['pending', 'under-review'].includes(x.status)).length}</strong></div></article><article><Users /><div><span>Approved members</span><strong>{data.memberships.filter(x => x.status === 'approved').length}</strong></div></article></section>
    <div className="admin-tabs"><button className={tab === 'memberships' ? 'is-active' : ''} onClick={() => setTab('memberships')}>Membership applications</button><button className={tab === 'publications' ? 'is-active' : ''} onClick={() => setTab('publications')}>Journals &amp; papers</button><button className={isEventRegistration ? 'is-active' : ''} onClick={() => setTab('eventRegistrations')}>Event Registrations</button></div>{error && <p className="auth-error">{error}</p>}
    <section className="admin-list">{items.map(item => <article key={item._id}>
      {tab === 'memberships' && <button className="admin-member-photo" onClick={() => showMemberImage(item)} aria-label={`View a larger photo of ${item.fullName}`}><img src={fileUrl(item.profilePicture)} alt={item.fullName} /><span><Maximize2 /></span></button>}
      <div className="admin-item-copy"><span>{tab !== 'publications' ? item.user?.email || item.email : `${item.type} · ${item.user?.email || 'Unknown user'}`}</span><h2>{tab !== 'publications' ? item.fullName : item.title}</h2><p>{tab !== 'publications' ? `${item.designation} · ${item.institution} · ${item.country}` : item.abstract}</p>{!isEventRegistration && item.status !== 'approved' && item.reviewReason && <p className="submission-reason">Current note: {item.reviewReason}</p>}</div>
      <div className="admin-actions">{!isEventRegistration && <strong className={`status-pill status-${item.status}`}>{item.status}</strong>}{tab !== 'publications' && <button className="admin-view-details" onClick={() => setSelectedMember(item)}><Eye /> View details</button>}{tab === 'memberships' && item.status === 'approved' && <button onClick={() => toggleReviewer(item)}>{item.user?.role === 'reviewer' ? 'Remove reviewer role' : 'Make reviewer'}</button>}{tab === 'publications' && <a className="admin-document-link" href={`${API_URL}/publications/${item._id}/manuscript`} target="_blank" rel="noreferrer">Open PDF</a>}{tab === 'publications' && <select className="reviewer-select" value={item.assignedReviewer?._id || ''} onChange={event => assignReviewer(item, event.target.value)}><option value="">Assign reviewer…</option>{data.reviewers.map(reviewer => <option key={reviewer._id} value={reviewer._id}>{reviewer.name} ({reviewer.email})</option>)}</select>}{tab === 'memberships' && statusOptions.membership.map(status => <button key={status} disabled={item.status === status} onClick={() => openReview('membership', item, status)}>{status.replace('-', ' ')}</button>)}</div>
    </article>)}{!items.length && <div className="portal-empty"><h3>{isEventRegistration ? 'No event registrations yet' : 'Nothing to review'}</h3></div>}</section>
  </main>
    {selectedMember && <div className="review-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setSelectedMember(null)}><section className="member-detail-modal" role="dialog" aria-modal="true" aria-labelledby="member-detail-title"><button className="review-modal-close" onClick={() => setSelectedMember(null)} aria-label="Close profile details"><X /></button><div className="member-detail-header">{!isEventRegistration && <button className="member-detail-photo" onClick={() => showMemberImage(selectedMember)} aria-label={`View a larger photo of ${selectedMember.fullName}`}><img src={fileUrl(selectedMember.profilePicture)} alt={selectedMember.fullName} /><span><Maximize2 /> Enlarge</span></button>}<div><p className="review-modal-eyebrow">{isEventRegistration ? 'Event registration' : 'Membership application'}</p><h2 id="member-detail-title">{selectedMember.fullName}</h2><p>{selectedMember.designation} · {selectedMember.institution}</p>{!isEventRegistration && <strong className={`status-pill status-${selectedMember.status}`}>{selectedMember.status}</strong>}</div></div><dl className="member-detail-grid"><div><dt>Email</dt><dd>{selectedMember.email}</dd></div><div><dt>Phone</dt><dd>{selectedMember.phone}</dd></div><div><dt>Country</dt><dd>{selectedMember.country}</dd></div>{!isEventRegistration && <><div><dt>Nationality</dt><dd>{selectedMember.nationality}</dd></div><div><dt>Date of birth</dt><dd>{formatDate(selectedMember.dateOfBirth)}</dd></div></>}<div><dt>Gender</dt><dd>{selectedMember.gender}</dd></div><div className="member-detail-wide"><dt>Address</dt><dd>{selectedMember.address}</dd></div>{!isEventRegistration && <><div className="member-detail-wide"><dt>Research interests</dt><dd>{(selectedMember.interests || []).join(', ') || 'Not provided'}</dd></div><div className="member-detail-wide"><dt>Contribution</dt><dd>{selectedMember.contribution}</dd></div></>}<div><dt>{isEventRegistration ? 'Registered on' : 'Applied on'}</dt><dd>{formatDate(selectedMember.createdAt)}</dd></div><div><dt>Curriculum vitae</dt><dd>{(isEventRegistration ? selectedMember.cv : selectedMember.cv) ? <a className="admin-document-link" href={fileUrl(isEventRegistration ? selectedMember.cv : selectedMember.cv)} target="_blank" rel="noreferrer">View CV</a> : 'Not provided'}</dd></div>{!isEventRegistration && selectedMember.reviewReason && <div className="member-detail-wide"><dt>Current review note</dt><dd>{selectedMember.reviewReason}</dd></div>}</dl></section></div>}
    {imagePreview && <div className="image-preview-backdrop" onMouseDown={event => event.target === event.currentTarget && setImagePreview(null)} role="dialog" aria-modal="true" aria-label={`${imagePreview.name} profile photo`}><button onClick={() => setImagePreview(null)} aria-label="Close image preview"><X /></button><img src={imagePreview.src} alt={imagePreview.name} /></div>}
    {reviewTarget && <div className="review-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setReviewTarget(null)}><section className={`review-modal review-modal--${reviewTarget.status}`} role="dialog" aria-modal="true" aria-labelledby="review-dialog-title"><button className="review-modal-close" onClick={() => setReviewTarget(null)} aria-label="Close review dialog"><X /></button><div className="review-modal-icon">{reviewTarget.status === 'rejected' ? <X /> : <CheckCircle2 />}</div><p className="review-modal-eyebrow">Confirm review decision</p><h2 id="review-dialog-title">{reviewTarget.status.replace('-', ' ')}</h2><p className="review-modal-subject">{reviewTarget.title}</p><form onSubmit={review}><label htmlFor="review-reason">{reviewTarget.status === 'rejected' ? 'Reason for rejection' : 'Review note'} <span>{reviewTarget.status === 'rejected' ? 'Required' : 'Optional'}</span></label><textarea id="review-reason" rows="4" maxLength="1000" autoFocus value={reason} onChange={event => setReason(event.target.value)} placeholder={reviewTarget.status === 'rejected' ? 'Explain what needs to be corrected…' : 'Add a note for the applicant…'} required={reviewTarget.status === 'rejected'} /><div className="review-modal-actions"><button type="button" className="review-cancel" onClick={() => setReviewTarget(null)}>Cancel</button><button className="review-confirm" disabled={saving || (reviewTarget.status === 'rejected' && !reason.trim())}>{saving ? 'Saving…' : `Confirm ${reviewTarget.status.replace('-', ' ')}`}</button></div></form></section></div>}
  </div>;
}
