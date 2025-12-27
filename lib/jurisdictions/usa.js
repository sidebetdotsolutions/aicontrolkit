/**
 * AI Control Kit — USA Jurisdiction
 * Covers NIST AI Risk Management Framework and state-specific requirements
 */

export default {
  id: 'usa',
  name: 'United States',
  regulation: 'NIST AI RMF',
  icon: '🇺🇸',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      help: 'Different use cases may trigger specific state regulations.',
      options: [
        { value: 'hiring', label: 'Employment decisions / hiring' },
        { value: 'credit', label: 'Credit decisions / lending' },
        { value: 'insurance', label: 'Insurance underwriting' },
        { value: 'healthcare', label: 'Healthcare / clinical decisions' },
        { value: 'housing', label: 'Housing decisions' },
        { value: 'content_moderation', label: 'Content moderation' },
        { value: 'content_generation', label: 'Content generation' },
        { value: 'customer_service', label: 'Customer service' },
        { value: 'internal', label: 'Internal business operations' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'operating_states',
      type: 'select',
      question: 'In which states does your AI system primarily operate?',
      help: 'Some states have specific AI regulations.',
      options: [
        { value: 'california', label: 'California' },
        { value: 'colorado', label: 'Colorado' },
        { value: 'illinois', label: 'Illinois' },
        { value: 'new_york', label: 'New York' },
        { value: 'texas', label: 'Texas' },
        { value: 'nationwide', label: 'Nationwide / Multiple states' },
        { value: 'other', label: 'Other states' }
      ]
    },
    {
      id: 'nyc_employment',
      type: 'boolean',
      question: 'Is this system used for employment decisions in New York City?',
      help: 'NYC Local Law 144 requires bias audits for automated employment decision tools.',
      dependsOn: { field: 'ai_purpose', equals: 'hiring' }
    },
    {
      id: 'training_data_source',
      type: 'select',
      question: 'What is the source of your training data?',
      help: 'This affects copyright and IP considerations.',
      options: [
        { value: 'licensed', label: 'Licensed / purchased data' },
        { value: 'public_domain', label: 'Public domain content' },
        { value: 'user_generated', label: 'User-generated content (with consent)' },
        { value: 'web_scraped', label: 'Web-scraped content' },
        { value: 'proprietary', label: 'Proprietary / internal data' },
        { value: 'mixed', label: 'Mixed sources' },
        { value: 'unknown', label: 'Unknown / third-party model' }
      ]
    },
    {
      id: 'generates_content',
      type: 'boolean',
      question: 'Does the system generate text, images, audio, or video?',
      help: 'Generative AI has specific copyright considerations.'
    },
    {
      id: 'content_for_commercial',
      type: 'boolean',
      question: 'Is AI-generated content used for commercial purposes?',
      dependsOn: { field: 'generates_content', equals: true }
    },
    {
      id: 'automated_decisions',
      type: 'select',
      question: 'How are AI outputs used in decision-making?',
      options: [
        { value: 'fully_automated', label: 'Fully automated decisions' },
        { value: 'recommendation', label: 'Recommendations reviewed by humans' },
        { value: 'advisory', label: 'Advisory only — humans make final decisions' },
        { value: 'augmentation', label: 'Augments human analysis' }
      ]
    },
    {
      id: 'impacts_consumers',
      type: 'boolean',
      question: 'Does the AI system make decisions that materially impact consumers?',
      help: 'This includes decisions about credit, employment, housing, insurance, or access to services.'
    },
    {
      id: 'sector',
      type: 'select',
      question: 'What industry sector does your organization operate in?',
      help: 'Certain sectors have additional regulatory requirements.',
      options: [
        { value: 'financial', label: 'Financial services' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'government', label: 'Government / public sector' },
        { value: 'retail', label: 'Retail / e-commerce' },
        { value: 'technology', label: 'Technology' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'risk_assessment_done',
      type: 'boolean',
      question: 'Have you conducted a formal AI risk assessment?',
      help: 'The NIST AI RMF recommends regular risk assessments.'
    },
    {
      id: 'bias_testing',
      type: 'boolean',
      question: 'Have you tested the system for bias across protected classes?',
      help: 'Required for certain use cases and recommended as best practice.'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // NIST AI RMF Alignment
    sections.push({
      heading: 'NIST AI Risk Management Framework',
      body: 'This policy aligns with the NIST AI Risk Management Framework (AI RMF 1.0), which provides voluntary guidance for managing AI risks. The framework emphasizes four core functions: Govern (establishing accountability), Map (understanding context and risks), Measure (assessing and tracking risks), and Manage (prioritizing and responding to risks).'
    });
    
    // Risk Assessment
    let riskText = '';
    if (answers.risk_assessment_done) {
      riskText = 'You have indicated that a formal risk assessment has been conducted. Ensure this assessment is documented and reviewed periodically. The NIST AI RMF recommends ongoing risk monitoring throughout the AI system lifecycle.';
    } else {
      riskText = 'RECOMMENDED: Conduct a formal AI risk assessment following the NIST AI RMF Map and Measure functions. Document identified risks, their likelihood and impact, and planned mitigations. Risk assessments should be reviewed at least annually or when significant changes occur.';
    }
    
    sections.push({
      heading: 'Risk Assessment',
      body: riskText
    });
    
    // Bias and Fairness
    const highRiskForBias = ['hiring', 'credit', 'insurance', 'housing', 'healthcare'].includes(answers.ai_purpose);
    
    let biasText = '';
    if (highRiskForBias) {
      biasText = `Your AI system is used for ${formatPurpose(answers.ai_purpose)}, which has significant potential for disparate impact on protected classes. `;
      
      if (answers.bias_testing) {
        biasText += 'You have indicated bias testing has been performed. Ensure testing covered relevant protected classes (race, gender, age, disability, etc.) and document results and any remediation steps taken.';
      } else {
        biasText += 'CRITICAL: You must conduct bias testing before deployment. Test for disparate impact across protected classes including race, gender, age, disability, national origin, and religion. Document methodology and results.';
      }
    } else if (answers.bias_testing) {
      biasText = 'Bias testing has been conducted. Maintain documentation and consider periodic re-testing, especially after model updates.';
    } else {
      biasText = 'Consider conducting bias testing as a best practice, even for lower-risk applications. This demonstrates due diligence and supports responsible AI development.';
    }
    
    sections.push({
      heading: 'Bias and Fairness',
      body: biasText
    });
    
    // NYC Local Law 144
    if (answers.nyc_employment) {
      sections.push({
        heading: 'NYC Local Law 144 Compliance',
        body: 'Your use of automated employment decision tools (AEDT) in New York City triggers Local Law 144 requirements:\n\n• Annual bias audit by an independent auditor is required\n• Audit results must be publicly posted on your website\n• Candidates must receive notice at least 10 business days before use\n• Notice must describe the job qualifications assessed and data sources\n• Candidates may request alternative selection process\n\nNon-compliance can result in penalties of $500-$1,500 per violation.'
      });
    }
    
    // State-Specific Requirements
    if (answers.operating_states === 'colorado') {
      sections.push({
        heading: 'Colorado AI Act Considerations',
        body: 'Colorado has enacted AI legislation focusing on high-risk AI systems. If your system makes consequential decisions in employment, education, financial services, healthcare, housing, insurance, or legal services, you may be subject to risk management, disclosure, and impact assessment requirements. Monitor the Colorado Attorney General\'s rulemaking for specific compliance obligations.'
      });
    }
    
    if (answers.operating_states === 'california') {
      sections.push({
        heading: 'California Requirements',
        body: 'California has various AI-related requirements including the California Consumer Privacy Act (CCPA) provisions on automated decision-making, proposed regulations on AI in employment, and the Bot Disclosure Law for conversational AI. Ensure your system complies with applicable California privacy and consumer protection laws.'
      });
    }
    
    if (answers.operating_states === 'illinois') {
      sections.push({
        heading: 'Illinois Considerations',
        body: 'Illinois has enacted the Artificial Intelligence Video Interview Act requiring notice and consent for AI analysis of video interviews. If using AI in hiring processes, ensure compliance with this and the Illinois Human Rights Act\'s provisions on automated decision-making in employment.'
      });
    }
    
    // Copyright and IP
    if (answers.generates_content || answers.training_data_source === 'web_scraped' || answers.training_data_source === 'mixed') {
      let copyrightText = 'AI-generated content and training data practices raise copyright considerations under U.S. law:\n\n';
      
      if (answers.training_data_source === 'web_scraped' || answers.training_data_source === 'mixed') {
        copyrightText += '• Training on copyrighted material without license may constitute infringement; fair use analysis is fact-specific and uncertain\n';
        copyrightText += '• Document your training data provenance and any licensing arrangements\n';
      }
      
      if (answers.generates_content) {
        copyrightText += '• AI-generated content may not be eligible for copyright protection under current U.S. Copyright Office guidance\n';
        copyrightText += '• Generated content that substantially copies training data may infringe source copyrights\n';
        
        if (answers.content_for_commercial) {
          copyrightText += '• Commercial use increases litigation risk; consider content filtering and indemnification provisions\n';
        }
      }
      
      copyrightText += '\nConsult intellectual property counsel for your specific use case.';
      
      sections.push({
        heading: 'Copyright and Intellectual Property',
        body: copyrightText
      });
    }
    
    // Sector-Specific
    if (answers.sector === 'financial') {
      sections.push({
        heading: 'Financial Services Considerations',
        body: 'Financial institutions using AI must comply with existing regulatory frameworks including fair lending laws (ECOA, Fair Housing Act), model risk management guidance (SR 11-7), and consumer protection requirements. The CFPB has indicated increased scrutiny of AI in consumer financial services. Ensure your AI governance integrates with existing compliance programs.'
      });
    }
    
    if (answers.sector === 'healthcare') {
      sections.push({
        heading: 'Healthcare AI Considerations',
        body: 'Healthcare AI systems may be subject to FDA regulation if they meet the definition of a medical device. Clinical decision support software has specific regulatory pathways. Additionally, ensure HIPAA compliance for systems processing protected health information, and consider clinical validation requirements for AI used in patient care.'
      });
    }
    
    // Consumer Impact
    if (answers.impacts_consumers && answers.automated_decisions === 'fully_automated') {
      sections.push({
        heading: 'Automated Decision-Making Disclosure',
        body: 'When AI systems make fully automated decisions materially impacting consumers, best practices and emerging regulations recommend:\n\n• Providing notice that automated processing is used\n• Explaining the general logic involved\n• Offering a mechanism to request human review\n• Maintaining records of decisions for potential challenges\n\nThis approach aligns with FTC guidance on algorithmic transparency and emerging state requirements.'
      });
    }
    
    // Next Steps
    const steps = ['Review and finalize this governance policy with your legal team.'];
    
    if (!answers.risk_assessment_done) {
      steps.push('Conduct a formal AI risk assessment using the NIST AI RMF.');
    }
    
    if (highRiskForBias && !answers.bias_testing) {
      steps.push('Conduct bias testing across protected classes before deployment.');
    }
    
    if (answers.nyc_employment) {
      steps.push('Engage an independent auditor for NYC Local Law 144 bias audit.');
      steps.push('Prepare and post required public disclosures.');
    }
    
    if (answers.generates_content || answers.training_data_source === 'web_scraped') {
      steps.push('Consult IP counsel regarding copyright exposure.');
    }
    
    steps.push('Establish ongoing monitoring and periodic reassessment procedures.');
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};

function formatPurpose(purpose) {
  const map = {
    hiring: 'employment decisions',
    credit: 'credit decisions',
    insurance: 'insurance underwriting',
    healthcare: 'healthcare decisions',
    housing: 'housing decisions',
    content_moderation: 'content moderation',
    content_generation: 'content generation',
    customer_service: 'customer service',
    internal: 'internal operations',
    other: 'other purposes'
  };
  return map[purpose] || purpose;
}
