/**
 * AI Control Kit — Brazil Jurisdiction
 * Covers Brazil AI Bill and LGPD alignment
 */

export default {
  id: 'brazil',
  name: 'Brazil',
  regulation: 'AI Bill + LGPD',
  icon: '🇧🇷',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      options: [
        { value: 'public_services', label: 'Public services / government' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'employment', label: 'Employment / HR' },
        { value: 'credit', label: 'Credit / financial decisions' },
        { value: 'justice', label: 'Justice system / legal' },
        { value: 'security', label: 'Public security' },
        { value: 'content_generation', label: 'Content generation' },
        { value: 'customer_service', label: 'Customer service' },
        { value: 'internal', label: 'Internal business operations' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'affects_rights',
      type: 'boolean',
      question: 'Can the AI system affect fundamental rights or access to services?',
      help: 'Including decisions about employment, credit, healthcare, education, or public services.'
    },
    {
      id: 'automated_decisions',
      type: 'select',
      question: 'What role does the AI play in decision-making?',
      options: [
        { value: 'fully_automated', label: 'Fully automated decisions' },
        { value: 'semi_automated', label: 'Semi-automated (human reviews some decisions)' },
        { value: 'human_final', label: 'Human makes final decision' },
        { value: 'advisory', label: 'Advisory / informational only' }
      ]
    },
    {
      id: 'processes_personal_data',
      type: 'boolean',
      question: 'Does the system process personal data?',
      help: 'Subject to LGPD (Brazil\'s data protection law).'
    },
    {
      id: 'sensitive_data',
      type: 'boolean',
      question: 'Does the system process sensitive personal data?',
      help: 'Health, biometric, genetic, racial/ethnic origin, religious belief, political opinion, etc.',
      dependsOn: { field: 'processes_personal_data', equals: true }
    },
    {
      id: 'explanation_mechanism',
      type: 'boolean',
      question: 'Can affected individuals request an explanation of AI decisions?',
      help: 'Brazil emphasizes the right to explanation.'
    },
    {
      id: 'human_review_available',
      type: 'boolean',
      question: 'Can affected individuals request human review of AI decisions?',
      help: 'Required for certain automated decisions under LGPD.'
    },
    {
      id: 'risk_assessment',
      type: 'boolean',
      question: 'Have you conducted an algorithmic impact assessment?',
      help: 'Evaluating risks to rights and freedoms.'
    },
    {
      id: 'error_monitoring',
      type: 'boolean',
      question: 'Do you monitor the system for errors or harmful outputs?',
      help: 'Brazil\'s strict liability approach emphasizes error prevention.'
    },
    {
      id: 'kill_switch',
      type: 'boolean',
      question: 'Can the system be quickly shut down if serious problems occur?',
      help: 'Emergency stop capability.'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Framework Overview
    sections.push({
      heading: 'Brazil AI Regulatory Framework',
      body: 'Brazil is advancing comprehensive AI legislation built on rights-based principles. The framework emphasizes human dignity, non-discrimination, transparency, and accountability. Key features include strong rights to explanation, human oversight requirements, and a strict liability approach for AI harms. Your governance policy should align with these principles and the existing LGPD data protection framework.'
    });
    
    // Risk Classification
    const highRiskPurposes = ['public_services', 'healthcare', 'education', 'employment', 'credit', 'justice', 'security'];
    const isHighRisk = highRiskPurposes.includes(answers.ai_purpose) || answers.affects_rights;
    
    let riskText = '';
    if (isHighRisk) {
      riskText = `This AI system is classified as HIGH RISK based on its use in ${formatPurpose(answers.ai_purpose)}${answers.affects_rights ? ' and its potential to affect fundamental rights' : ''}. High-risk systems face enhanced requirements including algorithmic impact assessments, transparency obligations, human oversight mandates, and strict liability provisions.`;
    } else {
      riskText = 'This AI system appears to be lower risk under the proposed framework. However, you should still adhere to general principles of transparency, non-discrimination, and accountability.';
    }
    
    sections.push({
      heading: 'Risk Classification',
      body: riskText
    });
    
    // Right to Explanation
    let explanationText = 'Brazilian law emphasizes the right to explanation for automated decisions. ';
    
    if (answers.explanation_mechanism) {
      explanationText += 'You have an explanation mechanism in place. Ensure explanations are:\n\n';
      explanationText += '• Clear and accessible to affected individuals\n';
      explanationText += '• Meaningful (not just stating "an algorithm decided")\n';
      explanationText += '• Provided in a timely manner upon request\n';
      explanationText += '• Documented for regulatory review';
    } else {
      explanationText += 'REQUIRED: Implement a mechanism for affected individuals to request and receive meaningful explanations of AI-influenced decisions. This is a core right under Brazilian AI governance principles.';
    }
    
    sections.push({
      heading: 'Right to Explanation',
      body: explanationText
    });
    
    // Human Oversight
    let humanText = '';
    if (answers.automated_decisions === 'fully_automated') {
      if (answers.human_review_available) {
        humanText = 'While your system operates with full automation, you provide human review on request. This aligns with LGPD Article 20 requirements. Ensure human reviewers have authority to override AI decisions and are appropriately trained.';
      } else {
        humanText = 'CRITICAL: Fully automated decisions affecting individuals typically require the option for human review under LGPD Article 20. Implement a human review mechanism, particularly for decisions with legal or significant effects.';
      }
    } else if (answers.automated_decisions === 'semi_automated') {
      humanText = 'Your semi-automated approach with human review aligns with Brazilian requirements for meaningful human oversight. Document the criteria for human review and ensure reviewers can effectively assess and override AI recommendations.';
    } else {
      humanText = 'Your approach maintains human authority over final decisions. Document the human decision-making process and how AI outputs are considered.';
    }
    
    sections.push({
      heading: 'Human Oversight',
      body: humanText
    });
    
    // LGPD Compliance
    if (answers.processes_personal_data) {
      let lgpdText = 'Your processing of personal data is subject to LGPD (Lei Geral de Proteção de Dados). Requirements include:\n\n';
      lgpdText += '• Identify and document your legal basis for processing (Article 7)\n';
      lgpdText += '• Provide clear privacy notices\n';
      lgpdText += '• Honor data subject rights (access, correction, deletion, portability)\n';
      lgpdText += '• Implement appropriate security measures\n';
      
      if (answers.sensitive_data) {
        lgpdText += '\nSensitive data processing requires explicit consent or specific legal grounds (Article 11). Implement enhanced protections and document your legal basis carefully.';
      }
      
      if (answers.automated_decisions === 'fully_automated' || answers.automated_decisions === 'semi_automated') {
        lgpdText += '\nArticle 20 of LGPD specifically addresses automated decisions: data subjects may request review of decisions made solely through automated processing that affect their interests.';
      }
      
      sections.push({
        heading: 'LGPD Compliance',
        body: lgpdText
      });
    }
    
    // Algorithmic Impact Assessment
    if (isHighRisk) {
      let aiaText = '';
      if (answers.risk_assessment) {
        aiaText = 'You have conducted an algorithmic impact assessment. Ensure it covers:\n\n';
        aiaText += '• Potential risks to fundamental rights\n';
        aiaText += '• Discrimination risks across protected groups\n';
        aiaText += '• Accuracy and reliability assessment\n';
        aiaText += '• Mitigation measures implemented\n';
        aiaText += '• Ongoing monitoring procedures\n\n';
        aiaText += 'Review and update the assessment periodically.';
      } else {
        aiaText = 'REQUIRED: High-risk AI systems require an algorithmic impact assessment evaluating risks to rights and freedoms. This assessment should identify potential harms, evaluate discrimination risks, and document mitigation measures. Conduct this assessment before deployment.';
      }
      
      sections.push({
        heading: 'Algorithmic Impact Assessment',
        body: aiaText
      });
    }
    
    // Strict Liability
    sections.push({
      heading: 'Strict Liability Considerations',
      body: 'Brazilian AI governance includes strict liability provisions for AI-caused harms. This means you may be liable for damages regardless of fault or negligence. To manage this exposure:\n\n• Implement robust testing before deployment\n• Monitor for errors and harmful outputs continuously\n• Maintain the ability to quickly intervene or stop the system\n• Document due diligence efforts\n• Consider appropriate insurance coverage'
    });
    
    // Kill Switch
    if (isHighRisk) {
      let killText = '';
      if (answers.kill_switch) {
        killText = 'You have emergency stop capability in place. Ensure:\n\n• Kill switch can be activated quickly by authorized personnel\n• Procedures for when to activate are documented\n• Backup processes exist for when AI is unavailable\n• Regular testing of shutdown procedures';
      } else {
        killText = 'RECOMMENDED: Implement emergency stop capability ("kill switch") for high-risk AI systems. This allows rapid shutdown if serious errors, discrimination, or harms are detected. Document activation procedures and backup processes.';
      }
      
      sections.push({
        heading: 'Emergency Stop Capability',
        body: killText
      });
    }
    
    // Error Monitoring
    if (answers.error_monitoring) {
      sections.push({
        heading: 'Error Monitoring',
        body: 'You have error monitoring in place. Ensure monitoring covers accuracy metrics, fairness indicators, and user complaints. Establish thresholds that trigger review or intervention. Maintain logs for regulatory demonstration of due diligence.'
      });
    } else {
      sections.push({
        heading: 'Error Monitoring',
        body: 'RECOMMENDED: Implement ongoing monitoring for errors and harmful outputs. Given the strict liability approach in Brazil, demonstrating active monitoring and quick response to problems is important for managing legal exposure.'
      });
    }
    
    // Next Steps
    const steps = ['Review this policy with legal counsel familiar with Brazilian AI regulation.'];
    
    if (isHighRisk && !answers.risk_assessment) {
      steps.push('Conduct an algorithmic impact assessment.');
    }
    
    if (!answers.explanation_mechanism) {
      steps.push('Implement a mechanism for individuals to request decision explanations.');
    }
    
    if (answers.automated_decisions === 'fully_automated' && !answers.human_review_available) {
      steps.push('Implement human review capability for automated decisions.');
    }
    
    if (isHighRisk && !answers.kill_switch) {
      steps.push('Implement emergency stop capability.');
    }
    
    if (!answers.error_monitoring) {
      steps.push('Implement error and harm monitoring procedures.');
    }
    
    if (answers.processes_personal_data) {
      steps.push('Review LGPD compliance for personal data processing.');
    }
    
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
    public_services: 'public services',
    healthcare: 'healthcare',
    education: 'education',
    employment: 'employment decisions',
    credit: 'credit/financial decisions',
    justice: 'justice system',
    security: 'public security',
    content_generation: 'content generation',
    customer_service: 'customer service',
    internal: 'internal operations',
    other: 'other purposes'
  };
  return map[purpose] || purpose;
}
