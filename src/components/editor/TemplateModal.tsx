/**
 * TemplateModal Component
 * Modal for selecting research document templates
 */

import React from 'react';
import { X, FileText, FlaskConical, BookOpen, Users } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string;
}

export interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: 'research-note',
    name: 'Research Note',
    description: 'Document your research findings and insights',
    icon: FileText,
    content: `# Research Note

## Context
<!-- Provide background information and context for this research -->

## Key Findings
<!-- List your main discoveries and observations -->

- Finding 1
- Finding 2
- Finding 3

## Analysis
<!-- Analyze and interpret the findings -->

## Next Steps
<!-- Outline what needs to be done next -->

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3

## References
<!-- List sources and related materials -->
`,
  },
  {
    id: 'experiment',
    name: 'Experiment',
    description: 'Document an experiment from hypothesis to conclusions',
    icon: FlaskConical,
    content: `# Experiment: [Title]

## Hypothesis
<!-- State your hypothesis clearly -->

## Methodology
<!-- Describe your experimental approach -->

### Materials
- Material 1
- Material 2

### Procedure
1. Step 1
2. Step 2
3. Step 3

## Results
<!-- Present your findings -->

### Data
<!-- Include measurements, observations, or data points -->

### Observations
- Observation 1
- Observation 2

## Analysis
<!-- Interpret the results -->

## Conclusions
<!-- Draw conclusions based on the results -->

### Key Takeaways
- Takeaway 1
- Takeaway 2

### Limitations
- Limitation 1
- Limitation 2

## Next Experiments
<!-- Suggest follow-up experiments -->
`,
  },
  {
    id: 'literature-review',
    name: 'Literature Review',
    description: 'Review and analyze research papers or articles',
    icon: BookOpen,
    content: `# Literature Review: [Title]

## Citation
<!-- Full citation in your preferred format -->

**Authors:**
**Year:**
**DOI/URL:**

## Summary
<!-- Brief overview of the work -->

## Key Points
<!-- Main arguments or findings -->

1. Point 1
2. Point 2
3. Point 3

## Methodology
<!-- Research methods used -->

## Strengths
<!-- What this work does well -->

- Strength 1
- Strength 2

## Weaknesses
<!-- Limitations or areas for improvement -->

- Weakness 1
- Weakness 2

## Relevance
<!-- How this relates to your research -->

## Notes & Quotes
<!-- Important excerpts or personal notes -->

> "Notable quote here"

## Follow-up Questions
<!-- Questions raised by this work -->

- Question 1
- Question 2

## Related Works
<!-- Connected research to explore -->

- Related work 1
- Related work 2
`,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Capture discussion points and action items',
    icon: Users,
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:**
**Location:**

## Attendees
- Name 1
- Name 2
- Name 3

## Agenda
1. Topic 1
2. Topic 2
3. Topic 3

## Discussion

### Topic 1
<!-- Notes about this topic -->

### Topic 2
<!-- Notes about this topic -->

### Topic 3
<!-- Notes about this topic -->

## Decisions Made
- Decision 1
- Decision 2

## Action Items
- [ ] **@Person:** Action item 1 - *Due: Date*
- [ ] **@Person:** Action item 2 - *Due: Date*
- [ ] **@Person:** Action item 3 - *Due: Date*

## Next Meeting
**Date:**
**Topics:**

## Additional Notes
<!-- Any other relevant information -->
`,
  },
];

export function TemplateModal({
  isOpen,
  onClose,
  onSelect,
}: TemplateModalProps) {
  if (!isOpen) return null;

  const handleSelect = (template: Template) => {
    onSelect(template);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="template-modal-title" className="modal-title">
            Choose a Template
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="templates-grid">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelect(template)}
                  className="template-card"
                >
                  <div className="template-icon">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
