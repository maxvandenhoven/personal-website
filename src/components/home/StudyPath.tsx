export interface StudyStep {
  school: string;
  degree: string;
  description: string;
}

interface StudyPathProps {
  title: string;
  steps: readonly StudyStep[];
}

/** Numbered education timeline that sits next to the about story. */
export function StudyPath({ title, steps }: StudyPathProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <h3 className="font-title leading-lede tracking-title text-3xl">
        {title}
      </h3>
      <ol className="flex flex-col gap-8">
        {steps.map((step, i) => (
          <li key={step.degree} className="flex min-w-0 flex-col gap-3">
            <div className="leading-label tracking-eyebrow after:border-rule flex items-center gap-3 font-mono text-xs font-medium uppercase after:min-w-6 after:flex-1 after:border-t">
              <span aria-hidden="true" className="text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-muted before:mr-3 before:content-['·']">
                {step.school}
              </span>
            </div>
            <h4 className="font-title leading-title tracking-title text-xl text-balance">
              {step.degree}
            </h4>
            <p className="leading-prose text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
