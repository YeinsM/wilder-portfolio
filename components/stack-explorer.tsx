'use client';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Braces,
  Database,
  Layers,
  Play,
  RotateCcw,
  Server,
  Workflow,
  Check,
} from 'lucide-react';
import { copy } from '../lib/content';
import { nextStep, type Locale } from '../lib/portfolio-state';

export default function StackExplorer({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [front, setFront] = useState('React');
  const [back, setBack] = useState('.NET');
  const [data, setData] = useState('PostgreSQL');
  const [step, setStep] = useState(0);
  const running = step > 0 && step < 4;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setStep((previous) => nextStep(previous)),
      850,
    );
    return () => clearTimeout(timer);
  }, [running, step]);
  const choices = [
    {
      label: c.front,
      items: ['React', 'Angular'],
      value: front,
      set: setFront,
      Icon: Braces,
      description: c.frontendText,
    },
    {
      label: c.back,
      items: ['.NET', 'Node.js'],
      value: back,
      set: setBack,
      Icon: Server,
      description: c.backendText,
    },
    {
      label: c.data,
      items: ['PostgreSQL', 'SQL Server', 'MongoDB'],
      value: data,
      set: setData,
      Icon: Database,
      description: c.dataText,
    },
  ];
  function run() {
    if (running) return;
    setStep(1);
  }
  return (
    <div className="stack-explorer">
      <div className="stack-toolbar">
        <span>
          <span className="status-dot" /> {c.systemText}
        </span>
        <span className="mono">UI → API → DATA</span>
      </div>
      <div className="stack-nodes">
        {choices.map(({ label, items, value, set, Icon, description }, i) => (
          <div
            className={`stack-node ${step === i + 1 || step === 4 ? 'active' : ''}`}
            key={label}
          >
            <div className="node-top">
              <span className="mono">
                0{i + 1} / {label}
              </span>
              <Icon size={20} />
            </div>
            <div className="node-symbol" aria-hidden="true">
              {i === 0 ? <Braces /> : i === 1 ? <Server /> : <Database />}
            </div>
            <h3>{value}</h3>
            <p>{description}</p>
            <fieldset
              className="tech-options"

              aria-label={`${c.selectTech}: ${label}`}
            >
              {items.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={value === item}
                  disabled={running}
                  onClick={() => {
                    set(item);
                    setStep(0);
                  }}
                >
                  {item}
                </button>
              ))}
            </fieldset>
            {i < 2 && (
              <ArrowRight className="node-connector" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
      <div className="simulation">
        <div>
          <span className="mono simulation-label">{c.simulation}</span>
          <output aria-live="polite">
            {step === 4 ? (
              <Check size={17} />
            ) : (
              <span className={`signal-dot ${running ? 'pulse' : ''}`} />
            )}{' '}
            {c.stages[step]}
          </output>
        </div>
        <button className="button" onClick={run} disabled={running}>
          {step === 4 ? <RotateCcw size={16} /> : <Play size={16} />}{' '}
          {running ? c.running : step === 4 ? c.replay : c.simulate}
        </button>
      </div>
      <div className="stack-extensions">
        <div>
          <Layers size={22} />
          <div>
            <p className="eyebrow">{c.enterprise}</p>
            <h3>Microsoft Dynamics 365</h3>
            <p>{c.enterpriseText}</p>
          </div>
        </div>
        <div>
          <Workflow size={22} />
          <div>
            <p className="eyebrow">{c.delivery}</p>
            <h3>QA Automation · CI/CD · DevOps</h3>
            <p>{c.deliveryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
