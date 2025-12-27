/**
 * AI Control Kit — EU AI Act Jurisdiction
 * Covers the EU Artificial Intelligence Act requirements
 */

export default {
  id: 'eu',
  name: 'European Union',
  regulation: 'EU AI Act',
  icon: '🇪🇺',
  
  questions: [
    {
      id: 'ai_purpose',
      type: 'select',
      question: 'What is the primary purpose of your AI system?',
      help: 'This determines your risk classification under the EU AI Act.',
      options: [
        { value: 'biometric_id', label: 'Biometric identification (facial recognition, etc.)' },
        { value: 'critical_infrastructure', label: 'Critical infrastructure (energy, water, transport)' },
        { value: 'education', label: 'Education and vocational training' },
        { value: 'employment', label: 'Employment, worker management, recruitment' },
        { value: 'essential_services', label: 'Access to essential services (credit, insurance, public benefits)' },
        { value: 'law_enforcement', label: 'Law enforcement' },
        { value: 'migration', label: 'Migration, asylum, border control' },
        { value: 'justice', label: 'Administration of justice' },
        { value: 'content_generation', label: 'Content generation (text, image, video)' },
        { value: 'customer_service', label: 'Customer service chatbot' },
        { value: 'internal_productivity', label: 'Internal productivity tools' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'interacts_with_people',
      type: 'boolean',
      question: 'Does the AI system interact directly with natural persons?',
      help: 'For example, chatbots, virtual assistants, or recommendation systems that communicate with users.'
    },
    {
      id: 'generates_synthetic',
      type: 'boolean',
      question: 'Does the system generate or manipulate synthetic content?',
      help: 'This includes AI-generated text, images, audio, video, or deepfakes.',
      dependsOn: { field: 'ai_purpose', equals: 'content_generation' }
    },
    {
      id: 'emotion_recognition',
      type: 'boolean',
      question: 'Does the system perform emotion recognition or biometric categorization?',
      help: 'Systems that infer emotions, intentions, or categorize people based on biometric data.'
    },
    {
      id: 'automated_decisions',
      type: 'select',
      question: 'What level of automation does the system have in decision-making?',
      help: 'Consider whether humans review AI outputs before they take effect.',
      options: [
        { value: 'fully_automated', label: 'Fully automated — no human review' },
        { value: 'human_on_loop', label: 'Human-on-the-loop — human can intervene' },
        { value: 'human_in_loop', label: 'Human-in-the-loop — human approves each decision' },
        { value: 'advisory_only', label: 'Advisory only — AI suggests, human decides' }
      ]
    },
    {
      id: 'training_data',
      type: 'select',
      question: 'What type of data was used to train the AI system?',
      help: 'This affects data governance requirements.',
      options: [
        { value: 'public', label: 'Publicly available data only' },
        { value: 'proprietary', label: 'Proprietary/internal data' },
        { value: 'personal', label: 'Personal data (GDPR applies)' },
        { value: 'special_category', label: 'Special category data (health, biometric, etc.)' },
        { value: 'unknown', label: 'Unknown / third-party model' }
      ]
    },
    {
      id: 'third_party_model',
      type: 'boolean',
      question: 'Are you using a third-party foundation model or general-purpose AI?',
      help: 'For example, GPT-4, Claude, Gemini, or other large language models.'
    },
    {
      id: 'gpai_provider',
      type: 'select',
      question: 'What is your role in relation to this third-party model?',
      help: 'This determines your obligations under the GPAI provisions.',
      dependsOn: { field: 'third_party_model', equals: true },
      options: [
        { value: 'deployer', label: 'Deployer — using the model as-is' },
        { value: 'fine_tuned', label: 'Fine-tuned — customized for specific use' },
        { value: 'integrated', label: 'Integrated — embedded in larger system' }
      ]
    },
    {
      id: 'target_users',
      type: 'select',
      question: 'Who are the primary users of this AI system?',
      options: [
        { value: 'internal', label: 'Internal employees only' },
        { value: 'b2b', label: 'Business customers (B2B)' },
        { value: 'consumers', label: 'General public / consumers (B2C)' },
        { value: 'government', label: 'Government / public sector' }
      ]
    },
    {
      id: 'market_placement',
      type: 'select',
      question: 'How is the AI system made available in the EU market?',
      options: [
        { value: 'eu_developed', label: 'Developed and deployed in the EU' },
        { value: 'imported', label: 'Imported into the EU' },
        { value: 'remote', label: 'Provided remotely to EU users' },
        { value: 'not_eu', label: 'Not available to EU users' }
      ]
    },
    {
      id: 'documentation_exists',
      type: 'boolean',
      question: 'Do you maintain technical documentation for this AI system?',
      help: 'This includes architecture descriptions, training methodologies, and evaluation results.'
    },
    {
      id: 'logging_enabled',
      type: 'boolean',
      question: 'Does the system automatically log its operations?',
      help: 'Required for traceability under the AI Act.'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Determine risk level
    const highRiskPurposes = [
      'biometric_id', 'critical_infrastructure', 'education', 
      'employment', 'essential_services', 'law_enforcement',
      'migration', 'justice'
    ];
    const isHighRisk = highRiskPurposes.includes(answers.ai_purpose);
    const isLimitedRisk = answers.interacts_with_people || answers.generates_synthetic;
    
    // Risk Classification
    let riskLevel, riskExplanation;
    if (isHighRisk) {
      riskLevel = 'High-Risk';
      riskExplanation = `Based on your indicated purpose (${formatPurpose(answers.ai_purpose)}), this AI system is classified as high-risk under Article 6 of the EU AI Act. High-risk systems are subject to mandatory requirements including conformity assessments, registration in the EU database, and ongoing monitoring obligations.`;
    } else if (isLimitedRisk) {
      riskLevel = 'Limited Risk';
      riskExplanation = 'This AI system is classified as limited risk due to its interaction with natural persons or generation of synthetic content. Limited-risk systems must comply with transparency obligations under Article 50, ensuring users are aware they are interacting with AI.';
    } else {
      riskLevel = 'Minimal Risk';
      riskExplanation = 'This AI system is classified as minimal risk under the EU AI Act. While not subject to mandatory requirements, voluntary adoption of codes of practice is encouraged.';
    }
    
    sections.push({
      heading: 'Risk Classification',
      body: `${riskLevel} System. ${riskExplanation}`
    });
    
    // Transparency Requirements
    if (isLimitedRisk || isHighRisk) {
      let transparencyText = 'This system must comply with the following transparency obligations:\n\n';
      
      if (answers.interacts_with_people) {
        transparencyText += '• Users must be informed they are interacting with an AI system (Article 50(1)).\n';
      }
      
      if (answers.generates_synthetic) {
        transparencyText += '• AI-generated content must be marked in a machine-readable format (Article 50(2)).\n';
        transparencyText += '• Deepfakes must disclose they were artificially created (Article 50(4)).\n';
      }
      
      if (answers.emotion_recognition) {
        transparencyText += '• Persons exposed to emotion recognition must be informed of its operation (Article 50(3)).\n';
      }
      
      sections.push({
        heading: 'Transparency Obligations',
        body: transparencyText
      });
    }
    
    // High-Risk Specific Requirements
    if (isHighRisk) {
      sections.push({
        heading: 'Conformity Assessment',
        body: 'Before placing this high-risk AI system on the market, you must complete a conformity assessment procedure as specified in Article 43. For biometric identification and critical infrastructure systems, this requires third-party assessment by a notified body. For other high-risk categories, self-assessment following Annex VI procedures may be sufficient.'
      });
      
      sections.push({
        heading: 'EU Database Registration',
        body: 'This high-risk AI system must be registered in the EU database for high-risk AI systems before being placed on the market (Article 71). Registration includes providing system information, intended purpose, conformity status, and contact details for the provider.'
      });
      
      sections.push({
        heading: 'Technical Documentation Requirements',
        body: `${answers.documentation_exists ? 'You have indicated that technical documentation exists. Ensure it meets' : 'You must create technical documentation meeting'} the requirements of Annex IV, including: general system description, detailed technical design, training data governance documentation, performance metrics, and cybersecurity measures.`
      });
      
      let oversightText = 'High-risk AI systems must be designed to allow effective human oversight (Article 14). ';
      if (answers.automated_decisions === 'fully_automated') {
        oversightText += 'CRITICAL: Your system currently operates with no human review. You must implement human oversight measures, including the ability for human operators to understand system capabilities, monitor for anomalies, and intervene or stop the system.';
      } else if (answers.automated_decisions === 'human_on_loop') {
        oversightText += 'Your human-on-the-loop approach may be sufficient if operators can effectively intervene. Ensure operators receive appropriate training and tools.';
      } else {
        oversightText += 'Your current human oversight approach appears appropriate. Maintain documentation of oversight procedures.';
      }
      
      sections.push({
        heading: 'Human Oversight',
        body: oversightText
      });
      
      sections.push({
        heading: 'Automatic Logging',
        body: `${answers.logging_enabled ? 'Your system includes automatic logging, which is required.' : 'REQUIRED: You must implement automatic logging capabilities.'} Logs must enable traceability of system operations and be retained for the duration of the system\'s intended purpose, with a minimum period to be specified in implementing acts.`
      });
    }
    
    // GPAI Provisions
    if (answers.third_party_model) {
      let gpaiText = 'Your use of a general-purpose AI (GPAI) model triggers additional considerations under Chapter V of the AI Act.\n\n';
      
      if (answers.gpai_provider === 'deployer') {
        gpaiText += 'As a deployer using the model as-is, you may rely on the GPAI provider\'s documentation and compliance measures. However, you remain responsible for your specific deployment context and must ensure the model is appropriate for your use case.';
      } else if (answers.gpai_provider === 'fine_tuned') {
        gpaiText += 'By fine-tuning the model, you have created a derivative system. You must document your modifications, assess any new risks introduced, and may be considered a provider for the modified system.';
      } else {
        gpaiText += 'By integrating the GPAI into a larger system, you share responsibility with the GPAI provider. Document the integration architecture and ensure clear allocation of compliance responsibilities.';
      }
      
      sections.push({
        heading: 'General-Purpose AI Obligations',
        body: gpaiText
      });
    }
    
    // Data Governance
    if (answers.training_data === 'personal' || answers.training_data === 'special_category') {
      sections.push({
        heading: 'Data Governance & GDPR Alignment',
        body: `Your AI system uses ${answers.training_data === 'special_category' ? 'special category personal data' : 'personal data'}, requiring alignment with GDPR obligations. Ensure lawful basis for processing (Article 6 GDPR), implement data protection impact assessments, and maintain records of processing activities. For high-risk AI systems, data governance practices must meet the specific requirements of Article 10 of the AI Act.`
      });
    }
    
    // Next Steps
    const steps = ['Review and finalize this governance policy with your legal team.'];
    
    if (isHighRisk) {
      steps.push('Complete the conformity assessment procedure.');
      steps.push('Register the system in the EU high-risk AI database.');
      steps.push('Implement required technical documentation per Annex IV.');
      steps.push('Establish human oversight procedures.');
      if (!answers.logging_enabled) {
        steps.push('Implement automatic logging capabilities.');
      }
    }
    
    if (isLimitedRisk) {
      steps.push('Implement transparency notices for users.');
      if (answers.generates_synthetic) {
        steps.push('Add machine-readable markers to AI-generated content.');
      }
    }
    
    if (answers.third_party_model) {
      steps.push('Document GPAI provider information and integration details.');
    }
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};

function formatPurpose(purpose) {
  const map = {
    biometric_id: 'biometric identification',
    critical_infrastructure: 'critical infrastructure',
    education: 'education and vocational training',
    employment: 'employment and recruitment',
    essential_services: 'essential services access',
    law_enforcement: 'law enforcement',
    migration: 'migration and border control',
    justice: 'administration of justice',
    content_generation: 'content generation',
    customer_service: 'customer service',
    internal_productivity: 'internal productivity',
    other: 'other purposes'
  };
  return map[purpose] || purpose;
}
