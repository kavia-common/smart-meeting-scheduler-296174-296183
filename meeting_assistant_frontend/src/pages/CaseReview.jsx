import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * CaseReview page
 * - Route: /cases/:caseId/review
 * - Three-column responsive layout:
 *   Left: Sections menu with search
 *   Middle: Details with subsections: Case Information, Service Details, Family Contacts, Obituary Notes, Action Items, Full Transcript
 *   Right: Compliance Panel and AI Generated Outputs (tabs)
 * - Client-side only with mock state
 * - Basic validation for email/phone; tooltips and confirmation toasts/messages
 * - Buttons: Save Changes (per section), Download Transcript, Copy Email, Send Email, Add/Remove Contact, Add Task
 */
export default function CaseReview() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  // Menu/sections
  const allSections = useMemo(
    () => [
      { id: 'caseInfo', label: 'Case Information' },
      { id: 'serviceDetails', label: 'Service Details' },
      { id: 'familyContacts', label: 'Family Contacts' },
      { id: 'obituaryNotes', label: 'Obituary Notes' },
      { id: 'actionItems', label: 'Action Items' },
      { id: 'transcript', label: 'Full Transcript' },
    ],
    []
  );
  const [menuQuery, setMenuQuery] = useState('');
  const [activeSection, setActiveSection] = useState('caseInfo');

  const filteredSections = useMemo(() => {
    const q = menuQuery.trim().toLowerCase();
    if (!q) return allSections;
    return allSections.filter(s => s.label.toLowerCase().includes(q));
  }, [menuQuery, allSections]);

  // Form State (mock)
  const [caseInfo, setCaseInfo] = useState({
    decedentName: '',
    caseNumber: caseId || 'AUTO-12345',
    arrangementDate: '',
  });
  const [serviceDetails, setServiceDetails] = useState({
    serviceType: '',
    location: '',
    officiant: '',
  });
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Jane Doe', relation: 'Spouse', email: 'jane@example.com', phone: '(555) 123-4567' },
  ]);
  const [notes, setNotes] = useState('The family prefers a simple obituary with focus on community service.');
  const [tasks, setTasks] = useState([{ id: 't1', title: 'Confirm service location', done: false }]);

  // Compliance mock
  const [complianceFlags] = useState([
    { id: 'c1', label: 'Consent for recording obtained', status: 'Pass' },
    { id: 'c2', label: 'Privacy language included', status: 'Pass' },
    { id: 'c3', label: 'Required disclosures presented', status: 'Review' },
  ]);

  // AI Outputs Tabs
  const tabs = [
    { id: 'obit', label: 'Obituary Draft' },
    { id: 'actions', label: 'Action Items' },
    { id: 'email', label: 'Follow Up Email' },
  ];
  const [activeTab, setActiveTab] = useState('obit');

  // Validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9()\-\s]{7,}$/;

  // UI feedback state
  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'info', text: '' }
  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.clearTimeout(showMessage._t);
    showMessage._t = window.setTimeout(() => setMessage(null), 3000);
  };

  // Section actions
  const saveCaseInfo = () => {
    if (!caseInfo.decedentName.trim()) {
      showMessage('error', 'Please enter the decedent name.');
      return;
    }
    showMessage('success', 'Case Information saved.');
  };
  const saveServiceDetails = () => {
    showMessage('success', 'Service Details saved.');
  };
  const saveNotes = () => {
    showMessage('success', 'Obituary notes saved.');
  };
  const addContact = () => {
    const newId = `${Date.now()}`;
    setContacts(prev => [...prev, { id: newId, name: '', relation: '', email: '', phone: '' }]);
  };
  const removeContact = (id) => {
    const c = contacts.find(ct => ct.id === id);
    const ok = window.confirm(`Remove contact ${c?.name || ''}?`);
    if (ok) {
      setContacts(prev => prev.filter(ct => ct.id !== id));
      showMessage('info', 'Contact removed.');
    }
  };
  const saveContacts = () => {
    // Validate emails/phones
    for (const c of contacts) {
      if (c.email && !emailRegex.test(c.email)) {
        showMessage('error', `Invalid email for ${c.name || 'contact'}.`);
        return;
      }
      if (c.phone && !phoneRegex.test(c.phone)) {
        showMessage('error', `Invalid phone for ${c.name || 'contact'}.`);
        return;
      }
    }
    showMessage('success', 'Family Contacts saved.');
  };
  const addTask = () => {
    const newId = `${Date.now()}`;
    setTasks(prev => [...prev, { id: newId, title: '', done: false }]);
  };
  const saveTasks = () => {
    showMessage('success', 'Action items saved.');
  };

  // Transcript actions
  const downloadTranscript = () => {
    // Mock download
    const content = 'Mock transcript content...';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-${caseId}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage('info', 'Transcript download started.');
  };

  // Email actions
  const copyEmail = () => {
    const emailContent = getEmailContent();
    navigator.clipboard.writeText(emailContent).then(() => {
      showMessage('success', 'Email content copied.');
    }).catch(() => showMessage('error', 'Failed to copy.'));
  };
  const sendEmail = () => {
    showMessage('info', 'Email sent (mock).');
  };

  // AI outputs content (mock)
  const getObitDraft = () =>
    `We remember ${caseInfo.decedentName || 'our beloved'} for a life of kindness and service.
The family will gather to honor their memory and share stories celebrating their legacy.`;
  const getActionItemsText = () =>
    tasks.map(t => `- [${t.done ? 'x' : ' '}] ${t.title || 'Untitled task'}`).join('\n');
  const getEmailContent = () =>
    `Subject: Follow-Up and Next Steps for Case ${caseInfo.caseNumber}

Dear Family,
Thank you for meeting with us. Here are the next steps:
${tasks.map(t => `• ${t.title || 'Untitled task'}`).join('\n')}

Warm regards,
Arrangement Assistant`;

  // Renderers for sections
  const renderCaseInfo = () => (
    <Card title="Case Information" footer={
      <>
        <button className="button ghost" onClick={() => navigate('/cases')}>Cancel</button>
        <button className="button" onClick={saveCaseInfo} title="Save changes to Case Information">Save Changes</button>
      </>
    }>
      <div style={styles.fieldGrid}>
        <Field
          label="Decedent Name"
          placeholder="e.g., John A. Smith"
          tooltip="Full legal name of the decedent."
          value={caseInfo.decedentName}
          onChange={v => setCaseInfo(ci => ({ ...ci, decedentName: v }))}
          required
        />
        <Field
          label="Case Number"
          placeholder="Auto-assigned"
          tooltip="Internal reference number for tracking."
          value={caseInfo.caseNumber}
          onChange={v => setCaseInfo(ci => ({ ...ci, caseNumber: v }))}
        />
        <Field
          label="Arrangement Date"
          placeholder="YYYY-MM-DD"
          tooltip="Date the arrangement meeting occurred."
          value={caseInfo.arrangementDate}
          onChange={v => setCaseInfo(ci => ({ ...ci, arrangementDate: v }))}
        />
      </div>
      <p style={styles.helperText}>All fields will be saved locally for this demo.</p>
    </Card>
  );

  const renderServiceDetails = () => (
    <Card title="Service Details" footer={
      <>
        <button className="button ghost" onClick={() => navigate(-1)}>Cancel</button>
        <button className="button" onClick={saveServiceDetails} title="Save changes to Service Details">Save Changes</button>
      </>
    }>
      <div style={styles.fieldGrid}>
        <Field
          label="Service Type"
          placeholder="e.g., Memorial, Funeral, Celebration of Life"
          tooltip="Type of service selected by the family."
          value={serviceDetails.serviceType}
          onChange={v => setServiceDetails(sd => ({ ...sd, serviceType: v }))}
        />
        <Field
          label="Location"
          placeholder="Chapel A, Cemetery, Offsite venue"
          tooltip="Primary venue or location."
          value={serviceDetails.location}
          onChange={v => setServiceDetails(sd => ({ ...sd, location: v }))}
        />
        <Field
          label="Officiant"
          placeholder="e.g., Rev. Miller"
          tooltip="Name of the officiant or celebrant."
          value={serviceDetails.officiant}
          onChange={v => setServiceDetails(sd => ({ ...sd, officiant: v }))}
        />
      </div>
    </Card>
  );

  const renderFamilyContacts = () => (
    <Card title="Family Contacts" footer={
      <>
        <button className="button ghost" onClick={addContact} title="Add a new contact">Add Contact</button>
        <button className="button" onClick={saveContacts} title="Save contact list changes">Save Changes</button>
      </>
    }>
      <div style={{ display: 'grid', gap: 12 }}>
        {contacts.map((c) => (
          <div key={c.id} style={styles.contactRow}>
            <div style={styles.contactGrid}>
              <Field
                label="Name"
                placeholder="Full name"
                value={c.name}
                onChange={(v) => setContacts(prev => prev.map(pc => pc.id === c.id ? { ...pc, name: v } : pc))}
              />
              <Field
                label="Relation"
                placeholder="e.g., Spouse, Child"
                value={c.relation}
                onChange={(v) => setContacts(prev => prev.map(pc => pc.id === c.id ? { ...pc, relation: v } : pc))}
              />
              <Field
                label="Email"
                placeholder="name@example.com"
                value={c.email}
                onChange={(v) => setContacts(prev => prev.map(pc => pc.id === c.id ? { ...pc, email: v } : pc))}
                error={c.email && !emailRegex.test(c.email) ? 'Enter a valid email address.' : undefined}
              />
              <Field
                label="Phone"
                placeholder="(555) 555-5555"
                value={c.phone}
                onChange={(v) => setContacts(prev => prev.map(pc => pc.id === c.id ? { ...pc, phone: v } : pc))}
                error={c.phone && !phoneRegex.test(c.phone) ? 'Enter a valid phone number.' : undefined}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="button ghost"
                onClick={() => removeContact(c.id)}
                title="Remove this contact"
              >
                Remove Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderObituaryNotes = () => (
    <Card title="Obituary Notes" footer={
      <>
        <button className="button" onClick={saveNotes} title="Save obituary notes">Save Changes</button>
      </>
    }>
      <label style={styles.label}>
        <span title="High-level notes for obituary writing." style={styles.labelText}>Notes</span>
        <textarea
          rows={6}
          placeholder="Key points to include in the obituary..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
    </Card>
  );

  const renderActionItems = () => (
    <Card title="Action Items" footer={
      <>
        <button className="button ghost" onClick={addTask} title="Add a task item">Add Task</button>
        <button className="button" onClick={saveTasks} title="Save tasks">Save Changes</button>
      </>
    }>
      <div style={{ display: 'grid', gap: 12 }}>
        {tasks.map(t => (
          <div key={t.id} style={styles.taskRow}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={(e) => setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, done: e.target.checked } : pt))}
              title="Mark task complete"
            />
            <input
              type="text"
              placeholder="Task title"
              value={t.title}
              onChange={(e) => setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, title: e.target.value } : pt))}
              style={{ flex: 1 }}
            />
          </div>
        ))}
      </div>
    </Card>
  );

  const renderTranscript = () => (
    <Card title="Full Transcript" footer={
      <>
        <button className="button" onClick={downloadTranscript} title="Download transcript as text file">Download Transcript</button>
      </>
    }>
      <div style={styles.transcriptBox}>
        <p>
          [00:00] Meeting started. Family discussed preferences for service, obituary tone, and contact responsibilities...
        </p>
        <p>
          [10:15] Decided on memorial service with a focus on community involvement. Follow-ups assigned.
        </p>
      </div>
    </Card>
  );

  const middleContent = () => {
    switch (activeSection) {
      case 'caseInfo': return renderCaseInfo();
      case 'serviceDetails': return renderServiceDetails();
      case 'familyContacts': return renderFamilyContacts();
      case 'obituaryNotes': return renderObituaryNotes();
      case 'actionItems': return renderActionItems();
      case 'transcript': return renderTranscript();
      default: return renderCaseInfo();
    }
  };

  // AI Panel content
  const renderAIPanel = () => (
    <Card title="AI Generated Outputs">
      <div style={styles.tabHeader}>
        {tabs.map(t => (
          <button
            key={t.id}
            className="button ghost"
            style={{
              ...styles.tabButton,
              ...(activeTab === t.id ? styles.tabButtonActive : {}),
            }}
            onClick={() => setActiveTab(t.id)}
            aria-pressed={activeTab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={styles.tabBody}>
        {activeTab === 'obit' && (
          <pre style={styles.pre}>{getObitDraft()}</pre>
        )}
        {activeTab === 'actions' && (
          <pre style={styles.pre}>{getActionItemsText() || 'No action items yet.'}</pre>
        )}
        {activeTab === 'email' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <pre style={styles.pre}>{getEmailContent()}</pre>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="button ghost" onClick={copyEmail} title="Copy email to clipboard">Copy Email</button>
              <button className="button" onClick={sendEmail} title="Send email (mock)">Send Email</button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  // Compliance Panel
  const renderCompliance = () => (
    <Card title="Compliance">
      <ul style={{ display: 'grid', gap: 8 }}>
        {complianceFlags.map(f => (
          <li key={f.id} style={styles.flagRow}>
            <span style={styles.flagLabel} title={f.label}>{f.label}</span>
            <span
              style={{
                ...styles.flagStatus,
                ...(f.status === 'Pass' ? styles.flagPass : styles.flagReview),
              }}
              title={`Status: ${f.status}`}
            >
              {f.status}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <div style={styles.page}>
      {/* Toast/Message */}
      {message ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            ...styles.toast,
            ...(message.type === 'success' ? styles.toastSuccess : message.type === 'error' ? styles.toastError : styles.toastInfo),
          }}
        >
          {message.text}
        </div>
      ) : null}

      <div style={styles.grid}>
        {/* Left – Sections menu */}
        <aside style={styles.leftCol} aria-label="Sections">
          <Card title="Sections">
            <input
              type="text"
              placeholder="Search sections..."
              value={menuQuery}
              onChange={(e) => setMenuQuery(e.target.value)}
              aria-label="Search sections"
              title="Filter sections by name"
            />
            <ul style={styles.menuList} role="menu">
              {filteredSections.map(sec => (
                <li key={sec.id}>
                  <button
                    type="button"
                    className="button ghost"
                    style={{
                      ...styles.menuButton,
                      ...(activeSection === sec.id ? styles.menuButtonActive : {}),
                    }}
                    onClick={() => setActiveSection(sec.id)}
                    role="menuitemradio"
                    aria-checked={activeSection === sec.id}
                    title={sec.label}
                  >
                    {sec.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        {/* Middle – Details area */}
        <section style={styles.middleCol}>
          {middleContent()}
        </section>

        {/* Right – Compliance + AI outputs */}
        <aside style={styles.rightCol} aria-label="Assistant Panels">
          {renderCompliance()}
          {renderAIPanel()}
        </aside>
      </div>
    </div>
  );
}

/**
 * Field component with label, tooltip, error display
 */
function Field({ label, tooltip, placeholder, value, onChange, error, required }) {
  return (
    <label style={styles.label}>
      <span style={styles.labelText} title={tooltip || ''}>
        {label}{required ? ' *' : ''}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        title={tooltip || placeholder || label}
      />
      {error ? (
        <span id={`${label}-error`} style={styles.errorText} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const styles = {
  page: {
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 380px',
    gap: 24,
  },
  leftCol: {
    display: 'grid',
    alignSelf: 'start',
    gap: 24,
    position: 'sticky',
    top: 24,
  },
  middleCol: {
    display: 'grid',
    gap: 24,
    minWidth: 0,
  },
  rightCol: {
    display: 'grid',
    gap: 24,
    alignSelf: 'start',
    position: 'sticky',
    top: 24,
  },

  // Elements
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
  },
  label: {
    display: 'grid',
    gap: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text-dark)',
  },
  helperText: {
    fontSize: 12,
    color: 'var(--color-text-medium)',
    marginTop: 8,
  },
  errorText: {
    color: 'var(--color-error)',
    fontSize: 12,
  },

  contactRow: {
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: 12,
    boxShadow: 'var(--shadow-sm)',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    marginBottom: 10,
  },

  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: '8px 10px',
  },

  transcriptBox: {
    whiteSpace: 'pre-wrap',
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: 12,
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--color-text-dark)',
  },

  // Menu
  menuList: {
    display: 'grid',
    marginTop: 12,
    gap: 8,
  },
  menuButton: {
    width: '100%',
    justifyContent: 'flex-start',
    borderRadius: 10,
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-text-dark)',
  },
  menuButtonActive: {
    background: '#F0F4FA',
    borderColor: 'var(--color-primary)',
  },

  // Tabs
  tabHeader: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tabButton: {
    background: 'transparent',
    color: 'var(--color-text-dark)',
    border: '1px solid var(--color-border)',
  },
  tabButtonActive: {
    background: '#F0F4FA',
    borderColor: 'var(--color-primary)',
  },
  tabBody: {
    display: 'grid',
    gap: 12,
  },
  pre: {
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: 12,
    margin: 0,
    whiteSpace: 'pre-wrap',
    boxShadow: 'var(--shadow-sm)',
  },

  // Flags
  flagRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 10,
    padding: '8px 10px',
    boxShadow: 'var(--shadow-sm)',
  },
  flagLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text-dark)',
  },
  flagStatus: {
    padding: '4px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid var(--color-border)',
  },
  flagPass: {
    background: 'rgba(52,168,83,0.1)',
    color: 'var(--color-success)',
    borderColor: 'rgba(52,168,83,0.3)',
  },
  flagReview: {
    background: 'rgba(245,158,11,0.1)',
    color: 'var(--color-warning)',
    borderColor: 'rgba(245,158,11,0.3)',
  },

  // Toast
  toast: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    marginBottom: 12,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-md)',
    background: '#fff',
    fontSize: 14,
  },
  toastSuccess: {
    borderColor: 'rgba(52,168,83,0.4)',
    background: 'rgba(52,168,83,0.08)',
    color: 'var(--color-text-dark)',
  },
  toastError: {
    borderColor: 'rgba(217,48,37,0.4)',
    background: 'rgba(217,48,37,0.08)',
    color: 'var(--color-text-dark)',
  },
  toastInfo: {
    borderColor: 'rgba(26,61,124,0.4)',
    background: 'rgba(26,61,124,0.08)',
    color: 'var(--color-text-dark)',
  },
};
