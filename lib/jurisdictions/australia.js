/**
 * AI Control Kit — Australia Jurisdiction
 * Covers Australia's Voluntary AI Safety Standard and Guardrails
 */

export default {
  id: 'australia',
  name: 'Australia',
  regulation: 'AI Guardrails',
  icon: '🇦🇺',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      options: [
        { value: 'high_risk_decision', label: 'Decisions affecting rights, safety, or legal status' },
        { value: 'healthcare', label: 'Healthcare / medical' },
        { value: 'financial', label: 'Financial services' },
        { value: 'employment', label: 'Employment / HR' },
        { value: 'government', label: 'Government services' },
        { value: 'education', label: 'Education' },
        { value: 'content_generation', label: 'Content generation' },
        { value: 'customer_service', label: 'Customer service' },
        { value: 'internal', label: 'Internal business tools' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'high_risk_decisions',
      type: 'boolean',
      question: 'Does the AI make or significantly influence decisions that affect individuals\' legal rights, safety, or access to essential services?',
      help: 'High-risk decisions require enhanced governance.'
    },
    {
      id: 'human_oversight',
      type: 'select',
      question: 'What level of human oversight exists for AI decisions?',
      options: [
        { value: 'human_in_loop', label: 'Human-in-the-loop (reviews each decision)' },
        { value: 'human_on_loop', label: 'Human-on-the-loop (monitors and can intervene)' },
        { value: 'human_out_loop', label: 'Human-out-of-the-loop (fully autonomous)' }
      ]
    },
    {
      id: 'supply_chain_known',
      type: 'boolean',
      question: 'Do you know and document the full AI supply chain (models, data sources, third-party components)?',
      help: 'Supply chain transparency is emphasized in Australian guidance.'
    },
    {
      id: 'third_party_components',
      type: 'boolean',
      question: 'Does your AI system use third-party models or components?',
    },
    {
      id: 'third_party_assessment',
      type: 'boolean',
      question: 'Have you assessed third-party AI components for risks?',
      dependsOn: { field: 'third_party_components', equals: true }
    },
    {
      id: 'testing_conducted',
      type: 'boolean',
      question: 'Has the AI system been tested for safety, accuracy, and bias?',
    },
    {
      id: 'affected_stakeholders',
      type: 'boolean',
      question: 'Have you consulted with stakeholders who may be affected by the AI system?',
      help: 'Including potential users, impacted communities, and domain experts.'
    },
    {
      id: 'transparency_measures',
      type: 'boolean',
      question: 'Do you provide transparency about AI use to affected individuals?',
      help: 'Including disclosure that AI is being used and how.'
    },
    {
      id: 'contestability',
      type: 'boolean',
      question: 'Can individuals contest or appeal AI-influenced decisions?',
      help: 'Mechanism for human review of AI decisions.'
    },
    {
      id: 'privacy_compliance',
      type: 'boolean',
      question: 'Does the system comply with the Privacy Act 1988?',
      help: 'Australian Privacy Principles apply to personal information handling.'
    },
    {
      id: 'ongoing_monitoring',
      type: 'boolean',
      question: 'Do you have ongoing monitoring for AI system performance and issues?',
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Framework Overview
    sections.push({
      heading: 'Australia\'s AI Governance Framework',
      body: 'Australia has adopted a voluntary guardrails approach to AI governance, with the Voluntary AI Safety Standard providing guidance for responsible AI development and deployment. The framework emphasizes human oversight, transparency, accountability, and ongoing monitoring. While currently voluntary, mandatory requirements may emerge, and organizations are encouraged to adopt these practices proactively.'
    });
    
    // Guardrails Summary
    sections.push({
      heading: 'The 10 AI Guardrails',
      body: 'Australia\'s voluntary guardrails for AI are:\n\n1. Establish accountability processes\n2. Manage AI-related risks throughout the lifecycle\n3. Protect privacy and data\n4. Ensure transparency about AI use\n5. Enable contestability for AI-influenced decisions\n6. Ensure appropriate human oversight\n7. Use representative data and test for bias\n8. Maintain supply chain transparency\n9. Consider environmental impact\n10. Keep records and documentation\n\nYour governance should address each applicable guardrail.'
    });
    
    // Risk Assessment
    const isHighRisk = answers.high_risk_decisions || 
      ['high_risk_decision', 'healthcare', 'financial', 'employment', 'government'].includes(answers.ai_purpose);
    
    let riskText = '';
    if (isHighRisk) {
      riskText = 'This AI system is considered HIGH RISK based on its potential to affect individuals\' rights, safety, or access to services. High-risk systems should implement all guardrails with enhanced rigor and documentation.';
    } else {
      riskText = 'This AI system appears lower risk. Apply guardrails proportionately while maintaining good governance practices.';
    }
    
    sections.push({
      heading: 'Risk Classification',
      body: riskText
    });
    
    // Human Oversight
    let oversightText = 'Human oversight is a core principle of responsible AI. ';
    
    switch (answers.human_oversight) {
      case 'human_in_loop':
        oversightText += 'Your human-in-the-loop approach, with human review of each decision, provides strong oversight. Ensure reviewers are appropriately trained, have authority to override AI, and are not overwhelmed by volume.';
        break;
      case 'human_on_loop':
        oversightText += 'Your human-on-the-loop approach allows intervention when needed. Ensure monitoring is effective, escalation paths are clear, and humans can meaningfully intervene in real-time when required.';
        break;
      case 'human_out_loop':
        if (isHighRisk) {
          oversightText += 'CRITICAL: Your fully autonomous approach may not be appropriate for high-risk applications. The Australian framework emphasizes meaningful human oversight for decisions affecting individuals. Consider implementing human review mechanisms.';
        } else {
          oversightText += 'Fully autonomous operation may be acceptable for lower-risk applications. Ensure robust monitoring and the ability to intervene if issues arise.';
        }
        break;
    }
    
    sections.push({
      heading: 'Human Oversight (Guardrail 6)',
      body: oversightText
    });
    
    // Supply Chain Transparency
    let supplyText = '';
    if (answers.supply_chain_known) {
      supplyText = 'You maintain supply chain documentation. Ensure records include:\n\n';
      supplyText += '• Foundation models and their providers\n';
      supplyText += '• Training data sources\n';
      supplyText += '• Third-party APIs and services\n';
      supplyText += '• Version information and update history\n';
      supplyText += '• Known limitations or risks of components';
    } else {
      supplyText = 'RECOMMENDED: Document your AI supply chain including models, data sources, and third-party components. This enables risk assessment, incident response, and regulatory compliance.';
    }
    
    if (answers.third_party_components) {
      if (answers.third_party_assessment) {
        supplyText += '\n\nYou have assessed third-party components for risks. Maintain this assessment and update when components change or new risks emerge.';
      } else {
        supplyText += '\n\nIMPORTANT: Conduct risk assessment of third-party AI components. Understand their limitations, data practices, and how they affect your system\'s overall risk profile.';
      }
    }
    
    sections.push({
      heading: 'Supply Chain Transparency (Guardrail 8)',
      body: supplyText
    });
    
    // Testing and Bias
    let testText = '';
    if (answers.testing_conducted) {
      testText = 'You have conducted testing for safety, accuracy, and bias. Ensure testing covered:\n\n';
      testText += '• Representative test data reflecting real-world use\n';
      testText += '• Performance across different demographic groups\n';
      testText += '• Edge cases and failure modes\n';
      testText += '• Adversarial robustness (where applicable)\n\n';
      testText += 'Document results and remediation steps taken.';
    } else {
      testText = 'RECOMMENDED: Conduct testing for safety, accuracy, and bias before deployment. Test with representative data covering the diversity of expected users and use cases. Document findings and address identified issues.';
    }
    
    sections.push({
      heading: 'Testing and Bias (Guardrail 7)',
      body: testText
    });
    
    // Transparency
    let transText = '';
    if (answers.transparency_measures) {
      transText = 'You provide transparency about AI use. Ensure disclosures include:\n\n';
      transText += '• Clear indication when AI is being used\n';
      transText += '• General explanation of how AI influences outcomes\n';
      transText += '• Limitations and potential for errors\n';
      transText += '• How to get more information or raise concerns';
    } else {
      transText = 'RECOMMENDED: Implement transparency measures to inform affected individuals about AI use. Be clear about what the AI does, how it influences decisions, and its limitations.';
    }
    
    sections.push({
      heading: 'Transparency (Guardrail 4)',
      body: transText
    });
    
    // Contestability
    let contestText = '';
    if (answers.contestability) {
      contestText = 'You have contestability mechanisms in place. Ensure they:\n\n';
      contestText += '• Are easily accessible to affected individuals\n';
      contestText += '• Result in meaningful human review\n';
      contestText += '• Have reasonable response timeframes\n';
      contestText += '• Can lead to decision reversal where appropriate';
    } else if (isHighRisk) {
      contestText = 'CRITICAL: High-risk AI decisions should have contestability mechanisms allowing affected individuals to request human review. Implement a clear process for challenging AI-influenced decisions.';
    } else {
      contestText = 'Consider implementing contestability mechanisms proportionate to the impact of AI decisions. Even for lower-risk applications, users benefit from recourse options.';
    }
    
    sections.push({
      heading: 'Contestability (Guardrail 5)',
      body: contestText
    });
    
    // Stakeholder Engagement
    if (answers.affected_stakeholders) {
      sections.push({
        heading: 'Stakeholder Engagement',
        body: 'You have consulted with affected stakeholders. Document engagement activities, feedback received, and how it influenced system design or deployment. Consider ongoing engagement as the system evolves.'
      });
    } else if (isHighRisk) {
      sections.push({
        heading: 'Stakeholder Engagement',
        body: 'RECOMMENDED: For high-risk AI systems, engage with potentially affected stakeholders including users, impacted communities, and domain experts. Their input can identify risks and improve outcomes.'
      });
    }
    
    // Privacy
    let privacyText = '';
    if (answers.privacy_compliance) {
      privacyText = 'You have indicated Privacy Act compliance. Ensure ongoing adherence to Australian Privacy Principles (APPs), including:\n\n';
      privacyText += '• Transparent collection and handling of personal information\n';
      privacyText += '• Purpose limitation and data minimization\n';
      privacyText += '• Data quality and security\n';
      privacyText += '• Access and correction rights\n';
      privacyText += '• Cross-border disclosure requirements';
    } else {
      privacyText = 'REQUIRED: Ensure compliance with the Privacy Act 1988 and Australian Privacy Principles (APPs) for any handling of personal information. This includes AI systems that collect, use, or generate personal data.';
    }
    
    sections.push({
      heading: 'Privacy Compliance (Guardrail 3)',
      body: privacyText
    });
    
    // Ongoing Monitoring
    if (answers.ongoing_monitoring) {
      sections.push({
        heading: 'Ongoing Monitoring (Guardrail 2)',
        body: 'You have ongoing monitoring in place. Ensure monitoring covers:\n\n• Performance metrics and drift detection\n• User feedback and complaints\n• Incident tracking and response\n• Regular audits and reviews\n• Updates to address identified issues\n\nDocument monitoring activities and findings.'
      });
    } else {
      sections.push({
        heading: 'Ongoing Monitoring (Guardrail 2)',
        body: 'RECOMMENDED: Implement ongoing monitoring throughout the AI system lifecycle. Monitor for performance degradation, emerging risks, user issues, and changing context. Establish procedures for addressing problems identified.'
      });
    }
    
    // Next Steps
    const steps = ['Review this policy with relevant stakeholders.'];
    
    if (!answers.testing_conducted) {
      steps.push('Conduct comprehensive testing for safety, accuracy, and bias.');
    }
    
    if (!answers.supply_chain_known) {
      steps.push('Document AI supply chain (models, data, components).');
    }
    
    if (answers.third_party_components && !answers.third_party_assessment) {
      steps.push('Assess risks of third-party AI components.');
    }
    
    if (!answers.transparency_measures) {
      steps.push('Implement transparency measures for affected individuals.');
    }
    
    if (isHighRisk && !answers.contestability) {
      steps.push('Implement contestability mechanisms for AI decisions.');
    }
    
    if (isHighRisk && !answers.affected_stakeholders) {
      steps.push('Engage with affected stakeholders.');
    }
    
    if (!answers.ongoing_monitoring) {
      steps.push('Establish ongoing monitoring procedures.');
    }
    
    if (!answers.privacy_compliance) {
      steps.push('Review and ensure Privacy Act compliance.');
    }
    
    steps.push('Document governance procedures and maintain records.');
    steps.push('Review and update governance as regulations evolve.');
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};
