/**
 * AI Control Kit — Wizard Application
 * Alpine.js component for the policy generation wizard
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('wizard', () => ({
    // =========================================================================
    // State
    // =========================================================================
    
    step: 'loading', // loading | error | jurisdiction | questions | generating | result
    error: null,
    
    // Jurisdiction data
    jurisdictions: [],
    selectedJurisdictions: [],
    
    // Question data
    questions: {}, // { eu: [...], usa: [...] }
    currentJurisdictionIndex: 0,
    currentQuestionIndex: 0,
    answers: {}, // { eu: { ai_purpose: 'hiring', ... }, usa: { ... } }
    
    // Result data
    policy: null,
    pdfToken: null,
    
    // =========================================================================
    // Computed Properties
    // =========================================================================
    
    get currentJurisdiction() {
      return this.selectedJurisdictions[this.currentJurisdictionIndex];
    },
    
    get currentJurisdictionData() {
      return this.jurisdictions.find(j => j.id === this.currentJurisdiction);
    },
    
    get currentJurisdictionQuestions() {
      if (!this.currentJurisdiction) return [];
      const all = this.questions[this.currentJurisdiction] || [];
      const jurisdictionAnswers = this.answers[this.currentJurisdiction] || {};
      
      // Filter based on dependencies
      return all.filter(q => {
        if (!q.dependsOn) return true;
        const { field, equals, notEquals } = q.dependsOn;
        const value = jurisdictionAnswers[field];
        if (equals !== undefined) return value === equals;
        if (notEquals !== undefined) return value !== notEquals;
        return true;
      });
    },
    
    get currentQuestion() {
      return this.currentJurisdictionQuestions[this.currentQuestionIndex];
    },
    
    get canGoBack() {
      return this.currentQuestionIndex > 0 || this.currentJurisdictionIndex > 0;
    },
    
    get progressPercent() {
      const totalJurisdictions = this.selectedJurisdictions.length;
      const jurisdictionProgress = this.currentJurisdictionIndex / totalJurisdictions;
      
      const questionsInCurrent = this.currentJurisdictionQuestions.length || 1;
      const questionProgress = this.currentQuestionIndex / questionsInCurrent;
      
      const perJurisdiction = 1 / totalJurisdictions;
      const overall = jurisdictionProgress + (questionProgress * perJurisdiction);
      
      // Scale to 20-90% range (10% for jurisdiction selection, 10% for result)
      return 20 + (overall * 70);
    },
    
    get progressText() {
      const currentNum = this.currentJurisdictionIndex + 1;
      const total = this.selectedJurisdictions.length;
      const qNum = this.currentQuestionIndex + 1;
      const qTotal = this.currentJurisdictionQuestions.length;
      
      if (total === 1) {
        return `Question ${qNum} of ${qTotal}`;
      }
      return `${this.currentJurisdictionData?.name}: Question ${qNum} of ${qTotal}`;
    },
    
    // =========================================================================
    // Lifecycle
    // =========================================================================
    
    async init() {
      this.step = 'loading';
      this.error = null;
      
      try {
        const data = await fetchJurisdictions();
        this.jurisdictions = data.jurisdictions;
        this.step = 'jurisdiction';
      } catch (e) {
        console.error('Failed to load jurisdictions:', e);
        this.error = 'Failed to load. Please refresh the page.';
        this.step = 'error';
      }
    },
    
    // =========================================================================
    // Actions
    // =========================================================================
    
    async toggleJurisdiction(id) {
      const index = this.selectedJurisdictions.indexOf(id);
      
      if (index > -1) {
        // Deselect
        this.selectedJurisdictions.splice(index, 1);
        delete this.questions[id];
        delete this.answers[id];
      } else {
        // Select and prefetch questions
        this.selectedJurisdictions.push(id);
        
        if (!this.questions[id]) {
          try {
            const data = await fetchQuestions(id);
            this.questions[id] = data.questions;
          } catch (e) {
            console.error(`Failed to load questions for ${id}:`, e);
            // Remove the selection on error
            this.selectedJurisdictions.pop();
            // Could show a toast/notification here
          }
        }
      }
    },
    
    startQuestions() {
      if (this.selectedJurisdictions.length === 0) return;
      
      this.currentJurisdictionIndex = 0;
      this.currentQuestionIndex = 0;
      this.step = 'questions';
    },
    
    getCurrentAnswer() {
      if (!this.currentJurisdiction || !this.currentQuestion) return undefined;
      return this.answers[this.currentJurisdiction]?.[this.currentQuestion.id];
    },
    
    answerQuestion(value) {
      if (!this.currentJurisdiction || !this.currentQuestion) return;
      
      // Initialize jurisdiction answers if needed
      if (!this.answers[this.currentJurisdiction]) {
        this.answers[this.currentJurisdiction] = {};
      }
      
      // Store the answer
      this.answers[this.currentJurisdiction][this.currentQuestion.id] = value;
      
      // Auto-advance after a short delay
      setTimeout(() => this.nextQuestion(), 150);
    },
    
    skipQuestion() {
      // Only works if current question has an answer
      if (this.getCurrentAnswer() !== undefined) {
        this.nextQuestion();
      }
    },
    
    nextQuestion() {
      const questionsInCurrent = this.currentJurisdictionQuestions.length;
      
      if (this.currentQuestionIndex < questionsInCurrent - 1) {
        // More questions in current jurisdiction
        this.currentQuestionIndex++;
      } else if (this.currentJurisdictionIndex < this.selectedJurisdictions.length - 1) {
        // Move to next jurisdiction
        this.currentJurisdictionIndex++;
        this.currentQuestionIndex = 0;
      } else {
        // All done, generate policy
        this.generate();
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      } else if (this.currentJurisdictionIndex > 0) {
        // Move to previous jurisdiction
        this.currentJurisdictionIndex--;
        // Go to last question of that jurisdiction
        this.currentQuestionIndex = this.currentJurisdictionQuestions.length - 1;
      }
    },
    
    async generate() {
      this.step = 'generating';
      
      try {
        const result = await generatePolicy(
          this.selectedJurisdictions,
          this.answers
        );
        
        this.policy = result.policy;
        this.pdfToken = result.pdfToken;
        this.step = 'result';
      } catch (e) {
        console.error('Failed to generate policy:', e);
        this.error = e.message || 'Failed to generate policy. Please try again.';
        this.step = 'error';
      }
    },
    
    async downloadPdf() {
      // Use client-side PDF generation (server-side would require a PDF service)
      this.generateClientPdf();
    },
    
    generateClientPdf() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;
      
      // Watermark function
      const addWatermark = () => {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.setFontSize(52);
        doc.setTextColor(128, 128, 128);
        
        // Center and rotate
        const text = 'AI CONTROL KIT — FREE TIER';
        doc.text(text, pageWidth / 2, pageHeight / 2, { 
          align: 'center',
          angle: 45
        });
        doc.restoreGraphicsState();
      };
      
      // Page break helper
      const checkPageBreak = (needed = 20) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          addWatermark();
          y = margin;
        }
      };
      
      // First page watermark
      addWatermark();
      
      // Title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('AI Governance Policy', margin, y);
      y += 12;
      
      // Metadata
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
      y += 6;
      
      const jurisdictionNames = this.policy.sections.map(s => s.title).join(', ');
      const metaLines = doc.splitTextToSize(`Jurisdictions: ${jurisdictionNames}`, pageWidth - margin * 2);
      metaLines.forEach(line => {
        doc.text(line, margin, y);
        y += 5;
      });
      y += 10;
      
      // Content
      doc.setTextColor(0, 0, 0);
      
      for (const section of this.policy.sections) {
        checkPageBreak(30);
        
        // Section header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin, y);
        y += 10;
        
        for (const content of section.content) {
          checkPageBreak(20);
          
          // Heading
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(content.heading, margin, y);
          y += 7;
          
          // Body
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          const lines = doc.splitTextToSize(content.body, pageWidth - margin * 2);
          for (const line of lines) {
            checkPageBreak(6);
            doc.text(line, margin, y);
            y += 5;
          }
          
          y += 6;
        }
        
        y += 8;
      }
      
      // Footer
      y = pageHeight - margin - 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const footerText = 'This document was generated by AI Control Kit (Free Tier). For watermark-free exports and compliance updates, visit aicontrolkit.com';
      const footerLines = doc.splitTextToSize(footerText, pageWidth - margin * 2);
      footerLines.forEach(line => {
        doc.text(line, margin, y);
        y += 4;
      });
      
      // Save
      doc.save('ai-governance-policy.pdf');
    },
    
    getJurisdictionIcon(id) {
      const j = this.jurisdictions.find(j => j.id === id);
      return j?.icon || '🌐';
    },
    
    startOver() {
      this.selectedJurisdictions = [];
      this.questions = {};
      this.answers = {};
      this.currentJurisdictionIndex = 0;
      this.currentQuestionIndex = 0;
      this.policy = null;
      this.pdfToken = null;
      this.step = 'jurisdiction';
    }
  }));
});
