import React from 'react';
import { 
  ArrowLeft, 
  Droplets, 
  Mail, 
  Building2 
} from 'lucide-react';
import { Footer } from './Footer';

interface PrivacyNoticePageProps {
  onBack: () => void;
  onOpenDashboard?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
}

export const PrivacyNoticePage: React.FC<PrivacyNoticePageProps> = ({ 
  onBack, 
  onOpenDashboard,
  onOpenTerms,
  onOpenContact
}) => {
  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    onBack();
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* 1. FUNCTIONAL STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm transition-all"
            title="Return to Home Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
            <span>Return to Home</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Logo & Project Tag */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-black text-white tracking-tight">Aqua<span className="text-cyan-400">Guard</span></span>
              <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-brand-950 text-brand-300 font-mono border border-brand-800">TCE Team 5</span>
            </div>
          </div>
        </div>

        {/* Functional Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <button 
            onClick={onBack}
            className="text-slate-300 hover:text-white transition-colors hidden md:inline-block cursor-pointer"
          >
            Home
          </button>
          {onOpenDashboard && (
            <button 
              onClick={onOpenDashboard}
              className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Live Dashboard
            </button>
          )}
          {onOpenTerms && (
            <button 
              onClick={onOpenTerms}
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
            >
              Terms
            </button>
          )}
          {onOpenContact ? (
            <button 
              onClick={onOpenContact}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          ) : (
            <button 
              onClick={handleScrollToContact}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. DARK TITLE BANNER - EXACTLY AS IN THE USER'S ATTACHED IMAGE */}
      <section className="bg-slate-950 text-white py-14 sm:py-16 px-4 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Privacy notice
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Last update: October 20, 2026
          </p>
        </div>
      </section>

      {/* 3. CLEAN DOCUMENT CONTENT WRAPPER - WHITE READING PAGE */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-12 lg:p-16 shadow-lg space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* SECTION 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              1. Introduction
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">1.1</span>
                <span>We are committed to safeguarding the privacy, operational telemetry integrity, and domestic water quality of our website visitors, IoT system operators, and academic evaluation reviewers.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">1.2</span>
                <span>This policy applies where we act as a project system designer and data controller with respect to the telemetry data of our automated smart water monitoring devices, web dashboard users, and demonstration testers; in other words, where we determine the physical sampling purposes, fail-safe parameters, and transmission mechanisms of that telemetry data.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">1.3</span>
                <span>We use local browser session storage on our website. Insofar as those storage keys are strictly necessary for saving user-preferred theme settings (dark/light mode) and simulated fault injection states, we apply those parameters during your active testing session.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">1.4</span>
                <span>In this policy, "we", "us", "our", and "Team 5" refer to the AquaGuard undergraduate engineering research team at Thiagarajar College of Engineering, Madurai, Tamil Nadu, India. For more information about our academic department and project guides, see Section 10.</span>
              </p>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              2. Credit
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">2.1</span>
                <span>This document was formulated under the academic compliance guidelines of Thiagarajar College of Engineering (Autonomous Institution Affiliated to Anna University, Approved by AICTE, Accredited by NAAC with &lsquo;A+&rsquo; Grade). It governs both prototype hardware operation and the companion real-time telemetry cloud software.</span>
              </p>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              3. How we use your personal and telemetry data
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.1</span>
                <span>In this Section 3 we have set out:</span>
              </p>
              <div className="pl-8 space-y-1 text-slate-600 dark:text-slate-400">
                <p>(a) the general categories of IoT sensor telemetry and personal data that we may process;</p>
                <p>(b) the purposes for which we process physical telemetry and user inputs; and</p>
                <p>(c) the engineering and legal bases of the automated closed-loop processing.</p>
              </div>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.2</span>
                <span>We may process physical data about your overhead water storage, fluid purity, and automated actuator states (&ldquo;telemetry data&rdquo;). The telemetry data includes:</span>
              </p>
              <div className="pl-8 space-y-1 text-slate-600 dark:text-slate-400">
                <p>&bull; <strong>Optical Turbidity Gauge:</strong> 0&ndash;5V analog output sampled on ESP32 ADC1 (GPIO32) and converted to Nephelometric Turbidity Units (NTU) to classify water clarity as CLEAR (&gt;3.50V), CLOUDY (2.50&ndash;3.50V), or DIRTY (&lt;2.50V);</p>
                <p>&bull; <strong>Conductive Water Level Depths:</strong> Pulsed binary state data from immersion-gold trace probes (HW-038) at LOW (20% tank depth via GPIO34) and FULL (90% tank depth via GPIO35);</p>
                <p>&bull; <strong>IR Inlet Optical Gate:</strong> Continuous digital beam continuity from the municipal pipe obstacle sensor (LM393 via GPIO27); and</p>
                <p>&bull; <strong>Actuator Relays:</strong> Discrete state commands asserted for Relay Channel 1 (12V Submersible Pump via GPIO26) and Relay Channel 2 (12V Normally Closed Brass Solenoid Valve via GPIO25).</p>
              </div>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.3</span>
                <span>The legal and physical basis for processing this telemetry is automated sanitary protection: preventing sewage or sediment runoff from entering drinking reservoirs, shutting off the pump during empty municipal line conditions, and stopping tank overflows.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.4</span>
                <span>We may process data about your use of our website and services (&ldquo;usage data&rdquo;). The usage data may include your IP address, geographical location, browser type and version, operating system, referral source, length of visit, page views and website navigation paths. The source of this usage data is our client-side Firebase telemetry sync system. This usage data may be processed for the purposes of analyzing the operational responsiveness of the web dashboard. The legal basis for this processing is our legitimate academic interest in validating low-latency IoT telemetry.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.5</span>
                <span>We may process information contained in any inquiry you submit to us regarding capstone project details, technical collaboration, or bill of materials inquiries (&ldquo;enquiry data&rdquo;). The enquiry data may be processed for the purposes of answering your technical questions and academic correspondence. The legal basis for this processing is consent.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.6</span>
                <span>We may process information relating to our academic relationships, including contact information (&ldquo;collaborator data&rdquo;). This may include your name, institution, job title or role, and communication history. The legal basis for this processing is our legitimate interest in properly managing academic dissemination.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.7</span>
                <span>We may process information that you provide to us for the purpose of receiving emergency audible or visual notifications (&ldquo;notification data&rdquo;). This includes localized buzzer alarm triggers and browser push notifications. The legal basis for this processing is safety consent.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.8</span>
                <span>We may process any of your operational data identified in this policy where necessary for the establishment, exercise or defense of academic project integrity, whether in evaluation proceedings or in an administrative context.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.9</span>
                <span>We may process any of your personal or telemetry data identified in this policy where necessary for obtaining or maintaining laboratory insurance coverage, managing prototype electrical risks, or obtaining engineering advice.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.10</span>
                <span>In addition to the specific purposes for which we may process your data set out in this Section 3, we may also process any of your personal data where such processing is necessary for compliance with a legal obligation to which we are subject, or in order to protect your vital physical safety.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">3.11</span>
                <span>Please do not supply any other person's personal information to us, unless we explicitly prompt you to do so under project guidance.</span>
              </p>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              4. Data encryption & Microcontroller Hardware Security
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">4.1</span>
                <span>We take the security of your operational telemetry and physical actuators seriously and have implemented industry-standard security practices to protect your hardware from unauthorized access, accidental override, or inductive noise. All cloud telemetry streams are transmitted over encrypted TLS/SSL channels. Microcontroller firmware incorporates non-blocking FreeRTOS task scheduling with optocoupler galvanic isolation barriers rated up to 2500V, ensuring that motor switching back-EMF cannot corrupt sensor registers or inject spurious actuator commands.</span>
              </p>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              5. Providing your personal and telemetry data to others
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">5.1</span>
                <span>We do not sell, rent, commercialize, or trade telemetry data or personal contact details with commercial advertisers or external data brokers.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">5.2</span>
                <span>We may disclose your contact details or thesis correspondence to academic faculty mentors, examiners, and project guides identified at Thiagarajar College of Engineering insofar as reasonably necessary for academic grading, capstone viva voce evaluation, and institutional record-keeping.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">5.3</span>
                <span>Cloud infrastructure services used by the prototype dashboard are hosted on Google Firebase Realtime Database. Telemetry points are serialized and synchronized strictly to power dashboard charts, historical trend analysis, and emergency interlocks.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">5.4</span>
                <span>In addition to the specific disclosures of telemetry data set out in this Section 5, we may disclose your data where such disclosure is necessary for compliance with college regulatory audits, or in order to protect against electrical short-circuits and domestic water contamination.</span>
              </p>
            </div>
          </section>

          {/* SECTION 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              6. International transfers of your personal data
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">6.1</span>
                <span>In this Section 6, we provide information about the circumstances in which your personal or telemetry data may be transferred to countries outside India or the European Economic Area (EEA).</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">6.2</span>
                <span>The cloud servers utilized for Firebase Realtime Database streaming are hosted across distributed Google Cloud data centers (including facilities in the United States and global edge nodes). These platforms operate under certified international data protection clauses and industry standard security compliances.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">6.3</span>
                <span>The hosting facilities for our open-source web application are distributed via edge Content Delivery Networks. Transfers to edge caches are secured by end-to-end HTTPS encryption.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">6.4</span>
                <span>You acknowledge that simulated telemetry and capstone demonstration metrics that you submit for public presentation may be accessible worldwide via the Internet. We ensure that personal identifying credentials are never broadcast across public telemetry topics.</span>
              </p>
            </div>
          </section>

          {/* SECTION 7 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              7. Retaining and deleting personal data
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">7.1</span>
                <span>This Section 7 sets out our data retention policies and procedures, which are designed to ensure that we comply with our institutional obligations in relation to the retention and deletion of sensor logs.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">7.2</span>
                <span>Personal data and high-frequency telemetry that we process for any purpose shall not be kept for longer than is necessary for that purpose.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">7.3</span>
                <span>We will retain your operational telemetry data as follows:</span>
              </p>
              <div className="pl-8 space-y-1 text-slate-600 dark:text-slate-400">
                <p>(a) High-frequency 1-second telemetry samples are stored in circular ring buffers for a period of one (1) hour to render live charts;</p>
                <p>(b) Hourly historical averages are retained for twenty-four (24) hours for daily duty-cycle monitoring;</p>
                <p>(c) System Audit Event Logs (interlock trips, dirty water cutoffs, dry-run alerts) are retained for a rolling maximum period of seven (7) days or up to 500 timestamped events, after which older records are safely purged; and</p>
                <p>(d) Contact inquiry details submitted via the web portal will be retained for up to twelve (12) months following the completion of the academic evaluation cycle.</p>
              </div>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">7.4</span>
                <span>In some cases it is not possible for us to specify in advance the periods for which your inquiry records will be retained. In such cases, retention will be determined based on academic accreditation review schedules.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">7.5</span>
                <span>Notwithstanding the other provisions of this Section 7, we may retain your telemetry data where such retention is necessary for compliance with a legal obligation to which we are subject, or in order to protect your vital interests or the vital interests of another natural person.</span>
              </p>
            </div>
          </section>

          {/* SECTION 8 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              8. Amendments
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">8.1</span>
                <span>We may update this policy and operational specification from time to time by publishing a new version on our website or updating our project firmware repository.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">8.2</span>
                <span>You should check this page occasionally to ensure you are happy with any changes to hardware pinouts, sensor calibrations, or safety threshold values.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">8.3</span>
                <span>We may notify you of significant changes to firmware interlocks or cloud endpoints through alert banners on the web dashboard.</span>
              </p>
            </div>
          </section>

          {/* SECTION 9 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              9. Your rights
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.1</span>
                <span>In this Section 9, we have summarized the principal rights and manual overrides that you hold under applicable data protection principles and system operator safety protocols:</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.2</span>
                <span>Your principal operator and data rights are:</span>
              </p>
              <div className="pl-8 space-y-1 text-slate-600 dark:text-slate-400">
                <p>(a) the right to access real-time raw ADC voltages, turbidity states, and water levels;</p>
                <p>(b) the right to manual override (switching from AUTO to MANUAL mode to command pump or solenoid states);</p>
                <p>(c) the right to alarm muting (silencing the 85dB piezo buzzer sounder);</p>
                <p>(d) the right to simulation testing (injecting synthetic turbidity drops, IR blockage, or level faults);</p>
                <p>(e) the right to clear local browser cache and reset simulation states to nominal baseline;</p>
                <p>(f) the right to export timestamped audit and telemetry logs for water quality assessment;</p>
                <p>(g) the right to complain to an institutional supervisory authority regarding academic compliance; and</p>
                <p>(h) the right to withdraw consent for email communications at any time.</p>
              </div>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.3</span>
                <span>You have the right to confirmation as to whether or not we process your personal or household telemetry data and, where we do, access to that telemetry, together with certain additional information including the purposes of processing and recipient cloud brokers.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.4</span>
                <span>You have the right to have any inaccurate operational parameters rectified and, taking into account the purposes of the processing, to have any incomplete telemetry data completed.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.5</span>
                <span>In some circumstances you have the right to the erasure of your personal data without undue delay. Those circumstances include: the telemetry logs are no longer necessary in relation to the academic purpose for which they were collected; or you withdraw consent.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.6</span>
                <span>In some circumstances you have the right to restrict the processing of your data. Where processing has been restricted, we may continue to store your data, but will only process it with your consent or for the protection of physical infrastructure.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.7</span>
                <span>You have the right to object to our processing of your telemetry on grounds relating to your particular situation, except where processing is strictly required for preventing domestic water tank contamination or pump dry-run motor burnout.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.8</span>
                <span>You have the right to object to our processing of your personal data for direct marketing purposes. We do not engage in any direct marketing activities.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.9</span>
                <span>You have the right to object to our processing of your personal data for scientific or historical research purposes or statistical purposes, unless the processing is necessary for the performance of an academic project in the public interest.</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">9.10</span>
                <span>To the extent that the legal basis for our processing of your personal data is consent, you have the right to withdraw that consent at any time without affecting the lawfulness of processing before its withdrawal.</span>
              </p>
            </div>
          </section>

          {/* SECTION 10 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>10. Institutional Governance &amp; Project Mentorship</span>
            </h2>
            <div className="space-y-2.5">
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">10.1</span>
                <span>This project is designed, prototyped, and evaluated under the Department of Electronics and Communication Engineering at <strong>Thiagarajar College of Engineering</strong>, Madurai &ndash; 625 015, Tamil Nadu, India.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">10.2</span>
                <span>Academic project mentorship is directed by:</span>
              </p>
              <div className="pl-8 space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">Dr. Gracia Nirmala Rani, B.E (ECE), M.E (VLSI DESIGN), PH.D</div>
                  <div className="text-xs text-brand-600 dark:text-brand-400">Project Faculty Guide &bull; Associate Professor, Dept. of ECE</div>
                  <div className="text-[11px] text-slate-500">Thiagarajar College of Engineering, Madurai</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">Dr. Ananthi, M.E., Ph.D.,</div>
                  <div className="text-xs text-brand-600 dark:text-brand-400">Project Faculty Guide &bull; Assistant Professor, Dept. of ECE</div>
                  <div className="text-[11px] text-slate-500">Thiagarajar College of Engineering, Madurai</div>
                </div>
              </div>
              <p className="flex items-start gap-3 pt-2">
                <span className="font-semibold text-slate-900 dark:text-slate-200 shrink-0">10.3</span>
                <span>Engineering Project Team 5 cohort: Kiruthik Sabari S (Team Leader), Srivardhini (Designer), Aswatha Priya B (Web Master), Palanisamy K (Recorder), and Harikumar M (Devil&rsquo;s Advocate). Total Prototype Hardware BOM Cost: ₹1,500 &ndash; ₹2,000.</span>
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* 4. FUNCTIONAL FOOTER FOR THE PRIVACY NOTICE PAGE - ROSTER HIDDEN AS REQUESTED */}
      <Footer 
        onOpenProjectInfo={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenDashboard={onOpenDashboard}
        onOpenCircuit={onBack}
        onOpenTerms={onOpenTerms}
        onOpenPrivacy={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenContact={onOpenContact}
        onNavigateHome={(sec) => {
          onBack();
          if (sec) {
            setTimeout(() => {
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }}
        showRoster={false}
      />

    </div>
  );
};
