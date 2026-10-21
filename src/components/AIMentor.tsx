import { useState } from 'react';
import { BookOpen, Lightbulb, LoaderCircle, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type MentorTask = 'review' | 'improve' | 'next_steps' | 'reflect' | 'scenario';
type Props = {
  plan: Record<string, unknown>;
  lessons: unknown[];
  floating?: boolean;
  onClose?: () => void;
};

const tasks: { id: MentorTask; title: string; description: string }[] = [
  { id: 'review', title: 'Review my unit', description: 'Find strengths, important gaps and useful next steps.' },
  { id: 'improve', title: 'Improve my draft', description: 'Suggest targeted changes without replacing my ideas.' },
  { id: 'next_steps', title: 'Help me plan next steps', description: 'Choose a manageable next planning move.' },
  { id: 'reflect', title: 'Reflect on learning evidence', description: 'Use teaching notes and evidence to consider responsive teaching.' },
  { id: 'scenario', title: 'Practise a classroom scenario', description: 'Explore a realistic challenge before seeing a model answer.' },
];

export default function AIMentor({ plan, lessons, floating = false, onClose }: Props) {
  const [task, setTask] = useState<MentorTask>('review');
  const [context, setContext] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const askMentor = async () => {
    setError('');
    setAnswer('');
    if (!supabase) {
      setError('Secure AI is not configured in this build yet. Please try again after setup is complete.');
      return;
    }
    setBusy(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('Please sign in again to use the AI mentor.');
        return;
      }
      const { data, error: invokeError } = await supabase.functions.invoke('ai-mentor', {
        body: { task, plan, lessons, context },
      });
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      if (!data?.text) throw new Error('The mentor returned no advice. Please try again.');
      setAnswer(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The AI mentor could not respond. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const renderLine = (line: string, index: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="answerGap" />;
    const isHeading = /^#{1,3}\s/.test(trimmed);
    const isBullet = /^[-*]\s/.test(trimmed);
    const content = trimmed.replace(/^#{1,3}\s+/, '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
    const parts = content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
    );
    if (isHeading) return <h3 key={index}>{parts}</h3>;
    if (isBullet || /^\d+\.\s/.test(trimmed)) return <div className="mentorBullet" key={index}>{parts}</div>;
    return <p key={index}>{parts}</p>;
  };

  return <div className={floating ? 'mentorFloatingContent' : 'page narrow'}>
    {floating && <div className="mentorFloatingHeader"><div><div className="eyebrow">YOUR PLANNING COMPANION</div><h2>Ask the AI mentor</h2><p>Get help with the unit you are editing.</p></div><button className="mentorFloatingClose" onClick={onClose} aria-label="Close AI help"><X size={19}/></button></div>}
    {!floating && <div className="intro">
      <div className="eyebrow">YOUR SECURE PLANNING COMPANION</div>
      <h1>AI PYP mentor</h1>
      <p>Think alongside a practical mentor. It uses your current unit and lesson sequence, asks useful questions and offers suggestions for you to review—not instructions you must follow.</p>
    </div>}
    {!floating && <div className="note"><BookOpen/><div><b>Keep your professional judgement in charge</b><p>This is a PYP-informed learning aid, not an official IB service. Advice depends on the information you provide and your school’s context. Do not include identifiable student information or sensitive records.</p></div></div>}
    <section className="formSection mentorFormSection">
      <h2><span><Sparkles size={16}/></span> What would you like help with?</h2>
      <div className="mentorTaskGrid">{tasks.map(item => <button type="button" key={item.id} className={'mentorTask '+(task===item.id?'selected':'')} onClick={() => setTask(item.id)}><b>{item.title}</b><small>{item.description}</small></button>)}</div>
      <label className="field">Extra context (optional)<textarea rows={4} value={context} onChange={e => setContext(e.target.value)} placeholder="For example: I am new to the PYP, this is a Year 3 unit, and I am unsure whether the lines of inquiry are distinct. Avoid student names or identifying details."/></label>
      {!floating && <div className="mentorContext"><Lightbulb size={17}/><span><b>Current unit:</b> {String(plan.title || 'Untitled unit')} · {String(plan.year || 'Year group not set')} · {String(plan.theme || 'Theme not selected')}<br/><small>The mentor will receive the current unit fields and lesson sequence. Save your draft before leaving if you want to keep your latest edits.</small></span></div>}
      <button className="btn primary big" disabled={busy} onClick={askMentor}>{busy?<><LoaderCircle size={16} className="spin"/> Thinking…</>:<><Sparkles size={16}/> Ask the AI mentor</>}</button>
      {error && <div className="mentorError" role="alert"><b>Could not get advice</b><p>{error}</p></div>}
    </section>
    {answer && <section className="formSection mentorAnswer"><div className="sectionHeading"><div><div className="eyebrow">MENTOR RESPONSE</div><h2>Your planning conversation</h2></div><button className="btn light" onClick={() => navigator.clipboard?.writeText(answer)}>Copy response</button></div><div className="mentorAnswerText">{answer.split('\n').map(renderLine)}</div><p className="muted">Review suggestions against your learners, school guidance and current IB resources before applying them.</p></section>}
  </div>;
}
