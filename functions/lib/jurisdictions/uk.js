/**
 * AI Control Kit — UK Jurisdiction
 * Covers UK Pro-Innovation AI Framework
 */

export default {
  id: 'uk',
  name: 'United Kingdom',
  regulation: 'Pro-Innovation Framework',
  icon: '🇬🇧',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      options: [
        { value: 'safety_critical', label: 'Safety-critical systems (transport, infrastructure)' },
        { value: 'healthcare', label: 'Healthcare / medical' },
        { value: 'financial', label: 'Financial services' },
        { value: 'employment', label: 'Employment / HR decisions' },
        { value: 'legal', label: 'Legal services' },
        { value: 'education', label: 'Education' },
        { value: 'content_generation', label: 'Content generation' },
        { value: 'customer_service', label: 'Customer service' },
        { value: 'internal', label: 'Internal business tools' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'regulated_sector',
      type: 'boolean',
      question: 'Does your organization operate in a sector with an existing regulator?',
      help: 'E.g., FCA for financial services, CQC for healthcare, Ofcom for communications.'
    },
    {
      id: 'regulator',
      type: 'select',
      question: 'Which regulator has primary oversight of your sector?',
      dependsOn: { field: 'regulated_sector', equals: true },
      options: [
        { value: 'fca', label: 'Financial Conduct Authority (FCA)' },
        { value: 'pra', label: 'Prudential Regulation Authority (PRA)' },
        { value: 'cqc', label: 'Care Quality Commission (CQC)' },
        { value: 'mhra', label: 'Medicines and Healthcare products Regulatory Agency (MHRA)' },
        { value: 'ofcom', label: 'Ofcom' },
        { value: 'ico', label: 'Information Commissioner\'s Office (ICO)' },
        { value: 'hse', label: 'Health and Safety Executive (HSE)' },
        { value: 'other', label: 'Other regulator' }
      ]
    },
    {
      id: 'interacts_with_public',
      type: 'boolean',
      question: 'Does the AI system interact directly with members of the public?',
      help: 'Including chatbots, recommendation systems, or automated communications.'
    },
    {
      id: 'automated_decisions',
      type: 'select',
      question: 'What role does the AI play in decision-making?',
      options: [
        { value: 'fully_automated', label: 'Makes decisions without human review' },
        { value: 'supports_decisions', label: 'Supports human decision-makers' },
        { value: 'provides_info', label: 'Provides information only' }
      ]
    },
    {
      id: 'contestability_mechanism',
      type: 'boolean',
      question: 'Do affected individuals have a way to challenge AI-influenced decisions?',
      help: 'A mechanism for humans to contest or appeal decisions.'
    },
    {
      id: 'processes_personal_data',
      type: 'boolean',
      question: 'Does the system process personal data?',
      help: 'Subject to UK GDPR requirements.'
    },
    {
      id: 'third_party_model',
      type: 'boolean',
      question: 'Are you using a third-party AI model or foundation model?'
    },
    {
      id: 'risk_assessment',
      type: 'boolean',
      question: 'Have you conducted a risk assessment for this AI system?'
    },
    {
      id: 'transparency_measures',
      type: 'boolean',
      question: 'Have you implemented transparency measures explaining how the AI works?'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Framework Overview
    sections.push({
      heading: 'UK Pro-Innovation AI Framework',
      body: 'The UK has adopted a principles-based, context-specific approach to AI regulation. Rather than creating a single AI regulator, existing sector regulators apply five cross-cutting principles to AI within their domains. This policy addresses your obligations under this framework.'
    });
    
    // Five Principles
    sections.push({
      heading: 'The Five AI Principles',
      body: 'UK regulators are expected to apply these principles:\n\n1. Safety, security, and robustness — AI should function securely and safely\n2. Transparency and explainability — AI should be appropriately transparent\n3. Fairness — AI should not undermine legal rights or discriminate\n4. Accountability and governance — Clear lines of responsibility\n5. Contestability and redress — People should be able to challenge AI decisions\n\nYour governance approach should address each principle relevant to your use case.'
    });
    
    // Sector-Specific Guidance
    if (answers.regulated_sector && answers.regulator) {
      let regulatorGuidance = '';
      
      switch (answers.regulator) {
        case 'fca':
          regulatorGuidance = 'The FCA has issued guidance on AI in financial services, emphasizing model risk management, consumer protection, and fair treatment. Your AI governance should integrate with existing Senior Managers and Certification Regime (SM&CR) accountability structures. Monitor FCA publications on AI and machine learning.';
          break;
        case 'cqc':
          regulatorGuidance = 'Healthcare AI must meet CQC standards for safety and effectiveness. AI systems supporting clinical decisions should have appropriate clinical validation and human oversight. Ensure integration with existing clinical governance frameworks.';
          break;
        case 'mhra':
          regulatorGuidance = 'AI systems qualifying as medical devices are subject to MHRA regulation. Post-Brexit, the UK has its own UKCA marking requirements. Clinical decision support AI may fall under software as a medical device (SaMD) regulations.';
          break;
        case 'ofcom':
          regulatorGuidance = 'Ofcom oversees AI used in communications and online services. The Online Safety Act creates duties around algorithmic transparency and content moderation. AI recommender systems may face specific compliance requirements.';
          break;
        case 'ico':
          regulatorGuidance = 'The ICO provides extensive guidance on AI and data protection. Key areas include lawful basis for processing, automated decision-making rights under UK GDPR Article 22, data protection impact assessments, and transparency requirements.';
          break;
        default:
          regulatorGuidance = 'Consult your sector regulator\'s specific guidance on AI governance. Most regulators are developing AI-specific guidance within the pro-innovation framework.';
      }
      
      sections.push({
        heading: 'Sector Regulator Guidance',
        body: regulatorGuidance
      });
    }
    
    // Transparency and Explainability
    let transparencyText = 'The transparency principle requires appropriate disclosure about AI use. ';
    
    if (answers.interacts_with_public) {
      transparencyText += 'Since your AI interacts with the public, you should clearly inform users when they are engaging with an AI system. ';
    }
    
    if (answers.transparency_measures) {
      transparencyText += 'You have indicated transparency measures are in place. Ensure these include clear explanations of how the AI influences outcomes and any limitations.';
    } else {
      transparencyText += 'RECOMMENDED: Implement transparency measures appropriate to your context, including user-facing explanations and technical documentation.';
    }
    
    sections.push({
      heading: 'Transparency and Explainability',
      body: transparencyText
    });
    
    // Contestability
    let contestText = 'The contestability principle ensures affected individuals can challenge AI decisions. ';
    
    if (answers.automated_decisions === 'fully_automated' && !answers.contestability_mechanism) {
      contestText += 'CRITICAL: Your system makes automated decisions without a challenge mechanism. Implement a process for individuals to request human review of AI-influenced decisions that affect them.';
    } else if (answers.contestability_mechanism) {
      contestText += 'You have a contestability mechanism in place. Ensure it is accessible, clearly communicated, and results in meaningful human review.';
    } else {
      contestText += 'Consider implementing a challenge mechanism proportionate to the impact of AI decisions on individuals.';
    }
    
    sections.push({
      heading: 'Contestability and Redress',
      body: contestText
    });
    
    // UK GDPR
    if (answers.processes_personal_data) {
      let gdprText = 'Your processing of personal data is subject to UK GDPR. Key requirements include:\n\n';
      gdprText += '• Identify and document your lawful basis for processing\n';
      gdprText += '• Conduct a Data Protection Impact Assessment (DPIA) for high-risk processing\n';
      gdprText += '• Provide privacy information to data subjects\n';
      
      if (answers.automated_decisions === 'fully_automated') {
        gdprText += '• Article 22 provides rights around solely automated decisions with legal/significant effects — ensure you have lawful grounds and safeguards\n';
      }
      
      gdprText += '\nConsult ICO guidance on AI and data protection for detailed requirements.';
      
      sections.push({
        heading: 'UK GDPR Compliance',
        body: gdprText
      });
    }
    
    // Risk Assessment
    if (answers.risk_assessment) {
      sections.push({
        heading: 'Risk Assessment',
        body: 'You have conducted a risk assessment. Ensure it covers the five principles and is reviewed periodically. Document risks, mitigations, and residual risks. Consider using the DSIT AI Assurance Framework or sector-specific guidance.'
      });
    } else {
      sections.push({
        heading: 'Risk Assessment',
        body: 'RECOMMENDED: Conduct a risk assessment covering safety, fairness, transparency, accountability, and contestability. The DSIT AI Assurance Framework provides useful guidance. Document your assessment and planned mitigations.'
      });
    }
    
    // AISI
    sections.push({
      heading: 'AI Safety Institute',
      body: 'The UK AI Safety Institute (AISI) conducts research and evaluations on AI safety. While currently focused on frontier AI models, AISI resources and evaluation frameworks may be relevant for understanding safety best practices. Monitor AISI publications for emerging guidance.'
    });
    
    // Third-Party Models
    if (answers.third_party_model) {
      sections.push({
        heading: 'Third-Party Model Governance',
        body: 'When using third-party AI models, you remain responsible for your deployment context. Document the model provider, version, intended use, and any customizations. Conduct due diligence on the provider\'s safety measures. Maintain the ability to monitor, update, or discontinue model use if issues arise.'
      });
    }
    
    // Next Steps
    const steps = ['Review this policy with legal and compliance teams.'];
    
    if (answers.regulated_sector) {
      steps.push('Confirm alignment with sector regulator AI guidance.');
    }
    
    if (!answers.risk_assessment) {
      steps.push('Conduct a risk assessment covering the five AI principles.');
    }
    
    if (!answers.contestability_mechanism && answers.automated_decisions === 'fully_automated') {
      steps.push('Implement a contestability mechanism for affected individuals.');
    }
    
    if (answers.processes_personal_data) {
      steps.push('Complete or review DPIA for AI processing of personal data.');
    }
    
    if (!answers.transparency_measures) {
      steps.push('Develop transparency documentation for stakeholders.');
    }
    
    steps.push('Establish ongoing monitoring and governance procedures.');
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};
