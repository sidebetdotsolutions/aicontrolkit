/**
 * AI Control Kit — China Jurisdiction
 * Covers China AI Governance Rules and related regulations
 */

export default {
  id: 'china',
  name: 'China',
  regulation: 'AI Governance Rules',
  icon: '🇨🇳',
  
  questions: [
    {
      id: 'ai_type',
      type: 'select',
      question: 'What type of AI service are you providing?',
      help: 'Different AI types have specific regulations in China.',
      options: [
        { value: 'generative', label: 'Generative AI (text, image, video, code)' },
        { value: 'recommendation', label: 'Recommendation algorithms' },
        { value: 'deepfake', label: 'Deep synthesis (deepfakes, voice cloning)' },
        { value: 'decision_support', label: 'Decision support systems' },
        { value: 'autonomous', label: 'Autonomous systems' },
        { value: 'other', label: 'Other AI applications' }
      ]
    },
    {
      id: 'public_facing',
      type: 'boolean',
      question: 'Is the AI service available to the general public in China?',
      help: 'Public-facing services have additional requirements.'
    },
    {
      id: 'generates_content',
      type: 'boolean',
      question: 'Does the AI generate or synthesize content (text, images, audio, video)?',
    },
    {
      id: 'content_labeling',
      type: 'boolean',
      question: 'Is AI-generated content labeled or watermarked?',
      help: 'Required for synthetic content in China.',
      dependsOn: { field: 'generates_content', equals: true }
    },
    {
      id: 'content_filtering',
      type: 'boolean',
      question: 'Do you have content filtering to prevent illegal or harmful outputs?',
      help: 'Required for generative AI services in China.'
    },
    {
      id: 'user_identity',
      type: 'select',
      question: 'How do you verify user identity?',
      help: 'Real-name verification is required for many internet services.',
      options: [
        { value: 'real_name', label: 'Real-name verification (ID-based)' },
        { value: 'phone', label: 'Phone number verification' },
        { value: 'account', label: 'Account registration only' },
        { value: 'anonymous', label: 'Anonymous access allowed' },
        { value: 'internal', label: 'Internal use only (employees)' }
      ]
    },
    {
      id: 'training_data_review',
      type: 'boolean',
      question: 'Has training data been reviewed for compliance with Chinese law?',
      help: 'Training data must not contain prohibited content.'
    },
    {
      id: 'algorithm_registered',
      type: 'boolean',
      question: 'Has the algorithm been registered with the Cyberspace Administration of China (CAC)?',
      help: 'Required for recommendation algorithms and generative AI with public opinion influence.',
      dependsOn: { field: 'public_facing', equals: true }
    },
    {
      id: 'security_assessment',
      type: 'boolean',
      question: 'Has a security assessment been conducted?',
      help: 'Required before launching public-facing generative AI services.'
    },
    {
      id: 'data_localization',
      type: 'boolean',
      question: 'Is user data stored within mainland China?',
      help: 'Data localization requirements apply to many services.'
    },
    {
      id: 'cross_border_transfer',
      type: 'boolean',
      question: 'Does any data transfer outside of China occur?',
      help: 'Cross-border data transfers require security assessments or other mechanisms.'
    }
  ],
  
  generatePolicy(answers) {
    const sections = [];
    
    // Framework Overview
    sections.push({
      heading: 'China AI Regulatory Framework',
      body: 'China has implemented a comprehensive AI governance framework through multiple regulations including the Interim Measures for Generative AI Services, Algorithm Recommendation Regulations, Deep Synthesis Provisions, and related cybersecurity and data protection laws. This framework emphasizes content control, algorithm transparency and registration, real-identity verification, and alignment with "core socialist values."'
    });
    
    // Generative AI Requirements
    if (answers.ai_type === 'generative' || answers.generates_content) {
      let genText = 'Generative AI services in China are subject to the Interim Measures for Generative AI Services Management. Key requirements:\n\n';
      genText += '• Content must adhere to core socialist values and not subvert state power\n';
      genText += '• Training data must be legally obtained and reviewed for prohibited content\n';
      genText += '• AI-generated content must be labeled/watermarked\n';
      genText += '• Content filtering must prevent illegal, false, or harmful outputs\n';
      genText += '• User complaint mechanisms must be available\n';
      genText += '• Algorithm filing with CAC is required for public-facing services\n';
      
      if (answers.public_facing && !answers.security_assessment) {
        genText += '\nCRITICAL: Public-facing generative AI services require a security assessment before launch. Complete this assessment and file with relevant authorities.';
      }
      
      sections.push({
        heading: 'Generative AI Compliance',
        body: genText
      });
    }
    
    // Recommendation Algorithms
    if (answers.ai_type === 'recommendation') {
      sections.push({
        heading: 'Recommendation Algorithm Compliance',
        body: 'Recommendation algorithms are regulated under the Internet Information Service Algorithmic Recommendation Management Provisions. Requirements include:\n\n• Algorithm registration/filing with CAC (for services with public opinion attributes)\n• Transparency about recommendation principles\n• User controls to disable personalized recommendations\n• Prohibition of algorithms that induce addiction or excessive spending\n• Special protections for minors\n• No illegal discrimination based on user characteristics\n\nReview your algorithm\'s compliance with these specific requirements.'
      });
    }
    
    // Deep Synthesis
    if (answers.ai_type === 'deepfake') {
      sections.push({
        heading: 'Deep Synthesis Compliance',
        body: 'Deep synthesis (deepfake) technology is regulated under specific provisions. Requirements include:\n\n• Clear labeling of synthesized content\n• Prohibition of synthesis without consent for realistic human likenesses\n• No creation of false news or information\n• Technical measures to embed identifiable marks in generated content\n• Verification of user identity for synthesis services\n• Mechanisms to handle complaints about misuse\n\nDeep synthesis services face strict scrutiny and enforcement.'
      });
    }
    
    // Content Filtering
    let contentText = '';
    if (answers.content_filtering) {
      contentText = 'You have content filtering in place. Ensure filters effectively prevent:\n\n';
      contentText += '• Content subverting state power or socialist system\n';
      contentText += '• Content endangering national security or interests\n';
      contentText += '• Content inciting ethnic hatred or discrimination\n';
      contentText += '• False information harming national or public interest\n';
      contentText += '• Content promoting terrorism or extremism\n';
      contentText += '• Obscene, violent, or otherwise illegal content\n';
      contentText += '• Content infringing others\' rights\n\n';
      contentText += 'Maintain logs of filtered content for potential regulatory review.';
    } else if (answers.generates_content || answers.public_facing) {
      contentText = 'REQUIRED: Implement content filtering to prevent generation or distribution of illegal or harmful content. This is mandatory for AI services in China. Filtering must cover political, security, and social harm categories defined in Chinese law.';
    }
    
    if (contentText) {
      sections.push({
        heading: 'Content Filtering',
        body: contentText
      });
    }
    
    // Content Labeling
    if (answers.generates_content) {
      let labelText = '';
      if (answers.content_labeling) {
        labelText = 'You have implemented AI content labeling. Ensure labels:\n\n• Are clearly visible to users\n• Include machine-readable watermarks where technically feasible\n• Cannot be easily removed\n• Are applied consistently to all AI-generated content';
      } else {
        labelText = 'REQUIRED: AI-generated content must be clearly labeled. Implement visible labeling and, where feasible, embedded watermarks. This applies to text, images, audio, and video generated by AI.';
      }
      
      sections.push({
        heading: 'AI Content Labeling',
        body: labelText
      });
    }
    
    // Real-Name Verification
    let identityText = '';
    if (answers.user_identity === 'real_name') {
      identityText = 'You have implemented real-name verification, which meets regulatory requirements for internet services in China.';
    } else if (answers.user_identity === 'phone') {
      identityText = 'Phone-based verification may satisfy real-name requirements as phone numbers in China are linked to identity. Confirm this meets requirements for your specific service type.';
    } else if (answers.public_facing && (answers.user_identity === 'anonymous' || answers.user_identity === 'account')) {
      identityText = 'CRITICAL: Public-facing internet services in China generally require real-name verification. Anonymous access for generative AI or recommendation services may not comply with regulations. Implement appropriate identity verification.';
    } else {
      identityText = 'For internal-only services, real-name requirements may not apply. Ensure employee access is appropriately controlled and logged.';
    }
    
    sections.push({
      heading: 'User Identity Verification',
      body: identityText
    });
    
    // Algorithm Registration
    if (answers.public_facing) {
      let regText = '';
      if (answers.algorithm_registered) {
        regText = 'Your algorithm is registered with CAC. Maintain registration and file updates if the algorithm significantly changes. Keep records of the filing for compliance demonstration.';
      } else {
        regText = 'REQUIRED: Public-facing AI services with public opinion influence or recommendation capabilities must register algorithms with the Cyberspace Administration of China (CAC). Complete the algorithm filing process, which includes disclosing basic principles, intended purpose, and operating mechanisms.';
      }
      
      sections.push({
        heading: 'Algorithm Registration',
        body: regText
      });
    }
    
    // Training Data
    if (answers.generates_content || answers.ai_type === 'generative') {
      let dataText = '';
      if (answers.training_data_review) {
        dataText = 'You have reviewed training data for compliance. Maintain documentation of:\n\n• Data sources and legality of collection\n• Review process for prohibited content\n• Measures taken to remove non-compliant data\n• Ongoing monitoring for data quality';
      } else {
        dataText = 'REQUIRED: Training data for generative AI must be reviewed to ensure it does not contain illegal content and was legally obtained. Conduct a comprehensive review and document your process. Be prepared to demonstrate compliance to regulators.';
      }
      
      sections.push({
        heading: 'Training Data Compliance',
        body: dataText
      });
    }
    
    // Data Localization
    let localText = '';
    if (answers.data_localization) {
      localText = 'You store user data within mainland China. Ensure data centers meet relevant security standards and certifications.';
    } else if (answers.public_facing) {
      localText = 'IMPORTANT: Many internet services in China require data localization. User data, particularly personal information, may need to be stored within mainland China. Review your obligations under the Cybersecurity Law and Data Security Law.';
    }
    
    if (answers.cross_border_transfer) {
      localText += '\n\nCross-border data transfers require compliance mechanisms such as CAC security assessment, standard contractual clauses, or certification. Assess which mechanism applies based on data volume and sensitivity.';
    }
    
    if (localText) {
      sections.push({
        heading: 'Data Localization and Cross-Border Transfer',
        body: localText
      });
    }
    
    // Next Steps
    const steps = ['Engage legal counsel with China regulatory expertise.'];
    
    if (answers.public_facing && !answers.algorithm_registered) {
      steps.push('Complete algorithm registration/filing with CAC.');
    }
    
    if (answers.public_facing && !answers.security_assessment) {
      steps.push('Conduct required security assessment.');
    }
    
    if (!answers.content_filtering && (answers.generates_content || answers.public_facing)) {
      steps.push('Implement content filtering for illegal/harmful content.');
    }
    
    if (answers.generates_content && !answers.content_labeling) {
      steps.push('Implement AI content labeling and watermarking.');
    }
    
    if (answers.public_facing && answers.user_identity !== 'real_name' && answers.user_identity !== 'phone') {
      steps.push('Implement real-name verification for users.');
    }
    
    if (!answers.training_data_review && answers.generates_content) {
      steps.push('Conduct training data compliance review.');
    }
    
    steps.push('Establish ongoing monitoring and reporting procedures.');
    
    sections.push({
      heading: 'Recommended Next Steps',
      body: steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    });
    
    return sections;
  }
};
