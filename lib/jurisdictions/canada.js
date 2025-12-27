/**
 * AI Control Kit — Canada Jurisdiction
 * Covers AIDA (Artificial Intelligence and Data Act) and PIPEDA alignment
 */

export default {
  id: 'canada',
  name: 'Canada',
  regulation: 'AIDA + PIPEDA',
  icon: '🇨🇦',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      help: 'This helps determine if the system may be considered "high-impact" under AIDA.',
      options: [
        { value: 'employment', label: 'Employment decisions (hiring, promotion, termination)' },
        { value: 'credit', label: 'Credit and lending decisions' },
        { value: 'insurance', label: 'Insurance underwriting or claims' },
        { value: 'healthcare', label: 'Healthcare services or triage' },
        { value: 'government', label: 'Government services or benefits' },
        { value: 'legal', label: 'Legal services or court proceedings' },
        { value: 'education', label: 'Educational admissions or assessment' },
        { value: 'biometric', label: 'Biometric identification' },
        { value: 'content_moderation', label: 'Content moderation' },
        { value: 'content_generation', label: 'Content generation' },
        { value: 'customer_service', label: 'Customer service' },
        { value: 'internal', label: 'Internal business operations' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'significant_impact',
      type: 'boolean',
      question: 'Could the AI system significantly impact individuals\' health, safety, or economic interests?',
      help: 'High-impact systems face additional requirements under AIDA.'
    },
    {
      id: 'federal_regulated',
      type: 'boolean',
      question: 'Is your organization federally regulated or engaged in international/interprovincial trade?',
      help: 'Determines whether AIDA and PIPEDA apply directly.'
    },
    {
      id: 'province',
      type: 'select',
      question: 'In which province(s) does your AI system primarily operate?',
      help: 'Quebec has additional AI and privacy requirements.',
      options: [
        { value: 'quebec', label: 'Quebec' },
        { value: 'ontario', label: 'Ontario' },
        { value: 'bc', label: 'British Columbia' },
        { value: 'alberta', label: 'Alberta' },
        { value: 'national', label: 'National / Multiple provinces' },
        { value: 'other', label: 'Other provinces' }
      ]
    },
    {
      id: 'processes_personal_info',
      type: 'boolean',
      question: 'Does the AI system process personal information?',
      help: 'Subject to PIPEDA or provincial privacy laws.'
    },
    {
      id: 'automated_decisions',
      type: 'select',
      question: 'What role does the AI play in decision-making?',
      options: [
        { value: 'fully_automated', label: 'Fully automated decisions' },
        { value: 'recommendation', label: 'Recommendations reviewed by humans' },
        { value: 'advisory', label: 'Advisory only — humans decide' },
        { value: 'augmentation', label: 'Augments human analysis' }
      ]
    },
    {
      id: 'transparency_measures',
      type: 'boolean',
      question: 'Do you inform individuals when AI is used in decisions affecting them?',
      help: 'PIPEDA requires transparency about automated decision-making.'
    },
    {
      id: 'explanation_available',
      type: 'boolean',
      question: 'Can individuals request an explanation of AI-assisted decisions?',
      help: 'Required under PIPEDA for automated decisions with significant impact.'
    },
    {
      id: 'bias_assessment',
      type: 'boolean',
      question: 'Have you assessed the AI system for biased outputs?',
      help: 'AIDA will require bias mitigation for high-impact systems.'
    },
    {
      id: 'risk_assessment',
      type: 'boolean',
      question: 'Have you conducted a risk assessment for this AI system?',
      help: 'Required for high-impact systems under AIDA.'
    },
    {
      id: 'human_oversight',
      type: 'boolean',
      question: 'Is there meaningful human oversight of AI operations?',
      help: 'Important for high-impact decision-making systems.'
    },
    {
      id: 'third_party_model',
      type: 'boolean',
      question: 'Are you using a third-party AI model (e.g., GPT, Claude)?',
      help: 'Affects accountability and documentation requirements.'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Framework Overview
    sections.push({
      heading: 'Canadian AI Regulatory Framework',
      body: 'Canada\'s AI governance framework centers on the proposed Artificial Intelligence and Data Act (AIDA), which is part of Bill C-27. AIDA establishes requirements for "high-impact" AI systems, including risk assessments, bias mitigation, transparency, and human oversight. Until AIDA comes into force, AI systems are primarily governed by PIPEDA (Personal Information Protection and Electronic Documents Act) for privacy, and provincial laws where applicable. This policy addresses both current obligations and anticipated AIDA requirements.'
    });
    
    // High-Impact Classification
    const highImpactPurposes = ['employment', 'credit', 'insurance', 'healthcare', 'government', 'legal', 'education', 'biometric'];
    const isHighImpact = highImpactPurposes.includes(answers.ai_purpose) || answers.significant_impact;
    
    let impactText = '';
    if (isHighImpact) {
      impactText = `This AI system is likely to be classified as HIGH-IMPACT under AIDA based on its use in ${formatPurpose(answers.ai_purpose)}${answers.significant_impact ? ' and its potential to significantly impact individuals' : ''}. High-impact systems will be subject to mandatory requirements including risk assessments, bias mitigation measures, transparency obligations, and human oversight requirements.`;
    } else {
      impactText = 'This AI system does not appear to meet the high-impact threshold under AIDA based on current information. However, you should monitor regulatory developments as the definition of high-impact systems may be clarified through regulations.';
    }
    
    sections.push({
      heading: 'AIDA High-Impact Classification',
      body: impactText
    });
    
    // AIDA Requirements (for high-impact systems)
    if (isHighImpact) {
      // Risk Assessment
      let riskText = '';
      if (answers.risk_assessment) {
        riskText = 'You have conducted a risk assessment. Under AIDA, high-impact systems require documented assessments that identify potential harms and mitigation measures. Ensure your assessment covers:\n\n';
        riskText += '• Potential harms to individuals (physical, psychological, economic)\n';
        riskText += '• Risks of biased or discriminatory outputs\n';
        riskText += '• Data quality and representativeness issues\n';
        riskText += '• Security and misuse risks\n';
        riskText += '• Mitigation measures for identified risks\n\n';
        riskText += 'Review and update the assessment periodically.';
      } else {
        riskText = 'REQUIRED UNDER AIDA: Conduct a risk assessment before deploying this high-impact AI system. Document potential harms, their likelihood and severity, and your mitigation measures. This will be mandatory once AIDA comes into force.';
      }
      
      sections.push({
        heading: 'Risk Assessment (AIDA)',
        body: riskText
      });
      
      // Bias Mitigation
      let biasText = '';
      if (answers.bias_assessment) {
        biasText = 'You have assessed for biased outputs. AIDA will require ongoing bias monitoring and mitigation for high-impact systems. Ensure your assessment:\n\n';
        biasText += '• Tests across protected grounds (race, gender, age, disability, etc.)\n';
        biasText += '• Documents methodology and findings\n';
        biasText += '• Implements mitigation for identified biases\n';
        biasText += '• Establishes ongoing monitoring procedures';
      } else {
        biasText = 'REQUIRED UNDER AIDA: High-impact AI systems must include measures to identify and mitigate biased outputs, particularly those that could disadvantage individuals based on prohibited grounds under the Canadian Human Rights Act. Conduct bias testing before deployment.';
      }
      
      sections.push({
        heading: 'Bias Mitigation (AIDA)',
        body: biasText
      });
      
      // Human Oversight
      let oversightText = 'AIDA emphasizes human oversight for high-impact AI systems. ';
      if (answers.human_oversight) {
        oversightText += 'You have indicated human oversight is in place. Ensure:\n\n';
        oversightText += '• Humans can understand and interpret AI outputs\n';
        oversightText += '• Humans have authority to override AI decisions\n';
        oversightText += '• Oversight is meaningful, not merely procedural\n';
        oversightText += '• Staff are trained on system capabilities and limitations';
      } else if (answers.automated_decisions === 'fully_automated') {
        oversightText += 'CRITICAL: Your system operates with full automation. For high-impact decisions, implement meaningful human oversight including the ability to review, understand, and override AI outputs.';
      } else {
        oversightText += 'Consider formalizing human oversight procedures to ensure they are effective and documented.';
      }
      
      sections.push({
        heading: 'Human Oversight (AIDA)',
        body: oversightText
      });
    }
    
    // PIPEDA Requirements
    if (answers.processes_personal_info) {
      let pipedaText = 'Your processing of personal information is subject to PIPEDA (or substantially similar provincial legislation). Key requirements:\n\n';
      pipedaText += '• Consent: Obtain meaningful consent for collection, use, and disclosure\n';
      pipedaText += '• Purpose limitation: Use information only for stated purposes\n';
      pipedaText += '• Transparency: Be open about your practices\n';
      pipedaText += '• Access: Allow individuals to access their information\n';
      pipedaText += '• Accuracy: Keep information accurate and up-to-date\n';
      pipedaText += '• Safeguards: Protect information with appropriate security\n\n';
      
      if (answers.automated_decisions === 'fully_automated' || answers.automated_decisions === 'recommendation') {
        pipedaText += 'For automated decision-making, PIPEDA requires transparency about how decisions are made and, in some cases, the opportunity for human review.';
      }
      
      sections.push({
        heading: 'PIPEDA Privacy Compliance',
        body: pipedaText
      });
    }
    
    // Transparency Requirements
    let transparencyText = '';
    if (answers.transparency_measures && answers.explanation_available) {
      transparencyText = 'You provide transparency and explanations about AI use. This aligns with both PIPEDA and anticipated AIDA requirements. Ensure:\n\n';
      transparencyText += '• Notices are clear and understandable to affected individuals\n';
      transparencyText += '• Explanations describe the general logic of AI decisions\n';
      transparencyText += '• Information is provided proactively, not just on request\n';
      transparencyText += '• Explanations are meaningful (not just "an algorithm decided")';
    } else if (!answers.transparency_measures) {
      transparencyText = 'RECOMMENDED: Implement transparency measures informing individuals when AI is used in decisions affecting them. This is expected under PIPEDA for automated decision-making and will be required under AIDA for high-impact systems.';
      if (!answers.explanation_available) {
        transparencyText += '\n\nAlso implement a mechanism for individuals to request explanations of AI-assisted decisions.';
      }
    } else if (!answers.explanation_available) {
      transparencyText = 'You inform individuals about AI use, but should also provide a mechanism for them to request explanations of AI-assisted decisions. This supports both PIPEDA compliance and anticipated AIDA requirements.';
    }
    
    sections.push({
      heading: 'Transparency and Explainability',
      body: transparencyText
    });
    
    // Quebec-Specific Requirements
    if (answers.province === 'quebec') {
      sections.push({
        heading: 'Quebec Law 25 Requirements',
        body: 'Operating in Quebec subjects you to Law 25 (formerly Bill 64), which has additional AI-related requirements:\n\n• Automated decision-making must be disclosed to affected individuals at or before the time a decision is made\n• Individuals have the right to be informed of the personal information used, the reasons and principal factors leading to the decision, and the right to have the decision reviewed by a person\n• Privacy Impact Assessments are required for projects involving personal information\n• Stricter consent requirements and data governance obligations apply\n\nEnsure your AI governance addresses these Quebec-specific obligations.'
      });
    }
    
    // Third-Party Models
    if (answers.third_party_model) {
      sections.push({
        heading: 'Third-Party AI Model Governance',
        body: 'Using third-party AI models does not transfer your compliance obligations. Under AIDA, you remain responsible for ensuring high-impact systems meet requirements regardless of who developed the underlying model. Document:\n\n• Model provider and version information\n• Provider\'s stated capabilities and limitations\n• Your evaluation of the model for your specific use case\n• Any fine-tuning or customization performed\n• Contractual provisions addressing compliance responsibilities\n\nMaintain the ability to switch providers if compliance issues arise.'
      });
    }
    
    // Federal vs Provincial Application
    let jurisdictionText = '';
    if (answers.federal_regulated) {
      jurisdictionText = 'As a federally regulated organization or one engaged in interprovincial/international trade, PIPEDA and AIDA (once in force) apply directly to your operations. Ensure compliance with federal requirements across all provinces.';
    } else {
      jurisdictionText = 'Provincial privacy laws may apply depending on your operations. In Quebec, Alberta, and British Columbia, substantially similar provincial laws govern privacy. AIDA, once in force, will apply to AI systems based on their impact regardless of provincial jurisdiction.';
    }
    
    sections.push({
      heading: 'Jurisdictional Application',
      body: jurisdictionText
    });
    
    // Enforcement and Penalties
    if (isHighImpact) {
      sections.push({
        heading: 'Enforcement Considerations',
        body: 'AIDA proposes significant penalties for non-compliance with high-impact AI system requirements:\n\n• Administrative monetary penalties up to $10 million or 3% of global revenue\n• Criminal offenses for knowing violations causing serious harm, with fines up to $25 million or 5% of global revenue\n• Personal liability for directors and officers in certain circumstances\n\nProactive compliance is strongly recommended given these potential consequences.'
      });
    }
    
    // Next Steps
    const steps = ['Review this policy with legal counsel familiar with Canadian AI and privacy law.'];
    
    if (isHighImpact && !answers.risk_assessment) {
      steps.push('Conduct a comprehensive risk assessment for this high-impact AI system.');
    }
    
    if (isHighImpact && !answers.bias_assessment) {
      steps.push('Conduct bias testing across protected grounds under Canadian human rights law.');
    }
    
    if (!answers.transparency_measures) {
      steps.push('Implement transparency measures informing individuals of AI use.');
    }
    
    if (!answers.explanation_available) {
      steps.push('Create a mechanism for individuals to request decision explanations.');
    }
    
    if (isHighImpact && !answers.human_oversight) {
      steps.push('Implement meaningful human oversight procedures.');
    }
    
    if (answers.province === 'quebec') {
      steps.push('Review Quebec Law 25 specific requirements for automated decision-making.');
    }
    
    if (answers.processes_personal_info) {
      steps.push('Review and document PIPEDA compliance measures.');
    }
    
    steps.push('Monitor AIDA regulatory developments as the law progresses.');
    steps.push('Establish ongoing governance and review procedures.');
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};

function formatPurpose(purpose) {
  const map = {
    employment: 'employment decisions',
    credit: 'credit and lending',
    insurance: 'insurance',
    healthcare: 'healthcare',
    government: 'government services',
    legal: 'legal services',
    education: 'education',
    biometric: 'biometric identification',
    content_moderation: 'content moderation',
    content_generation: 'content generation',
    customer_service: 'customer service',
    internal: 'internal operations',
    other: 'other purposes'
  };
  return map[purpose] || purpose;
}
